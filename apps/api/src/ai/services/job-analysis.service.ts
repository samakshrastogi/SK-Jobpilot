import { JobModel } from '../../models/job.model.js';
import { JobAnalysisModel } from '../../models/job-analysis.model.js';
import { AIExecutionModel } from '../../models/ai-execution.model.js';
import { getAIProvider } from '../provider-factory.js';
import { PROMPT_REGISTRY } from '../prompts/registry.js';
import { AppError } from '../../errors/app-error.js';
import { logger } from '../../utils/logger.js';
import { jobAnalysisSchema, type JobAnalysis } from '@sk-job-pilot/shared';
import mongoose from 'mongoose';

const KNOWN_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'Python', 'Django', 'Django REST Framework',
  'REST', 'GraphQL', 'MongoDB', 'PostgreSQL', 'SQL', 'Redis', 'Docker', 'AWS', 'Azure', 'Linux', 'Tailwind',
  'LangChain', 'LangGraph', 'RAG', 'AI Agents', 'Prompt Engineering', 'Java', 'Spring Boot', 'Flutter',
];

function extractSkills(text: string): string[] {
  const normalized = text.toLowerCase();
  return KNOWN_SKILLS.filter((skill) => normalized.includes(skill.toLowerCase()));
}

function extractRequiredExperienceYears(text: string): number {
  const matches = Array.from(text.matchAll(/(\d{1,2})\+?\s*(?:years|yrs)\s+(?:of\s+)?experience/gi));
  const years = matches.map((match) => Number(match[1])).filter(Number.isFinite);
  return years.length ? Math.min(...years) : 0;
}

function deterministicJobAnalysis(jobId: string, job: { jobTitle: string; companyName: string; description: string; location: string; workMode: string; employmentType: string }): JobAnalysis {
  const text = `${job.jobTitle}\n${job.description || ''}`;
  const skills = extractSkills(text);
  const seniority = /\b(staff|principal|architect|lead|manager|director|head)\b/i.test(job.jobTitle)
    ? 'Lead/Senior'
    : /\b(sr\.?|senior)\b/i.test(job.jobTitle)
      ? 'Senior'
      : 'Entry to Mid';
  const roleFamily = /front|react|ui|web/i.test(job.jobTitle)
    ? 'Frontend Engineering'
    : /back|node|api|server/i.test(job.jobTitle)
      ? 'Backend Engineering'
      : /ai|automation|agent|rag/i.test(job.jobTitle)
        ? 'AI Automation Engineering'
        : 'Software Engineering';

  const parsed = jobAnalysisSchema.parse({
    normalizedTitle: job.jobTitle,
    company: job.companyName,
    seniority,
    roleFamily,
    requiredExperienceYears: extractRequiredExperienceYears(text),
    requiredSkills: skills.slice(0, 8),
    preferredSkills: skills.slice(8),
    responsibilities: [],
    qualifications: [],
    educationRequirements: [],
    domainRequirements: [],
    location: job.location || 'Remote',
    workMode: job.workMode,
    employmentType: job.employmentType,
    visaSponsorship: 'Unknown',
    compensationText: '',
    importantKeywords: skills,
    negativeRequirements: [],
    confidenceScore: skills.length ? 70 : 50,
    extractionWarnings: ['Local deterministic extraction used because external AI is unavailable'],
  });

  return { ...parsed, jobId };
}

async function saveAnalysis(jobId: string, data: JobAnalysis): Promise<JobAnalysis> {
  const analysisData = Object.fromEntries(Object.entries(data).filter(([key]) => key !== 'jobId')) as Omit<JobAnalysis, 'jobId'>;
  let analysisDoc = await JobAnalysisModel.findOne({ jobId });
  if (analysisDoc) {
    Object.assign(analysisDoc, analysisData);
    await analysisDoc.save();
  } else {
    analysisDoc = await JobAnalysisModel.create({
      jobId: new mongoose.Types.ObjectId(jobId),
      ...analysisData,
    });
  }

  return analysisDoc.toJSON() as unknown as JobAnalysis;
}

export async function analyzeJob(jobId: string, forceRegenerate = false): Promise<JobAnalysis> {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw AppError.badRequest('Invalid job ID format');
  }

  const job = await JobModel.findById(jobId);
  if (!job) {
    throw AppError.notFound('Job not found');
  }

  if (!forceRegenerate) {
    const existing = await JobAnalysisModel.findOne({ jobId });
    if (existing) {
      return existing.toJSON() as unknown as JobAnalysis;
    }
  }

  const startTime = Date.now();
  const promptDef = PROMPT_REGISTRY.jobRequirementExtraction;
  const promptText = promptDef.buildPrompt({
    jobTitle: job.jobTitle,
    companyName: job.companyName,
    description: job.description,
  });

  try {
    const provider = getAIProvider();
    const response = await provider.generateStructured({
      systemInstruction: promptDef.systemInstruction,
      prompt: promptText,
      schema: jobAnalysisSchema,
      promptId: promptDef.id,
      promptVersion: promptDef.version,
    });

    const durationMs = Date.now() - startTime;

    await AIExecutionModel.create({
      operationType: 'job_extraction',
      provider: response.provider,
      aiModel: response.model,
      entityType: 'Job',
      entityId: jobId,
      status: 'completed',
      durationMs,
      promptVersion: promptDef.version,
      retryCount: 0,
      inputTokenUsage: response.usage.inputTokens,
      outputTokenUsage: response.usage.outputTokens,
      totalTokenUsage: response.usage.totalTokens,
      estimatedCostUsd: response.usage.estimatedCostUsd,
      resultSummary: `Extracted requirements for ${job.jobTitle} at ${job.companyName}`,
    });

    job.processingStatus = 'analyzed';
    if (response.data.requiredSkills && response.data.requiredSkills.length > 0) {
      job.requiredSkills = response.data.requiredSkills;
    }
    if (response.data.preferredSkills && response.data.preferredSkills.length > 0) {
      job.preferredSkills = response.data.preferredSkills;
    }
    await job.save();

    return saveAnalysis(jobId, { ...(response.data as Omit<JobAnalysis, 'jobId'>), jobId });
  } catch (error) {
    logger.warn({ reason: error instanceof Error ? error.message : 'Unknown AI analysis error', jobId }, 'Job analysis AI unavailable; using local deterministic extraction');
    const data = deterministicJobAnalysis(jobId, {
      jobTitle: job.jobTitle,
      companyName: job.companyName,
      description: job.description || '',
      location: job.location,
      workMode: job.workMode,
      employmentType: job.employmentType,
    });
    job.processingStatus = 'analyzed';
    job.requiredSkills = data.requiredSkills;
    job.preferredSkills = data.preferredSkills;
    await job.save();
    return saveAnalysis(jobId, data);
  }
}

export async function getJobAnalysis(jobId: string): Promise<JobAnalysis | null> {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw AppError.badRequest('Invalid job ID format');
  }
  const analysis = await JobAnalysisModel.findOne({ jobId });
  if (!analysis) return null;
  return analysis.toJSON() as unknown as JobAnalysis;
}