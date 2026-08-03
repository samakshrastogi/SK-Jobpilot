import { safeFetch } from '../utils/ssrf-guard.js';
import type { DiscoveredRawJob } from './greenhouse.provider.js';

export async function fetchAshbyJobs(boardId: string, companyName: string): Promise<DiscoveredRawJob[]> {
  const apiUrl = `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(boardId)}`;
  const jsonText = await safeFetch(apiUrl);
  const data = JSON.parse(jsonText);

  if (!data || !Array.isArray(data.jobs)) {
    return [];
  }

  return data.jobs.map((j: any) => {
    const isRemote = (j.locationName || '').toLowerCase().includes('remote') || j.isRemote;

    return {
      externalSource: 'ashby',
      externalSourceId: String(j.id),
      jobTitle: j.title || 'Untitled Role',
      companyName,
      location: j.locationName || (isRemote ? 'Remote' : 'Onsite'),
      workMode: isRemote ? 'remote' : 'onsite',
      employmentType: 'full_time',
      description: j.descriptionHtml || j.title || 'Ashby job posting',
      sourceUrl: j.jobUrl || '',
      applicationUrl: j.jobUrl || '',
      postedDate: j.publishedAt || new Date().toISOString(),
    };
  });
}
