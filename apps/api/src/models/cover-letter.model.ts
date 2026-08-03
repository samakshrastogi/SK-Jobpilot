import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoverLetterDocument extends Document {
  jobId: mongoose.Types.ObjectId;
  variant: 'concise' | 'standard' | 'detailed';
  content: string;
  approvalStatus: 'draft' | 'generated' | 'under_review' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const coverLetterSchema = new Schema<ICoverLetterDocument>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    variant: { type: String, enum: ['concise', 'standard', 'detailed'], default: 'standard' },
    content: { type: String, required: true },
    approvalStatus: {
      type: String,
      enum: ['draft', 'generated', 'under_review', 'approved', 'rejected'],
      default: 'generated',
    },
  },
  { timestamps: true }
);

export const CoverLetterModel: Model<ICoverLetterDocument> =
  mongoose.models.CoverLetter || mongoose.model<ICoverLetterDocument>('CoverLetter', coverLetterSchema);
