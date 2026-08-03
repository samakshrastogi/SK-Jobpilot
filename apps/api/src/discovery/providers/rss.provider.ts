import Parser from 'rss-parser';
import { safeFetch } from '../utils/ssrf-guard.js';
import type { DiscoveredRawJob } from './greenhouse.provider.js';

const rssParser = new Parser();

export async function fetchRssJobs(rssUrl: string, companyName: string): Promise<DiscoveredRawJob[]> {
  const xmlText = await safeFetch(rssUrl);
  const feed = await rssParser.parseString(xmlText);

  if (!feed || !Array.isArray(feed.items)) {
    return [];
  }

  return feed.items.map((item, idx) => {
    const isRemote = (item.title || '').toLowerCase().includes('remote') || (item.contentSnippet || '').toLowerCase().includes('remote');

    return {
      externalSource: 'rss',
      externalSourceId: item.guid || item.link || `rss-${idx}`,
      jobTitle: item.title || 'Untitled Role',
      companyName: companyName || feed.title || 'RSS Feed Listing',
      location: isRemote ? 'Remote' : 'Onsite',
      workMode: isRemote ? 'remote' : 'onsite',
      employmentType: 'full_time',
      description: item.contentSnippet || item.content || item.title || '',
      sourceUrl: item.link || rssUrl,
      applicationUrl: item.link || rssUrl,
      postedDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
    };
  });
}
