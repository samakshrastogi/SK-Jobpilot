import { apiFetch } from './api-client';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
export async function uploadResumeFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${BASE_URL}/resumes/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to upload resume file');
  }
  return data;
}
export async function fetchResumes(page = 1, limit = 20) {
  return apiFetch('/resumes', {
    params: { page, limit },
  });
}
export async function deleteResume(id) {
  return apiFetch(`/resumes/${id}`, {
    method: 'DELETE',
  });
}
export async function setMasterResume(id) {
  return apiFetch(`/resumes/${id}/master`, {
    method: 'PATCH',
  });
}
//# sourceMappingURL=resume.service.js.map
