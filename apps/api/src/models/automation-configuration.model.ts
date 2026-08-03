import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAutomationConfigurationDocument extends Document {
  enabled: boolean;
  mode: 'discovery_only' | 'prepare_and_review' | 'safe_auto_apply';
  frequency: 'hourly' | 'daily';
  minimumMatchScore: number;
  maxApplicationsPerHour: number;
  maxApplicationsPerDay: number;
  autoAnalyze: boolean;
  autoMatch: boolean;
  autoTailorResume: boolean;
  autoGenerateCoverLetter: boolean;
  autoSubmitSafeApplications: boolean;
  lastRunAt?: Date;
  nextRunAt?: Date;
  consecutiveFailures: number;
  pausedReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const automationConfigurationSchema = new Schema<IAutomationConfigurationDocument>(
  {
    enabled: { type: Boolean, default: true },
    mode: {
      type: String,
      enum: ['discovery_only', 'prepare_and_review', 'safe_auto_apply'],
      default: 'prepare_and_review',
    },
    frequency: { type: String, enum: ['hourly', 'daily'], default: 'hourly' },
    minimumMatchScore: { type: Number, default: 75 },
    maxApplicationsPerHour: { type: Number, default: 5 },
    maxApplicationsPerDay: { type: Number, default: 20 },
    autoAnalyze: { type: Boolean, default: true },
    autoMatch: { type: Boolean, default: true },
    autoTailorResume: { type: Boolean, default: true },
    autoGenerateCoverLetter: { type: Boolean, default: true },
    autoSubmitSafeApplications: { type: Boolean, default: false },
    lastRunAt: { type: Date },
    nextRunAt: { type: Date },
    consecutiveFailures: { type: Number, default: 0 },
    pausedReason: { type: String, default: '' },
  },
  { timestamps: true }
);

export const AutomationConfigurationModel: Model<IAutomationConfigurationDocument> =
  mongoose.models.AutomationConfiguration ||
  mongoose.model<IAutomationConfigurationDocument>('AutomationConfiguration', automationConfigurationSchema);
