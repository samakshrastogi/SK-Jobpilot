import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFollowUpReminderDocument extends Document {
  applicationId: mongoose.Types.ObjectId;
  reminderType: 'application_follow_up' | 'recruiter_reply' | 'assessment_deadline' | 'interview_preparation' | 'interview_follow_up' | 'offer_decision' | 'manual';
  title: string;
  dueDate: Date;
  notes?: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const followUpReminderSchema = new Schema<IFollowUpReminderDocument>(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true, index: true },
    reminderType: {
      type: String,
      enum: ['application_follow_up', 'recruiter_reply', 'assessment_deadline', 'interview_preparation', 'interview_follow_up', 'offer_decision', 'manual'],
      required: true,
    },
    title: { type: String, required: true },
    dueDate: { type: Date, required: true, index: true },
    notes: { type: String, default: '' },
    isCompleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

followUpReminderSchema.virtual('application', {
  ref: 'Application',
  localField: 'applicationId',
  foreignField: '_id',
  justOne: true,
});

followUpReminderSchema.set('toJSON', { virtuals: true });
followUpReminderSchema.set('toObject', { virtuals: true });

export const FollowUpReminderModel: Model<IFollowUpReminderDocument> =
  mongoose.models.FollowUpReminder ||
  mongoose.model<IFollowUpReminderDocument>('FollowUpReminder', followUpReminderSchema);
