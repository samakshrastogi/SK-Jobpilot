import mongoose, { Schema, Document, Model } from 'mongoose';

const changeSchema = new Schema(
  {
    id: { type: String, required: true },
    section: { type: String, required: true },
    transformationType: {
      type: String,
      enum: ['unchanged', 'reordered', 'shortened', 'clarified', 'keyword_aligned', 'impact_emphasized'],
      required: true,
    },
    originalText: { type: String, default: '' },
    proposedText: { type: String, required: true },
    reason: { type: String, required: true },
    targetedKeywords: [{ type: String }],
    truthfulnessConfidence: { type: Number, default: 100 },
    sourceReference: { type: String, default: '' },
    approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { _id: false }
);

export interface ITailoredResumeDocument extends Document {
  name: string;
  sourceResumeId?: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  candidateFingerprint: string;
  jobFingerprint: string;
  promptVersion: string;
  provider: string;
  aiModel: string;
  proposedSummary: string;
  proposedSkills: string[];
  proposedExperienceBullets: Array<Record<string, unknown>>;
  coverLetterOutline?: string;
  estimatedScoreBefore: number;
  estimatedScoreAfter: number;
  approvalStatus: 'draft' | 'generated' | 'under_review' | 'approved' | 'rejected' | 'archived';
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const tailoredResumeSchema = new Schema<ITailoredResumeDocument>(
  {
    name: { type: String, required: true, trim: true },
    sourceResumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    candidateFingerprint: { type: String, required: true },
    jobFingerprint: { type: String, required: true },
    promptVersion: { type: String, default: '1.0' },
    provider: { type: String, default: 'gemini' },
    aiModel: { type: String, default: 'gemini-2.5-flash' },
    proposedSummary: { type: String, required: true },
    proposedSkills: [{ type: String }],
    proposedExperienceBullets: { type: [changeSchema], default: [] },
    coverLetterOutline: { type: String, default: '' },
    estimatedScoreBefore: { type: Number, default: 0 },
    estimatedScoreAfter: { type: Number, default: 0 },
    approvalStatus: {
      type: String,
      enum: ['draft', 'generated', 'under_review', 'approved', 'rejected', 'archived'],
      default: 'generated',
      index: true,
    },
    approvedAt: { type: Date },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

tailoredResumeSchema.virtual('job', {
  ref: 'Job',
  localField: 'jobId',
  foreignField: '_id',
  justOne: true,
});

tailoredResumeSchema.index({ createdAt: -1 });

export const TailoredResumeModel: Model<ITailoredResumeDocument> =
  mongoose.models.TailoredResume || mongoose.model<ITailoredResumeDocument>('TailoredResume', tailoredResumeSchema);
