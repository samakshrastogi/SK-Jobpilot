import mongoose, { Schema, Document, Model } from 'mongoose';

export type AgentTaskStatus = 'queued' | 'analyzing' | 'skipped' | 'needs_review' | 'ready' | 'failed';

export interface IAgentTaskDocument extends Document {
  runId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  status: AgentTaskStatus;
  stage: string;
  decisionReason: string;
  eligibilityScore?: number;
  matchScore?: number;
  attempts: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const agentTaskSchema = new Schema<IAgentTaskDocument>({
  runId: { type: Schema.Types.ObjectId, ref: 'AgentRun', required: true, index: true },
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
  status: { type: String, enum: ['queued', 'analyzing', 'skipped', 'needs_review', 'ready', 'failed'], default: 'queued', index: true },
  stage: { type: String, default: 'queued' },
  decisionReason: { type: String, default: '' },
  eligibilityScore: Number,
  matchScore: Number,
  attempts: { type: Number, default: 0 },
  errorMessage: { type: String, default: '' },
}, { timestamps: true });

agentTaskSchema.index({ runId: 1, jobId: 1 }, { unique: true });

export const AgentTaskModel: Model<IAgentTaskDocument> =
  mongoose.models.AgentTask || mongoose.model<IAgentTaskDocument>('AgentTask', agentTaskSchema);