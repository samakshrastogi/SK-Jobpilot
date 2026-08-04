import type { Request, Response } from 'express';
import { DiscoverySourceModel } from '../models/discovery-source.model.js';
import { DiscoveryRunModel } from '../models/discovery-run.model.js';
import { executeDiscoveryRun } from '../discovery/services/scheduler.service.js';
import { ensureDefaultDiscoverySources } from '../discovery/services/default-sources.service.js';
import { sseActivityManager } from '../discovery/services/sse-activity.service.js';
import { browserCaptureBatchSchema, createDiscoverySourceSchema } from '@sk-job-pilot/shared';
import { processAndDeduplicateJobs } from '../discovery/services/deduplication.service.js';
import type { DiscoveredRawJob } from '../discovery/providers/greenhouse.provider.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

function getParamId(req: Request): string {
  const param = req.params.id;
  return Array.isArray(param) ? param[0] : param;
}

export async function fetchDiscoverySources(req: Request, res: Response): Promise<void> {
  await ensureDefaultDiscoverySources();
  const sources = await DiscoverySourceModel.find().sort({ createdAt: -1 });
  sendSuccess(res, sources, 'Discovery sources retrieved successfully', 200, req);
}

export async function createDiscoverySource(req: Request, res: Response): Promise<void> {
  const validated = createDiscoverySourceSchema.parse(req.body);
  const source = await DiscoverySourceModel.create(validated);
  sendSuccess(res, source.toJSON(), 'Discovery source created successfully', 201, req);
}

export async function runDiscoverySource(req: Request, res: Response): Promise<void> {
  const id = getParamId(req);
  const result = await executeDiscoveryRun(id, 'manual');
  sendSuccess(res, result, 'Discovery run started successfully', 200, req);
}

export async function fetchDiscoveryRuns(req: Request, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const skip = (page - 1) * limit;

  const totalItems = await DiscoveryRunModel.countDocuments();
  const runs = await DiscoveryRunModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('sourceId');

  sendPaginated(
    res,
    runs,
    {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit) || 1,
      hasNextPage: page * limit < totalItems,
      hasPrevPage: page > 1,
    },
    'Discovery runs retrieved successfully',
    req
  );
}

export async function streamActivityEvents(req: Request, res: Response): Promise<void> {
  const clientId = `sse-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  sseActivityManager.addClient(clientId, res);
}

export async function captureBrowserJobs(req: Request, res: Response): Promise<void> {
  const { jobs } = browserCaptureBatchSchema.parse(req.body);
  const rawJobs: DiscoveredRawJob[] = jobs.map((job) => ({
    externalSource: job.platform,
    externalSourceId: job.sourceJobId || job.sourceUrl,
    jobTitle: job.title,
    companyName: job.company,
    location: job.location || 'Not specified',
    workMode: job.workMode,
    employmentType: job.employmentType,
    description: job.description,
    sourceUrl: job.sourceUrl,
    applicationUrl: job.applyUrl || job.sourceUrl,
    postedDate: job.postedDate,
  }));
  const result = await processAndDeduplicateJobs(rawJobs, 'browser-capture', 'api');
  sendSuccess(res, { received: jobs.length, ...result }, 'Browser jobs captured successfully', 201, req);
}
