import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  runCandidateAnalysis,
  fetchCandidateAnalysis,
  runJobAnalysis,
  fetchJobAnalysis,
  runJobMatch,
  fetchJobMatch,
  runBatchJobMatch,
  runSkillGapAnalysis,
  generateTailoredResume,
  fetchTailoredResumes,
  approveTailoredResume,
  rejectTailoredResume,
  deleteTailoredResume,
  fetchAIHealth,
  fetchAIActivityLogs,
} from '../services/ai.service';

export function useCandidateAnalysisQuery() {
  return useQuery({
    queryKey: ['candidate-analysis'],
    queryFn: fetchCandidateAnalysis,
  });
}

export function useRunCandidateAnalysisMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (force?: boolean) => runCandidateAnalysis(force),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-analysis'] });
    },
  });
}

export function useJobAnalysisQuery(jobId: string) {
  return useQuery({
    queryKey: ['job-analysis', jobId],
    queryFn: () => fetchJobAnalysis(jobId),
    enabled: Boolean(jobId),
  });
}

export function useRunJobAnalysisMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, force }: { jobId: string; force?: boolean }) =>
      runJobAnalysis(jobId, force),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['job-analysis', variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useJobMatchQuery(jobId: string) {
  return useQuery({
    queryKey: ['job-match', jobId],
    queryFn: () => fetchJobMatch(jobId),
    enabled: Boolean(jobId),
  });
}

export function useRunJobMatchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, force }: { jobId: string; force?: boolean }) => runJobMatch(jobId, force),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['job-match', variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useBatchMatchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobIds: string[]) => runBatchJobMatch(jobIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useSkillGapQuery(jobId: string) {
  return useQuery({
    queryKey: ['skill-gap', jobId],
    queryFn: () => runSkillGapAnalysis(jobId),
    enabled: Boolean(jobId),
  });
}

export function useTailoredResumesQuery() {
  return useQuery({
    queryKey: ['tailored-resumes'],
    queryFn: fetchTailoredResumes,
  });
}

export function useGenerateTailoredResumeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => generateTailoredResume(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tailored-resumes'] });
    },
  });
}

export function useApproveTailoredResumeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveTailoredResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tailored-resumes'] });
    },
  });
}

export function useRejectTailoredResumeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rejectTailoredResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tailored-resumes'] });
    },
  });
}

export function useDeleteTailoredResumeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTailoredResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tailored-resumes'] });
    },
  });
}

export function useAIHealthQuery() {
  return useQuery({
    queryKey: ['ai-health'],
    queryFn: fetchAIHealth,
    refetchInterval: 30000,
  });
}

export function useAIActivityLogsQuery(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['ai-activity', page, limit],
    queryFn: () => fetchAIActivityLogs(page, limit),
  });
}
