import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRoleRecommendationDocument extends Document {
  roleTitle: string;
  roleFamily: string;
  suitabilityScore: number;
  confidenceScore: number;
  seniorityLevel: string;
  evidence: string[];
  matchingSkills: string[];
  suggestedSearchTitles: string[];
  suggestedExcludedTitles: string[];
  applicationRecommendation: 'highly_qualified' | 'qualified' | 'partially_qualified' | 'stretch_role' | 'not_recommended';
  createdAt: Date;
}

const roleRecommendationSchema = new Schema<IRoleRecommendationDocument>(
  {
    roleTitle: { type: String, required: true },
    roleFamily: { type: String, required: true },
    suitabilityScore: { type: Number, required: true },
    confidenceScore: { type: Number, required: true },
    seniorityLevel: { type: String, required: true },
    evidence: [{ type: String }],
    matchingSkills: [{ type: String }],
    suggestedSearchTitles: [{ type: String }],
    suggestedExcludedTitles: [{ type: String }],
    applicationRecommendation: {
      type: String,
      enum: ['highly_qualified', 'qualified', 'partially_qualified', 'stretch_role', 'not_recommended'],
      default: 'qualified',
    },
  },
  { timestamps: true }
);

export const RoleRecommendationModel: Model<IRoleRecommendationDocument> =
  mongoose.models.RoleRecommendation || mongoose.model<IRoleRecommendationDocument>('RoleRecommendation', roleRecommendationSchema);
