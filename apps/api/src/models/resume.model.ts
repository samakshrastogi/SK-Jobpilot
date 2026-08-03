import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResumeDocument extends Document {
  name: string;
  originalFileName: string;
  storagePath: string;
  mimeType: string;
  fileSize: number;
  checksum: string;
  sourceType: 'upload' | 'generated' | 'imported';
  rawText: string;
  parsedContent: {
    summary?: string;
    skills?: string[];
    experience?: Array<{ company?: string; title?: string; dates?: string; bullets?: string[] }>;
    education?: Array<{ institution?: string; degree?: string; year?: string }>;
    projects?: Array<{ name?: string; description?: string }>;
    certifications?: string[];
    contactInfo?: { email?: string; phone?: string; urls?: string[] };
  };
  parsingStatus: 'pending' | 'parsed' | 'requires_ocr' | 'error';
  parsingError?: string;
  parsingConfidence?: number;
  warnings?: string[];
  isMaster: boolean;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResumeDocument>(
  {
    name: { type: String, required: true, trim: true },
    originalFileName: { type: String, required: true },
    storagePath: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    checksum: { type: String, required: true, index: true },
    sourceType: { type: String, enum: ['upload', 'generated', 'imported'], default: 'upload' },
    rawText: { type: String, default: '' },
    parsedContent: { type: Schema.Types.Mixed, default: () => ({}) },
    parsingStatus: {
      type: String,
      enum: ['pending', 'parsed', 'requires_ocr', 'error'],
      default: 'pending',
      index: true,
    },
    parsingError: { type: String },
    parsingConfidence: { type: Number, default: 0 },
    warnings: [{ type: String }],
    isMaster: { type: Boolean, default: false, index: true },
    version: { type: String, default: '1.0' },
  },
  { timestamps: true }
);

resumeSchema.index({ createdAt: -1 });

resumeSchema.pre('save', function (next) {
  // Master Resume Integrity Rule:
  // A resume can be master ONLY when parsingStatus is 'parsed' and rawText exists.
  if (this.isMaster && (this.parsingStatus !== 'parsed' || !this.rawText || this.rawText.trim().length === 0)) {
    this.isMaster = false;
  }
  next();
});

export const ResumeModel: Model<IResumeDocument> =
  mongoose.models.Resume || mongoose.model<IResumeDocument>('Resume', resumeSchema);
