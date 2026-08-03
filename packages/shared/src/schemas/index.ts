import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  API_PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  APP_ORIGIN: z.string().url().default('http://localhost:5173'),
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/sk_job_pilot'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  VITE_API_BASE_URL: z.string().url().default('http://localhost:5000/api/v1'),
  GEMINI_API_KEY: z.string().optional().default(''),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  GEMINI_TEXT_MODEL: z.string().default('gemini-2.5-flash'),
  GEMINI_EMBEDDING_MODEL: z.string().default('gemini-embedding-2'),
  AI_PROVIDER: z.enum(['gemini', 'mock']).default('gemini'),
  AI_REQUEST_TIMEOUT_MS: z.coerce.number().default(30000),
  AI_MAX_RETRIES: z.coerce.number().default(3),
  AI_DEFAULT_TEMPERATURE: z.coerce.number().default(0.2),
  AI_DAILY_REQUEST_LIMIT: z.coerce.number().default(200),
  AI_DAILY_TOKEN_BUDGET: z.coerce.number().default(500000),
  ENABLE_EMBEDDINGS: z.coerce.boolean().default(true),
  ENABLE_AI_FEATURES: z.coerce.boolean().default(true),
  REDIS_URL: z.string().optional().default('redis://127.0.0.1:6379'),
  DISCOVERY_MAX_JOBS_PER_RUN: z.coerce.number().default(100),
  DISCOVERY_HTTP_TIMEOUT_MS: z.coerce.number().default(15000),
  RESUME_STORAGE_DIR: z.string().min(1).default('./uploads/resumes'),
  MAX_RESUME_FILE_SIZE_MB: z.coerce.number().positive().default(10),
});

export type EnvConfig = z.infer<typeof envSchema>;

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional(),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

// Candidate Profile Schemas
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().default(''),
  location: z.string().optional().default(''),
  linkedinUrl: z.string().optional().default(''),
  githubUrl: z.string().optional().default(''),
  portfolioUrl: z.string().optional().default(''),
});

export const professionalInfoSchema = z.object({
  currentTitle: z.string().optional().default(''),
  summary: z.string().optional().default(''),
  totalExperienceMonths: z.number().min(0).optional().default(0),
  preferredRoles: z.array(z.string()).optional().default([]),
  preferredLocations: z.array(z.string()).optional().default([]),
  remotePreference: z.enum(['remote_only', 'hybrid', 'onsite', 'open']).optional().default('open'),
  employmentTypes: z.array(z.string()).optional().default([]),
  expectedSalary: z.object({
    amount: z.number().min(0).optional().default(0),
    currency: z.string().optional().default('USD'),
    period: z.enum(['yearly', 'monthly', 'hourly']).optional().default('yearly'),
  }).optional().default({ amount: 0, currency: 'USD', period: 'yearly' }),
  noticePeriodDays: z.number().min(0).optional().default(0),
  willingToRelocate: z.boolean().optional().default(false),
});

export const skillCategoriesSchema = z.object({
  languages: z.array(z.string()).optional().default([]),
  backend: z.array(z.string()).optional().default([]),
  frontend: z.array(z.string()).optional().default([]),
  databases: z.array(z.string()).optional().default([]),
  cloudDevOps: z.array(z.string()).optional().default([]),
  aiAutomation: z.array(z.string()).optional().default([]),
  tools: z.array(z.string()).optional().default([]),
});

export const workExperienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  employmentType: z.string().optional().default('Full-time'),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  isCurrent: z.boolean().optional().default(false),
  location: z.string().optional().default(''),
  description: z.string().optional().default(''),
  achievements: z.array(z.string()).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
});

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().optional().default(''),
  field: z.string().optional().default(''),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  score: z.string().optional().default(''),
  location: z.string().optional().default(''),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional().default(''),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  isCurrent: z.boolean().optional().default(false),
  technologies: z.array(z.string()).optional().default([]),
  repositoryUrl: z.string().optional().default(''),
  liveUrl: z.string().optional().default(''),
  achievements: z.array(z.string()).optional().default([]),
});

