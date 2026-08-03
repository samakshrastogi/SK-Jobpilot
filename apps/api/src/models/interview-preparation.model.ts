import mongoose, { Schema, Document, Model } from 'mongoose';

const questionSchema = new Schema(
  {
    id: { type: String, required: true },
    question: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, default: 'senior' },
    whyAsked: { type: String, default: '' },
    skillsAssessed: [{ type: String }],
    suggestedFramework: { type: String, default: '' },
    keyPointsToCover: [{ type: String }],
    commonMistakes: [{ type: String }],
  },
  { _id: false }
);

export interface IInterviewPreparationDocument extends Document {
  jobId: mongoose.Types.ObjectId;
  interviewType: string;
  difficulty: string;
  sevenDayStudyPlan: Array<{ day: number; focus: string; tasks: string[] }>;
  questions: Array<Record<string, unknown>>;
  createdAt: Date;
  updatedAt: Date;
}

const interviewPreparationSchema = new Schema<IInterviewPreparationDocument>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    interviewType: { type: String, default: 'behavioural' },
    difficulty: { type: String, default: 'senior' },
    sevenDayStudyPlan: [
      {
        day: { type: Number },
        focus: { type: String },
        tasks: [{ type: String }],
      },
    ],
    questions: [questionSchema],
  },
  { timestamps: true }
);

interviewPreparationSchema.virtual('job', {
  ref: 'Job',
  localField: 'jobId',
  foreignField: '_id',
  justOne: true,
});

interviewPreparationSchema.set('toJSON', { virtuals: true });
interviewPreparationSchema.set('toObject', { virtuals: true });

export const InterviewPreparationModel: Model<IInterviewPreparationDocument> =
  mongoose.models.InterviewPreparation ||
  mongoose.model<IInterviewPreparationDocument>('InterviewPreparation', interviewPreparationSchema);
