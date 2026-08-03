import {
  candidateAnalysisSchema,
  jobAnalysisSchema,
  jobMatchSchema,
  skillGapAnalysisSchema,
  tailoredResumeSchema,
} from '@sk-job-pilot/shared';

export interface PromptDefinition<T> {
  id: string;
  version: string;
  purpose: string;
  schema: unknown;
  systemInstruction: string;
  buildPrompt: (input: unknown) => string;
}

export const PROMPT_REGISTRY = {
  candidateProfileAnalysis: {
    id: 'candidate-profile-analysis',
    version: '1.0',
    purpose:
      'Normalize candidate profile and master resume into structured intelligence without inventing data.',
    schema: candidateAnalysisSchema,
    systemInstruction: `You are an expert AI Career & Candidate Intelligence Analyst.
Analyze the candidate profile and raw resume text provided.
Rule 1: Extract ONLY truthful facts present in the text. Do NOT fabricate skills, metrics, employers, or dates.
Rule 2: Provide clear evidence references for extracted claims.
Rule 3: Output structured JSON matching the requested schema exactly.`,
    buildPrompt: (input: { profile: unknown; rawResumeText: string }) => `
CANDIDATE PROFILE DATA:
${JSON.stringify(input.profile, null, 2)}

RAW RESUME TEXT:
${input.rawResumeText || 'No raw resume text provided.'}

Extract a complete Candidate Analysis JSON.
`,
  },

  jobRequirementExtraction: {
    id: 'job-requirement-extraction',
    version: '1.0',
    purpose:
      'Extract structured job requirements, skills, experience, and negative constraints from job description.',
    schema: jobAnalysisSchema,
    systemInstruction: `You are a Technical Recruiting Intelligence Specialist.
Analyze the job posting description and extract structured requirements.
Rule 1: Separate hard required skills from optional preferred skills.
Rule 2: Identify negative requirements or disqualifiers.
Rule 3: Output structured JSON matching the requested schema.`,
    buildPrompt: (input: { jobTitle: string; companyName: string; description: string }) => `
JOB TITLE: ${input.jobTitle}
COMPANY: ${input.companyName}
JOB DESCRIPTION:
${input.description}

Extract structured Job Requirement Analysis JSON.
`,
  },

  candidateJobMatch: {
    id: 'candidate-job-match',
    version: '1.0',
    purpose: 'Evaluate alignment between candidate intelligence profile and job requirements.',
    schema: jobMatchSchema,
    systemInstruction: `You are an Executive AI Job Matching & Talent Alignment Analyst.
Compare the Candidate Analysis against the Job Requirements Analysis.
Rule 1: Evaluate required skills, experience years, title alignment, and domain experience.
Rule 2: Calculate category scores (0-100) and provide evidence references.
Rule 3: Provide a fair human-readable explanation of why this candidate is a good or weak match.`,
    buildPrompt: (input: { candidateAnalysis: unknown; jobAnalysis: unknown }) => `
CANDIDATE ANALYSIS:
${JSON.stringify(input.candidateAnalysis, null, 2)}

JOB REQUIREMENTS:
${JSON.stringify(input.jobAnalysis, null, 2)}

Produce a structured Job Match Evaluation JSON.
`,
  },

  skillGapAnalysis: {
    id: 'skill-gap-analysis',
    version: '1.0',
    purpose: 'Distinguish between resume visibility gaps versus genuine experience gaps.',
    schema: skillGapAnalysisSchema,
    systemInstruction: `You are an AI Career Development Coach.
Analyze the gaps between Candidate Experience and Job Requirements.
Rule 1: Distinguish between "Resume Visibility Gap" (candidate has skill elsewhere, but not highlighted) vs "Genuine Experience Gap".
Rule 2: Never suggest claiming a skill the candidate does not possess.
Rule 3: Output structured JSON matching the requested schema.`,
    buildPrompt: (input: { candidateAnalysis: unknown; jobAnalysis: unknown }) => `
CANDIDATE ANALYSIS:
${JSON.stringify(input.candidateAnalysis, null, 2)}

JOB REQUIREMENTS:
${JSON.stringify(input.jobAnalysis, null, 2)}

Extract structured Skill Gap Analysis JSON.
`,
  },

  resumeTailoring: {
    id: 'resume-tailoring',
    version: '1.0',
    purpose:
      'Propose targeted resume summary adjustments and bullet point rewrites for a target job role.',
    schema: tailoredResumeSchema,
    systemInstruction: `You are a Master Resume Tailoring Strategist.
Your goal is to tailor the candidate's existing resume bullet points to emphasize keywords relevant to the target job description.

STRICT TRUTHFULNESS & SAFETY MANDATES:
1. DO NOT fabricate any work experience, metrics, dates, employers, or tools.
2. DO NOT invent skills absent from the candidate's master profile/resume.
3. Keep the original factual meaning of all bullets intact.
4. For every proposed bullet rewrite, provide transformationType, originalText, proposedText, reason, targetedKeywords, and sourceReference.
5. If no truthful optimization is possible for a bullet, set transformationType: "unchanged" and keep original text.`,
    buildPrompt: (input: {
      candidateProfile: unknown;
      rawResumeText: string;
      jobDescription: string;
      targetTitle: string;
      companyName: string;
    }) => `
TARGET ROLE: ${input.targetTitle} at ${input.companyName}

TARGET JOB DESCRIPTION:
${input.jobDescription}

CANDIDATE PROFILE:
${JSON.stringify(input.candidateProfile, null, 2)}

ORIGINAL RESUME TEXT:
${input.rawResumeText}

Generate a proposed Tailored Resume JSON.
`,
  },
};
