import { JobModel } from '../../models/job.model.js';
import { JobMatchModel } from '../../models/job-match.model.js';
import { AIExecutionModel } from '../../models/ai-execution.model.js';
import { analyzeCandidate } from './candidate-analysis.service.js';
import { analyzeJob } from './job-analysis.service.js';
import { getAIProvider } from '../provider-factory.js';
import { PROMPT_REGISTRY } from '../prompts/registry.js';
import { AppError } from '../../errors/app-error.js';
import { jobMatchSchema, type JobMatch } from '@sk-job-pilot/shared';
import mongoose from 'mongoose';

export async function matchCandidateToJob(
  jobId: string,
  forceRegenerate = false
): Promise<JobMatch> {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw AppError.badRequest('Invalid job ID format');
  }

  const job = await JobModel.findById(jobId);
  if (!job) {
    throw AppError.notFound('Job not found');
  }

  const candidateAnalysis = await analyzeCandidate();
  const candidateFingerprint = candidateAnalysis.fingerprint || 'default_fingerprint';

  if (!forceRegenerate) {
    const existing = await JobMatchModel.findOne({ jobId, candidateFingerprint });
    if (existing) {
      return existing.toJSON() as unknown as JobMatch;
    }
  }

  const jobAnalysis = await analyzeJob(jobId);
  const startTime = Date.now();
  const provider = getAIProvider();

  let matchResultData: JobMatch;

  try {
    const promptDef = PROMPT_REGISTRY.candidateJobMatch;
    const promptText = promptDef.buildPrompt({ candidateAnalysis, jobAnalysis });

    const response = await provider.generateStructured({
      systemInstruction: promptDef.systemInstruction,
      prompt: promptText,
      schema: jobMatchSchema,
      promptId: promptDef.id,
      promptVersion: promptDef.version,
    });

    matchResultData = response.data as unknown as JobMatch;

    await AIExecutionModel.create({
      operationType: 'job_match',
      provider: response.provider,
      aiModel: response.model,
      entityType: 'Job',
      entityId: jobId,
      status: 'completed',
      durationMs: Date.now() - startTime,
      promptVersion: promptDef.version,
      retryCount: 0,
      inputTokenUsage: response.usage.inputTokens,
      outputTokenUsage: response.usage.outputTokens,
      totalTokenUsage: response.usage.totalTokens,
      estimatedCostUsd: response.usage.estimatedCostUsd,
      resultSummary: `Calculated match score of ${matchResultData.overallScore}% for ${job.jobTitle}`,
    });
  } catch {
    matchResultData = calculateDeterministicFallbackMatch(candidateAnalysis, jobAnalysis);
  }

  job.matchScore = matchResultData.overallScore;
  job.matchExplanation = matchResultData.explanation;
  await job.save();

  const { jobId: _j, candidateFingerprint: _c, ...restMatch } = matchResultData;

  let matchDoc = await JobMatchModel.findOne({ jobId, candidateFingerprint });
  if (matchDoc) {
    Object.assign(matchDoc, restMatch);
    await matchDoc.save();
  } else {
    matchDoc = await JobMatchModel.create({
      jobId: new mongoose.Types.ObjectId(jobId),
      candidateFingerprint,
      ...restMatch,
    });
  }

  return matchDoc.toJSON() as unknown as JobMatch;
}

export async function matchJobsBatch(jobIds: string[]): Promise<JobMatch[]> {
  const results: JobMatch[] = [];
  const batchSize = 3;
  for (let i = 0; i < jobIds.length; i += batchSize) {
    const chunk = jobIds.slice(i, i + batchSize);
    const chunkResults = await Promise.all(
      chunk.map(async (id) => {
        try {
          return await matchCandidateToJob(id);
        } catch {
          return null;
        }
      })
    );
    chunkResults.forEach((r) => {
      if (r) results.push(r);
    });
  }
  return results;
}

