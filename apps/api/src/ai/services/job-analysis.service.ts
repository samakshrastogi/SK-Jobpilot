import { JobModel } from '../../models/job.model.js';
import { JobAnalysisModel } from '../../models/job-analysis.model.js';
import { AIExecutionModel } from '../../models/ai-execution.model.js';
import { getAIProvider } from '../provider-factory.js';
import { PROMPT_REGISTRY } from '../prompts/registry.js';
import { AppError } from '../../errors/app-error.js';
import { jobAnalysisSchema, type JobAnalysis } from '@sk-job-pilot/shared';
import mongoose from 'mongoose';

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
  const provider = getAIProvider();
  const promptDef = PROMPT_REGISTRY.jobRequirementExtraction;

  const promptText = promptDef.buildPrompt({
    jobTitle: job.jobTitle,
    companyName: job.companyName,
    description: job.description,
  });

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

  let analysisDoc = await JobAnalysisModel.findOne({ jobId });
  if (analysisDoc) {
    Object.assign(analysisDoc, response.data);
    await analysisDoc.save();
  } else {
    analysisDoc = await JobAnalysisModel.create({
      jobId: new mongoose.Types.ObjectId(jobId),
      ...response.data,
    });
  }

  return analysisDoc.toJSON() as unknown as JobAnalysis;
}

export async function getJobAnalysis(jobId: string): Promise<JobAnalysis | null> {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw AppError.badRequest('Invalid job ID format');
  }
  const analysis = await JobAnalysisModel.findOne({ jobId });
  if (!analysis) return null;
  return analysis.toJSON() as unknown as JobAnalysis;
}
