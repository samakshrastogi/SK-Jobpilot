import mongoose, { Schema, Document, Model } from 'mongoose';

const answerFeedbackSchema = new Schema(
  {
    questionId: { type: String, required: true },
    question: { type: String, required: true },
    candidateAnswer: { type: String, required: true },
    score: { type: Number, default: 0 },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    suggestedAnswer: { type: String, default: '' },
    starAnalysis: {
      situation: { type: String, default: '' },
      task: { type: String, default: '' },
      action: { type: String, default: '' },
      result: { type: String, default: '' },
    },
  },
  { _id: false }
);

export interface IMockInterviewSessionDocument extends Document {
  preparationId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  interviewType: string;
  status: 'in_progress' | 'completed';
  currentQuestionIndex: number;
  questions: Array<Record<string, unknown>>;
  answers: Array<Record<string, unknown>>;
  overallScore?: number;
  finalSummary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const mockInterviewSessionSchema = new Schema<IMockInterviewSessionDocument>(
  {
    preparationId: { type: Schema.Types.ObjectId, ref: 'InterviewPreparation', required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    interviewType: { type: String, default: 'behavioural' },
    status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
    currentQuestionIndex: { type: Number, default: 0 },
    questions: [{ type: Schema.Types.Mixed }],
    answers: [answerFeedbackSchema],
    overallScore: { type: Number, default: 0 },
    finalSummary: { type: String, default: '' },
  },
  { timestamps: true }
);

export const MockInterviewSessionModel: Model<IMockInterviewSessionDocument> =
  mongoose.models.MockInterviewSession ||
  mongoose.model<IMockInterviewSessionDocument>('MockInterviewSession', mockInterviewSessionSchema);