export const certificateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Certificate name is required'),
  issuer: z.string().optional().default(''),
  issueDate: z.string().optional().default(''),
  credentialUrl: z.string().optional().default(''),
});

export const jobPreferencesSchema = z.object({
  targetTitles: z.array(z.string()).optional().default([]),
  includedKeywords: z.array(z.string()).optional().default([]),
  excludedKeywords: z.array(z.string()).optional().default([]),
  preferredIndustries: z.array(z.string()).optional().default([]),
  preferredCompanies: z.array(z.string()).optional().default([]),
  excludedCompanies: z.array(z.string()).optional().default([]),
  minExperienceYears: z.number().min(0).optional().default(0),
  maxExperienceYears: z.number().min(0).optional().default(30),
  preferredWorkModes: z.array(z.string()).optional().default([]),
  sponsorshipRequired: z.boolean().optional().default(false),
  relocationCountries: z.array(z.string()).optional().default([]),
});

export const candidateProfileSchema = z.object({
  personalInfo: personalInfoSchema,
  professionalInfo: professionalInfoSchema,
  skills: skillCategoriesSchema,
  experience: z.array(workExperienceSchema).optional().default([]),
  education: z.array(educationSchema).optional().default([]),
  projects: z.array(projectSchema).optional().default([]),
  certificates: z.array(certificateSchema).optional().default([]),
  jobPreferences: jobPreferencesSchema,
});

export type CandidateProfileDTO = z.infer<typeof candidateProfileSchema>;

// Job Schemas
export const createJobSchema = z.object({
  externalSource: z.string().optional().default('manual'),
  externalSourceId: z.string().optional().default(''),
  sourceUrl: z.string().url('Invalid source URL').or(z.string().length(0)).optional().default(''),
  applicationUrl: z.string().url('Invalid application URL').or(z.string().length(0)).optional().default(''),
  companyName: z.string().min(1, 'Company name is required'),
  companyWebsite: z.string().optional().default(''),
  jobTitle: z.string().min(1, 'Job title is required'),
  location: z.string().optional().default('Remote'),
  workMode: z.enum(['remote', 'hybrid', 'onsite']).optional().default('remote'),
  employmentType: z.enum(['full_time', 'part_time', 'contract', 'freelance', 'internship']).optional().default('full_time'),
  experienceMin: z.number().min(0).optional().default(0),
  experienceMax: z.number().min(0).optional().default(10),
  salaryMin: z.number().min(0).optional().default(0),
  salaryMax: z.number().min(0).optional().default(0),
  salaryCurrency: z.string().optional().default('USD'),
  description: z.string().min(1, 'Job description is required'),
  responsibilities: z.array(z.string()).optional().default([]),
  requiredSkills: z.array(z.string()).optional().default([]),
  preferredSkills: z.array(z.string()).optional().default([]),
  qualifications: z.array(z.string()).optional().default([]),
  benefits: z.array(z.string()).optional().default([]),
  postedDate: z.string().optional().default(() => new Date().toISOString()),
  expiryDate: z.string().optional().default(''),
  savedStatus: z.boolean().optional().default(false),
  archivedStatus: z.boolean().optional().default(false),
  freshnessStatus: z.enum(['new', 'active', 'updated', 'stale', 'expired', 'removed', 'unknown']).optional().default('active'),
});

export const updateJobSchema = createJobSchema.partial().extend({
  matchScore: z.number().min(0).max(100).optional(),
  matchExplanation: z.string().optional(),
  processingStatus: z.enum(['discovered', 'analyzed', 'archived']).optional(),
  savedStatus: z.boolean().optional(),
  archivedStatus: z.boolean().optional(),
  freshnessStatus: z.enum(['new', 'active', 'updated', 'stale', 'expired', 'removed', 'unknown']).optional(),
});

