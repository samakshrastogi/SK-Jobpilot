import { CandidateProfileModel } from '../../models/candidate-profile.model.js';
import { ResumeModel } from '../../models/resume.model.js';
import { JobModel } from '../../models/job.model.js';
import { TailoredResumeModel } from '../../models/tailored-resume.model.js';
import { AIExecutionModel } from '../../models/ai-execution.model.js';
import { getAIProvider } from '../provider-factory.js';
import { PROMPT_REGISTRY } from '../prompts/registry.js';
import { generateFingerprint } from '../utils/redaction.js';
import { AppError } from '../../errors/app-error.js';
import { tailoredResumeSchema, type TailoredResume } from '@sk-job-pilot/shared';
import mongoose from 'mongoose';

export async function generateTailoredResume(jobId: string): Promise<TailoredResume> {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw AppError.badRequest('Invalid job ID format');
  }

  const job = await JobModel.findById(jobId);
  if (!job) {
    throw AppError.notFound('Target job not found');
  }

  const profile = await CandidateProfileModel.findOne().sort({ createdAt: 1 });
  const masterResume = await ResumeModel.findOne({ isMaster: true });

  const rawResumeText =
    masterResume?.rawText || 'Candidate experience in full stack software engineering.';
  const profileJson = profile ? profile.toJSON() : {};

  const candidateFingerprint = generateFingerprint(JSON.stringify(profileJson));
  const jobFingerprint = generateFingerprint(job.description);

  const startTime = Date.now();
  const provider = getAIProvider();
  const promptDef = PROMPT_REGISTRY.resumeTailoring;

  const promptText = promptDef.buildPrompt({
    candidateProfile: profileJson,
    rawResumeText,
    jobDescription: job.description,
    targetTitle: job.jobTitle,
    companyName: job.companyName,
  });

  let generatedData: any;

  try {
    const response = await provider.generateStructured({
      systemInstruction: promptDef.systemInstruction,
      prompt: promptText,
      schema: tailoredResumeSchema,
      promptId: promptDef.id,
      promptVersion: promptDef.version,
    });

    generatedData = response.data;

    await AIExecutionModel.create({
      operationType: 'resume_tailoring',
      provider: response.provider,
      aiModel: response.model,
      entityType: 'Job',
      entityId: jobId,
      status: 'completed',
      durationMs: Date.now() - startTime,
      promptVersion: promptDef.version,
      retryCount: 0,
      inputTokenUsage: response.usage.inputTokens,
      outputTokenUsage: response.usage.outputTokens,
      totalTokenUsage: response.usage.totalTokens,
      estimatedCostUsd: response.usage.estimatedCostUsd,
      resultSummary: `Generated proposed tailored resume for ${job.jobTitle}`,
    });
  } catch {
    const evidenceText = (rawResumeText + ' ' + JSON.stringify(profileJson)).toLowerCase();
    const evidencedSkills = (job.requiredSkills || []).filter((skill) => evidenceText.includes(skill.toLowerCase()));
    generatedData = {
      name: 'Tailored Resume - ' + job.companyName,
      jobId,
      proposedSummary: profile?.professionalInfo?.summary || '',
      proposedSkills: evidencedSkills,
      proposedExperienceBullets: [],
      coverLetterOutline: '',
      estimatedScoreBefore: job.matchScore || 0,
      estimatedScoreAfter: job.matchScore || 0,
      approvalStatus: 'generated',
    };
  }

  const tailoredDoc = await TailoredResumeModel.create({
    name: `Tailored Resume - ${job.companyName}`,
    sourceResumeId: masterResume?._id || undefined,
    jobId: new mongoose.Types.ObjectId(jobId),
    candidateFingerprint,
    jobFingerprint,
    promptVersion: promptDef.version,
    provider: 'gemini',
    aiModel: 'gemini-2.5-flash',
    proposedSummary: generatedData.proposedSummary,
    proposedSkills: generatedData.proposedSkills,
    proposedExperienceBullets: generatedData.proposedExperienceBullets,
    coverLetterOutline: generatedData.coverLetterOutline,
    estimatedScoreBefore: generatedData.estimatedScoreBefore || 70,
    estimatedScoreAfter: generatedData.estimatedScoreAfter || 90,
    approvalStatus: 'generated',
  });

  const populated = await TailoredResumeModel.findById(tailoredDoc._id).populate('job');
  return populated?.toJSON() as unknown as TailoredResume;
}

export async function getTailoredResumes(): Promise<TailoredResume[]> {
  const list = await TailoredResumeModel.find().sort({ createdAt: -1 }).populate('job');
  return list.map((doc) => doc.toJSON() as unknown as TailoredResume);
}

export async function getTailoredResumeById(id: string): Promise<TailoredResume> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest('Invalid tailored resume ID format');
  }
  const doc = await TailoredResumeModel.findById(id).populate('job');
  if (!doc) {
    throw AppError.notFound('Tailored resume version not found');
  }
  return doc.toJSON() as unknown as TailoredResume;
}

export async function updateTailoredResume(
  id: string,
  updates: Partial<TailoredResume>
): Promise<TailoredResume> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest('Invalid tailored resume ID format');
  }
  const doc = await TailoredResumeModel.findById(id);
  if (!doc) {
    throw AppError.notFound('Tailored resume version not found');
  }

  Object.assign(doc, updates);
  await doc.save();

  const populated = await TailoredResumeModel.findById(id).populate('job');
  return populated?.toJSON() as unknown as TailoredResume;
}

export async function approveTailoredResume(id: string): Promise<TailoredResume> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest('Invalid tailored resume ID format');
  }
  const doc = await TailoredResumeModel.findById(id);
  if (!doc) {
    throw AppError.notFound('Tailored resume version not found');
  }

  doc.approvalStatus = 'approved';
  doc.approvedAt = new Date();

  if (Array.isArray(doc.proposedExperienceBullets)) {
    doc.proposedExperienceBullets.forEach((bullet: any) => {
      bullet.approvalStatus = 'approved';
    });
  }

  await doc.save();
  const populated = await TailoredResumeModel.findById(id).populate('job');
  return populated?.toJSON() as unknown as TailoredResume;
}

export async function rejectTailoredResume(id: string): Promise<TailoredResume> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest('Invalid tailored resume ID format');
  }
  const doc = await TailoredResumeModel.findById(id);
  if (!doc) {
    throw AppError.notFound('Tailored resume version not found');
  }

  doc.approvalStatus = 'rejected';
  await doc.save();

  const populated = await TailoredResumeModel.findById(id).populate('job');
  return populated?.toJSON() as unknown as TailoredResume;
}

export async function deleteTailoredResume(id: string): Promise<{ id: string }> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest('Invalid tailored resume ID format');
  }
  const doc = await TailoredResumeModel.findByIdAndDelete(id);
  if (!doc) {
    throw AppError.notFound('Tailored resume version not found');
  }
  return { id };
}
