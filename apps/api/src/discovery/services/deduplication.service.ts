import { JobModel } from '../../models/job.model.js';
import { generateJobFingerprint, canonicalizeUrl } from '@sk-job-pilot/shared';
import type { DiscoveredRawJob } from '../providers/greenhouse.provider.js';

export async function processAndDeduplicateJobs(
  rawJobs: DiscoveredRawJob[],
  sourceId: string,
  discoveryMethod: 'manual' | 'scraper' | 'api' = 'scraper'
): Promise<{ inserted: number; duplicates: number }> {
  let inserted = 0;
  let duplicates = 0;

  for (const raw of rawJobs) {
    const canonicalUrl = canonicalizeUrl(raw.sourceUrl);
    const fingerprint = generateJobFingerprint(raw.companyName, raw.jobTitle);

    // Check duplicate by externalSource + externalSourceId, canonicalUrl, or fingerprint
    const existing = await JobModel.findOne({
      $or: [
        { externalSource: raw.externalSource, externalSourceId: raw.externalSourceId },
        { canonicalUrl: { $exists: true, $eq: canonicalUrl } },
        { fingerprint },
      ],
    });

    if (existing) {
      duplicates++;
      // Update last seen freshness date
      existing.freshnessStatus = 'active';
      if (raw.postedDate) {
        existing.postedDate = new Date(raw.postedDate);
      }
      await existing.save();
    } else {
      inserted++;
      await JobModel.create({
        externalSource: raw.externalSource,
        externalSourceId: raw.externalSourceId,
        sourceUrl: raw.sourceUrl,
        applicationUrl: raw.applicationUrl || raw.sourceUrl,
        companyName: raw.companyName,
        jobTitle: raw.jobTitle,
        location: raw.location,
        workMode: raw.workMode,
        employmentType: raw.employmentType,
        description: raw.description,
        postedDate: raw.postedDate ? new Date(raw.postedDate) : new Date(),
        dateDiscovered: new Date(),
        discoveryMethod,
        processingStatus: 'discovered',
        matchScore: 0,
        savedStatus: false,
        archivedStatus: false,
        freshnessStatus: 'new',
        canonicalUrl,
        fingerprint,
      });
    }
  }

  return { inserted, duplicates };
}
