import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOnboardingStateDocument extends Document {
  step: number;
  resumeUploaded: boolean;
  candidateProfileReviewed: boolean;
  rolesSelected: boolean;
  preferencesConfigured: boolean;
  answersConfigured: boolean;
  automationReviewed: boolean;
  automationEnabled: boolean;
  completedAt?: Date;
  updatedAt: Date;
}

const onboardingStateSchema = new Schema<IOnboardingStateDocument>(
  {
    step: { type: Number, default: 1 },
    resumeUploaded: { type: Boolean, default: false },
    candidateProfileReviewed: { type: Boolean, default: false },
    rolesSelected: { type: Boolean, default: false },
    preferencesConfigured: { type: Boolean, default: false },
    answersConfigured: { type: Boolean, default: false },
    automationReviewed: { type: Boolean, default: false },
    automationEnabled: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const OnboardingStateModel: Model<IOnboardingStateDocument> =
  mongoose.models.OnboardingState || mongoose.model<IOnboardingStateDocument>('OnboardingState', onboardingStateSchema);
