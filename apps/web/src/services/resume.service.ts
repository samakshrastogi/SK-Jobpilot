import { apiFetch } from './api-client';
import type { ApiResponse, PaginatedResponse, Resume } from '@sk-job-pilot/shared';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api/v1';

export async function uploadResumeFile(file: File): Promise<ApiResponse<Resume>> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/resumes/upload`, {
    method: 'POST',
    body: formData,
  });

  const data: ApiResponse<Resume> = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to upload resume file');
  }
  return data;
}

export async function fetchResumes(page = 1, limit = 20): Promise<PaginatedResponse<Resume>> {
  return apiFetch<Resume[]>('/resumes', {
    params: { page, limit },
  }) as Promise<PaginatedResponse<Resume>>;
}

export async function deleteResume(id: string): Promise<ApiResponse<{ id: string }>> {
  return apiFetch<{ id: string }>(`/resumes/${id}`, {
    method: 'DELETE',
  });
}

export async function setMasterResume(id: string): Promise<ApiResponse<Resume>> {
  return apiFetch<Resume>(`/resumes/${id}/master`, {
    method: 'PATCH',
  });
}