export async function getJobMatch(jobId: string): Promise<JobMatch | null> {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw AppError.badRequest('Invalid job ID format');
  }
  const match = await JobMatchModel.findOne({ jobId }).sort({ updatedAt: -1 });
  if (!match) return null;
  return match.toJSON() as unknown as JobMatch;
}

function calculateDeterministicFallbackMatch(candidate: any, job: any): JobMatch {
  const candidateSkills = new Set(
    [
      ...(candidate.coreSkills || []),
      ...(candidate.supportingSkills || []),
      ...(candidate.toolsAndPlatforms || []),
    ].map((s: string) => s.toLowerCase())
  );

  const reqSkills = job.requiredSkills || [];
  const prefSkills = job.preferredSkills || [];

  const matchedReq = reqSkills.filter((s: string) => candidateSkills.has(s.toLowerCase()));
  const missingReq = reqSkills.filter((s: string) => !candidateSkills.has(s.toLowerCase()));
  const matchedPref = prefSkills.filter((s: string) => candidateSkills.has(s.toLowerCase()));
  const missingPref = prefSkills.filter((s: string) => !candidateSkills.has(s.toLowerCase()));

  const reqScore = reqSkills.length > 0 ? (matchedReq.length / reqSkills.length) * 100 : 80;
  const prefScore = prefSkills.length > 0 ? (matchedPref.length / prefSkills.length) * 100 : 70;
  const expScore =
    candidate.totalRelevantExperienceYears >= (job.requiredExperienceYears || 0) ? 90 : 60;
  const titleScore = 75;

  const overall = Math.round(
    reqScore * 0.3 + expScore * 0.2 + titleScore * 0.15 + prefScore * 0.1 + 80 * 0.25
  );

  let rec: JobMatch['recommendation'] = 'possible_match';
  if (overall >= 85) rec = 'excellent_match';
  else if (overall >= 75) rec = 'strong_match';
  else if (overall >= 60) rec = 'possible_match';
  else rec = 'weak_match';

  return {
    jobId: job.jobId || 'deterministic',
    candidateFingerprint: candidate.fingerprint || 'default',
    overallScore: Math.min(Math.max(overall, 0), 100),
    recommendation: rec,
    categories: {
      requiredSkills: {
        score: reqScore,
        weight: 0.3,
        weightedScore: reqScore * 0.3,
        notes: 'Deterministic skill match',
      },
      experience: {
        score: expScore,
        weight: 0.2,
        weightedScore: expScore * 0.2,
        notes: 'Experience comparison',
      },
      roleTitleAlignment: {
        score: titleScore,
        weight: 0.15,
        weightedScore: titleScore * 0.15,
        notes: 'Title comparison',
      },
      preferredSkills: {
        score: prefScore,
        weight: 0.1,
        weightedScore: prefScore * 0.1,
        notes: 'Preferred skill match',
      },
      domainAlignment: { score: 75, weight: 0.1, weightedScore: 7.5, notes: 'Domain alignment' },
      projectEvidence: { score: 75, weight: 0.05, weightedScore: 3.75, notes: 'Project evidence' },
      educationAlignment: {
        score: 80,
        weight: 0.05,
        weightedScore: 4.0,
        notes: 'Education alignment',
      },
      locationWorkPref: {
        score: 90,
        weight: 0.05,
        weightedScore: 4.5,
        notes: 'Work mode preference',
      },
    },
    matchedRequiredSkills: matchedReq,
    missingRequiredSkills: missingReq,
    matchedPreferredSkills: matchedPref,
    missingPreferredSkills: missingPref,
    transferableSkills: [],
    strongSupportingExperience: [],
    weakEvidenceAreas: [],
    potentialDisqualifiers: [],
    explanation: `Deterministic match evaluation completed. Score: ${overall}%. Matched ${matchedReq.length} of ${reqSkills.length} required skills.`,
  };
}
