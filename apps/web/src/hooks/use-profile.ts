import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProfile, saveProfile } from '../services/profile.service';
import type { CandidateProfile } from '@sk-job-pilot/shared';

export function useProfileQuery() {
  return useQuery({
    queryKey: ['candidate-profile'],
    queryFn: fetchProfile,
  });
}

export function useSaveProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CandidateProfile>) => saveProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-profile'] });
    },
  });
}
