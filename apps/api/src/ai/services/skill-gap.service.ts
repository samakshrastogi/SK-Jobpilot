import { analyzeCandidate } from './candidate-analysis.service.js';
import { analyzeJob } from './job-analysis.service.js';
import { AIExecutionModel } from '../../models/ai-execution.model.js';
import { getAIProvider } from '../provider-factory.js';
import { PROMPT_REGISTRY } from '../prompts/registry.js';
import { AppError } from '../../errors/app-error.js';
import { skillGapAnalysisSchema, type SkillGapAnalysis } from '@sk-job-pilot/shared';
import mongoose from 'mongoose';

export async function analyzeSkillGaps(jobId: string): Promise<SkillGapAnalysis> {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw AppError.badRequest('Invalid job ID format');
  }

  const candidateAnalysis = await analyzeCandidate();
  const jobAnalysis = await analyzeJob(jobId);

  const startTime = Date.now();
  const provider = getAIProvider();

  let gapData: SkillGapAnalysis;

  try {
    const promptDef = PROMPT_REGISTRY.skillGapAnalysis;
    const promptText = promptDef.buildPrompt({ candidateAnalysis, jobAnalysis });

    const response = await provider.generateStructured({
      systemInstruction: promptDef.systemInstruction,
      prompt: promptText,
      schema: skillGapAnalysisSchema,
      promptId: promptDef.id,
      promptVersion: promptDef.version,
    });

    gapData = { jobId, ...response.data };

    await AIExecutionModel.create({
      operationType: 'skill_gap_analysis',
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
      resultSummary: `Analyzed skill gaps for job ${jobId}`,
    });
  } catch {
    gapData = {
      jobId,
      criticalMissingRequirements: jobAnalysis.requiredSkills.filter(
        (s) => !candidateAnalysis.coreSkills.map((c) => c.toLowerCase()).includes(s.toLowerCase())
      ),
      importantMissingSkills: jobAnalysis.preferredSkills.filter(
        (s) =>
          !candidateAnalysis.supportingSkills.map((c) => c.toLowerCase()).includes(s.toLowerCase())
      ),
      optionalMissingSkills: [],
      weaklyEvidencedSkills: [],
      transferableSkills: candidateAnalysis.supportingSkills,
      resumeVisibilityGaps: ['Highlight relevant project achievements in resume bullets.'],
      genuineExperienceGaps: [],
      recommendedResumeImprovements: ['Add targeted skill keywords to skills section.'],
      recommendedPortfolioImprovements: ['Include live links to relevant repositories.'],
      recommendedInterviewPrepTopics: ['Technical architectural design principles.'],
    };
  }

  return gapData;
}
