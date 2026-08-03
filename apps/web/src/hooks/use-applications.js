import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  addApplicationTimelineEvent,
} from '../services/application.service';
export function useApplicationsQuery(params = {}) {
  return useQuery({
    queryKey: ['applications', params],
    queryFn: () => fetchApplications(params),
  });
}
export function useCreateApplicationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}
export function useUpdateApplicationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateApplication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
export function useDeleteApplicationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
export function useAddTimelineEventMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, event }) => addApplicationTimelineEvent(id, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
//# sourceMappingURL=use-applications.js.map
