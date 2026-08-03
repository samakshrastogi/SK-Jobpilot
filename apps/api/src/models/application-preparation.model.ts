import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IApplicationPreparationDocument extends Document {
  jobId: mongoose.Types.ObjectId;
  applicationId?: mongoose.Types.ObjectId;
  status: 'draft' | 'analyzing_form' | 'needs_information' | 'ready_for_review' | 'submitted_by_user';
  detectedFields: Array<{ fieldKey: string; label: string; value: string; requiresConfirmation: boolean }>;
  riskFlags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const applicationPreparationSchema = new Schema<IApplicationPreparationDocument>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application' },
    status: {
      type: String,
      enum: ['draft', 'analyzing_form', 'needs_information', 'ready_for_review', 'submitted_by_user'],
      default: 'draft',
    },
    detectedFields: [
      {
        fieldKey: { type: String, required: true },
        label: { type: String, required: true },
        value: { type: String, default: '' },
        requiresConfirmation: { type: Boolean, default: false },
      },
    ],
    riskFlags: [{ type: String }],
  },
  { timestamps: true }
);

export const ApplicationPreparationModel: Model<IApplicationPreparationDocument> =
  mongoose.models.ApplicationPreparation ||
  mongoose.model<IApplicationPreparationDocument>('ApplicationPreparation', applicationPreparationSchema);
