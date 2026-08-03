import mongoose, { Schema, Document, Model } from 'mongoose';

export type AgentRunStatus = 'running' | 'completed' | 'failed' | 'skipped';

export interface IAgentRunDocument extends Document {
  trigger: 'scheduled' | 'manual';
  status: AgentRunStatus;
  startedAt: Date;
  completedAt?: Date;
  discovered: number;
  considered: number;
  matched: number;
  prepared: number;
  skipped: number;
  failed: number;
  summary: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const agentRunSchema = new Schema<IAgentRunDocument>({
  trigger: { type: String, enum: ['scheduled', 'manual'], required: true },
  status: { type: String, enum: ['running', 'completed', 'failed', 'skipped'], default: 'running', index: true },
  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
  discovered: { type: Number, default: 0 },
  considered: { type: Number, default: 0 },
  matched: { type: Number, default: 0 },
  prepared: { type: Number, default: 0 },
  skipped: { type: Number, default: 0 },
  failed: { type: Number, default: 0 },
  summary: { type: String, default: '' },
  errorMessage: { type: String, default: '' },
}, { timestamps: true });

export const AgentRunModel: Model<IAgentRunDocument> =
  mongoose.models.AgentRun || mongoose.model<IAgentRunDocument>('AgentRun', agentRunSchema);