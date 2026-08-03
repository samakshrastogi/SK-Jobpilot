import type {
  AIProvider,
  AITextRequest,
  AIStructuredRequest,
  AIEmbeddingRequest,
  AIResponse,
  AIEmbeddingResponse,
} from '../types.js';

export class MockAIProvider implements AIProvider {
  public readonly name = 'mock';

  public async isAvailable(): Promise<boolean> {
    return true;
  }

  public async generateText(request: AITextRequest): Promise<AIResponse<string>> {
    const text = `Mock AI response generated for prompt: ${request.prompt.substring(0, 50)}...`;
    return {
      data: text,
      rawText: text,
      provider: 'mock',
      model: 'mock-model-1.0',
      usage: { inputTokens: 50, outputTokens: 50, totalTokens: 100, estimatedCostUsd: 0 },
      durationMs: 15,
    };
  }

  public async generateStructured<T>(request: AIStructuredRequest<T>): Promise<AIResponse<T>> {
    let mockObject: unknown = {};

    if (request.promptId === 'candidate-profile-analysis') {
      mockObject = {
        primaryTitle: 'Lead Software Architect',
        seniorityEstimate: 'Senior / Lead',
        totalRelevantExperienceYears: 8,
        coreSkills: ['TypeScript', 'React', 'Node.js', 'Python', 'MongoDB'],
        supportingSkills: ['Docker', 'AWS', 'REST', 'GraphQL'],
        toolsAndPlatforms: ['Git', 'Vite', 'Vitest'],
        domainExperience: ['AI Systems', 'SaaS Applications'],
        industryExperience: ['Software Engineering'],
        leadershipIndicators: ['Lead Architect'],
        backendStrengths: ['Node.js', 'Express', 'Mongoose'],
        frontendStrengths: ['React', 'Next.js', 'Tailwind CSS'],
        cloudDevOpsStrengths: ['Docker', 'CI/CD'],
        aiAutomationStrengths: ['Gemini', 'LangChain'],
        strongestAchievements: ['Architected scalable monorepo platform'],
        measurableEvidence: ['8+ years experience'],
        preferredRoles: ['Lead Architect', 'Staff Engineer'],
        roleSuitability: ['High alignment for Full-Stack Architect roles'],
        missingOrWeakInfo: ['No cloud certification details'],
        parsingWarnings: [],
        evidenceReferences: [{ claim: '8+ years experience', source: 'profile.professionalInfo' }],
      };
    } else if (request.promptId === 'job-requirement-extraction') {
      mockObject = {
        normalizedTitle: 'Senior Full Stack Engineer',
        company: 'Tech Corp',
        seniority: 'Senior',
        roleFamily: 'Engineering',
        requiredExperienceYears: 5,
        requiredSkills: ['TypeScript', 'React', 'Node.js'],
        preferredSkills: ['MongoDB', 'Docker', 'AWS'],
        responsibilities: ['Develop scalable full-stack features'],
        qualifications: ["Bachelor's degree in Computer Science"],
        educationRequirements: ["Bachelor's degree"],
        domainRequirements: ['Web Application Development'],
        location: 'Remote',
        workMode: 'remote',
        employmentType: 'full_time',
        visaSponsorship: 'Available',
        compensationText: '$150,000 - $180,000',
        importantKeywords: ['TypeScript', 'React', 'Node.js'],
        negativeRequirements: [],
        confidenceScore: 90,
        extractionWarnings: [],
      };
    } else if (request.promptId === 'candidate-job-match') {
      mockObject = {
        overallScore: 88,
        recommendation: 'strong_match',
        categories: {
          requiredSkills: {
            score: 95,
            weight: 0.3,
            weightedScore: 28.5,
            notes: 'Matches all required skills',
          },
          experience: {
            score: 90,
            weight: 0.2,
            weightedScore: 18.0,
            notes: 'Exceeds experience requirement',
          },
          roleTitleAlignment: {
            score: 85,
            weight: 0.15,
            weightedScore: 12.75,
            notes: 'Title aligns well',
          },
          preferredSkills: {
            score: 80,
            weight: 0.1,
            weightedScore: 8.0,
            notes: 'Matches key preferred skills',
          },
          domainAlignment: {
            score: 85,
            weight: 0.1,
            weightedScore: 8.5,
            notes: 'Strong domain alignment',
          },
          projectEvidence: {
            score: 80,
            weight: 0.05,
            weightedScore: 4.0,
            notes: 'Proven project portfolio',
          },
          educationAlignment: {
            score: 80,
            weight: 0.05,
            weightedScore: 4.0,
            notes: 'Meets education background',
          },
          locationWorkPref: {
            score: 100,
            weight: 0.05,
            weightedScore: 5.0,
            notes: 'Remote preference match',
          },
        },
        matchedRequiredSkills: ['TypeScript', 'React', 'Node.js'],
        missingRequiredSkills: [],
        matchedPreferredSkills: ['MongoDB', 'Docker'],
        missingPreferredSkills: ['AWS'],
        transferableSkills: ['Python'],
        strongSupportingExperience: ['8 years in SaaS development'],
        weakEvidenceAreas: [],
        potentialDisqualifiers: [],
        explanation:
          'Candidate strongly aligns with all required technical skills and experience levels.',
        evidenceReferences: [{ claim: 'Matches TypeScript requirement', source: 'profile.skills' }],
      };
    } else if (request.promptId === 'skill-gap-analysis') {
      mockObject = {
        criticalMissingRequirements: [],
        importantMissingSkills: ['AWS'],
        optionalMissingSkills: ['Kubernetes'],
        weaklyEvidencedSkills: ['GraphQL'],
        transferableSkills: ['Docker experience transfers to container deployments'],
        resumeVisibilityGaps: ['Highlight AWS or cloud deployment projects'],
        genuineExperienceGaps: ['Kubernetes cluster management'],
        recommendedResumeImprovements: [
          'Emphasize cloud deployment experience in work bullet points',
        ],
        recommendedPortfolioImprovements: ['Add live demo links to cloud projects'],
        recommendedInterviewPrepTopics: ['Cloud architecture principles'],
      };
    } else if (request.promptId === 'resume-tailoring') {
      mockObject = {
        name: 'Tailored Resume - Tech Corp',
        jobId: 'dummy-job-id',
        proposedSummary:
          'Results-driven Senior Full Stack Engineer specializing in TypeScript, React, and Node.js.',
        proposedSkills: ['TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Docker'],
        proposedExperienceBullets: [
          {
            id: 'change-1',
            section: 'experience',
            transformationType: 'keyword_aligned',
            originalText: 'Built web application using TypeScript and React.',
            proposedText:
              'Architected high-performance web applications leveraging TypeScript, React, and Node.js.',
            reason: 'Emphasize target role keywords TypeScript and React.',
            targetedKeywords: ['TypeScript', 'React', 'Node.js'],
            truthfulnessConfidence: 100,
            sourceReference: 'experience[0]',
            approvalStatus: 'pending',
          },
        ],
        coverLetterOutline:
          'Strong candidate for Senior Full Stack Engineer role with 8+ years experience.',
        estimatedScoreBefore: 75,
        estimatedScoreAfter: 92,
        approvalStatus: 'generated',
      };
    } else {
      mockObject = request.schema.parse({});
    }

    const validated = request.schema.parse(mockObject);

    return {
      data: validated,
      rawText: JSON.stringify(validated),
      provider: 'mock',
      model: 'mock-model-1.0',
      usage: { inputTokens: 100, outputTokens: 100, totalTokens: 200, estimatedCostUsd: 0 },
      durationMs: 10,
    };
  }

  public async generateEmbedding(request: AIEmbeddingRequest): Promise<AIEmbeddingResponse> {
    const dimension = 768;
    const embedding = new Array(dimension).fill(0).map((_, i) => (i % 10) * 0.1);
    return {
      embedding,
      dimension,
      model: request.model || 'mock-embedding-004',
      usage: { inputTokens: 20, outputTokens: 0, totalTokens: 20, estimatedCostUsd: 0 },
    };
  }
}
