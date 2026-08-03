import { Router } from 'express';
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  addTimelineEvent,
} from '../controllers/application.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';

export const applicationRouter = Router();

applicationRouter.get('/applications', asyncHandler(getApplications));
applicationRouter.post('/applications', asyncHandler(createApplication));
applicationRouter.get('/applications/:id', asyncHandler(getApplicationById));
applicationRouter.patch('/applications/:id', asyncHandler(updateApplication));
applicationRouter.delete('/applications/:id', asyncHandler(deleteApplication));
applicationRouter.post('/applications/:id/events', asyncHandler(addTimelineEvent));
