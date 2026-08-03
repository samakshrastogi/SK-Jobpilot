import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchDiscoverySources,
  createDiscoverySource,
  runDiscoverySource,
  fetchDiscoveryRuns,
} from '../services/discovery.service';
import type { DiscoverySource } from '@sk-job-pilot/shared';

export function useDiscoverySourcesQuery() {
  return useQuery({
    queryKey: ['discovery-sources'],
    queryFn: fetchDiscoverySources,
  });
}

export function useCreateDiscoverySourceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (source: Partial<DiscoverySource>) => createDiscoverySource(source),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discovery-sources'] });
    },
  });
}

export function useRunDiscoverySourceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => runDiscoverySource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discovery-sources'] });
      queryClient.invalidateQueries({ queryKey: ['discovery-runs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useDiscoveryRunsQuery(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['discovery-runs', page, limit],
    queryFn: () => fetchDiscoveryRuns(page, limit),
  });
}
