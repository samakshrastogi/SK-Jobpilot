import { apiFetch } from './api-client';
import type { ApiResponse, PaginatedResponse, Application } from '@sk-job-pilot/shared';

export interface FetchApplicationsParams {
  page?: number;
  limit?: number;
  status?: string;
  jobId?: string;
}

export async function fetchApplications(
  params: FetchApplicationsParams = {}
): Promise<PaginatedResponse<Application>> {
  return apiFetch<Application[]>('/applications', {
    params: params as Record<string, string | number | boolean | undefined>,
  }) as Promise<PaginatedResponse<Application>>;
}

export async function createApplication(data: {
  jobId: string;
  resumeId?: string;
  status?: string;
  allowDuplicate?: boolean;
}): Promise<ApiResponse<Application>> {
  return apiFetch<Application>('/applications', {
    method: 'POST',
    body: data,
  });
}

export async function updateApplication(
  id: string,
  data: Partial<Application>
): Promise<ApiResponse<Application>> {
  return apiFetch<Application>(`/applications/${id}`, {
    method: 'PATCH',
    body: data,
  });
}

export async function deleteApplication(id: string): Promise<ApiResponse<{ id: string }>> {
  return apiFetch<{ id: string }>(`/applications/${id}`, {
    method: 'DELETE',
  });
}

export async function addApplicationTimelineEvent(
  id: string,
  event: { status: string; title: string; description?: string; date?: string }
): Promise<ApiResponse<Application>> {
  return apiFetch<Application>(`/applications/${id}/events`, {
    method: 'POST',
    body: event,
  });
}
