import { apiFetch } from './api-client';
import type { ApiResponse, PaginatedResponse, Job } from '@sk-job-pilot/shared';

export interface FetchJobsParams {
  page?: number;
  limit?: number;
  search?: string;
  workMode?: string;
  employmentType?: string;
  savedOnly?: boolean;
  archivedOnly?: boolean;
}

export async function fetchJobs(params: FetchJobsParams = {}): Promise<PaginatedResponse<Job>> {
  return apiFetch<Job[]>('/jobs', {
    params: params as Record<string, string | number | boolean | undefined>,
  }) as Promise<PaginatedResponse<Job>>;
}

export async function createJob(jobData: Partial<Job>): Promise<ApiResponse<Job>> {
  return apiFetch<Job>('/jobs', {
    method: 'POST',
    body: jobData,
  });
}

export async function toggleSaveJob(id: string): Promise<ApiResponse<Job>> {
  return apiFetch<Job>(`/jobs/${id}/save`, {
    method: 'PATCH',
  });
}

export async function toggleArchiveJob(id: string): Promise<ApiResponse<Job>> {
  return apiFetch<Job>(`/jobs/${id}/archive`, {
    method: 'PATCH',
  });
}

export async function deleteJob(id: string): Promise<ApiResponse<{ id: string }>> {
  return apiFetch<{ id: string }>(`/jobs/${id}`, {
    method: 'DELETE',
  });
}
