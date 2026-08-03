import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJobAnalysisDocument extends Document {
  jobId: mongoose.Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const jobAnalysisSchema = new Schema<IJobAnalysisDocument>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, unique: true, index: true },
    normalizedTitle: { type: String, required: true },
    company: { type: String, required: true },
    seniority: { type: String, default: 'Mid-Senior' },
    roleFamily: { type: String, default: 'Engineering' },
    requiredExperienceYears: { type: Number, default: 0 },
    requiredSkills: [{ type: String }],
    preferredSkills: [{ type: String }],
    responsibilities: [{ type: String }],
    qualifications: [{ type: String }],
    educationRequirements: [{ type: String }],
    domainRequirements: [{ type: String }],
    location: { type: String, default: 'Remote' },
    workMode: { type: String, default: 'remote' },
    employmentType: { type: String, default: 'full_time' },
    visaSponsorship: { type: String, default: 'Not specified' },
    compensationText: { type: String, default: '' },
    importantKeywords: [{ type: String }],
    negativeRequirements: [{ type: String }],
    confidenceScore: { type: Number, default: 80 },
    extractionWarnings: [{ type: String }],
  },
  { timestamps: true }
);

export const JobAnalysisModel: Model<IJobAnalysisDocument> =
  mongoose.models.JobAnalysis ||
  mongoose.model<IJobAnalysisDocument>('JobAnalysis', jobAnalysisSchema);
