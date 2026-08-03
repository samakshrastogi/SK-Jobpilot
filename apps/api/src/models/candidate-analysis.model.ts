import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICandidateAnalysisDocument extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const candidateAnalysisSchema = new Schema<ICandidateAnalysisDocument>(
  {
    fingerprint: { type: String, required: true, unique: true, index: true },
    primaryTitle: { type: String, required: true },
    seniorityEstimate: { type: String, required: true },
    totalRelevantExperienceYears: { type: Number, default: 0 },
    coreSkills: [{ type: String }],
    supportingSkills: [{ type: String }],
    toolsAndPlatforms: [{ type: String }],
    domainExperience: [{ type: String }],
    industryExperience: [{ type: String }],
    leadershipIndicators: [{ type: String }],
    backendStrengths: [{ type: String }],
    frontendStrengths: [{ type: String }],
    cloudDevOpsStrengths: [{ type: String }],
    aiAutomationStrengths: [{ type: String }],
    strongestAchievements: [{ type: String }],
    measurableEvidence: [{ type: String }],
    preferredRoles: [{ type: String }],
    roleSuitability: [{ type: String }],
    missingOrWeakInfo: [{ type: String }],
    parsingWarnings: [{ type: String }],
    evidenceReferences: [{ claim: { type: String }, source: { type: String } }],
  },
  { timestamps: true }
);

export const CandidateAnalysisModel: Model<ICandidateAnalysisDocument> =
  mongoose.models.CandidateAnalysis ||
  mongoose.model<ICandidateAnalysisDocument>('CandidateAnalysis', candidateAnalysisSchema);
