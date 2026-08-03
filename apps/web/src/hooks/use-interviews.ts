import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createInterviewPrep,
  fetchInterviewPreps,
  startMockSession,
  submitMockAnswer,
  fetchSavedAnswers,
  createSavedAnswer,
  fetchReminders,
  createFollowUpReminder,
  toggleReminder,
} from '../services/interviews.service';

export function useInterviewPrepsQuery(jobId?: string) {
  return useQuery({
    queryKey: ['interview-preps', jobId],
    queryFn: () => fetchInterviewPreps(jobId),
  });
}

export function useCreateInterviewPrepMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, interviewType, difficulty }: { jobId: string; interviewType?: string; difficulty?: string }) =>
      createInterviewPrep(jobId, interviewType, difficulty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview-preps'] });
    },
  });
}

export function useStartMockSessionMutation() {
  return useMutation({
    mutationFn: (preparationId: string) => startMockSession(preparationId),
  });
}

export function useSubmitMockAnswerMutation() {
  return useMutation({
    mutationFn: ({ sessionId, questionId, candidateAnswer }: { sessionId: string; questionId: string; candidateAnswer: string }) =>
      submitMockAnswer(sessionId, questionId, candidateAnswer),
  });
}

export function useSavedAnswersQuery() {
  return useQuery({
    queryKey: ['saved-answers'],
    queryFn: fetchSavedAnswers,
  });
}

export function useCreateSavedAnswerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ canonicalKey, answerText, category, requiresConfirmation }: { canonicalKey: string; answerText: string; category?: string; requiresConfirmation?: boolean }) =>
      createSavedAnswer(canonicalKey, answerText, category, requiresConfirmation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-answers'] });
    },
  });
}

export function useRemindersQuery(applicationId?: string) {
  return useQuery({
    queryKey: ['reminders', applicationId],
    queryFn: () => fetchReminders(applicationId),
  });
}

export function useCreateReminderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, reminderType, title, dueDate, notes }: { applicationId: string; reminderType: string; title: string; dueDate: string; notes?: string }) =>
      createFollowUpReminder(applicationId, reminderType, title, dueDate, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}

export function useToggleReminderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleReminder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
}
