import { Router } from 'express';
import { asyncHandler } from '../middlewares/async-handler.js';
import { fetchAgentRuns, fetchAgentStatus, fetchAgentTasks, runApplicationAgent } from '../controllers/application-agent.controller.js';

export const applicationAgentRouter = Router();
applicationAgentRouter.get('/agent/status', asyncHandler(fetchAgentStatus));
applicationAgentRouter.get('/agent/runs', asyncHandler(fetchAgentRuns));
applicationAgentRouter.get('/agent/tasks', asyncHandler(fetchAgentTasks));
applicationAgentRouter.post('/agent/run-now', asyncHandler(runApplicationAgent));