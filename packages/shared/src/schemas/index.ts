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
  GEMINI_MODEL: z.string().default('gemini-3.6-flash'),
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
  expectedSalary: z
    .object({
      amount: z.number().min(0).optional().default(0),
      currency: z.string().optional().default('USD'),
      period: z.enum(['yearly', 'monthly', 'hourly']).optional().default('yearly'),
    })
    .optional()
    .default({ amount: 0, currency: 'USD', period: 'yearly' }),
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
  applicationUrl: z
    .string()
    .url('Invalid application URL')
    .or(z.string().length(0))
    .optional()
    .default(''),
  companyName: z.string().min(1, 'Company name is required'),
  companyWebsite: z.string().optional().default(''),
  jobTitle: z.string().min(1, 'Job title is required'),
  location: z.string().optional().default('Remote'),
  workMode: z.enum(['remote', 'hybrid', 'onsite']).optional().default('remote'),
  employmentType: z
    .enum(['full_time', 'part_time', 'contract', 'freelance', 'internship'])
    .optional()
    .default('full_time'),
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
  postedDate: z
    .string()
    .optional()
    .default(() => new Date().toISOString()),
  expiryDate: z.string().optional().default(''),
  savedStatus: z.boolean().optional().default(false),
  archivedStatus: z.boolean().optional().default(false),
});

export const updateJobSchema = createJobSchema.partial().extend({
  matchScore: z.number().min(0).max(100).optional(),
  matchExplanation: z.string().optional(),
  processingStatus: z.enum(['discovered', 'analyzed', 'archived']).optional(),
  savedStatus: z.boolean().optional(),
  archivedStatus: z.boolean().optional(),
});

export const jobFilterQuerySchema = paginationQuerySchema.extend({
  company: z.string().optional(),
  location: z.string().optional(),
  workMode: z.enum(['remote', 'hybrid', 'onsite']).optional(),
  employmentType: z
    .enum(['full_time', 'part_time', 'contract', 'freelance', 'internship'])
    .optional(),
  minMatchScore: z.coerce.number().optional(),
  savedOnly: z.coerce.boolean().optional(),
  archivedOnly: z.coerce.boolean().optional(),
});

// Application Schemas
export const createApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job reference is required'),
  resumeId: z.string().optional(),
  status: z
    .enum([
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
    ])
    .optional()
    .default('planned'),
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

export const createTimelineEventSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  title: z.string().min(1, 'Event title is required'),
  description: z.string().optional().default(''),
  date: z
    .string()
    .optional()
    .default(() => new Date().toISOString()),
});

export const applicationFilterQuerySchema = paginationQuerySchema.extend({
  status: z.string().optional(),
  jobId: z.string().optional(),
});
