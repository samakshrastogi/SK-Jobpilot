import { TailoredResumeModel } from '../models/tailored-resume.model.js';
import { CandidateProfileModel } from '../models/candidate-profile.model.js';
import { AppError } from '../errors/app-error.js';
import mongoose from 'mongoose';

export async function exportTailoredResume(tailoredResumeId: string, format = 'pdf') {
  if (!mongoose.Types.ObjectId.isValid(tailoredResumeId)) {
    throw AppError.badRequest('Invalid tailored resume ID format');
  }

  const tailored = await TailoredResumeModel.findById(tailoredResumeId).populate('job');
  if (!tailored) {
    throw AppError.notFound('Tailored resume version not found');
  }

  if (tailored.approvalStatus !== 'approved') {
    throw AppError.badRequest('Only approved tailored resume versions can be exported as official documents.');
  }

  const profile = await CandidateProfileModel.findOne().sort({ createdAt: 1 });
  const personal = profile?.personalInfo || { fullName: 'Candidate', email: 'candidate@example.com' };

  const summary = tailored.proposedSummary;
  const skills = (tailored.proposedSkills || []).join(', ');
  const bullets = (tailored.proposedExperienceBullets || [])
    .map((b: any) => `• ${b.proposedText || b.originalText}`)
    .join('\n');

  const textDocument = `
${personal.fullName.toUpperCase()}
Email: ${personal.email} | Phone: ${personal.phone || ''} | Location: ${personal.location || ''}
LinkedIn: ${personal.linkedinUrl || ''} | Portfolio: ${personal.portfolioUrl || ''}

================================================================================
PROFESSIONAL SUMMARY
================================================================================
${summary}

================================================================================
CORE SKILLS & TECHNOLOGIES
================================================================================
${skills}

================================================================================
PROFESSIONAL EXPERIENCE & HIGHLIGHTS
================================================================================
${bullets}
`.trim();

  return {
    tailoredResumeId,
    format,
    filename: `${personal.fullName.replace(/\s+/g, '_')}_Resume_${tailored.name.replace(/\s+/g, '_')}.${format === 'docx' ? 'docx' : 'pdf'}`,
    textContent: textDocument,
    mimeType: format === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf',
  };
}
