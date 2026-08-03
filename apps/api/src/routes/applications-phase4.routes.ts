import { Router } from 'express';
import {
  fetchSavedAnswers,
  postSavedAnswer,
  fetchReminders,
  postFollowUpReminder,
  patchToggleReminder,
} from '../controllers/applications-phase4.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';

export const phase4ApplicationsRouter = Router();

phase4ApplicationsRouter.get('/screening/answers', asyncHandler(fetchSavedAnswers));
phase4ApplicationsRouter.post('/screening/answers', asyncHandler(postSavedAnswer));

phase4ApplicationsRouter.get('/reminders', asyncHandler(fetchReminders));
phase4ApplicationsRouter.post('/reminders', asyncHandler(postFollowUpReminder));
phase4ApplicationsRouter.patch('/reminders/:id/toggle', asyncHandler(patchToggleReminder));
