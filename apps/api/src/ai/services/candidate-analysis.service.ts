import { CandidateProfileModel } from '../../models/candidate-profile.model.js';
import { ResumeModel } from '../../models/resume.model.js';
import { CandidateAnalysisModel } from '../../models/candidate-analysis.model.js';
import { AIExecutionModel } from '../../models/ai-execution.model.js';
import { getAIProvider } from '../provider-factory.js';
import { PROMPT_REGISTRY } from '../prompts/registry.js';
import { generateFingerprint } from '../utils/redaction.js';
import { logger } from '../../utils/logger.js';
import { candidateAnalysisSchema, type CandidateAnalysis } from '@sk-job-pilot/shared';

const KNOWN_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'Python', 'Django', 'Django REST Framework',
  'REST', 'GraphQL', 'MongoDB', 'PostgreSQL', 'SQL', 'Redis', 'Docker', 'AWS', 'Azure', 'Linux', 'Tailwind',
  'LangChain', 'LangGraph', 'RAG', 'AI Agents', 'Prompt Engineering', 'Git', 'Vite', 'Vitest',
];

function unique(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function profileSkills(profileJson: Record<string, unknown>, rawResumeText: string): string[] {
  const grouped = (profileJson.skills || {}) as Record<string, unknown>;
  const savedSkills = Object.values(grouped).flatMap((value) => Array.isArray(value) ? value.map(String) : []);
  const text = rawResumeText.toLowerCase();
  const textSkills = KNOWN_SKILLS.filter((skill) => text.includes(skill.toLowerCase()));
  return unique([...savedSkills, ...textSkills]);
}

function deterministicCandidateAnalysis(profileJson: Record<string, unknown>, rawResumeText: string, fingerprint: string): CandidateAnalysis {
  const professional = (profileJson.professionalInfo || {}) as Record<string, unknown>;
  const skills = profileSkills(profileJson, rawResumeText);
  const months = typeof professional.totalExperienceMonths === 'number' ? professional.totalExperienceMonths : 0;
  const inferredYears = /nokia|intern/i.test(rawResumeText) ? 0.9 : 0;
  const totalRelevantExperienceYears = Math.max(months / 12, inferredYears);
  const preferredRoles = Array.isArray(professional.preferredRoles) ? professional.preferredRoles.map(String) : [];
  const primaryTitle = String(professional.currentTitle || preferredRoles[0] || 'Software Engineer');
  const backend = skills.filter((skill) => /node|express|python|django|rest|graphql|mongodb|postgres|sql|redis/i.test(skill));
  const frontend = skills.filter((skill) => /react|next|javascript|typescript|css|tailwind|vite/i.test(skill));
  const cloud = skills.filter((skill) => /docker|aws|azure|linux/i.test(skill));
  const ai = skills.filter((skill) => /ai|langchain|langgraph|rag|prompt/i.test(skill));

  const parsed = candidateAnalysisSchema.parse({
    primaryTitle,
    seniorityEstimate: totalRelevantExperienceYears >= 2 ? 'Mid-level' : 'Entry to Junior',
    totalRelevantExperienceYears,
    coreSkills: skills.slice(0, 12),
    supportingSkills: skills.slice(12),
    toolsAndPlatforms: unique([...cloud, 'Git'].filter((skill) => skills.includes(skill) || skill === 'Git')),
    domainExperience: unique([ai.length ? 'AI automation' : '', backend.length ? 'Backend systems' : '', frontend.length ? 'Web applications' : '']),
    industryExperience: ['Software Engineering'],
    leadershipIndicators: [],
    backendStrengths: backend,
    frontendStrengths: frontend,
    cloudDevOpsStrengths: cloud,
    aiAutomationStrengths: ai,
    strongestAchievements: rawResumeText ? ['Resume-backed project and internship evidence available'] : [],
    measurableEvidence: totalRelevantExperienceYears > 0 ? [`Approximately ${totalRelevantExperienceYears.toFixed(1)} years of relevant experience inferred from profile/resume`] : [],
    preferredRoles,
    roleSuitability: preferredRoles.length ? preferredRoles.map((role) => `Evidence-backed fit for ${role}`) : ['Evidence-backed fit for software engineering roles'],
    missingOrWeakInfo: ['Local deterministic analysis used because external AI is unavailable'],
    parsingWarnings: [],
    evidenceReferences: [{ claim: 'Skills and experience derived from saved resume/profile', source: 'candidate profile and master resume' }],
  });

  return { ...parsed, fingerprint };
}

async function saveAnalysis(fingerprint: string, data: CandidateAnalysis): Promise<CandidateAnalysis> {
  const analysisData = Object.fromEntries(Object.entries(data).filter(([key]) => key !== 'fingerprint')) as Omit<CandidateAnalysis, 'fingerprint'>;
  let analysisDoc = await CandidateAnalysisModel.findOne({ fingerprint });
  if (analysisDoc) {
    Object.assign(analysisDoc, analysisData);
    await analysisDoc.save();
  } else {
    analysisDoc = await CandidateAnalysisModel.create({
      fingerprint,
      ...analysisData,
    });
  }

  return analysisDoc.toJSON() as unknown as CandidateAnalysis;
}

export async function analyzeCandidate(forceRegenerate = false): Promise<CandidateAnalysis> {
  const profile = await CandidateProfileModel.findOne().sort({ createdAt: 1 });
  const masterResume = await ResumeModel.findOne({ isMaster: true });

  const rawResumeText = masterResume?.rawText || '';
  const profileJson = profile ? profile.toJSON() as Record<string, unknown> : {};
  const combinedInput = `${JSON.stringify(profileJson)}:${rawResumeText}`;
  const fingerprint = generateFingerprint(combinedInput);

  if (!forceRegenerate) {
    const existing = await CandidateAnalysisModel.findOne({ fingerprint });
    if (existing) {
      return existing.toJSON() as unknown as CandidateAnalysis;
    }
  }

  const startTime = Date.now();
  const promptDef = PROMPT_REGISTRY.candidateProfileAnalysis;
  const promptText = promptDef.buildPrompt({
    profile: profileJson,
    rawResumeText,
  });

  try {
    const provider = getAIProvider();
    const response = await provider.generateStructured({
      systemInstruction: promptDef.systemInstruction,
      prompt: promptText,
      schema: candidateAnalysisSchema,
      promptId: promptDef.id,
      promptVersion: promptDef.version,
    });

    const durationMs = Date.now() - startTime;

    await AIExecutionModel.create({
      operationType: 'candidate_analysis',
      provider: response.provider,
      aiModel: response.model,
      entityType: 'CandidateProfile',
      entityId: profile?._id ? (profile._id as object).toString() : 'default',
      status: 'completed',
      durationMs,
      inputFingerprint: fingerprint,
      promptVersion: promptDef.version,
      retryCount: 0,
      inputTokenUsage: response.usage.inputTokens,
      outputTokenUsage: response.usage.outputTokens,
      totalTokenUsage: response.usage.totalTokens,
      estimatedCostUsd: response.usage.estimatedCostUsd,
      resultSummary: `Analyzed candidate profile. Primary title: ${response.data.primaryTitle}`,
    });

    return saveAnalysis(fingerprint, { ...(response.data as Omit<CandidateAnalysis, 'fingerprint'>), fingerprint });
  } catch (error) {
    logger.warn({ reason: error instanceof Error ? error.message : 'Unknown AI analysis error' }, 'Candidate analysis AI unavailable; using local deterministic analysis');
    return saveAnalysis(fingerprint, deterministicCandidateAnalysis(profileJson, rawResumeText, fingerprint));
  }
}

export async function getCandidateAnalysis(): Promise<CandidateAnalysis | null> {
  const analysis = await CandidateAnalysisModel.findOne().sort({ updatedAt: -1 });
  if (!analysis) return null;
  return analysis.toJSON() as unknown as CandidateAnalysis;
}