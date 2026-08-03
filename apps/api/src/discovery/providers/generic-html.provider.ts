import * as cheerio from 'cheerio';
import { safeFetch } from '../utils/ssrf-guard.js';
import type { DiscoveredRawJob } from './greenhouse.provider.js';

export async function fetchGenericHtmlJob(targetUrl: string, companyName: string): Promise<DiscoveredRawJob[]> {
  const html = await safeFetch(targetUrl);
  const $ = cheerio.load(html);

  // 1. Try parsing JSON-LD JobPosting schema
  let jsonLdJob: DiscoveredRawJob | null = null;

  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      const parsed = JSON.parse($(element).html() || '{}');
      const item = Array.isArray(parsed) ? parsed.find((p) => p['@type'] === 'JobPosting') : parsed;

      if (item && item['@type'] === 'JobPosting') {
        jsonLdJob = {
          externalSource: 'generic_html',
          externalSourceId: item.identifier?.value || targetUrl,
          jobTitle: item.title || $('title').text().trim() || 'Job Opportunity',
          companyName: item.hiringOrganization?.name || companyName || 'Company',
          location: item.jobLocation?.address?.addressLocality || 'Remote',
          workMode: (item.jobLocationType || '').toLowerCase().includes('telecommute') ? 'remote' : 'onsite',
          employmentType: 'full_time',
          description: item.description || $('body').text().substring(0, 1000),
          sourceUrl: targetUrl,
          applicationUrl: item.directApply ? targetUrl : targetUrl,
          postedDate: item.datePosted || new Date().toISOString(),
        };
      }
    } catch {
      // Ignore JSON parse errors
    }
  });

  if (jsonLdJob) {
    return [jsonLdJob];
  }

  // 2. Fallback to HTML meta tags & content container extraction
  const title = $('h1').first().text().trim() || $('title').text().trim() || 'Job Listing';
  const metaDescription = $('meta[name="description"]').attr('content') || $('body').text().substring(0, 800);

  return [
    {
      externalSource: 'generic_html',
      externalSourceId: targetUrl,
      jobTitle: title,
      companyName: companyName || 'Company',
      location: 'Remote',
      workMode: 'remote',
      employmentType: 'full_time',
      description: metaDescription,
      sourceUrl: targetUrl,
      applicationUrl: targetUrl,
      postedDate: new Date().toISOString(),
    },
  ];
}
