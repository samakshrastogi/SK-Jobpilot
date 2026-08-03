import { Router } from 'express';
import { fetchDashboardSummary } from '../controllers/dashboard.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';

export const dashboardRouter = Router();

dashboardRouter.get('/dashboard/summary', asyncHandler(fetchDashboardSummary));