export const jobFilterQuerySchema = paginationQuerySchema.extend({
  company: z.string().optional(),
  location: z.string().optional(),
  workMode: z.enum(['remote', 'hybrid', 'onsite']).optional(),
  employmentType: z.enum(['full_time', 'part_time', 'contract', 'freelance', 'internship']).optional(),
  minMatchScore: z.coerce.number().optional(),
  savedOnly: z.coerce.boolean().optional(),
  archivedOnly: z.coerce.boolean().optional(),
  freshnessStatus: z.string().optional(),
});

// Application Schemas
export const createApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job reference is required'),
  resumeId: z.string().optional(),
  status: z.enum([
    'planned',
    'preparing',
    'ready_for_review',
    'submitted',
    'acknowledged',
    'recruiter_contacted',
    'assessment',
    'interview',
    'offer',
    'rejected',
    'withdrawn',
    'archived',
  ]).optional().default('planned'),
  applicationMethod: z.string().optional().default('Direct Site'),
  applicationUrl: z.string().optional().default(''),
  appliedDate: z.string().optional(),
  nextFollowUpDate: z.string().optional(),
  contactPerson: z.string().optional().default(''),
  contactEmail: z.string().optional().default(''),
  referralInfo: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  salaryEntered: z.number().optional(),
  coverLetter: z.string().optional().default(''),
  allowDuplicate: z.boolean().optional().default(false),
});

export const updateApplicationSchema = createApplicationSchema.partial().extend({
  rejectionReason: z.string().optional(),
  offerDetails: z.string().optional(),
});

export const applicationFilterQuerySchema = paginationQuerySchema.extend({
  status: z.string().optional(),
  jobId: z.string().optional(),
});

export const createTimelineEventSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  title: z.string().min(1, 'Event title is required'),
  description: z.string().optional().default(''),
  date: z.string().optional().default(() => new Date().toISOString()),
});

// Phase 3 & 4 AI & Discovery Schemas
export const candidateAnalysisSchema = z.object({
  primaryTitle: z.string(),
  seniorityEstimate: z.string(),
  totalRelevantExperienceYears: z.number(),
  coreSkills: z.array(z.string()),
  supportingSkills: z.array(z.string()),
  toolsAndPlatforms: z.array(z.string()),
  domainExperience: z.array(z.string()),
  industryExperience: z.array(z.string()),
  leadershipIndicators: z.array(z.string()),
  backendStrengths: z.array(z.string()),
  frontendStrengths: z.array(z.string()),
  cloudDevOpsStrengths: z.array(z.string()),
  aiAutomationStrengths: z.array(z.string()),
  strongestAchievements: z.array(z.string()),
  measurableEvidence: z.array(z.string()),
  preferredRoles: z.array(z.string()),
  roleSuitability: z.array(z.string()),
  missingOrWeakInfo: z.array(z.string()),
  parsingWarnings: z.array(z.string()),
  evidenceReferences: z.array(z.object({ claim: z.string(), source: z.string() })).optional().default([]),
});

export const jobAnalysisSchema = z.object({
  normalizedTitle: z.string(),
  company: z.string(),
  seniority: z.string(),
  roleFamily: z.string(),
  requiredExperienceYears: z.number(),
  requiredSkills: z.array(z.string()),
  preferredSkills: z.array(z.string()),
  responsibilities: z.array(z.string()),
  qualifications: z.array(z.string()),
  educationRequirements: z.array(z.string()),
  domainRequirements: z.array(z.string()),
  location: z.string(),
  workMode: z.string(),
  employmentType: z.string(),
  visaSponsorship: z.string(),
  compensationText: z.string(),
  importantKeywords: z.array(z.string()),
  negativeRequirements: z.array(z.string()),
  confidenceScore: z.number(),
  extractionWarnings: z.array(z.string()),
});

export const matchCategoryScoreSchema = z.object({
  score: z.number().min(0).max(100),
  weight: z.number(),
  weightedScore: z.number(),
  notes: z.string(),
});

