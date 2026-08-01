import { apiFetch } from './api-client';
import type { ApiResponse, HealthCheckData } from '@sk-job-pilot/shared';

export async function fetchHealth(): Promise<ApiResponse<HealthCheckData>> {
  return apiFetch<HealthCheckData>('/health');
}

export async function fetchDatabaseHealth(): Promise<ApiResponse<HealthCheckData>> {
  return apiFetch<HealthCheckData>('/health/database');
}
