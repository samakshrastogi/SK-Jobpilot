export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: unknown;
    stack?: string;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}
export interface PaginatedMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginatedMeta;
}
export interface HealthCheckData {
  status: 'healthy' | 'unhealthy' | 'degraded';
  database: 'connected' | 'disconnected' | 'connecting';
  uptime: number;
  timestamp: string;
  environment: string;
}
export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid';
  salaryRange?: string;
  matchScore: number;
  skills: string[];
  postedDate: string;
  source: string;
  descriptionUrl?: string;
  isSaved?: boolean;
  status: 'discovered' | 'saved' | 'applying' | 'applied' | 'ignored';
}
export interface ApplicationItem {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: 'draft' | 'tailoring' | 'applied' | 'interviewing' | 'offered' | 'rejected';
  appliedDate?: string;
  matchScore: number;
  tailoredResumeId?: string;
  nextFollowUpDate?: string;
  notes?: string;
}
export interface ResumeItem {
  id: string;
  title: string;
  targetRole: string;
  version: string;
  lastUpdated: string;
  isMaster: boolean;
  matchCount: number;
}
export interface InterviewItem {
  id: string;
  applicationId: string;
  jobTitle: string;
  company: string;
  round: string;
  scheduledAt: string;
  type: 'Technical' | 'Behavioral' | 'HR Screen' | 'System Design' | 'Executive';
  status: 'scheduled' | 'completed' | 'cancelled';
  prepStatus: 'Not Started' | 'In Progress' | 'Ready';
}
export interface AgentActivityLog {
  id: string;
  timestamp: string;
  agentName: 'DiscoveryAgent' | 'MatchingAgent' | 'TailorAgent' | 'InterviewPrepAgent';
  action: string;
  status: 'info' | 'success' | 'warning' | 'error';
  details: string;
}
//# sourceMappingURL=index.d.ts.map
