import type { Request, Response } from 'express';
import { CandidateProfileModel } from '../models/candidate-profile.model.js';
import { candidateProfileSchema } from '@sk-job-pilot/shared';
import { sendSuccess } from '../utils/response.js';

const defaultEmptyProfile = {
  personalInfo: {
    fullName: 'SK JobPilot User',
    email: 'user@example.com',
    phone: '',
    location: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
  },
  professionalInfo: {
    currentTitle: '',
    summary: '',
    totalExperienceMonths: 0,
    preferredRoles: [],
    preferredLocations: [],
    remotePreference: 'open',
    employmentTypes: [],
    expectedSalary: { amount: 0, currency: 'USD', period: 'yearly' },
    noticePeriodDays: 0,
    willingToRelocate: false,
  },
  skills: {
    languages: [],
    backend: [],
    frontend: [],
    databases: [],
    cloudDevOps: [],
    aiAutomation: [],
    tools: [],
  },
  experience: [],
  education: [],
  projects: [],
  certificates: [],
  jobPreferences: {
    targetTitles: [],
    includedKeywords: [],
    excludedKeywords: [],
    preferredIndustries: [],
    preferredCompanies: [],
    excludedCompanies: [],
    minExperienceYears: 0,
    maxExperienceYears: 30,
    preferredWorkModes: [],
    sponsorshipRequired: false,
    relocationCountries: [],
  },
};

export async function getProfile(req: Request, res: Response): Promise<void> {
  const profile = await CandidateProfileModel.findOne().sort({ createdAt: 1 });
  if (!profile) {
    sendSuccess(res, defaultEmptyProfile, 'Default candidate profile returned', 200, req);
    return;
  }
  sendSuccess(res, profile, 'Candidate profile retrieved successfully', 200, req);
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  const validated = candidateProfileSchema.parse(req.body);

  let profile = await CandidateProfileModel.findOne().sort({ createdAt: 1 });
  if (profile) {
    profile.personalInfo = validated.personalInfo;
    profile.professionalInfo = validated.professionalInfo;
    profile.skills = validated.skills;
    profile.experience = validated.experience;
    profile.education = validated.education;
    profile.projects = validated.projects;
    profile.certificates = validated.certificates;
    profile.jobPreferences = validated.jobPreferences;
    await profile.save();
  } else {
    profile = await CandidateProfileModel.create(validated);
  }

  sendSuccess(res, profile, 'Candidate profile saved successfully', 200, req);
}

export async function patchProfile(req: Request, res: Response): Promise<void> {
  let profile = await CandidateProfileModel.findOne().sort({ createdAt: 1 });

  if (!profile) {
    // If updating non-existent profile, start with default and merge
    const validated = candidateProfileSchema.partial().parse(req.body);
    const initial = { ...defaultEmptyProfile, ...validated };
    profile = await CandidateProfileModel.create(initial);
  } else {
    const updateData = req.body;
    if (updateData.personalInfo) Object.assign(profile.personalInfo, updateData.personalInfo);
    if (updateData.professionalInfo)
      Object.assign(profile.professionalInfo, updateData.professionalInfo);
    if (updateData.skills) Object.assign(profile.skills, updateData.skills);
    if (updateData.experience) profile.experience = updateData.experience;
    if (updateData.education) profile.education = updateData.education;
    if (updateData.projects) profile.projects = updateData.projects;
    if (updateData.certificates) profile.certificates = updateData.certificates;
    if (updateData.jobPreferences) Object.assign(profile.jobPreferences, updateData.jobPreferences);
    await profile.save();
  }

  sendSuccess(res, profile, 'Candidate profile updated successfully', 200, req);
}
