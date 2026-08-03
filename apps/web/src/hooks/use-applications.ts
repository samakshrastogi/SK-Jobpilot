import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  addApplicationTimelineEvent,
  type FetchApplicationsParams,
} from '../services/application.service';
import type { Application } from '@sk-job-pilot/shared';

export function useApplicationsQuery(params: FetchApplicationsParams = {}) {
  return useQuery({
    queryKey: ['applications', params],
    queryFn: () => fetchApplications(params),
  });
}

export function useCreateApplicationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      jobId: string;
      resumeId?: string;
      status?: string;
      allowDuplicate?: boolean;
    }) => createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useUpdateApplicationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Application> }) =>
      updateApplication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useDeleteApplicationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useAddTimelineEventMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      event,
    }: {
      id: string;
      event: { status: string; title: string; description?: string; date?: string };
    }) => addApplicationTimelineEvent(id, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