export const jobMatchSchema = z.object({
  overallScore: z.number().min(0).max(100),
  recommendation: z.enum([
    'excellent_match',
    'strong_match',
    'possible_match',
    'weak_match',
    'not_recommended',
    'manual_review_required',
  ]),
  categories: z.object({
    requiredSkills: matchCategoryScoreSchema,
    experience: matchCategoryScoreSchema,
    roleTitleAlignment: matchCategoryScoreSchema,
    preferredSkills: matchCategoryScoreSchema,
    domainAlignment: matchCategoryScoreSchema,
    projectEvidence: matchCategoryScoreSchema,
    educationAlignment: matchCategoryScoreSchema,
    locationWorkPref: matchCategoryScoreSchema,
  }),
  matchedRequiredSkills: z.array(z.string()),
  missingRequiredSkills: z.array(z.string()),
  matchedPreferredSkills: z.array(z.string()),
  missingPreferredSkills: z.array(z.string()),
  transferableSkills: z.array(z.string()),
  strongSupportingExperience: z.array(z.string()),
  weakEvidenceAreas: z.array(z.string()),
  potentialDisqualifiers: z.array(z.string()),
  explanation: z.string(),
  evidenceReferences: z.array(z.object({ claim: z.string(), source: z.string() })).optional().default([]),
});

export const skillGapAnalysisSchema = z.object({
  criticalMissingRequirements: z.array(z.string()),
  importantMissingSkills: z.array(z.string()),
  optionalMissingSkills: z.array(z.string()),
  weaklyEvidencedSkills: z.array(z.string()),
  transferableSkills: z.array(z.string()),
  resumeVisibilityGaps: z.array(z.string()),
  genuineExperienceGaps: z.array(z.string()),
  recommendedResumeImprovements: z.array(z.string()),
  recommendedPortfolioImprovements: z.array(z.string()),
  recommendedInterviewPrepTopics: z.array(z.string()),
});

export const tailoredResumeChangeSchema = z.object({
  id: z.string(),
  section: z.string(),
  transformationType: z.enum(['unchanged', 'reordered', 'shortened', 'clarified', 'keyword_aligned', 'impact_emphasized']),
  originalText: z.string(),
  proposedText: z.string(),
  reason: z.string(),
  targetedKeywords: z.array(z.string()),
  truthfulnessConfidence: z.number().min(0).max(100),
  sourceReference: z.string(),
  approvalStatus: z.enum(['pending', 'approved', 'rejected']).default('pending'),
});

export const tailoredResumeSchema = z.object({
  name: z.string(),
  jobId: z.string(),
  proposedSummary: z.string(),
  proposedSkills: z.array(z.string()),
  proposedExperienceBullets: z.array(tailoredResumeChangeSchema),
  coverLetterOutline: z.string().optional().default(''),
  estimatedScoreBefore: z.number().min(0).max(100),
  estimatedScoreAfter: z.number().min(0).max(100),
  approvalStatus: z.enum(['draft', 'generated', 'under_review', 'approved', 'rejected', 'archived']).default('generated'),
});

export const batchMatchRequestSchema = z.object({
  jobIds: z.array(z.string()).min(1).max(20),
});

// Phase 4 Discovery Schemas
export const createDiscoverySourceSchema = z.object({
  name: z.string().min(1, 'Source name is required'),
  providerType: z.enum(['greenhouse', 'lever', 'ashby', 'workable', 'jobicy', 'remotive', 'generic_html', 'generic_browser', 'rss', 'manual', 'import']),
  companyName: z.string().min(1, 'Company name is required'),
  baseUrl: z.string().optional().default(''),
  careersUrl: z.string().min(1, 'Careers URL or Board ID is required'),
  boardId: z.string().optional().default(''),
  includedKeywords: z.array(z.string()).optional().default([]),
  excludedKeywords: z.array(z.string()).optional().default([]),
  enabled: z.boolean().optional().default(true),
  scheduleEnabled: z.boolean().optional().default(true),
  scheduleExpression: z.string().optional().default('0 */6 * * *'),
});

export const updateDiscoverySourceSchema = createDiscoverySourceSchema.partial();

