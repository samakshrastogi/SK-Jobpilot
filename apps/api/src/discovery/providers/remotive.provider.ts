import { safeFetch } from '../utils/ssrf-guard.js';
import type { DiscoveredRawJob } from './greenhouse.provider.js';

interface RemotiveJob {
  id?: number; url?: string; title?: string; company_name?: string; candidate_required_location?: string;
  job_type?: string; description?: string; publication_date?: string;
}

function employmentType(value: unknown = ''): DiscoveredRawJob['employmentType'] {
  const normalized = String(value).toLowerCase();
  if (normalized.includes('part')) return 'part_time';
  if (normalized.includes('contract') || normalized.includes('temporary')) return 'contract';
  if (normalized.includes('freelance')) return 'freelance';
  if (normalized.includes('intern')) return 'internship';
  return 'full_time';
}

export async function fetchRemotiveJobs(searchTerms: string[]): Promise<DiscoveredRawJob[]> {
  const terms = Array.from(new Set(searchTerms.map((term) => term.trim()).filter(Boolean))).slice(0, 4);
  const query = terms.join(' OR ') || 'software engineer';
  const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=100`;
  const data = JSON.parse(await safeFetch(url)) as { jobs?: RemotiveJob[] };

  return (data.jobs || []).map((job) => ({
    externalSource: 'remotive',
    externalSourceId: String(job.id || job.url || ''),
    jobTitle: job.title || 'Untitled Role',
    companyName: job.company_name || 'Unknown company',
    location: job.candidate_required_location || 'Remote',
    workMode: 'remote' as const,
    employmentType: employmentType(job.job_type),
    description: job.description || job.title || 'Remote job posting',
    sourceUrl: job.url || '',
    applicationUrl: job.url || '',
    postedDate: job.publication_date || new Date().toISOString(),
  })).filter((job) => job.sourceUrl);
}
