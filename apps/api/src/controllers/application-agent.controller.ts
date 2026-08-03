import type { Request, Response } from 'express';
import { z } from 'zod';
import { executeApplicationAgent, getAgentStatus, listAgentRuns, listAgentTasks } from '../services/application-agent.service.js';
import { sendSuccess } from '../utils/response.js';

const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  runId: z.string().optional(),
});

export async function runApplicationAgent(req: Request, res: Response): Promise<void> {
  const result = await executeApplicationAgent('manual');
  sendSuccess(res, result, 'Application agent run completed successfully', 200, req);
}

export async function fetchAgentStatus(req: Request, res: Response): Promise<void> {
  sendSuccess(res, await getAgentStatus(), 'Application agent status retrieved successfully', 200, req);
}

export async function fetchAgentRuns(req: Request, res: Response): Promise<void> {
  const { limit } = listQuerySchema.parse(req.query);
  sendSuccess(res, await listAgentRuns(limit), 'Application agent runs retrieved successfully', 200, req);
}

export async function fetchAgentTasks(req: Request, res: Response): Promise<void> {
  const { limit, runId } = listQuerySchema.parse(req.query);
  sendSuccess(res, await listAgentTasks(runId, limit), 'Application agent tasks retrieved successfully', 200, req);
}