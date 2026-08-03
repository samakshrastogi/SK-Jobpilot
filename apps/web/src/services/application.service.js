import { apiFetch } from './api-client';
export async function fetchApplications(params = {}) {
  return apiFetch('/applications', {
    params: params,
  });
}
export async function createApplication(data) {
  return apiFetch('/applications', {
    method: 'POST',
    body: data,
  });
}
export async function updateApplication(id, data) {
  return apiFetch(`/applications/${id}`, {
    method: 'PATCH',
    body: data,
  });
}
export async function deleteApplication(id) {
  return apiFetch(`/applications/${id}`, {
    method: 'DELETE',
  });
}
export async function addApplicationTimelineEvent(id, event) {
  return apiFetch(`/applications/${id}/events`, {
    method: 'POST',
    body: event,
  });
}
//# sourceMappingURL=application.service.js.map