export const browserCapturedJobSchema = z.object({
  platform: z.enum(['linkedin', 'indeed', 'wellfound', 'naukri', 'instahyre', 'company_ats', 'other']),
  sourceJobId: z.string().trim().max(200).optional().default(''),
  title: z.string().trim().min(2, 'Job title is required').max(300),
  company: z.string().trim().min(1, 'Company name is required').max(300),
  location: z.string().trim().max(300).optional().default(''),
  description: z.string().trim().max(200000).optional().default(''),
  sourceUrl: z.string().url('A valid job URL is required'),
  applyUrl: z.string().url().optional(),
  workMode: z.enum(['remote', 'hybrid', 'onsite']).optional().default('onsite'),
  employmentType: z.enum(['full_time', 'part_time', 'contract', 'freelance', 'internship']).optional().default('full_time'),
  postedDate: z.string().datetime().optional(),
  captureMethod: z.enum(['structured_data', 'manual']).default('manual'),
});

export const browserCaptureBatchSchema = z.object({
  jobs: z.array(browserCapturedJobSchema).min(1).max(50),
});

// Phase 4 Interview Preparation & Mock Schemas
export const createInterviewPrepSchema = z.object({
  jobId: z.string().min(1, 'Job reference is required'),
  interviewType: z.enum(['recruiter_screen', 'behavioural', 'technical', 'coding', 'system_design', 'project_deep_dive', 'managerial', 'mixed']).optional().default('behavioural'),
  difficulty: z.enum(['junior', 'mid', 'senior', 'lead', 'executive']).optional().default('senior'),
});

export const submitMockAnswerSchema = z.object({
  questionId: z.string().min(1, 'Question ID is required'),
  candidateAnswer: z.string().min(1, 'Answer is required'),
});

// Phase 4 Saved Answer & Reminder Schemas
export const createSavedAnswerSchema = z.object({
  canonicalKey: z.string().min(1, 'Canonical key is required'),
  category: z.string().optional().default('general'),
  answerText: z.string().min(1, 'Answer text is required'),
  requiresConfirmation: z.boolean().optional().default(false),
});

export const createFollowUpReminderSchema = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  reminderType: z.enum(['application_follow_up', 'recruiter_reply', 'assessment_deadline', 'interview_preparation', 'interview_follow_up', 'offer_decision', 'manual']),
  title: z.string().min(1, 'Title is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  notes: z.string().optional().default(''),
});

// Phase 5 System Readiness & Cover Letter Schemas
export const createCoverLetterSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  variant: z.enum(['concise', 'standard', 'detailed']).optional().default('standard'),
});

export const exportResumeRequestSchema = z.object({
  tailoredResumeId: z.string().min(1, 'Tailored Resume ID is required'),
  format: z.enum(['pdf', 'docx', 'txt', 'html']).optional().default('pdf'),
  template: z.enum(['ats_classic', 'modern_minimal', 'tech_lead']).optional().default('ats_classic'),
});

// Task 2 Onboarding & Hourly Automation Schemas
export const onboardingStateSchema = z.object({
  step: z.number().int().min(1).max(6).default(1),
  resumeUploaded: z.boolean().default(false),
  candidateProfileReviewed: z.boolean().default(false),
  rolesSelected: z.boolean().default(false),
  preferencesConfigured: z.boolean().default(false),
  answersConfigured: z.boolean().default(false),
  automationReviewed: z.boolean().default(false),
  automationEnabled: z.boolean().default(false),
});

export const updateOnboardingStepSchema = z.object({
  step: z.number().int().min(1).max(6),
});

export const selectTargetRolesSchema = z.object({
  roleTitles: z.array(z.string().trim().min(2)).min(1, 'At least one target role must be selected').max(10).transform((titles) => Array.from(new Set(titles))),
});

export const automationConfigSchema = z.object({
  enabled: z.boolean().default(true),
  mode: z.enum(['discovery_only', 'prepare_and_review', 'safe_auto_apply']).default('prepare_and_review'),
  frequency: z.enum(['hourly', 'daily']).default('hourly'),
  minimumMatchScore: z.number().min(0).max(100).default(75),
  maxApplicationsPerHour: z.number().min(1).max(20).default(5),
  maxApplicationsPerDay: z.number().min(1).max(50).default(20),
});
