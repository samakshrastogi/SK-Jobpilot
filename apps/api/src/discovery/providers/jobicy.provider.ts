import { safeFetch } from '../utils/ssrf-guard.js';
import type { DiscoveredRawJob } from './greenhouse.provider.js';

interface JobicyJob {
  id?: string | number; url?: string; jobTitle?: string; companyName?: string; jobGeo?: string;
  jobType?: string; jobDescription?: string; jobExcerpt?: string; pubDate?: string;
}

function employmentType(value: unknown = ''): DiscoveredRawJob['employmentType'] {
  const normalized = String(value).toLowerCase();
  if (normalized.includes('part')) return 'part_time';
  if (normalized.includes('contract')) return 'contract';
  if (normalized.includes('freelance')) return 'freelance';
  if (normalized.includes('intern')) return 'internship';
  return 'full_time';
}

export async function fetchJobicyJobs(searchTerms: string[]): Promise<DiscoveredRawJob[]> {
  const terms = Array.from(new Set(searchTerms.map((term) => term.trim()).filter(Boolean))).slice(0, 6);
  const queries = terms.length ? terms : ['software engineer'];
  const responses = await Promise.all(queries.map(async (term) => {
    const url = `https://jobicy.com/api/v2/remote-jobs?count=100&tag=${encodeURIComponent(term)}`;
    const data = JSON.parse(await safeFetch(url)) as { jobs?: JobicyJob[] };
    return data.jobs || [];
  }));

  return responses.flat().map((job) => ({
    externalSource: 'jobicy',
    externalSourceId: String(job.id || job.url || ''),
    jobTitle: job.jobTitle || 'Untitled Role',
    companyName: job.companyName || 'Unknown company',
    location: job.jobGeo || 'Remote',
    workMode: 'remote' as const,
    employmentType: employmentType(job.jobType),
    description: job.jobDescription || job.jobExcerpt || job.jobTitle || 'Remote job posting',
    sourceUrl: job.url || '',
    applicationUrl: job.url || '',
    postedDate: job.pubDate || new Date().toISOString(),
  })).filter((job) => job.sourceUrl);
}
