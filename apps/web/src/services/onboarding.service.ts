import { apiFetch } from './api-client';
import type { ApiResponse } from '@sk-job-pilot/shared';

export interface OnboardingState {
  step: number;
  resumeUploaded: boolean;
  candidateProfileReviewed: boolean;
  rolesSelected: boolean;
  preferencesConfigured: boolean;
  answersConfigured: boolean;
  automationReviewed: boolean;
  automationEnabled: boolean;
}

export interface RoleRecommendation {
  id?: string;
  roleTitle: string;
  roleFamily: string;
  suitabilityScore: number;
  confidenceScore: number;
  seniorityLevel: string;
  evidence: string[];
  matchingSkills: string[];
  suggestedSearchTitles: string[];
  applicationRecommendation: 'highly_qualified' | 'qualified' | 'partially_qualified' | 'stretch_role' | 'not_recommended';
}

export interface ReviewQueueItem {
  id: string;
  reason: string;
  blockingQuestion: string;
  suggestedAnswer?: string;
  confidence: number;
  sensitiveFlag: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'resolved';
  jobId?: { id: string; jobTitle: string; companyName: string; applicationUrl?: string; sourceUrl?: string };
}
export interface AgentRunSummary {
  id?: string;
  status: 'running' | 'completed' | 'failed' | 'skipped';
  discovered: number;
  considered: number;
  matched: number;
  prepared: number;
  skipped: number;
  failed: number;
  summary: string;
  startedAt: string;
  completedAt?: string;
}

export interface AgentStatus {
  latestRun: AgentRunSummary | null;
  pendingReview: number;
  runningTasks: number;
  inProcess: boolean;
}
export interface AutomationConfiguration {
  enabled: boolean;
  mode: 'discovery_only' | 'prepare_and_review';
  frequency: 'hourly' | 'daily';
  minimumMatchScore: number;
  maxApplicationsPerHour: number;
  maxApplicationsPerDay: number;
  autoAnalyze?: boolean;
  autoMatch?: boolean;
  autoTailorResume?: boolean;
  autoGenerateCoverLetter?: boolean;
  autoSubmitSafeApplications?: false;
}

export function fetchOnboardingState(): Promise<ApiResponse<OnboardingState>> {
  return apiFetch<OnboardingState>('/onboarding/state');
}

export function updateOnboardingStep(step: number): Promise<ApiResponse<OnboardingState>> {
  return apiFetch<OnboardingState>('/onboarding/step', { method: 'POST', body: { step } });
}

export function generateRoleRecommendations(): Promise<ApiResponse<RoleRecommendation[]>> {
  return apiFetch<RoleRecommendation[]>('/onboarding/roles/recommend', { method: 'POST', timeoutMs: 60000 });
}

export function selectTargetRoles(roleTitles: string[]): Promise<ApiResponse<unknown[]>> {
  return apiFetch<unknown[]>('/onboarding/roles/select', { method: 'POST', body: { roleTitles } });
}

export function fetchAutomationConfiguration(): Promise<ApiResponse<AutomationConfiguration>> {
  return apiFetch<AutomationConfiguration>('/automation/config');
}

export function fetchReviewQueue(): Promise<ApiResponse<ReviewQueueItem[]>> {
  return apiFetch<ReviewQueueItem[]>('/review-queue');
}

export function updateAutomationConfiguration(config: AutomationConfiguration): Promise<ApiResponse<AutomationConfiguration>> {
  return apiFetch<AutomationConfiguration>('/automation/config', { method: 'PUT', body: config });
}

export function fetchAgentStatus(): Promise<ApiResponse<AgentStatus>> {
  return apiFetch<AgentStatus>('/agent/status');
}

export function runDiscoveryNow(): Promise<ApiResponse<AgentRunSummary>> {
  return apiFetch<AgentRunSummary>('/agent/run-now', { method: 'POST', timeoutMs: 180000 });
}
export function updateReviewQueueItem(id: string, status: 'approved' | 'rejected' | 'resolved', userCorrection = ''): Promise<ApiResponse<ReviewQueueItem>> {
  return apiFetch<ReviewQueueItem>(`/review-queue/${id}`, { method: 'PATCH', body: { status, userCorrection } });
}