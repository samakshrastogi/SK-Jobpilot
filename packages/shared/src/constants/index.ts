export const APP_NAME = 'SK JobPilot';
export const APP_DESCRIPTION =
  'AI-powered Job Discovery, Matching, Application & Interview Platform';

export const API_ROUTES = {
  HEALTH: '/api/v1/health',
  HEALTH_DATABASE: '/api/v1/health/database',
  JOBS: '/api/v1/jobs',
  APPLICATIONS: '/api/v1/applications',
  RESUMES: '/api/v1/resumes',
  INTERVIEWS: '/api/v1/interviews',
  AGENT_LOGS: '/api/v1/agents/logs',
} as const;

export const APP_ROUTES = {
  DASHBOARD: '/',
  DISCOVER_JOBS: '/discover',
  SAVED_JOBS: '/saved-jobs',
  APPLICATIONS: '/applications',
  RESUMES: '/resumes',
  INTERVIEWS: '/interviews',
  AGENT_ACTIVITY: '/agent-activity',
  SETTINGS: '/settings',
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const SAMPLE_DATA_BADGE_TEXT = 'DEV SAMPLE DATA';
