import type { DiscoveredRawJob } from '../providers/greenhouse.provider.js';
import type { ICandidateProfileDocument } from '../../models/candidate-profile.model.js';
import type { ITargetRoleDocument } from '../../models/target-role.model.js';

export const DEFAULT_INDIA_LOCATIONS = [
  'India',
  'Remote India',
  'Gurugram',
  'Gurgaon',
  'Delhi NCR',
  'Noida',
  'Bengaluru',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Mumbai',
];

const INDIA_LOCATION_TOKENS = [
  'india',
  'remote india',
  'gurugram',
  'gurgaon',
  'delhi',
  'delhi ncr',
  'ncr',
  'noida',
  'bengaluru',
  'bangalore',
  'hyderabad',
  'pune',
  'chennai',
  'mumbai',
  'kolkata',
  'ahmedabad',
  'jaipur',
  'indore',
  'kochi',
  'cochin',
  'trivandrum',
  'thiruvananthapuram',
  'chandigarh',
];

const OUT_OF_INDIA_REGION_TOKENS = [
  'united states',
  'usa',
  'u.s.',
  'canada',
  'latin america',
  'latam',
  'europe',
  'emea',
  'united kingdom',
  'uk',
  'germany',
  'france',
  'netherlands',
  'australia',
  'new zealand',
  'africa',
];

const DEFAULT_EARLY_CAREER_EXCLUDED_TITLES = [
  'senior',
  'sr.',
  'lead',
  'staff',
  'principal',
  'architect',
  'manager',
  'director',
  'head of',
];

const ROLE_SYNONYMS: Record<string, string[]> = {
  backend: ['backend', 'back end', 'back-end', 'node', 'api', 'server', 'express'],
  frontend: ['frontend', 'front end', 'front-end', 'react', 'ui', 'web'],
  fullstack: ['full stack', 'full-stack', 'fullstack', 'mern', 'react node'],
  software: ['software engineer', 'software developer', 'sde'],
  ai: ['ai', 'automation', 'agent', 'langchain', 'rag'],
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9+#.]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function includesAny(value: string, tokens: string[]): boolean {
  const normalized = normalize(value);
  return tokens.some((token) => normalized.includes(normalize(token)));
}

function roleTokens(role: ITargetRoleDocument): string[] {
  const values = [role.primaryTitle, ...(role.searchAliases || [])].filter(Boolean);
  const expanded = values.flatMap((value) => {
    const normalized = normalize(value);
    const synonyms = Object.entries(ROLE_SYNONYMS)
      .filter(([key]) => normalized.includes(key))
      .flatMap(([, items]) => items);
    return [value, ...synonyms];
  });
  return Array.from(new Set(expanded.map(normalize).filter(Boolean)));
}

export function getCandidateIndiaLocations(profile: ICandidateProfileDocument | null): string[] {
  const profileLocations = [
    profile?.personalInfo?.location || '',
    ...((profile?.professionalInfo?.preferredLocations as string[] | undefined) || []),
    ...(((profile?.jobPreferences?.relocationCountries as string[] | undefined) || []).filter((value) => /india/i.test(value))),
  ];
  return Array.from(new Set([...profileLocations, ...DEFAULT_INDIA_LOCATIONS].map((value) => value.trim()).filter(Boolean)));
}

export function isIndiaCompatibleJob(job: DiscoveredRawJob, profile: ICandidateProfileDocument | null): boolean {
  const locationText = `${job.location || ''} ${job.description || ''}`.slice(0, 1500);
  const preferredLocationTokens = getCandidateIndiaLocations(profile);
  const hasIndiaSignal = includesAny(locationText, [...INDIA_LOCATION_TOKENS, ...preferredLocationTokens]);
  if (hasIndiaSignal) return true;

  const hasOutOfIndiaRegion = includesAny(job.location || '', OUT_OF_INDIA_REGION_TOKENS);
  if (hasOutOfIndiaRegion) return false;

  const normalizedLocation = normalize(job.location || '');
  const isPlainRemote = !normalizedLocation || normalizedLocation === 'remote';
  return job.workMode === 'remote' && isPlainRemote;
}

export function isRoleCompatibleJob(job: DiscoveredRawJob, roles: ITargetRoleDocument[]): boolean {
  if (!roles.length) return true;
  const title = normalize(job.jobTitle);
  return roles.some((role) => roleTokens(role).some((token) => token.length > 2 && title.includes(token)));
}

export function isSeniorityCompatibleJob(job: DiscoveredRawJob, roles: ITargetRoleDocument[]): boolean {
  const title = normalize(job.jobTitle);
  const selectedSeniorTerms = roles.flatMap((role) => [role.primaryTitle, ...(role.searchAliases || [])]).filter((value) => includesAny(value, DEFAULT_EARLY_CAREER_EXCLUDED_TITLES));
  if (selectedSeniorTerms.length > 0) return true;

  const roleSpecificExcluded = roles.flatMap((role) => role.excludedKeywords || []);
  const excluded = Array.from(new Set([...DEFAULT_EARLY_CAREER_EXCLUDED_TITLES, ...roleSpecificExcluded]));
  return !includesAny(title, excluded);
}

export function filterJobsForCandidateTargeting(
  rawJobs: DiscoveredRawJob[],
  context: {
    profile: ICandidateProfileDocument | null;
    roles: ITargetRoleDocument[];
  }
): { jobs: DiscoveredRawJob[]; rejected: number; reasons: Record<string, number> } {
  const reasons: Record<string, number> = {};
  const jobs = rawJobs.filter((job) => {
    if (!isIndiaCompatibleJob(job, context.profile)) {
      reasons.location = (reasons.location || 0) + 1;
      return false;
    }
    if (!isRoleCompatibleJob(job, context.roles)) {
      reasons.role = (reasons.role || 0) + 1;
      return false;
    }
    if (!isSeniorityCompatibleJob(job, context.roles)) {
      reasons.seniority = (reasons.seniority || 0) + 1;
      return false;
    }
    return true;
  });

  return {
    jobs,
    rejected: rawJobs.length - jobs.length,
    reasons,
  };
}