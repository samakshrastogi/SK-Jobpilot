import { apiFetch } from './api-client';
import type {
  ApiResponse,
  InterviewPreparation,
  MockInterviewSession,
  SavedAnswer,
  FollowUpReminder,
} from '@sk-job-pilot/shared';

export async function createInterviewPrep(
  jobId: string,
  interviewType = 'behavioural',
  difficulty = 'senior'
): Promise<ApiResponse<InterviewPreparation>> {
  return apiFetch<InterviewPreparation>('/interviews/preparations', {
    method: 'POST',
    body: { jobId, interviewType, difficulty },
  });
}

export async function fetchInterviewPreps(jobId?: string): Promise<ApiResponse<InterviewPreparation[]>> {
  return apiFetch<InterviewPreparation[]>('/interviews/preparations', {
    params: jobId ? { jobId } : undefined,
  });
}

export async function startMockSession(preparationId: string): Promise<ApiResponse<MockInterviewSession>> {
  return apiFetch<MockInterviewSession>('/interviews/sessions', {
    method: 'POST',
    body: { preparationId },
  });
}

export async function submitMockAnswer(
  sessionId: string,
  questionId: string,
  candidateAnswer: string
): Promise<ApiResponse<MockInterviewSession>> {
  return apiFetch<MockInterviewSession>(`/interviews/sessions/${sessionId}/answer`, {
    method: 'POST',
    body: { questionId, candidateAnswer },
  });
}

export async function fetchSavedAnswers(): Promise<ApiResponse<SavedAnswer[]>> {
  return apiFetch<SavedAnswer[]>('/screening/answers');
}

export async function createSavedAnswer(
  canonicalKey: string,
  answerText: string,
  category = 'general',
  requiresConfirmation = false
): Promise<ApiResponse<SavedAnswer>> {
  return apiFetch<SavedAnswer>('/screening/answers', {
    method: 'POST',
    body: { canonicalKey, answerText, category, requiresConfirmation },
  });
}

export async function fetchReminders(applicationId?: string): Promise<ApiResponse<FollowUpReminder[]>> {
  return apiFetch<FollowUpReminder[]>('/reminders', {
    params: applicationId ? { applicationId } : undefined,
  });
}

export async function createFollowUpReminder(
  applicationId: string,
  reminderType: string,
  title: string,
  dueDate: string,
  notes = ''
): Promise<ApiResponse<FollowUpReminder>> {
  return apiFetch<FollowUpReminder>('/reminders', {
    method: 'POST',
    body: { applicationId, reminderType, title, dueDate, notes },
  });
}

export async function toggleReminder(id: string): Promise<ApiResponse<FollowUpReminder>> {
  return apiFetch<FollowUpReminder>(`/reminders/${id}/toggle`, {
    method: 'PATCH',
  });
}
