import { SavedAnswerModel } from '../models/saved-answer.model.js';
import { FollowUpReminderModel } from '../models/follow-up-reminder.model.js';
import { CandidateProfileModel } from '../models/candidate-profile.model.js';
import { AppError } from '../errors/app-error.js';
import mongoose from 'mongoose';

export async function getSavedAnswers() {
  const answers = await SavedAnswerModel.find().sort({ canonicalKey: 1 });
  return answers.map((doc) => doc.toJSON());
}

export async function createOrUpdateSavedAnswer(
  canonicalKey: string,
  answerText: string,
  category = 'general',
  requiresConfirmation = false
) {
  let doc = await SavedAnswerModel.findOne({ canonicalKey });
  if (doc) {
    doc.answerText = answerText;
    doc.category = category;
    doc.requiresConfirmation = requiresConfirmation;
    await doc.save();
  } else {
    doc = await SavedAnswerModel.create({
      canonicalKey,
      answerText,
      category,
      requiresConfirmation,
    });
  }
  return doc.toJSON();
}

export async function getFollowUpReminders(applicationId?: string) {
  const query = applicationId && mongoose.Types.ObjectId.isValid(applicationId) ? { applicationId } : {};
  const reminders = await FollowUpReminderModel.find(query).sort({ dueDate: 1 }).populate('application');
  return reminders.map((doc) => doc.toJSON());
}

export async function createFollowUpReminder(
  applicationId: string,
  reminderType: string,
  title: string,
  dueDate: string,
  notes = ''
) {
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw AppError.badRequest('Invalid application ID format');
  }

  const reminder = await FollowUpReminderModel.create({
    applicationId: new mongoose.Types.ObjectId(applicationId),
    reminderType,
    title,
    dueDate: new Date(dueDate),
    notes,
    isCompleted: false,
  });

  const populated = await FollowUpReminderModel.findById(reminder._id).populate('application');
  return populated?.toJSON();
}

export async function toggleCompleteReminder(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest('Invalid reminder ID format');
  }

  const reminder = await FollowUpReminderModel.findById(id);
  if (!reminder) {
    throw AppError.notFound('Reminder not found');
  }

  reminder.isCompleted = !reminder.isCompleted;
  await reminder.save();

  const populated = await FollowUpReminderModel.findById(id).populate('application');
  return populated?.toJSON();
}
