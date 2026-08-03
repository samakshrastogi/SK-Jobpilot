import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAIExecutionDocument extends Document {
  operationType:
    | 'candidate_analysis'
    | 'resume_analysis'
    | 'job_extraction'
    | 'job_match'
    | 'skill_gap_analysis'
    | 'resume_tailoring'
    | 'interview_question_generation';
  provider: string;
  aiModel: string;
  entityType?: string;
  entityId?: string;
  status: 'started' | 'completed' | 'failed' | 'cached';
  durationMs: number;
  inputFingerprint?: string;
  promptVersion: string;
  retryCount: number;
  inputTokenUsage: number;
  outputTokenUsage: number;
  totalTokenUsage: number;
  estimatedCostUsd: number;
  errorCategory?: string;
  safeErrorMessage?: string;
  resultSummary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const aiExecutionSchema = new Schema<IAIExecutionDocument>(
  {
    operationType: {
      type: String,
      required: true,
      enum: [
        'candidate_analysis',
        'resume_analysis',
        'job_extraction',
        'job_match',
        'skill_gap_analysis',
        'resume_tailoring',
        'interview_question_generation',
      ],
      index: true,
    },
    provider: { type: String, required: true, default: 'gemini' },
    aiModel: { type: String, required: true },
    entityType: { type: String, index: true },
    entityId: { type: String, index: true },
    status: {
      type: String,
      enum: ['started', 'completed', 'failed', 'cached'],
      default: 'completed',
      index: true,
    },
    durationMs: { type: Number, default: 0 },
    inputFingerprint: { type: String, index: true },
    promptVersion: { type: String, default: '1.0' },
    retryCount: { type: Number, default: 0 },
    inputTokenUsage: { type: Number, default: 0 },
    outputTokenUsage: { type: Number, default: 0 },
    totalTokenUsage: { type: Number, default: 0 },
    estimatedCostUsd: { type: Number, default: 0 },
    errorCategory: { type: String },
    safeErrorMessage: { type: String },
    resultSummary: { type: String, default: '' },
  },
  { timestamps: true }
);

aiExecutionSchema.index({ createdAt: -1 });

export const AIExecutionModel: Model<IAIExecutionDocument> =
  mongoose.models.AIExecution ||
  mongoose.model<IAIExecutionDocument>('AIExecution', aiExecutionSchema);
