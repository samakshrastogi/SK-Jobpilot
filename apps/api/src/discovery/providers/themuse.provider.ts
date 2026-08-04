import { safeFetch } from '../utils/ssrf-guard.js';
import type { DiscoveredRawJob } from './greenhouse.provider.js';

interface MuseJob {
  id?: number;
  name?: string;
  contents?: string;
  publication_date?: string;
  refs?: { landing_page?: string };
  company?: { name?: string };
  locations?: Array<{ name?: string }>;
  levels?: Array<{ name?: string }>;
  categories?: Array<{ name?: string }>;
  type?: string;
}

function employmentType(value: unknown = ''): DiscoveredRawJob['employmentType'] {
  const normalized = String(value).toLowerCase();
  if (normalized.includes('part')) return 'part_time';
  if (normalized.includes('contract') || normalized.includes('temporary')) return 'contract';
  if (normalized.includes('freelance')) return 'freelance';
  if (normalized.includes('intern')) return 'internship';
  return 'full_time';
}

function workMode(location: string): DiscoveredRawJob['workMode'] {
  const normalized = location.toLowerCase();
  if (normalized.includes('remote') && /india|bangalore|bengaluru|chennai|hyderabad|pune|mumbai|noida|gurugram|gurgaon|delhi/.test(normalized)) return 'remote';
  if (normalized.includes('remote')) return 'remote';
  return 'onsite';
}

export async function fetchMuseJobs(searchTerms: string[]): Promise<DiscoveredRawJob[]> {
  const terms = Array.from(new Set(searchTerms.map((term) => term.trim()).filter(Boolean))).slice(0, 4);
  const queries = terms.length ? terms : ['software engineer'];
  const responses = await Promise.all(queries.flatMap((term) => [1, 2].map(async (page) => {
    const url = `https://www.themuse.com/api/public/jobs?page=${page}&category=Software%20Engineering&location=India&search=${encodeURIComponent(term)}`;
    const data = JSON.parse(await safeFetch(url)) as { results?: MuseJob[] };
    return data.results || [];
  })));

  return responses.flat().map((job) => {
    const location = (job.locations || []).map((item) => item.name).filter(Boolean).join(', ') || 'Remote';
    const sourceUrl = job.refs?.landing_page || '';
    return {
      externalSource: 'themuse',
      externalSourceId: String(job.id || sourceUrl),
      jobTitle: job.name || 'Untitled Role',
      companyName: job.company?.name || 'Unknown company',
      location,
      workMode: workMode(location),
      employmentType: employmentType(job.type || job.levels?.[0]?.name),
      description: job.contents || job.name || 'Job posting from The Muse',
      sourceUrl,
      applicationUrl: sourceUrl,
      postedDate: job.publication_date || new Date().toISOString(),
    } satisfies DiscoveredRawJob;
  }).filter((job) => job.sourceUrl);
}