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

// Candidate Profile Types
export interface PersonalInformation {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export interface ProfessionalInformation {
  currentTitle?: string;
  summary?: string;
  totalExperienceMonths?: number;
  preferredRoles?: string[];
  preferredLocations?: string[];
  remotePreference?: 'remote_only' | 'hybrid' | 'onsite' | 'open';
  employmentTypes?: string[];
  expectedSalary?: {
    amount?: number;
    currency?: string;
    period?: 'yearly' | 'monthly' | 'hourly';
  };
  noticePeriodDays?: number;
  willingToRelocate?: boolean;
}

export interface SkillCategories {
  languages?: string[];
  backend?: string[];
  frontend?: string[];
  databases?: string[];
  cloudDevOps?: string[];
  aiAutomation?: string[];
  tools?: string[];
}

export interface WorkExperience {
  id?: string;
  company: string;
  position: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  location?: string;
  description?: string;
  achievements?: string[];
  technologies?: string[];
}

export interface Education {
  id?: string;
  institution: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  score?: string;
  location?: string;
}

export interface Project {
  id?: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  technologies?: string[];
  repositoryUrl?: string;
  liveUrl?: string;
  achievements?: string[];
}

export interface Certificate {
  id?: string;
  name: string;
  issuer?: string;
  issueDate?: string;
  credentialUrl?: string;
}

export interface JobPreferences {
  targetTitles?: string[];
  includedKeywords?: string[];
  excludedKeywords?: string[];
  preferredIndustries?: string[];
  preferredCompanies?: string[];
  excludedCompanies?: string[];
  minExperienceYears?: number;
  maxExperienceYears?: number;
  preferredWorkModes?: string[];
  sponsorshipRequired?: boolean;
  relocationCountries?: string[];
}

export interface CandidateProfile {
  id?: string;
  personalInfo: PersonalInformation;
  professionalInfo: ProfessionalInformation;
  skills: SkillCategories;
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  certificates: Certificate[];
  jobPreferences: JobPreferences;
  createdAt?: string;
  updatedAt?: string;
}

// Resume Types
export interface ParsedResumeContent {
  summary?: string;
  skills?: string[];
  experience?: Array<{
    company?: string;
    title?: string;
    dates?: string;
    bullets?: string[];
  }>;
  education?: Array<{
    institution?: string;
    degree?: string;
    year?: string;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
  }>;
  certifications?: string[];
  contactInfo?: {
    email?: string;
    phone?: string;
    urls?: string[];
  };
}

export interface Resume {
  id: string;
  name: string;
  originalFileName: string;
  storagePath: string;
  mimeType: string;
  fileSize: number;
  checksum: string;
  sourceType: 'upload' | 'generated' | 'imported';
  rawText: string;
  parsedContent: ParsedResumeContent;
  parsingStatus: 'pending' | 'parsed' | 'requires_ocr' | 'error';
  parsingError?: string;
  parsingConfidence?: number;
  warnings?: string[];
  isMaster: boolean;
  version: string;
  createdAt: string;
  updatedAt: string;
}

// Job Types
export interface Job {
  id: string;
  externalSource: string;
  externalSourceId?: string;
  sourceUrl?: string;
  applicationUrl?: string;
  companyName: string;
  companyWebsite?: string;
  jobTitle: string;
  location: string;
  workMode: 'remote' | 'hybrid' | 'onsite';
  employmentType: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
  experienceMin: number;
  experienceMax: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  description: string;
  responsibilities?: string[];
  requiredSkills?: string[];
  preferredSkills?: string[];
  qualifications?: string[];
  benefits?: string[];
  postedDate?: string;
  expiryDate?: string;
  dateDiscovered: string;
  discoveryMethod: 'manual' | 'scraper' | 'api';
  processingStatus: 'discovered' | 'analyzed' | 'archived';
  matchScore: number;
  matchExplanation?: string;
  savedStatus: boolean;
  archivedStatus: boolean;
  freshnessStatus?: 'new' | 'active' | 'updated' | 'stale' | 'expired' | 'removed' | 'unknown';
  canonicalUrl?: string;
  fingerprint?: string;
  createdAt: string;
  updatedAt: string;
}

// Application Types
export type ApplicationStatus =
  | 'planned'
  | 'preparing'
  | 'ready_for_review'
  | 'submitted'
  | 'acknowledged'
  | 'recruiter_contacted'
  | 'assessment'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'
  | 'archived';

export interface ApplicationTimelineEvent {
  id: string;
  date: string;
  status: string;
  title: string;
  description?: string;
}

export interface Application {
  id: string;
  jobId: string;
  job?: Job;
  resumeId?: string;
  resume?: Resume;
  status: ApplicationStatus;
  applicationMethod?: string;
  applicationUrl?: string;
  appliedDate?: string;
  lastActivityDate: string;
  nextFollowUpDate?: string;
  contactPerson?: string;
  contactEmail?: string;
  referralInfo?: string;
  notes?: string;
  salaryEntered?: number;
  coverLetter?: string;
  screeningQuestions?: Array<{ question: string; answer: string }>;
  timelineEvents: ApplicationTimelineEvent[];
  rejectionReason?: string;
  offerDetails?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentActivityLog {
  id: string;
  timestamp: string;
  agentName: 'DiscoveryAgent' | 'MatchingAgent' | 'TailorAgent' | 'InterviewPrepAgent';
  action: string;
  status: 'info' | 'success' | 'warning' | 'error';
  details: string;
}

// Phase 3 AI Intelligence Types
export interface CandidateAnalysis {
  id?: string;
  fingerprint: string;
  primaryTitle: string;
  seniorityEstimate: string;
  totalRelevantExperienceYears: number;
  coreSkills: string[];
  supportingSkills: string[];
  toolsAndPlatforms: string[];
  domainExperience: string[];
  industryExperience: string[];
  leadershipIndicators: string[];
  backendStrengths: string[];
  frontendStrengths: string[];
  cloudDevOpsStrengths: string[];
  aiAutomationStrengths: string[];
  strongestAchievements: string[];
  measurableEvidence: string[];
  preferredRoles: string[];
  roleSuitability: string[];
  missingOrWeakInfo: string[];
  parsingWarnings: string[];
  evidenceReferences?: Array<{ claim: string; source: string }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobAnalysis {
  id?: string;
  jobId: string;
  normalizedTitle: string;
  company: string;
  seniority: string;
  roleFamily: string;
  requiredExperienceYears: number;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  educationRequirements: string[];
  domainRequirements: string[];
  location: string;
  workMode: string;
  employmentType: string;
  visaSponsorship: string;
  compensationText: string;
  importantKeywords: string[];
  negativeRequirements: string[];
  confidenceScore: number;
  extractionWarnings: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MatchCategoryScore {
  score: number;
  weight: number;
  weightedScore: number;
  notes: string;
}

export interface JobMatch {
  id?: string;
  jobId: string;
  candidateFingerprint: string;
  overallScore: number;
  recommendation:
    | 'excellent_match'
    | 'strong_match'
    | 'possible_match'
    | 'weak_match'
    | 'not_recommended'
    | 'manual_review_required';
  categories: {
    requiredSkills: MatchCategoryScore;
    experience: MatchCategoryScore;
    roleTitleAlignment: MatchCategoryScore;
    preferredSkills: MatchCategoryScore;
    domainAlignment: MatchCategoryScore;
    projectEvidence: MatchCategoryScore;
    educationAlignment: MatchCategoryScore;
    locationWorkPref: MatchCategoryScore;
  };
  matchedRequiredSkills: string[];
  missingRequiredSkills: string[];
  matchedPreferredSkills: string[];
  missingPreferredSkills: string[];
  transferableSkills: string[];
  strongSupportingExperience: string[];
  weakEvidenceAreas: string[];
  potentialDisqualifiers: string[];
  explanation: string;
  evidenceReferences?: Array<{ claim: string; source: string }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillGapAnalysis {
  id?: string;
  jobId: string;
  criticalMissingRequirements: string[];
  importantMissingSkills: string[];
  optionalMissingSkills: string[];
  weaklyEvidencedSkills: string[];
  transferableSkills: string[];
  resumeVisibilityGaps: string[];
  genuineExperienceGaps: string[];
  recommendedResumeImprovements: string[];
  recommendedPortfolioImprovements: string[];
  recommendedInterviewPrepTopics: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TailoredResumeChange {
  id: string;
  section: string;
  transformationType: 'unchanged' | 'reordered' | 'shortened' | 'clarified' | 'keyword_aligned' | 'impact_emphasized';
  originalText: string;
  proposedText: string;
  reason: string;
  targetedKeywords: string[];
  truthfulnessConfidence: number;
  sourceReference: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

export interface TailoredResume {
  id: string;
  name: string;
  sourceResumeId?: string;
  jobId: string;
  job?: Job;
  candidateFingerprint: string;
  jobFingerprint: string;
  promptVersion: string;
  provider: string;
  model: string;
  proposedSummary: string;
  proposedSkills: string[];
  proposedExperienceBullets: TailoredResumeChange[];
  coverLetterOutline?: string;
  estimatedScoreBefore: number;
  estimatedScoreAfter: number;
  approvalStatus: 'draft' | 'generated' | 'under_review' | 'approved' | 'rejected' | 'archived';
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIExecution {
  id: string;
  operationType:
    | 'candidate_analysis'
    | 'resume_analysis'
    | 'job_extraction'
    | 'job_match'
    | 'skill_gap_analysis'
    | 'resume_tailoring'
    | 'interview_question_generation';
  provider: string;
  model: string;
  entityType?: string;
  entityId?: string;
  status: 'started' | 'completed' | 'failed' | 'cached';
  durationMs: number;
  promptVersion: string;
  retryCount: number;
  inputTokenUsage: number;
  outputTokenUsage: number;
  totalTokenUsage: number;
  estimatedCostUsd: number;
  errorCategory?: string;
  safeErrorMessage?: string;
  resultSummary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIHealthStatus {
  status: 'healthy' | 'degraded' | 'unavailable';
  configuredProvider: string;
  textModel: string;
  embeddingModel: string;
  hasApiKey: boolean;
  dailyRequestsUsed: number;
  dailyRequestLimit: number;
  dailyTokensUsed: number;
  dailyTokenBudget: number;
  circuitState: 'closed' | 'open' | 'half_open';
  lastSuccessfulRequestAt?: string;
  lastFailedRequestAt?: string;
}

// Phase 4 Discovery Types
export interface DiscoverySource {
  id: string;
  name: string;
  providerType: 'greenhouse' | 'lever' | 'ashby' | 'workable' | 'generic_html' | 'generic_browser' | 'rss' | 'manual' | 'import';
  companyName: string;
  baseUrl?: string;
  careersUrl: string;
  boardId?: string;
  includedKeywords?: string[];
  excludedKeywords?: string[];
  enabled: boolean;
  scheduleEnabled: boolean;
  scheduleExpression?: string;
  lastRunAt?: string;
  lastRunStatus?: 'success' | 'failure' | 'none';
  createdAt: string;
  updatedAt: string;
}

export interface DiscoveryRun {
  id: string;
  sourceId: string;
  providerType: string;
  trigger: 'manual' | 'scheduled' | 'import';
  status: 'queued' | 'running' | 'completed' | 'failed';
  jobsDiscovered: number;
  jobsInserted: number;
  duplicatesFound: number;
  errorMessage?: string;
  durationMs: number;
  createdAt: string;
  updatedAt: string;
}

// Phase 4 Interview Preparation & Mock Types
export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  whyAsked: string;
  skillsAssessed: string[];
  suggestedFramework: string;
  keyPointsToCover: string[];
  commonMistakes: string[];
}

export interface InterviewPreparation {
  id: string;
  jobId: string;
  job?: Job;
  interviewType: string;
  difficulty: string;
  sevenDayStudyPlan: Array<{ day: number; focus: string; tasks: string[] }>;
  questions: InterviewQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface MockAnswerFeedback {
  questionId: string;
  question: string;
  candidateAnswer: string;
  score: number;
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
  starAnalysis?: { situation: string; task: string; action: string; result: string };
}

export interface MockInterviewSession {
  id: string;
  preparationId: string;
  jobId: string;
  interviewType: string;
  status: 'in_progress' | 'completed';
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  answers: MockAnswerFeedback[];
  overallScore?: number;
  finalSummary?: string;
  createdAt: string;
  updatedAt: string;
}

// Phase 4 Saved Answer & Reminder Types
export interface SavedAnswer {
  id: string;
  canonicalKey: string;
  category: string;
  answerText: string;
  requiresConfirmation: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUpReminder {
  id: string;
  applicationId: string;
  application?: Application;
  reminderType: 'application_follow_up' | 'recruiter_reply' | 'assessment_deadline' | 'interview_preparation' | 'interview_follow_up' | 'offer_decision' | 'manual';
  title: string;
  dueDate: string;
  notes?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Phase 5 Readiness & Cover Letter Types
export interface SystemReadiness {
  status: 'healthy' | 'degraded' | 'unhealthy';
  nodeVersion: string;
  database: 'connected' | 'disconnected';
  redis: 'connected' | 'fallback_in_memory';
  aiProvider: 'ready' | 'missing_key';
  storageDirWritable: boolean;
  configuredTextModel: string;
  configuredEmbeddingModel: string;
  timestamp: string;
}

export interface CoverLetter {
  id: string;
  jobId: string;
  job?: Job;
  variant: 'concise' | 'standard' | 'detailed';
  content: string;
  approvalStatus: 'draft' | 'generated' | 'under_review' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
