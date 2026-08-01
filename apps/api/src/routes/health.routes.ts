import { Router } from 'express';
import { getHealthStatus, getDatabaseHealthStatus } from '../controllers/health.controller.js';

export const healthRouter = Router();

healthRouter.get('/health', getHealthStatus);
healthRouter.get('/health/database', getDatabaseHealthStatus);
