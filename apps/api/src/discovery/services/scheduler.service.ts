import { DiscoverySourceModel } from '../../models/discovery-source.model.js';
import { DiscoveryRunModel } from '../../models/discovery-run.model.js';
import { fetchGreenhouseJobs } from '../providers/greenhouse.provider.js';
import { fetchLeverJobs } from '../providers/lever.provider.js';
import { fetchAshbyJobs } from '../providers/ashby.provider.js';
import { fetchWorkableJobs } from '../providers/workable.provider.js';
import { fetchJobicyJobs } from '../providers/jobicy.provider.js';
import { fetchRemotiveJobs } from '../providers/remotive.provider.js';
import { fetchRssJobs } from '../providers/rss.provider.js';
import { fetchGenericHtmlJob } from '../providers/generic-html.provider.js';
import { processAndDeduplicateJobs } from './deduplication.service.js';
import { sseActivityManager } from './sse-activity.service.js';
import { logger } from '../../utils/logger.js';
import { AppError } from '../../errors/app-error.js';
import mongoose from 'mongoose';
import { TargetRoleModel } from '../../models/target-role.model.js';

export async function executeDiscoveryRun(sourceId: string, trigger: 'manual' | 'scheduled' = 'manual') {
  if (!mongoose.Types.ObjectId.isValid(sourceId)) {
    throw AppError.badRequest('Invalid source ID format');
  }

  const source = await DiscoverySourceModel.findById(sourceId);
  if (!source) {
    throw AppError.notFound('Discovery source not found');
  }

  const startTime = Date.now();

  const runDoc = await DiscoveryRunModel.create({
    sourceId: source._id,
    providerType: source.providerType,
    trigger,
    status: 'running',
    jobsDiscovered: 0,
    jobsInserted: 0,
    duplicatesFound: 0,
  });

  sseActivityManager.broadcastEvent({
    type: 'discovery_run_started',
    payload: { sourceName: source.name, providerType: source.providerType },
  });

  try {
    let rawJobs: any[] = [];
    const roles = await TargetRoleModel.find({ active: true }).select('primaryTitle searchAliases').lean();
    const searchTerms = roles.flatMap((role) => [role.primaryTitle, ...(role.searchAliases || [])]);

    switch (source.providerType) {
      case 'greenhouse':
        rawJobs = await fetchGreenhouseJobs(source.boardId || source.careersUrl, source.companyName);
        break;
      case 'lever':
        rawJobs = await fetchLeverJobs(source.boardId || source.careersUrl, source.companyName);
        break;
      case 'ashby':
        rawJobs = await fetchAshbyJobs(source.boardId || source.careersUrl, source.companyName);
        break;
      case 'workable':
        rawJobs = await fetchWorkableJobs(source.boardId || source.careersUrl, source.companyName);
        break;
      case 'jobicy':
        rawJobs = await fetchJobicyJobs(searchTerms);
        break;
      case 'remotive':
        rawJobs = await fetchRemotiveJobs(searchTerms);
        break;
      case 'rss':
        rawJobs = await fetchRssJobs(source.careersUrl, source.companyName);
        break;
      case 'generic_html':
        rawJobs = await fetchGenericHtmlJob(source.careersUrl, source.companyName);
        break;
      default:
        rawJobs = [];
    }

    const { inserted, duplicates } = await processAndDeduplicateJobs(rawJobs, sourceId);

    const durationMs = Date.now() - startTime;
    runDoc.status = 'completed';
    runDoc.jobsDiscovered = rawJobs.length;
    runDoc.jobsInserted = inserted;
    runDoc.duplicatesFound = duplicates;
    runDoc.durationMs = durationMs;
    await runDoc.save();

    source.lastRunAt = new Date();
    source.lastRunStatus = 'success';
    await source.save();

    sseActivityManager.broadcastEvent({
      type: 'discovery_run_completed',
      payload: { sourceName: source.name, inserted, duplicates, total: rawJobs.length },
    });

    return runDoc.toJSON();
  } catch (err: unknown) {
    const safeMsg = (err as Error).message || String(err);
    runDoc.status = 'failed';
    runDoc.errorMessage = safeMsg;
    runDoc.durationMs = Date.now() - startTime;
    await runDoc.save();

    source.lastRunAt = new Date();
    source.lastRunStatus = 'failure';
    await source.save();

    logger.error({ error: safeMsg, sourceId }, 'Discovery run failed.');

    sseActivityManager.broadcastEvent({
      type: 'discovery_run_failed',
      payload: { sourceName: source.name, error: safeMsg },
    });

    throw err;
  }
}
