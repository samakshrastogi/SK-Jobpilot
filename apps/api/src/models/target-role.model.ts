import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITargetRoleDocument extends Document {
  primaryTitle: string;
  searchAliases: string[];
  includedKeywords: string[];
  excludedKeywords: string[];
  minimumMatchScore: number;
  maximumRequiredExperienceYears: number;
  priority: number;
  autoApplyEnabled: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const targetRoleSchema = new Schema<ITargetRoleDocument>(
  {
    primaryTitle: { type: String, required: true },
    searchAliases: [{ type: String }],
    includedKeywords: [{ type: String }],
    excludedKeywords: [{ type: String }],
    minimumMatchScore: { type: Number, default: 75 },
    maximumRequiredExperienceYears: { type: Number, default: 5 },
    priority: { type: Number, default: 1 },
    autoApplyEnabled: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const TargetRoleModel: Model<ITargetRoleDocument> =
  mongoose.models.TargetRole || mongoose.model<ITargetRoleDocument>('TargetRole', targetRoleSchema);
