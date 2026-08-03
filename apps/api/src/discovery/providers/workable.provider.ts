import { safeFetch } from '../utils/ssrf-guard.js';
import type { DiscoveredRawJob } from './greenhouse.provider.js';

export async function fetchWorkableJobs(accountId: string, companyName: string): Promise<DiscoveredRawJob[]> {
  const apiUrl = `https://apply.workable.com/api/v1/widget/accounts/${encodeURIComponent(accountId)}`;
  const jsonText = await safeFetch(apiUrl);
  const data = JSON.parse(jsonText);

  if (!data || !Array.isArray(data.jobs)) {
    return [];
  }

  return data.jobs.map((j: any) => {
    const isRemote = (j.location?.telecommute || false) || (j.title || '').toLowerCase().includes('remote');

    return {
      externalSource: 'workable',
      externalSourceId: String(j.shortcode || j.id),
      jobTitle: j.title || 'Untitled Role',
      companyName,
      location: j.location?.city ? `${j.location.city}, ${j.location.country}` : 'Remote',
      workMode: isRemote ? 'remote' : 'onsite',
      employmentType: 'full_time',
      description: j.description || j.title || 'Workable job posting',
      sourceUrl: j.url || '',
      applicationUrl: j.url || '',
      postedDate: j.published_on || new Date().toISOString(),
    };
  });
}
