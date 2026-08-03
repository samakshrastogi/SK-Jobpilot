import mongoose, { Schema, Document, Model } from 'mongoose';

const categoryScoreSchema = new Schema(
  {
    score: { type: Number, required: true },
    weight: { type: Number, required: true },
    weightedScore: { type: Number, required: true },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

export interface IJobMatchDocument extends Document {
  jobId: mongoose.Types.ObjectId;
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
    requiredSkills: { score: number; weight: number; weightedScore: number; notes: string };
    experience: { score: number; weight: number; weightedScore: number; notes: string };
    roleTitleAlignment: { score: number; weight: number; weightedScore: number; notes: string };
    preferredSkills: { score: number; weight: number; weightedScore: number; notes: string };
    domainAlignment: { score: number; weight: number; weightedScore: number; notes: string };
    projectEvidence: { score: number; weight: number; weightedScore: number; notes: string };
    educationAlignment: { score: number; weight: number; weightedScore: number; notes: string };
    locationWorkPref: { score: number; weight: number; weightedScore: number; notes: string };
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
  createdAt: Date;
  updatedAt: Date;
}

const jobMatchSchema = new Schema<IJobMatchDocument>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    candidateFingerprint: { type: String, required: true, index: true },
    overallScore: { type: Number, required: true, index: true },
    recommendation: {
      type: String,
      enum: [
        'excellent_match',
        'strong_match',
        'possible_match',
        'weak_match',
        'not_recommended',
        'manual_review_required',
      ],
      default: 'possible_match',
    },
    categories: {
      requiredSkills: { type: categoryScoreSchema, required: true },
      experience: { type: categoryScoreSchema, required: true },
      roleTitleAlignment: { type: categoryScoreSchema, required: true },
      preferredSkills: { type: categoryScoreSchema, required: true },
      domainAlignment: { type: categoryScoreSchema, required: true },
      projectEvidence: { type: categoryScoreSchema, required: true },
      educationAlignment: { type: categoryScoreSchema, required: true },
      locationWorkPref: { type: categoryScoreSchema, required: true },
    },
    matchedRequiredSkills: [{ type: String }],
    missingRequiredSkills: [{ type: String }],
    matchedPreferredSkills: [{ type: String }],
    missingPreferredSkills: [{ type: String }],
    transferableSkills: [{ type: String }],
    strongSupportingExperience: [{ type: String }],
    weakEvidenceAreas: [{ type: String }],
    potentialDisqualifiers: [{ type: String }],
    explanation: { type: String, required: true },
    evidenceReferences: [{ claim: { type: String }, source: { type: String } }],
  },
  { timestamps: true }
);

jobMatchSchema.index({ jobId: 1, candidateFingerprint: 1 }, { unique: true });

export const JobMatchModel: Model<IJobMatchDocument> =
  mongoose.models.JobMatch || mongoose.model<IJobMatchDocument>('JobMatch', jobMatchSchema);
