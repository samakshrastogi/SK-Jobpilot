import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDiscoveryRunDocument extends Document {
  sourceId: mongoose.Types.ObjectId;
  providerType: string;
  trigger: 'manual' | 'scheduled' | 'import';
  status: 'queued' | 'running' | 'completed' | 'failed';
  jobsDiscovered: number;
  jobsInserted: number;
  duplicatesFound: number;
  errorMessage?: string;
  durationMs: number;
  createdAt: Date;
  updatedAt: Date;
}

const discoveryRunSchema = new Schema<IDiscoveryRunDocument>(
  {
    sourceId: { type: Schema.Types.ObjectId, ref: 'DiscoverySource', required: true, index: true },
    providerType: { type: String, required: true },
    trigger: { type: String, enum: ['manual', 'scheduled', 'import'], default: 'manual' },
    status: { type: String, enum: ['queued', 'running', 'completed', 'failed'], default: 'queued', index: true },
    jobsDiscovered: { type: Number, default: 0 },
    jobsInserted: { type: Number, default: 0 },
    duplicatesFound: { type: Number, default: 0 },
    errorMessage: { type: String },
    durationMs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const DiscoveryRunModel: Model<IDiscoveryRunDocument> =
  mongoose.models.DiscoveryRun || mongoose.model<IDiscoveryRunDocument>('DiscoveryRun', discoveryRunSchema);
