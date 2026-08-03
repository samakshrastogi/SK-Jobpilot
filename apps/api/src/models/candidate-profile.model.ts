import mongoose, { Schema, Document, Model } from 'mongoose';

const personalInfoSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: '', trim: true },
    location: { type: String, default: '', trim: true },
    linkedinUrl: { type: String, default: '', trim: true },
    githubUrl: { type: String, default: '', trim: true },
    portfolioUrl: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const professionalInfoSchema = new Schema(
  {
    currentTitle: { type: String, default: '', trim: true },
    summary: { type: String, default: '', trim: true },
    totalExperienceMonths: { type: Number, default: 0 },
    preferredRoles: [{ type: String, trim: true }],
    preferredLocations: [{ type: String, trim: true }],
    remotePreference: {
      type: String,
      enum: ['remote_only', 'hybrid', 'onsite', 'open'],
      default: 'open',
    },
    employmentTypes: [{ type: String, trim: true }],
    expectedSalary: {
      amount: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
      period: { type: String, enum: ['yearly', 'monthly', 'hourly'], default: 'yearly' },
    },
    noticePeriodDays: { type: Number, default: 0 },
    willingToRelocate: { type: Boolean, default: false },
  },
  { _id: false }
);

const skillCategoriesSchema = new Schema(
  {
    languages: [{ type: String, trim: true }],
    backend: [{ type: String, trim: true }],
    frontend: [{ type: String, trim: true }],
    databases: [{ type: String, trim: true }],
    cloudDevOps: [{ type: String, trim: true }],
    aiAutomation: [{ type: String, trim: true }],
    tools: [{ type: String, trim: true }],
  },
  { _id: false }
);

const workExperienceSchema = new Schema(
  {
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    employmentType: { type: String, default: 'Full-time' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    isCurrent: { type: Boolean, default: false },
    location: { type: String, default: '' },
    description: { type: String, default: '' },
    achievements: [{ type: String }],
    technologies: [{ type: String }],
  },
  { id: true }
);

const educationSchema = new Schema(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, default: '' },
    field: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    score: { type: String, default: '' },
    location: { type: String, default: '' },
  },
  { id: true }
);

const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    isCurrent: { type: Boolean, default: false },
    technologies: [{ type: String }],
    repositoryUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    achievements: [{ type: String }],
  },
  { id: true }
);

const certificateSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, default: '' },
    issueDate: { type: String, default: '' },
    credentialUrl: { type: String, default: '' },
  },
  { id: true }
);

const jobPreferencesSchema = new Schema(
  {
    targetTitles: [{ type: String, trim: true }],
    includedKeywords: [{ type: String, trim: true }],
    excludedKeywords: [{ type: String, trim: true }],
    preferredIndustries: [{ type: String, trim: true }],
    preferredCompanies: [{ type: String, trim: true }],
    excludedCompanies: [{ type: String, trim: true }],
    minExperienceYears: { type: Number, default: 0 },
    maxExperienceYears: { type: Number, default: 30 },
    preferredWorkModes: [{ type: String, trim: true }],
    sponsorshipRequired: { type: Boolean, default: false },
    relocationCountries: [{ type: String, trim: true }],
  },
  { _id: false }
);

export interface ICandidateProfileDocument extends Document {
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
  };
  professionalInfo: {
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
  };
  skills: {
    languages?: string[];
    backend?: string[];
    frontend?: string[];
    databases?: string[];
    cloudDevOps?: string[];
    aiAutomation?: string[];
    tools?: string[];
  };
  experience: Array<Record<string, unknown>>;
  education: Array<Record<string, unknown>>;
  projects: Array<Record<string, unknown>>;
  certificates: Array<Record<string, unknown>>;
  jobPreferences: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const candidateProfileSchema = new Schema<ICandidateProfileDocument>(
  {
    personalInfo: { type: personalInfoSchema, required: true },
    professionalInfo: { type: professionalInfoSchema, default: () => ({}) },
    skills: { type: skillCategoriesSchema, default: () => ({}) },
    experience: { type: [workExperienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    certificates: { type: [certificateSchema], default: [] },
    jobPreferences: { type: jobPreferencesSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const CandidateProfileModel: Model<ICandidateProfileDocument> =
  mongoose.models.CandidateProfile ||
  mongoose.model<ICandidateProfileDocument>('CandidateProfile', candidateProfileSchema);
