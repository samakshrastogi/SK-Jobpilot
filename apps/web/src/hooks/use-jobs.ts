import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchJobs,
  createJob,
  toggleSaveJob,
  toggleArchiveJob,
  deleteJob,
  type FetchJobsParams,
} from '../services/job.service';
import type { Job } from '@sk-job-pilot/shared';

export function useJobsQuery(params: FetchJobsParams = {}) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => fetchJobs(params),
  });
}

export function useCreateJobMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Job>) => createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useToggleSaveJobMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleSaveJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useToggleArchiveJobMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleArchiveJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useDeleteJobMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}
