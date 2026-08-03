import { apiFetch } from './api-client';
import type {
  ApiResponse,
  PaginatedResponse,
  CandidateAnalysis,
  JobAnalysis,
  JobMatch,
  SkillGapAnalysis,
  TailoredResume,
  AIExecution,
  AIHealthStatus,
} from '@sk-job-pilot/shared';

export async function runCandidateAnalysis(force = false): Promise<ApiResponse<CandidateAnalysis>> {
  return apiFetch<CandidateAnalysis>('/ai/candidate/analyze', {
    method: 'POST',
    params: { force: String(force) },
  });
}

export async function fetchCandidateAnalysis(): Promise<ApiResponse<CandidateAnalysis>> {
  return apiFetch<CandidateAnalysis>('/ai/candidate/analysis');
}

export async function runJobAnalysis(
  jobId: string,
  force = false
): Promise<ApiResponse<JobAnalysis>> {
  return apiFetch<JobAnalysis>(`/jobs/${jobId}/analyze`, {
    method: 'POST',
    params: { force: String(force) },
  });
}

export async function fetchJobAnalysis(jobId: string): Promise<ApiResponse<JobAnalysis>> {
  return apiFetch<JobAnalysis>(`/jobs/${jobId}/analysis`);
}

export async function runJobMatch(jobId: string, force = false): Promise<ApiResponse<JobMatch>> {
  return apiFetch<JobMatch>(`/jobs/${jobId}/match`, {
    method: 'POST',
    params: { force: String(force) },
  });
}

export async function fetchJobMatch(jobId: string): Promise<ApiResponse<JobMatch>> {
  return apiFetch<JobMatch>(`/jobs/${jobId}/match`);
}

export async function runBatchJobMatch(jobIds: string[]): Promise<ApiResponse<JobMatch[]>> {
  return apiFetch<JobMatch[]>('/jobs/match/batch', {
    method: 'POST',
    body: { jobIds },
  });
}

export async function runSkillGapAnalysis(jobId: string): Promise<ApiResponse<SkillGapAnalysis>> {
  return apiFetch<SkillGapAnalysis>(`/jobs/${jobId}/gaps`, {
    method: 'POST',
  });
}

export async function generateTailoredResume(jobId: string): Promise<ApiResponse<TailoredResume>> {
  return apiFetch<TailoredResume>(`/jobs/${jobId}/resume-tailoring`, {
    method: 'POST',
  });
}

export async function fetchTailoredResumes(): Promise<ApiResponse<TailoredResume[]>> {
  return apiFetch<TailoredResume[]>('/tailored-resumes');
}

export async function fetchTailoredResumeById(id: string): Promise<ApiResponse<TailoredResume>> {
  return apiFetch<TailoredResume>(`/tailored-resumes/${id}`);
}

export async function approveTailoredResume(id: string): Promise<ApiResponse<TailoredResume>> {
  return apiFetch<TailoredResume>(`/tailored-resumes/${id}/approve`, {
    method: 'POST',
  });
}

export async function rejectTailoredResume(id: string): Promise<ApiResponse<TailoredResume>> {
  return apiFetch<TailoredResume>(`/tailored-resumes/${id}/reject`, {
    method: 'POST',
  });
}

export async function deleteTailoredResume(id: string): Promise<ApiResponse<{ id: string }>> {
  return apiFetch<{ id: string }>(`/tailored-resumes/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchAIHealth(): Promise<ApiResponse<AIHealthStatus>> {
  return apiFetch<AIHealthStatus>('/ai/health');
}

export async function fetchAIActivityLogs(
  page = 1,
  limit = 20
): Promise<PaginatedResponse<AIExecution>> {
  return apiFetch<AIExecution[]>('/ai/activity', {
    params: { page, limit },
  }) as Promise<PaginatedResponse<AIExecution>>;
}
