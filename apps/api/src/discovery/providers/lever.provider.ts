import { safeFetch } from '../utils/ssrf-guard.js';
import type { DiscoveredRawJob } from './greenhouse.provider.js';

export async function fetchLeverJobs(companyId: string, companyName: string): Promise<DiscoveredRawJob[]> {
  const apiUrl = `https://api.lever.co/v0/postings/${encodeURIComponent(companyId)}?mode=json`;
  const jsonText = await safeFetch(apiUrl);
  const data = JSON.parse(jsonText);

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((j: any) => {
    const isRemote =
      (j.categories?.location || '').toLowerCase().includes('remote') ||
      (j.workplaceType || '').toLowerCase().includes('remote');

    return {
      externalSource: 'lever',
      externalSourceId: String(j.id),
      jobTitle: j.text || 'Untitled Role',
      companyName,
      location: j.categories?.location || (isRemote ? 'Remote' : 'Onsite'),
      workMode: isRemote ? 'remote' : 'onsite',
      employmentType: 'full_time',
      description: j.descriptionPlain || j.text || 'Lever job posting',
      sourceUrl: j.hostedUrl || j.applyUrl || '',
      applicationUrl: j.applyUrl || j.hostedUrl || '',
      postedDate: j.createdAt ? new Date(j.createdAt).toISOString() : new Date().toISOString(),
    };
  });
}
