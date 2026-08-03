import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJobDocument extends Document {
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
  postedDate?: Date;
  expiryDate?: Date;
  dateDiscovered: Date;
  discoveryMethod: 'manual' | 'scraper' | 'api';
  processingStatus: 'discovered' | 'analyzed' | 'archived';
  matchScore: number;
  matchExplanation?: string;
  savedStatus: boolean;
  archivedStatus: boolean;
  freshnessStatus?: 'new' | 'active' | 'updated' | 'stale' | 'expired' | 'removed' | 'unknown';
  rawMetadata?: Schema.Types.Mixed;
  canonicalUrl?: string;
  fingerprint?: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJobDocument>(
  {
    externalSource: { type: String, default: 'manual', trim: true },
    externalSourceId: { type: String, default: '', trim: true },
    sourceUrl: { type: String, default: '', trim: true },
    applicationUrl: { type: String, default: '', trim: true },
    companyName: { type: String, required: true, trim: true, index: true },
    companyWebsite: { type: String, default: '', trim: true },
    jobTitle: { type: String, required: true, trim: true, index: true },
    location: { type: String, default: 'Remote', trim: true },
    workMode: {
      type: String,
      enum: ['remote', 'hybrid', 'onsite'],
      default: 'remote',
      index: true,
    },
    employmentType: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'freelance', 'internship'],
      default: 'full_time',
      index: true,
    },
    experienceMin: { type: Number, default: 0 },
    experienceMax: { type: Number, default: 10 },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    salaryCurrency: { type: String, default: 'USD' },
    description: { type: String, default: '' },
    responsibilities: [{ type: String }],
    requiredSkills: [{ type: String }],
    preferredSkills: [{ type: String }],
    qualifications: [{ type: String }],
    benefits: [{ type: String }],
    postedDate: { type: Date, default: Date.now, index: true },
    expiryDate: { type: Date },
    dateDiscovered: { type: Date, default: Date.now },
    discoveryMethod: { type: String, enum: ['manual', 'scraper', 'api'], default: 'manual' },
    processingStatus: {
      type: String,
      enum: ['discovered', 'analyzed', 'archived'],
      default: 'discovered',
    },
    matchScore: { type: Number, default: 0, index: true },
    matchExplanation: { type: String, default: '' },
    savedStatus: { type: Boolean, default: false, index: true },
    archivedStatus: { type: Boolean, default: false, index: true },
    freshnessStatus: {
      type: String,
      enum: ['new', 'active', 'updated', 'stale', 'expired', 'removed', 'unknown'],
      default: 'active',
      index: true,
    },
    rawMetadata: { type: Schema.Types.Mixed },
    canonicalUrl: { type: String, index: true },
    fingerprint: { type: String, index: true },
  },
  { timestamps: true }
);

jobSchema.index({ externalSource: 1, externalSourceId: 1 });
jobSchema.index({ jobTitle: 'text', companyName: 'text', description: 'text' });

export const JobModel: Model<IJobDocument> =
  mongoose.models.Job || mongoose.model<IJobDocument>('Job', jobSchema);
