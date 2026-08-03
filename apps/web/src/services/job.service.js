import { apiFetch } from './api-client';
export async function fetchJobs(params = {}) {
  return apiFetch('/jobs', {
    params: params,
  });
}
export async function createJob(jobData) {
  return apiFetch('/jobs', {
    method: 'POST',
    body: jobData,
  });
}
export async function toggleSaveJob(id) {
  return apiFetch(`/jobs/${id}/save`, {
    method: 'PATCH',
  });
}
export async function toggleArchiveJob(id) {
  return apiFetch(`/jobs/${id}/archive`, {
    method: 'PATCH',
  });
}
export async function deleteJob(id) {
  return apiFetch(`/jobs/${id}`, {
    method: 'DELETE',
  });
}
//# sourceMappingURL=job.service.js.map
