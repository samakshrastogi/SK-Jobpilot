import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReviewQueueItemDocument extends Document {
  jobId: mongoose.Types.ObjectId;
  applicationId?: mongoose.Types.ObjectId;
  reason: string;
  blockingQuestion: string;
  suggestedAnswer?: string;
  confidence: number;
  sensitiveFlag: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'resolved';
  userCorrection?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewQueueItemSchema = new Schema<IReviewQueueItemDocument>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', index: true },
    reason: { type: String, required: true },
    blockingQuestion: { type: String, required: true },
    suggestedAnswer: { type: String, default: '' },
    confidence: { type: Number, default: 80 },
    sensitiveFlag: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'resolved'], default: 'pending' },
    userCorrection: { type: String, default: '' },
  },
  { timestamps: true }
);

export const ReviewQueueItemModel: Model<IReviewQueueItemDocument> =
  mongoose.models.ReviewQueueItem || mongoose.model<IReviewQueueItemDocument>('ReviewQueueItem', reviewQueueItemSchema);
