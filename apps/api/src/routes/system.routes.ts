import { Router } from 'express';
import {
  fetchSystemReadiness,
  fetchSystemDiagnostics,
  fetchSystemVersion,
  fetchPublicConfig,
} from '../controllers/system.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';

export const systemRouter = Router();

systemRouter.get('/system/readiness', asyncHandler(fetchSystemReadiness));
systemRouter.get('/system/diagnostics', asyncHandler(fetchSystemDiagnostics));
systemRouter.get('/system/version', asyncHandler(fetchSystemVersion));
systemRouter.get('/system/config/public', asyncHandler(fetchPublicConfig));
