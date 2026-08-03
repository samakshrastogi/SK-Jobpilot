import { Router } from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  toggleSaveJob,
  toggleArchiveJob,
} from '../controllers/job.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';

export const jobRouter = Router();

jobRouter.get('/jobs', asyncHandler(getJobs));
jobRouter.post('/jobs', asyncHandler(createJob));
jobRouter.get('/jobs/:id', asyncHandler(getJobById));
jobRouter.patch('/jobs/:id', asyncHandler(updateJob));
jobRouter.delete('/jobs/:id', asyncHandler(deleteJob));
jobRouter.patch('/jobs/:id/save', asyncHandler(toggleSaveJob));
jobRouter.patch('/jobs/:id/archive', asyncHandler(toggleArchiveJob));
