import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDiscoverySourceDocument extends Document {
  name: string;
  providerType: 'greenhouse' | 'lever' | 'ashby' | 'workable' | 'generic_html' | 'generic_browser' | 'rss' | 'manual' | 'import';
  companyName: string;
  baseUrl?: string;
  careersUrl: string;
  boardId?: string;
  includedKeywords?: string[];
  excludedKeywords?: string[];
  enabled: boolean;
  scheduleEnabled: boolean;
  scheduleExpression: string;
  lastRunAt?: Date;
  lastRunStatus?: 'success' | 'failure' | 'none';
  createdAt: Date;
  updatedAt: Date;
}

const discoverySourceSchema = new Schema<IDiscoverySourceDocument>(
  {
    name: { type: String, required: true, trim: true },
    providerType: {
      type: String,
      enum: ['greenhouse', 'lever', 'ashby', 'workable', 'generic_html', 'generic_browser', 'rss', 'manual', 'import'],
      required: true,
      index: true,
    },
    companyName: { type: String, required: true, trim: true },
    baseUrl: { type: String, default: '' },
    careersUrl: { type: String, required: true, trim: true },
    boardId: { type: String, default: '' },
    includedKeywords: [{ type: String }],
    excludedKeywords: [{ type: String }],
    enabled: { type: Boolean, default: true, index: true },
    scheduleEnabled: { type: Boolean, default: true },
    scheduleExpression: { type: String, default: '0 */6 * * *' },
    lastRunAt: { type: Date },
    lastRunStatus: { type: String, enum: ['success', 'failure', 'none'], default: 'none' },
  },
  { timestamps: true }
);

export const DiscoverySourceModel: Model<IDiscoverySourceDocument> =
  mongoose.models.DiscoverySource || mongoose.model<IDiscoverySourceDocument>('DiscoverySource', discoverySourceSchema);
