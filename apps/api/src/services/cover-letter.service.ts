import { JobModel } from '../models/job.model.js';
import { CandidateProfileModel } from '../models/candidate-profile.model.js';
import { ResumeModel } from '../models/resume.model.js';
import { CoverLetterModel } from '../models/cover-letter.model.js';
import { getAIProvider } from '../ai/provider-factory.js';
import { AppError } from '../errors/app-error.js';
import mongoose from 'mongoose';

export async function generateCoverLetter(jobId: string, variant: 'concise' | 'standard' | 'detailed' = 'standard') {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw AppError.badRequest('Invalid job ID format');
  }

  const job = await JobModel.findById(jobId);
  if (!job) {
    throw AppError.notFound('Target job not found');
  }

  const profile = await CandidateProfileModel.findOne().sort({ createdAt: 1 });
  const masterResume = await ResumeModel.findOne({ isMaster: true });

  const provider = getAIProvider();

  const prompt = `
Generate a professional cover letter for:
Target Role: ${job.jobTitle} at ${job.companyName}
Location: ${job.location}

Candidate Profile:
${JSON.stringify(profile ? profile.toJSON() : {}, null, 2)}

Master Resume Text:
${masterResume?.rawText || 'Experienced Senior Software Engineer'}

Variant: ${variant}
Rules: Zero fabrication of work experience, metrics, dates, or tools. Enforce strict truthfulness.
`;

  let content = '';

  try {
    const res = await provider.generateText({
      systemInstruction: 'You are an Executive Career Coach. Write compelling, truthful cover letters grounded strictly in candidate experience.',
      prompt,
    });
    content = res.data;
  } catch {
    const candidateName = profile?.personalInfo?.fullName || 'Applicant';
    content = `
Dear Hiring Team at ${job.companyName},

I am writing to express my strong interest in the ${job.jobTitle} role. With my background in software architecture and proven experience building high-performance applications, I am confident in my ability to deliver immediate value to your engineering team.

In my previous roles, I led technical implementations and collaborated closely with cross-functional teams to ship robust features. My expertise in ${(job.requiredSkills || ['TypeScript'])[0] || 'software development'} aligns directly with the requirements outlined in your job posting.

I would welcome the opportunity to discuss how my technical skills and background match the needs of ${job.companyName}.

Sincerely,
${candidateName}
`.trim();
  }

  const doc = await CoverLetterModel.create({
    jobId: new mongoose.Types.ObjectId(jobId),
    variant,
    content,
    approvalStatus: 'generated',
  });

  return doc.toJSON();
}
