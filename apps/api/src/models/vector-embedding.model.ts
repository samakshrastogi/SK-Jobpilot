import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVectorEmbeddingDocument extends Document {
  entityType: 'candidate_profile' | 'resume' | 'job_description' | 'job_requirements';
  entityId: string;
  fingerprint: string;
  provider: string;
  aiModel: string;
  dimension: number;
  embedding: number[];
  createdAt: Date;
  updatedAt: Date;
}

const vectorEmbeddingSchema = new Schema<IVectorEmbeddingDocument>(
  {
    entityType: {
      type: String,
      enum: ['candidate_profile', 'resume', 'job_description', 'job_requirements'],
      required: true,
      index: true,
    },
    entityId: { type: String, required: true, index: true },
    fingerprint: { type: String, required: true, index: true },
    provider: { type: String, default: 'gemini' },
    aiModel: { type: String, default: 'text-embedding-004' },
    dimension: { type: Number, required: true },
    embedding: [{ type: Number, required: true }],
  },
  { timestamps: true }
);

vectorEmbeddingSchema.index({ entityType: 1, entityId: 1, fingerprint: 1 }, { unique: true });

export const VectorEmbeddingModel: Model<IVectorEmbeddingDocument> =
  mongoose.models.VectorEmbedding ||
  mongoose.model<IVectorEmbeddingDocument>('VectorEmbedding', vectorEmbeddingSchema);
