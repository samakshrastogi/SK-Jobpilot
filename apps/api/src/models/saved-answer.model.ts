import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISavedAnswerDocument extends Document {
  canonicalKey: string;
  category: string;
  answerText: string;
  requiresConfirmation: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const savedAnswerSchema = new Schema<ISavedAnswerDocument>(
  {
    canonicalKey: { type: String, required: true, unique: true, index: true },
    category: { type: String, default: 'general' },
    answerText: { type: String, required: true },
    requiresConfirmation: { type: Boolean, default: false },
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const SavedAnswerModel: Model<ISavedAnswerDocument> =
  mongoose.models.SavedAnswer || mongoose.model<ISavedAnswerDocument>('SavedAnswer', savedAnswerSchema);
