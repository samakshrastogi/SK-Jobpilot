import { Router } from 'express';
import {
  createInterviewPreparation,
  fetchInterviewPreparations,
  startMockSession,
  postMockAnswer,
} from '../controllers/interviews.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';

export const interviewRouter = Router();

interviewRouter.post('/interviews/preparations', asyncHandler(createInterviewPreparation));
interviewRouter.get('/interviews/preparations', asyncHandler(fetchInterviewPreparations));
interviewRouter.post('/interviews/sessions', asyncHandler(startMockSession));
interviewRouter.post('/interviews/sessions/:id/answer', asyncHandler(postMockAnswer));
