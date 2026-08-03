import { CandidateProfileModel } from '../../models/candidate-profile.model.js';
import { ResumeModel } from '../../models/resume.model.js';
import { CandidateAnalysisModel } from '../../models/candidate-analysis.model.js';
import { AIExecutionModel } from '../../models/ai-execution.model.js';
import { getAIProvider } from '../provider-factory.js';
import { PROMPT_REGISTRY } from '../prompts/registry.js';
import { generateFingerprint } from '../utils/redaction.js';
import { candidateAnalysisSchema, type CandidateAnalysis } from '@sk-job-pilot/shared';

export async function analyzeCandidate(forceRegenerate = false): Promise<CandidateAnalysis> {
  const profile = await CandidateProfileModel.findOne().sort({ createdAt: 1 });
  const masterResume = await ResumeModel.findOne({ isMaster: true });

  const rawResumeText = masterResume?.rawText || '';
  const profileJson = profile ? profile.toJSON() : {};
  const combinedInput = `${JSON.stringify(profileJson)}:${rawResumeText}`;
  const fingerprint = generateFingerprint(combinedInput);

  if (!forceRegenerate) {
    const existing = await CandidateAnalysisModel.findOne({ fingerprint });
    if (existing) {
      return existing.toJSON() as unknown as CandidateAnalysis;
    }
  }

  const startTime = Date.now();
  const provider = getAIProvider();
  const promptDef = PROMPT_REGISTRY.candidateProfileAnalysis;

  const promptText = promptDef.buildPrompt({
    profile: profileJson,
    rawResumeText,
  });

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

  let analysisDoc = await CandidateAnalysisModel.findOne({ fingerprint });
  if (analysisDoc) {
    Object.assign(analysisDoc, response.data);
    await analysisDoc.save();
  } else {
    analysisDoc = await CandidateAnalysisModel.create({
      fingerprint,
      ...response.data,
    });
  }

  return analysisDoc.toJSON() as unknown as CandidateAnalysis;
}

export async function getCandidateAnalysis(): Promise<CandidateAnalysis | null> {
  const analysis = await CandidateAnalysisModel.findOne().sort({ updatedAt: -1 });
  if (!analysis) return null;
  return analysis.toJSON() as unknown as CandidateAnalysis;
}
