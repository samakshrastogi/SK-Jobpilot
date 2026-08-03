import type { Request, Response } from 'express';
import {
  analyzeCandidate,
  getCandidateAnalysis,
} from '../ai/services/candidate-analysis.service.js';
import { analyzeJob, getJobAnalysis } from '../ai/services/job-analysis.service.js';
import {
  matchCandidateToJob,
  matchJobsBatch,
  getJobMatch,
} from '../ai/services/hybrid-matching.service.js';
import { analyzeSkillGaps } from '../ai/services/skill-gap.service.js';
import {
  generateTailoredResume,
  getTailoredResumes,
  getTailoredResumeById,
  updateTailoredResume,
  approveTailoredResume,
  rejectTailoredResume,
  deleteTailoredResume,
} from '../ai/services/resume-tailoring.service.js';
import { AIExecutionModel } from '../models/ai-execution.model.js';
import { aiBudgetManager } from '../ai/utils/budget-manager.js';
import { env } from '../config/env.js';
import { batchMatchRequestSchema } from '@sk-job-pilot/shared';
import { sendSuccess, sendPaginated } from '../utils/response.js';

function getParamId(req: Request): string {
  const param = req.params.id;
  return Array.isArray(param) ? param[0] : param;
}

export async function runCandidateAnalysis(req: Request, res: Response): Promise<void> {
  const force = req.query.force === 'true';
  const result = await analyzeCandidate(force);
  sendSuccess(res, result, 'Candidate profile analysis completed successfully', 200, req);
}

export async function fetchCandidateAnalysis(req: Request, res: Response): Promise<void> {
  const result = await getCandidateAnalysis();
  sendSuccess(res, result, 'Candidate profile analysis retrieved successfully', 200, req);
}

export async function runJobAnalysis(req: Request, res: Response): Promise<void> {
  const id = getParamId(req);
  const force = req.query.force === 'true';
  const result = await analyzeJob(id, force);
  sendSuccess(res, result, 'Job requirement extraction completed successfully', 200, req);
}

export async function fetchJobAnalysis(req: Request, res: Response): Promise<void> {
  const id = getParamId(req);
  const result = await getJobAnalysis(id);
  sendSuccess(res, result, 'Job analysis retrieved successfully', 200, req);
}

export async function runJobMatch(req: Request, res: Response): Promise<void> {
  const id = getParamId(req);
  const force = req.query.force === 'true';
  const result = await matchCandidateToJob(id, force);
  sendSuccess(res, result, 'Candidate job match calculation completed successfully', 200, req);
}

export async function fetchJobMatch(req: Request, res: Response): Promise<void> {
  const id = getParamId(req);
  const result = await getJobMatch(id);
  sendSuccess(res, result, 'Job match evaluation retrieved successfully', 200, req);
}

export async function runBatchJobMatch(req: Request, res: Response): Promise<void> {
  const validated = batchMatchRequestSchema.parse(req.body);
  const results = await matchJobsBatch(validated.jobIds);
  sendSuccess(res, results, 'Batch job match calculation completed successfully', 200, req);
}

export async function runSkillGapAnalysis(req: Request, res: Response): Promise<void> {
  const id = getParamId(req);
  const result = await analyzeSkillGaps(id);
  sendSuccess(res, result, 'Skill gap analysis completed successfully', 200, req);
}

export async function createTailoredResumeVersion(req: Request, res: Response): Promise<void> {
  const id = getParamId(req);
  const result = await generateTailoredResume(id);
  sendSuccess(res, result, 'Tailored resume proposed version generated successfully', 201, req);
}

export async function fetchTailoredResumes(req: Request, res: Response): Promise<void> {
  const results = await getTailoredResumes();
  sendSuccess(res, results, 'Tailored resume versions retrieved successfully', 200, req);
}

export async function fetchTailoredResumeById(req: Request, res: Response): Promise<void> {
  const id = getParamId(req);
  const result = await getTailoredResumeById(id);
  sendSuccess(res, result, 'Tailored resume version retrieved successfully', 200, req);
}

export async function patchTailoredResumeVersion(req: Request, res: Response): Promise<void> {
  const id = getParamId(req);
  const result = await updateTailoredResume(id, req.body);
  sendSuccess(res, result, 'Tailored resume version updated successfully', 200, req);
}

export async function approveTailoredResumeVersion(req: Request, res: Response): Promise<void> {
  const id = getParamId(req);
  const result = await approveTailoredResume(id);
  sendSuccess(res, result, 'Tailored resume version approved successfully', 200, req);
}

export async function rejectTailoredResumeVersion(req: Request, res: Response): Promise<void> {
  const id = getParamId(req);
  const result = await rejectTailoredResume(id);
  sendSuccess(res, result, 'Tailored resume version rejected', 200, req);
}

export async function removeTailoredResumeVersion(req: Request, res: Response): Promise<void> {
  const id = getParamId(req);
  const result = await deleteTailoredResume(id);
  sendSuccess(res, result, 'Tailored resume version deleted successfully', 200, req);
}

export async function getAIHealthStatus(req: Request, res: Response): Promise<void> {
  const budgetStatus = aiBudgetManager.getStatus();
  const hasKey = Boolean(env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim().length > 0);

  const healthData = {
    status: hasKey && budgetStatus.circuitState !== 'open' ? 'healthy' : 'degraded',
    configuredProvider: env.AI_PROVIDER || 'gemini',
    textModel: env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash',
    embeddingModel: env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004',
    hasApiKey: hasKey,
    dailyRequestsUsed: budgetStatus.dailyRequestsCount,
    dailyRequestLimit: budgetStatus.dailyRequestsLimit,
    dailyTokensUsed: budgetStatus.dailyTokensCount,
    dailyTokenBudget: budgetStatus.dailyTokenBudget,
    circuitState: budgetStatus.circuitState,
    lastSuccessfulRequestAt: budgetStatus.lastSuccessTime,
    lastFailedRequestAt: budgetStatus.lastFailureTime,
  };

  sendSuccess(res, healthData, 'AI service health retrieved successfully', 200, req);
}

export async function getAIActivityLogs(req: Request, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const skip = (page - 1) * limit;

  const totalItems = await AIExecutionModel.countDocuments();
  const logs = await AIExecutionModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  sendPaginated(
    res,
    logs,
    {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    'AI activity logs retrieved successfully',
    req
  );
}
