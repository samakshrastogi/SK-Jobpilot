import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJobs, createJob, toggleSaveJob, toggleArchiveJob, deleteJob, } from '../services/job.service';
export function useJobsQuery(params = {}) {
    return useQuery({
        queryKey: ['jobs', params],
        queryFn: () => fetchJobs(params),
    });
}
export function useCreateJobMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => createJob(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
    });
}
export function useToggleSaveJobMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => toggleSaveJob(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
    });
}
export function useToggleArchiveJobMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => toggleArchiveJob(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
    });
}
export function useDeleteJobMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteJob(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
    });
}
//# sourceMappingURL=use-jobs.js.map