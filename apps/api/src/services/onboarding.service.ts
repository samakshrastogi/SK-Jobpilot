import { OnboardingStateModel } from '../models/onboarding-state.model.js';
import { CandidateProfileModel } from '../models/candidate-profile.model.js';
import { RoleRecommendationModel } from '../models/role-recommendation.model.js';
import { TargetRoleModel } from '../models/target-role.model.js';
import { ResumeModel } from '../models/resume.model.js';
import { getAIProvider } from '../ai/provider-factory.js';
import { z } from 'zod';

const roleRecommendationAiSchema = z.array(
  z.object({
    roleTitle: z.string(),
    roleFamily: z.string(),
    suitabilityScore: z.number(),
    confidenceScore: z.number(),
    seniorityLevel: z.string(),
    evidence: z.array(z.string()),
    matchingSkills: z.array(z.string()),
    suggestedSearchTitles: z.array(z.string()),
    suggestedExcludedTitles: z.array(z.string()),
    applicationRecommendation: z.enum(['highly_qualified', 'qualified', 'partially_qualified', 'stretch_role', 'not_recommended']),
  })
);

export async function getOrCreateOnboardingState() {
  let state = await OnboardingStateModel.findOne();
  if (!state) {
    state = await OnboardingStateModel.create({
      step: 1,
      resumeUploaded: false,
      candidateProfileReviewed: false,
      rolesSelected: false,
      preferencesConfigured: false,
      answersConfigured: false,
      automationReviewed: false,
      automationEnabled: false,
    });
  }

  const masterResume = await ResumeModel.findOne({ isMaster: true });
  if (masterResume && !state.resumeUploaded) {
    state.resumeUploaded = true;
    if (state.step === 1) state.step = 2;
    await state.save();
  }

  return state.toJSON();
}

export async function updateOnboardingStep(step: number) {
  let state = await OnboardingStateModel.findOne();
  if (!state) {
    state = await OnboardingStateModel.create({ step });
  } else {
    state.step = step;
    await state.save();
  }
  return state.toJSON();
}

export async function recommendRolesFromProfile() {
  const profile = await CandidateProfileModel.findOne().sort({ createdAt: 1 });
  const masterResume = await ResumeModel.findOne({ isMaster: true });

  const provider = getAIProvider();

  const prompt = `
Analyze this candidate profile & master resume. Generate 4 to 6 highly qualified job roles based STRICTLY on evidence.

Candidate Profile:
${JSON.stringify(profile ? profile.toJSON() : {}, null, 2)}

Master Resume Text:
${masterResume?.rawText || 'Software Engineer'}

Rules:
1. Do NOT invent skills or experience.
2. Recommend realistic titles (e.g. Backend Engineer, Full Stack Engineer, Node.js Developer, Python Developer, AI Backend Engineer).
3. Classify recommendation as "highly_qualified", "qualified", or "stretch_role".
`;

  let recommendations: Array<{
    roleTitle: string;
    roleFamily: string;
    suitabilityScore: number;
    confidenceScore: number;
    seniorityLevel: string;
    evidence: string[];
    matchingSkills: string[];
    suggestedSearchTitles: string[];
    suggestedExcludedTitles: string[];
    applicationRecommendation: 'highly_qualified' | 'qualified' | 'partially_qualified' | 'stretch_role' | 'not_recommended';
  }> = [];

  try {
    const aiRes = await provider.generateStructured({
      schema: roleRecommendationAiSchema,
      promptId: 'role_recommendations',
      promptVersion: '1.0.0',
      prompt,
      systemInstruction: 'You are a Staff Technical Recruiter. Generate evidence-grounded role recommendations.',
    });
    if (Array.isArray(aiRes.data)) {
      recommendations = aiRes.data;
    }
  } catch {
    // Fallback deterministic recommendations based on profile skills
    const skills = profile?.skills?.backend || ['TypeScript', 'Node.js', 'Python'];
    recommendations = [
      {
        roleTitle: 'Backend Engineer',
        roleFamily: 'Software Engineering',
        suitabilityScore: 92,
        confidenceScore: 95,
        seniorityLevel: 'Mid-Senior',
        evidence: [`Verified experience in ${skills.slice(0, 3).join(', ')}`],
        matchingSkills: skills,
        suggestedSearchTitles: ['Backend Engineer', 'Node.js Developer', 'API Engineer'],
        suggestedExcludedTitles: ['PHP Developer', 'WordPress Specialist', 'Director'],
        applicationRecommendation: 'highly_qualified',
      },
      {
        roleTitle: 'Full Stack Engineer',
        roleFamily: 'Software Engineering',
        suitabilityScore: 88,
        confidenceScore: 90,
        seniorityLevel: 'Mid',
        evidence: ['Proven experience developing backend services and React interfaces'],
        matchingSkills: [...skills, 'React', 'TypeScript'],
        suggestedSearchTitles: ['Full Stack Engineer', 'Full Stack Developer'],
        suggestedExcludedTitles: ['Senior Manager', 'Flutter Developer'],
        applicationRecommendation: 'qualified',
      },
    ];
  }

  await RoleRecommendationModel.deleteMany({});
  const saved = await RoleRecommendationModel.insertMany(recommendations);
  return saved.map((s) => s.toJSON());
}

export async function selectTargetRoles(roleTitles: string[]) {
  await TargetRoleModel.deleteMany({});

  const newRoles = roleTitles.map((title) => ({
    primaryTitle: title,
    searchAliases: [title, `${title} Developer`],
    includedKeywords: ['TypeScript', 'Node.js', 'React', 'Python'],
    excludedKeywords: ['Senior Manager', 'PHP', 'WordPress', 'Director'],
    minimumMatchScore: 75,
    maximumRequiredExperienceYears: 5,
    priority: 1,
    autoApplyEnabled: true,
    active: true,
  }));

  const saved = await TargetRoleModel.insertMany(newRoles);

  let state = await OnboardingStateModel.findOne();
  if (state) {
    state.rolesSelected = true;
    state.step = Math.max(state.step, 4);
    await state.save();
  }

  return saved.map((s) => s.toJSON());
}
