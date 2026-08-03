import mongoose from 'mongoose';
import { AgentRunModel } from '../models/agent-run.model.js';
import { AgentTaskModel } from '../models/agent-task.model.js';
import { ApplicationPreparationModel } from '../models/application-preparation.model.js';
import { ApplicationModel } from '../models/application.model.js';
import type { IJobDocument } from '../models/job.model.js';
import { AutomationConfigurationModel } from '../models/automation-configuration.model.js';
import { CandidateProfileModel, type ICandidateProfileDocument } from '../models/candidate-profile.model.js';
import { JobModel } from '../models/job.model.js';
import { ReviewQueueItemModel } from '../models/review-queue-item.model.js';
import { TargetRoleModel } from '../models/target-role.model.js';
import { executeHourlyDiscoveryPipeline } from './hourly-discovery.service.js';
import { evaluateMandatoryEligibility } from './eligibility-rules.service.js';
import { matchCandidateToJob } from '../ai/services/hybrid-matching.service.js';
import { generateTailoredResume } from '../ai/services/resume-tailoring.service.js';
import { logger } from '../utils/logger.js';

let activeRun: Promise<unknown> | null = null;
function startOfHour(): Date { const d = new Date(); d.setMinutes(0, 0, 0); return d; }
function startOfDay(): Date { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
function allSkills(profile: ICandidateProfileDocument | null): string[] {
  const groups = profile?.skills || {};
  return Object.values(groups).flatMap((value) => Array.isArray(value) ? value.map(String) : []);
}
export function isRoleAligned(title: string, roles: string[]): boolean {
  if (!roles.length) return true;
  const normalized = title.toLowerCase();
  return roles.some((role) => {
    const tokens = role.toLowerCase().split(/\s+/).filter((token) => token.length > 2);
    return tokens.length > 0 && tokens.filter((token) => normalized.includes(token)).length >= Math.ceil(tokens.length / 2);
  });
}

async function ensureTrackedApplication(job: IJobDocument, status: 'preparing' | 'ready_for_review') {
  let application = await ApplicationModel.findOne({ job: job._id });
  if (!application) {
    application = await ApplicationModel.create({
      job: job._id,
      status,
      applicationMethod: 'AI agent + browser review',
      applicationUrl: job.applicationUrl || job.sourceUrl || '',
      lastActivityDate: new Date(),
      timelineEvents: [{ status, title: status === 'preparing' ? 'Agent needs more information' : 'Application prepared for review', description: 'Created automatically by the JobPilot application agent.' }],
    });
  } else if (['planned', 'preparing', 'ready_for_review'].includes(application.status)) {
    application.status = status;
    application.lastActivityDate = new Date();
    await application.save();
  }
  return application;
}
export async function executeApplicationAgent(trigger: 'scheduled' | 'manual' = 'manual') {
  if (activeRun) return activeRun;
  activeRun = runAgent(trigger).finally(() => { activeRun = null; });
  return activeRun;
}

async function runAgent(trigger: 'scheduled' | 'manual') {
  const existing = await AgentRunModel.findOne({ status: 'running', startedAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) } });
  if (existing) return existing.toJSON();
  const config = await AutomationConfigurationModel.findOne();
  const run = await AgentRunModel.create({ trigger, status: 'running', startedAt: new Date() });
  try {
    if (!config?.enabled) {
      run.status = 'skipped'; run.summary = 'Automation is disabled.'; run.completedAt = new Date(); await run.save(); return run.toJSON();
    }
    const profile = await CandidateProfileModel.findOne().sort({ createdAt: 1 });
    if (!profile) {
      run.status = 'skipped'; run.summary = 'Candidate profile is required before the agent can evaluate jobs.'; run.completedAt = new Date(); await run.save(); return run.toJSON();
    }
    const discovery = await executeHourlyDiscoveryPipeline();
    run.discovered = 'jobsInserted' in discovery ? discovery.jobsInserted || 0 : 0;
    if (config.mode === 'discovery_only') {
      run.status = 'completed'; run.summary = 'Discovery-only run completed.'; run.completedAt = new Date(); await run.save(); return run.toJSON();
    }
    const [roles, preparedToday, preparedThisHour, existingPreparations] = await Promise.all([
      TargetRoleModel.find({ active: true }).lean(),
      ApplicationPreparationModel.countDocuments({ createdAt: { $gte: startOfDay() } }),
      ApplicationPreparationModel.countDocuments({ createdAt: { $gte: startOfHour() } }),
      ApplicationPreparationModel.find().select('jobId').lean(),
    ]);
    const capacity = Math.min(Math.max(0, config.maxApplicationsPerDay - preparedToday), Math.max(0, config.maxApplicationsPerHour - preparedThisHour));
    if (!capacity) {
      run.status = 'completed'; run.summary = 'Application preparation limits have been reached.'; run.completedAt = new Date(); await run.save(); return run.toJSON();
    }
    const jobs = await JobModel.find({
      _id: { $nin: existingPreparations.map((item) => item.jobId) },
      archivedStatus: false,
      freshnessStatus: { $in: ['new', 'active', 'updated'] },
    }).sort({ dateDiscovered: -1 }).limit(Math.max(capacity * 5, 20));
    const roleTitles = roles.map((role) => role.primaryTitle);
    const skills = allSkills(profile);
    const experienceYears = (profile.professionalInfo?.totalExperienceMonths || 0) / 12;

    for (const job of jobs) {
      if (run.prepared >= capacity) break;
      run.considered += 1;
      const task = await AgentTaskModel.create({ runId: run._id, jobId: job._id, status: 'analyzing', stage: 'policy_check', attempts: 1 });
      try {
        if (!isRoleAligned(job.jobTitle, roleTitles)) {
          task.status = 'skipped'; task.stage = 'role_alignment'; task.decisionReason = 'Job title does not align with selected target roles.'; run.skipped += 1; await task.save(); continue;
        }
        if (!job.description.trim()) {
          const trackedApplication = await ensureTrackedApplication(job, 'preparing');
          await ApplicationPreparationModel.findOneAndUpdate({ jobId: job._id }, { jobId: job._id, applicationId: trackedApplication._id, status: 'needs_information', riskFlags: ['Job description is missing; matching cannot be verified.'] }, { upsert: true, new: true });
          await ReviewQueueItemModel.findOneAndUpdate({ jobId: job._id, status: 'pending' }, {
            jobId: job._id, applicationId: trackedApplication._id, reason: 'Missing job information', blockingQuestion: 'Confirm the complete job description before preparing this application.',
            confidence: 100, sensitiveFlag: false, status: 'pending',
          }, { upsert: true, new: true });
          task.status = 'needs_review'; task.stage = 'missing_information'; task.decisionReason = 'Job description must be confirmed by the user.';
          run.prepared += 1; await task.save(); continue;
        }
        const eligibility = evaluateMandatoryEligibility({
          title: job.jobTitle, description: job.description, employmentType: job.employmentType,
          candidateExperienceYears: experienceYears, candidateSkills: skills,
        });
        task.eligibilityScore = eligibility.mandatoryEligibility;
        if (eligibility.decision === 'skip') {
          task.status = 'skipped'; task.stage = 'eligibility';
          task.decisionReason = eligibility.hardBlockers.join('; ') || 'Mandatory eligibility requirements were not met.';
          run.skipped += 1; await task.save(); continue;
        }
        task.stage = 'ai_matching'; await task.save();
        const match = await matchCandidateToJob(job.id);
        task.matchScore = match.overallScore;
        if (match.overallScore < config.minimumMatchScore || match.potentialDisqualifiers.length > 0) {
          task.status = 'skipped'; task.stage = 'match_threshold';
          task.decisionReason = match.potentialDisqualifiers.join('; ') || ('Match score ' + match.overallScore + '% is below the configured threshold.');
          run.skipped += 1; await task.save(); continue;
        }
        run.matched += 1; task.stage = 'application_preparation'; await task.save();
        if (config.autoTailorResume) await generateTailoredResume(job.id);
        const trackedApplication = await ensureTrackedApplication(job, 'ready_for_review');
        await ApplicationPreparationModel.findOneAndUpdate({ jobId: job._id }, { jobId: job._id, applicationId: trackedApplication._id, status: 'ready_for_review', riskFlags: ['Final form values and portal submission require user confirmation.'] }, { upsert: true, new: true });
        await ReviewQueueItemModel.findOneAndUpdate({ jobId: job._id, status: 'pending' }, {
          jobId: job._id, applicationId: trackedApplication._id, reason: 'Application prepared by AI agent',
          blockingQuestion: 'Review the tailored material and confirm final portal submission.',
          suggestedAnswer: 'Open the application page with the JobPilot extension, review all fields, then submit.',
          confidence: match.overallScore, sensitiveFlag: false, status: 'pending',
        }, { upsert: true, new: true });
        task.status = 'needs_review'; task.stage = 'ready_for_review'; task.decisionReason = 'Eligible application prepared and queued for final review.';
        run.prepared += 1; await task.save();
      } catch (error) {
        task.status = 'failed'; task.stage = 'failed'; task.errorMessage = error instanceof Error ? error.message : 'Unknown agent task failure';
        run.failed += 1; await task.save();
      }
    }
    run.status = 'completed'; run.completedAt = new Date();
    run.summary = 'Considered ' + run.considered + ', matched ' + run.matched + ', prepared ' + run.prepared + ', skipped ' + run.skipped + ', failed ' + run.failed + '.';
    config.lastRunAt = run.completedAt;
    config.nextRunAt = new Date(Date.now() + (config.frequency === 'daily' ? 24 : 1) * 60 * 60 * 1000);
    config.consecutiveFailures = 0; config.pausedReason = '';
    await Promise.all([run.save(), config.save()]);
    return run.toJSON();
  } catch (error) {
    run.status = 'failed'; run.completedAt = new Date(); run.failed += 1;
    run.errorMessage = error instanceof Error ? error.message : 'Unknown agent run failure';
    run.summary = 'Agent run failed safely; no application was submitted.'; await run.save();
    if (config) { config.consecutiveFailures += 1; config.pausedReason = run.errorMessage; await config.save(); }
    logger.error({ error, runId: run.id }, 'Application agent run failed'); throw error;
  }
}

export async function getAgentStatus() {
  const [config, latestRun, pendingReview, runningTasks] = await Promise.all([
    AutomationConfigurationModel.findOne(), AgentRunModel.findOne().sort({ createdAt: -1 }).lean(),
    ReviewQueueItemModel.countDocuments({ status: 'pending' }),
    AgentTaskModel.countDocuments({ status: { $in: ['queued', 'analyzing'] } }),
  ]);
  return { config, latestRun, pendingReview, runningTasks, inProcess: Boolean(activeRun) };
}
export async function listAgentRuns(limit = 20) { return AgentRunModel.find().sort({ createdAt: -1 }).limit(limit).lean(); }
export async function listAgentTasks(runId?: string, limit = 100) {
  const query = runId && mongoose.Types.ObjectId.isValid(runId) ? { runId } : {};
  return AgentTaskModel.find(query).sort({ createdAt: -1 }).limit(limit).populate('jobId').lean();
}
