import { useQuery } from '@tanstack/react-query';
import { fetchHealth, fetchDatabaseHealth } from '../services/health.service';
export function useHealthQuery() {
  return useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    refetchInterval: 30000, // auto check every 30s
    retry: 1,
  });
}
export function useDatabaseHealthQuery() {
  return useQuery({
    queryKey: ['health', 'database'],
    queryFn: fetchDatabaseHealth,
    refetchInterval: 30000,
    retry: 1,
  });
}
//# sourceMappingURL=use-health.js.map
