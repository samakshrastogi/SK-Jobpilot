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
