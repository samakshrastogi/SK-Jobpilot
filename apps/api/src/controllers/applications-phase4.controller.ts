import type { Request, Response } from 'express';
import {
  getSavedAnswers,
  createOrUpdateSavedAnswer,
  getFollowUpReminders,
  createFollowUpReminder,
  toggleCompleteReminder,
} from '../applications/screening-assistant.service.js';
import { createSavedAnswerSchema, createFollowUpReminderSchema } from '@sk-job-pilot/shared';
import { sendSuccess } from '../utils/response.js';

function getParamId(req: Request): string {
  const param = req.params.id;
  return Array.isArray(param) ? param[0] : param;
}

export async function fetchSavedAnswers(req: Request, res: Response): Promise<void> {
  const answers = await getSavedAnswers();
  sendSuccess(res, answers, 'Saved screening answers retrieved successfully', 200, req);
}

export async function postSavedAnswer(req: Request, res: Response): Promise<void> {
  const validated = createSavedAnswerSchema.parse(req.body);
  const result = await createOrUpdateSavedAnswer(
    validated.canonicalKey,
    validated.answerText,
    validated.category,
    validated.requiresConfirmation
  );
  sendSuccess(res, result, 'Saved answer stored successfully', 201, req);
}

export async function fetchReminders(req: Request, res: Response): Promise<void> {
  const appId = req.query.applicationId as string;
  const reminders = await getFollowUpReminders(appId);
  sendSuccess(res, reminders, 'Follow-up reminders retrieved successfully', 200, req);
}

export async function postFollowUpReminder(req: Request, res: Response): Promise<void> {
  const validated = createFollowUpReminderSchema.parse(req.body);
  const reminder = await createFollowUpReminder(
    validated.applicationId,
    validated.reminderType,
    validated.title,
    validated.dueDate,
    validated.notes
  );
  sendSuccess(res, reminder, 'Follow-up reminder created successfully', 201, req);
}

export async function patchToggleReminder(req: Request, res: Response): Promise<void> {
  const id = getParamId(req);
  const reminder = await toggleCompleteReminder(id);
  sendSuccess(res, reminder, 'Reminder completion status updated successfully', 200, req);
}
