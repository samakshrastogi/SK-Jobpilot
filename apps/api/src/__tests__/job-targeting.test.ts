import { describe, expect, it } from 'vitest';
import {
  filterJobsForCandidateTargeting,
  getCandidateIndiaLocations,
  isIndiaCompatibleJob,
} from '../discovery/services/job-targeting.service.js';
import type { DiscoveredRawJob } from '../discovery/providers/greenhouse.provider.js';
import type { ICandidateProfileDocument } from '../models/candidate-profile.model.js';
import type { ITargetRoleDocument } from '../models/target-role.model.js';

const profile = {
  personalInfo: { location: 'Gurugram, India' },
  professionalInfo: { preferredLocations: ['Noida', 'Bengaluru', 'Remote India'] },
  jobPreferences: { relocationCountries: ['India'] },
} as unknown as ICandidateProfileDocument;

const backendRole = {
  primaryTitle: 'Backend Developer',
  searchAliases: ['Node.js Developer', 'Software Engineer'],
  excludedKeywords: ['Senior', 'Lead', 'Manager'],
} as unknown as ITargetRoleDocument;

function job(overrides: Partial<DiscoveredRawJob>): DiscoveredRawJob {
  return {
    externalSource: 'remotive',
    externalSourceId: overrides.externalSourceId || overrides.sourceUrl || 'job-1',
    jobTitle: 'Backend Developer',
    companyName: 'Acme',
    location: 'Remote India',
    workMode: 'remote',
    employmentType: 'full_time',
    description: 'Build Node.js APIs with TypeScript and MongoDB.',
    sourceUrl: 'https://example.com/job-1',
    applicationUrl: 'https://example.com/job-1/apply',
    postedDate: new Date().toISOString(),
    ...overrides,
  };
}

describe('candidate job targeting filters', () => {
  it('keeps India locations from the candidate profile and defaults', () => {
    expect(getCandidateIndiaLocations(profile)).toEqual(expect.arrayContaining(['Gurugram, India', 'Noida', 'Bengaluru', 'India']));
    expect(isIndiaCompatibleJob(job({ location: 'Bengaluru, Karnataka' }), profile)).toBe(true);
    expect(isIndiaCompatibleJob(job({ location: 'Remote - India only' }), profile)).toBe(true);
  });

  it('rejects roles constrained to non-India or broad remote regions', () => {
    expect(isIndiaCompatibleJob(job({ location: 'Remote - United States only' }), profile)).toBe(false);
    expect(isIndiaCompatibleJob(job({ location: 'Remote - Europe / EMEA' }), profile)).toBe(false);
    expect(isIndiaCompatibleJob(job({ location: 'Remote - LATAM' }), profile)).toBe(false);
    expect(isIndiaCompatibleJob(job({ location: 'Anywhere' }), profile)).toBe(false);
    expect(isIndiaCompatibleJob(job({ location: 'Worldwide' }), profile)).toBe(false);
    expect(isIndiaCompatibleJob(job({ location: 'APAC, UAE' }), profile)).toBe(false);
    expect(isIndiaCompatibleJob(job({ location: 'Remote' }), profile)).toBe(true);
  });

  it('filters by location, selected role, and early-career seniority before saving jobs', () => {
    const result = filterJobsForCandidateTargeting([
      job({ externalSourceId: 'keep', jobTitle: 'Node.js Developer', location: 'Noida, India' }),
      job({ externalSourceId: 'us', location: 'Remote - United States only' }),
      job({ externalSourceId: 'sales', jobTitle: 'Sales Executive', location: 'Gurugram, India' }),
      job({ externalSourceId: 'senior', jobTitle: 'Senior Backend Developer', location: 'Pune, India' }),
    ], { profile, roles: [backendRole] });

    expect(result.jobs.map((item) => item.externalSourceId)).toEqual(['keep']);
    expect(result.rejected).toBe(3);
    expect(result.reasons).toMatchObject({ location: 1, role: 1, seniority: 1 });
  });
});