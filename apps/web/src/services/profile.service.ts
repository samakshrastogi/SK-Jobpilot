import { apiFetch } from './api-client';
import type { ApiResponse, CandidateProfile } from '@sk-job-pilot/shared';

export async function fetchProfile(): Promise<ApiResponse<CandidateProfile>> {
  return apiFetch<CandidateProfile>('/profile');
}

export async function saveProfile(
  profileData: Partial<CandidateProfile>
): Promise<ApiResponse<CandidateProfile>> {
  return apiFetch<CandidateProfile>('/profile', {
    method: 'PUT',
    body: profileData,
  });
}

export async function patchProfile(
  profileData: Partial<CandidateProfile>
): Promise<ApiResponse<CandidateProfile>> {
  return apiFetch<CandidateProfile>('/profile', {
    method: 'PATCH',
    body: profileData,
  });
}
