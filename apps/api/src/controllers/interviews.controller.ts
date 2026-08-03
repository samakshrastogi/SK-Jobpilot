import type { Request, Response } from 'express';
import {
  generateInterviewPrep,
  getInterviewPreps,
  startMockInterviewSession,
  submitMockAnswer,
} from '../interviews/interview.service.js';
import { createInterviewPrepSchema, submitMockAnswerSchema } from '@sk-job-pilot/shared';
import { sendSuccess } from '../utils/response.js';

function getParamId(req: Request): string {
  const param = req.params.id;
  return Array.isArray(param) ? param[0] : param;
}

export async function createInterviewPreparation(req: Request, res: Response): Promise<void> {
  const validated = createInterviewPrepSchema.parse(req.body);
  const prep = await generateInterviewPrep(validated.jobId, validated.interviewType, validated.difficulty);
  sendSuccess(res, prep, 'Interview preparation package generated successfully', 201, req);
}

export async function fetchInterviewPreparations(req: Request, res: Response): Promise<void> {
  const jobId = req.query.jobId as string;
  const preps = await getInterviewPreps(jobId);
  sendSuccess(res, preps, 'Interview preparations retrieved successfully', 200, req);
}

export async function startMockSession(req: Request, res: Response): Promise<void> {
  const prepId = req.body.preparationId || getParamId(req);
  const session = await startMockInterviewSession(prepId);
  sendSuccess(res, session, 'Mock interview session initialized successfully', 201, req);
}

export async function postMockAnswer(req: Request, res: Response): Promise<void> {
  const sessionId = getParamId(req);
  const validated = submitMockAnswerSchema.parse(req.body);
  const updatedSession = await submitMockAnswer(sessionId, validated.questionId, validated.candidateAnswer);
  sendSuccess(res, updatedSession, 'Mock answer evaluated successfully', 200, req);
}
