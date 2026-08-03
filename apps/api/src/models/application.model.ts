import mongoose, { Schema, Document, Model } from 'mongoose';

const timelineEventSchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    status: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { id: true }
);

export interface IApplicationDocument extends Document {
  job: mongoose.Types.ObjectId;
  resume?: mongoose.Types.ObjectId;
  status:
    | 'planned'
    | 'preparing'
    | 'ready_for_review'
    | 'submitted'
    | 'acknowledged'
    | 'recruiter_contacted'
    | 'assessment'
    | 'interview'
    | 'offer'
    | 'rejected'
    | 'withdrawn'
    | 'archived';
  applicationMethod?: string;
  applicationUrl?: string;
  appliedDate?: Date;
  lastActivityDate: Date;
  nextFollowUpDate?: Date;
  contactPerson?: string;
  contactEmail?: string;
  referralInfo?: string;
  notes?: string;
  salaryEntered?: number;
  coverLetter?: string;
  screeningQuestions?: Array<{ question: string; answer: string }>;
  timelineEvents: Array<Record<string, unknown>>;
  rejectionReason?: string;
  offerDetails?: string;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplicationDocument>(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    resume: { type: Schema.Types.ObjectId, ref: 'Resume', index: true },
    status: {
      type: String,
      enum: [
        'planned',
        'preparing',
        'ready_for_review',
        'submitted',
        'acknowledged',
        'recruiter_contacted',
        'assessment',
        'interview',
        'offer',
        'rejected',
        'withdrawn',
        'archived',
      ],
      default: 'planned',
      index: true,
    },
    applicationMethod: { type: String, default: 'Direct Site' },
    applicationUrl: { type: String, default: '' },
    appliedDate: { type: Date },
    lastActivityDate: { type: Date, default: Date.now },
    nextFollowUpDate: { type: Date },
    contactPerson: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    referralInfo: { type: String, default: '' },
    notes: { type: String, default: '' },
    salaryEntered: { type: Number },
    coverLetter: { type: String, default: '' },
    screeningQuestions: [{ question: { type: String }, answer: { type: String } }],
    timelineEvents: { type: [timelineEventSchema], default: [] },
    rejectionReason: { type: String, default: '' },
    offerDetails: { type: String, default: '' },
  },
  { timestamps: true }
);

applicationSchema.index({ createdAt: -1 });

export const ApplicationModel: Model<IApplicationDocument> =
  mongoose.models.Application ||
  mongoose.model<IApplicationDocument>('Application', applicationSchema);
