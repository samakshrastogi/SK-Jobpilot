import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProfile, saveProfile } from '../services/profile.service';
export function useProfileQuery() {
    return useQuery({
        queryKey: ['candidate-profile'],
        queryFn: fetchProfile,
    });
}
export function useSaveProfileMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => saveProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['candidate-profile'] });
        },
    });
}
//# sourceMappingURL=use-profile.js.map