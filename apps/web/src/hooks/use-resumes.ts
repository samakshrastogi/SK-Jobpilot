import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchResumes,
  uploadResumeFile,
  deleteResume,
  setMasterResume,
} from '../services/resume.service';

export function useResumesQuery(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['resumes', page, limit],
    queryFn: () => fetchResumes(page, limit),
  });
}

export function useUploadResumeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadResumeFile(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
}

export function useDeleteResumeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
}

export function useSetMasterResumeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => setMasterResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
}
