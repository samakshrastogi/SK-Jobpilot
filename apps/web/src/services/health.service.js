import { apiFetch } from './api-client';
export async function fetchHealth() {
  return apiFetch('/health');
}
export async function fetchDatabaseHealth() {
  return apiFetch('/health/database');
}
//# sourceMappingURL=health.service.js.map
