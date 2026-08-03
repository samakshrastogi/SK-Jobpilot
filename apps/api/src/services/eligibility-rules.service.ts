export interface EligibilityInput {
  title: string;
  description: string;
  employmentType: string;
  candidateExperienceYears: number;
  candidateSkills: string[];
  excludedSeniorities?: string[];
}

export interface EligibilityResult {
  mandatoryEligibility: number;
  experienceFit: number;
  decision: 'apply' | 'stretch' | 'skip' | 'review';
  hardBlockers: string[];
  softGaps: string[];
  strengths: string[];
}

const DEFAULT_EXCLUDED_SENIORITIES = ['senior', 'lead', 'staff', 'principal', 'architect', 'manager'];
const MUST_EXPERIENCE_PATTERNS = [
  /(?:minimum|at least|must have|requires?|mandatory)\s+(\d+)\+?\s+years?/i,
  /(\d+)\+\s+years?[^.\n]{0,60}(?:required|mandatory|must)/i,
];

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9+#.]+/g, ' ').trim();
}

export function evaluateMandatoryEligibility(input: EligibilityInput): EligibilityResult {
  const title = normalize(input.title);
  const description = input.description.replace(/\s+/g, ' ');
  const hardBlockers: string[] = [];
  const softGaps: string[] = [];
  const normalizedSkills = new Set(input.candidateSkills.map(normalize));
  const excludedSeniorities = input.excludedSeniorities ?? DEFAULT_EXCLUDED_SENIORITIES;

  if (input.employmentType === 'internship' || /\bintern(?:ship)?\b/i.test(title)) {
    hardBlockers.push('Internship roles are excluded by the target profile');
  }
  const excludedSeniority = excludedSeniorities.find((level) => title.split(' ').includes(normalize(level)));
  if (excludedSeniority) {
    hardBlockers.push(`Role seniority "${excludedSeniority}" is excluded by the target profile`);
  }

  let mandatoryYears: number | undefined;
  for (const pattern of MUST_EXPERIENCE_PATTERNS) {
    const match = description.match(pattern);
    if (match) {
      mandatoryYears = Number(match[1]);
      break;
    }
  }
  if (mandatoryYears !== undefined && input.candidateExperienceYears < mandatoryYears) {
    hardBlockers.push(`Job explicitly requires at least ${mandatoryYears} years of experience`);
  }

  for (const match of description.matchAll(/(?:must have|required|mandatory)[:\s]+([A-Za-z][A-Za-z0-9+#. -]{1,40})/gi)) {
    const skill = match[1].split(/[,;.]/)[0].trim();
    if (skill && !normalizedSkills.has(normalize(skill))) {
      softGaps.push(`${skill} is stated as mandatory but is not evidenced in the profile`);
    }
  }

  const normalizedDescription = normalize(description);
  const strengths = input.candidateSkills.filter((skill) => normalizedDescription.includes(normalize(skill)));
  const experienceGap = mandatoryYears === undefined ? 0 : Math.max(0, mandatoryYears - input.candidateExperienceYears);
  const experienceFit = mandatoryYears === undefined ? 100 : Math.max(0, 100 - experienceGap * 30);
  const mandatoryEligibility = hardBlockers.length > 0
    ? Math.max(0, 45 - (hardBlockers.length - 1) * 15)
    : Math.max(50, 100 - softGaps.length * 15);
  const decision = hardBlockers.length > 0 || mandatoryEligibility < 50
    ? 'skip'
    : mandatoryEligibility < 70
      ? 'stretch'
      : 'review';

  return { mandatoryEligibility, experienceFit, decision, hardBlockers, softGaps, strengths };
}
