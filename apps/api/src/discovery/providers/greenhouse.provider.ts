import { safeFetch } from '../utils/ssrf-guard.js';

export interface DiscoveredRawJob {
  externalSource: string;
  externalSourceId: string;
  jobTitle: string;
  companyName: string;
  location: string;
  workMode: 'remote' | 'hybrid' | 'onsite';
  employmentType: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
  description: string;
  sourceUrl: string;
  applicationUrl: string;
  postedDate?: string;
}

export async function fetchGreenhouseJobs(boardId: string, companyName: string): Promise<DiscoveredRawJob[]> {
  const apiUrl = `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(boardId)}/jobs?content=true`;
  const jsonText = await safeFetch(apiUrl);
  const data = JSON.parse(jsonText);

  if (!data || !Array.isArray(data.jobs)) {
    return [];
  }

  return data.jobs.map((j: any) => {
    const isRemote =
      (j.location?.name || '').toLowerCase().includes('remote') ||
      (j.title || '').toLowerCase().includes('remote');

    return {
      externalSource: 'greenhouse',
      externalSourceId: String(j.id),
      jobTitle: j.title || 'Untitled Role',
      companyName,
      location: j.location?.name || (isRemote ? 'Remote' : 'Onsite'),
      workMode: isRemote ? 'remote' : 'onsite',
      employmentType: 'full_time',
      description: j.content || j.title || 'Greenhouse job posting',
      sourceUrl: j.absolute_url || '',
      applicationUrl: j.absolute_url || '',
      postedDate: j.updated_at || new Date().toISOString(),
    };
  });
}
