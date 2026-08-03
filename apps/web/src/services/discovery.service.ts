import { apiFetch } from './api-client';
import type { ApiResponse, PaginatedResponse, DiscoverySource, DiscoveryRun } from '@sk-job-pilot/shared';

export async function fetchDiscoverySources(): Promise<ApiResponse<DiscoverySource[]>> {
  return apiFetch<DiscoverySource[]>('/discovery/sources');
}

export async function createDiscoverySource(source: Partial<DiscoverySource>): Promise<ApiResponse<DiscoverySource>> {
  return apiFetch<DiscoverySource>('/discovery/sources', {
    method: 'POST',
    body: source,
  });
}

export async function runDiscoverySource(id: string): Promise<ApiResponse<DiscoveryRun>> {
  return apiFetch<DiscoveryRun>(`/discovery/sources/${id}/run`, {
    method: 'POST',
  });
}

export async function fetchDiscoveryRuns(page = 1, limit = 20): Promise<PaginatedResponse<DiscoveryRun>> {
  return apiFetch<DiscoveryRun[]>('/discovery/runs', {
    params: { page, limit },
  }) as Promise<PaginatedResponse<DiscoveryRun>>;
}
