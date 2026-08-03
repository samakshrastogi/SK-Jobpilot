import { apiFetch } from './api-client';
export async function fetchProfile() {
  return apiFetch('/profile');
}
export async function saveProfile(profileData) {
  return apiFetch('/profile', {
    method: 'PUT',
    body: profileData,
  });
}
export async function patchProfile(profileData) {
  return apiFetch('/profile', {
    method: 'PATCH',
    body: profileData,
  });
}
//# sourceMappingURL=profile.service.js.map
