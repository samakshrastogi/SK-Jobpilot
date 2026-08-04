import type { Request, Response } from 'express';
import { JobModel } from '../models/job.model.js';
import { createJobSchema, updateJobSchema, jobFilterQuerySchema } from '@sk-job-pilot/shared';
import { canonicalizeUrl, generateJobFingerprint } from '@sk-job-pilot/shared';
import { AppError } from '../errors/app-error.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

export async function createJob(req: Request, res: Response): Promise<void> {
  const validated = createJobSchema.parse(req.body);

  const canonicalUrl = validated.sourceUrl ? canonicalizeUrl(validated.sourceUrl) : undefined;
  const fingerprint = generateJobFingerprint(
    validated.companyName,
    validated.jobTitle,
    validated.location
  );

  // Duplicate Detection
  if (canonicalUrl) {
    const existingUrl = await JobModel.findOne({ canonicalUrl });
    if (existingUrl) {
      sendSuccess(res, existingUrl, 'Duplicate job detected by canonical URL', 200, req);
      return;
    }
  }

  if (validated.externalSourceId && validated.externalSource) {
    const existingExt = await JobModel.findOne({
      externalSource: validated.externalSource,
      externalSourceId: validated.externalSourceId,
    });
    if (existingExt) {
      sendSuccess(res, existingExt, 'Duplicate job detected by external source ID', 200, req);
      return;
    }
  }

  const existingFingerprint = await JobModel.findOne({ fingerprint });
  if (existingFingerprint) {
    sendSuccess(
      res,
      existingFingerprint,
      'Duplicate job detected by company and title fingerprint',
      200,
      req
    );
    return;
  }

  const job = await JobModel.create({
    ...validated,
    canonicalUrl,
    fingerprint,
    postedDate: validated.postedDate ? new Date(validated.postedDate) : new Date(),
    expiryDate: validated.expiryDate ? new Date(validated.expiryDate) : undefined,
  });

  sendSuccess(res, job, 'Job created successfully', 201, req);
}

export async function getJobs(req: Request, res: Response): Promise<void> {
  const query = jobFilterQuerySchema.parse(req.query);

  const filter: Record<string, unknown> = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.company) {
    filter.companyName = new RegExp(query.company, 'i');
  }

  if (query.location) {
    filter.location = new RegExp(query.location, 'i');
  }

  if (query.workMode) {
    filter.workMode = query.workMode;
  }

  if (query.employmentType) {
    filter.employmentType = query.employmentType;
  }

  if (query.minMatchScore !== undefined && query.minMatchScore > 0) {
    filter.matchScore = { $gte: query.minMatchScore };
  }

  if (query.savedOnly !== undefined) {
    filter.savedStatus = query.savedOnly;
  }

  filter.archivedStatus = query.archivedOnly === true;

  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const sortField = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  const sort: Record<string, 1 | -1> = { [sortField]: sortOrder };

  const totalItems = await JobModel.countDocuments(filter);
  const jobs = await JobModel.find(filter).sort(sort).skip(skip).limit(limit);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  sendPaginated(
    res,
    jobs,
    {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    'Jobs retrieved successfully',
    req
  );
}

export async function getJobById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const job = await JobModel.findById(id);
  if (!job) {
    throw AppError.notFound('Job not found');
  }
  sendSuccess(res, job, 'Job retrieved successfully', 200, req);
}

export async function updateJob(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const validated = updateJobSchema.parse(req.body);

  const job = await JobModel.findById(id);
  if (!job) {
    throw AppError.notFound('Job not found');
  }

  Object.assign(job, validated);
  if (validated.companyName || validated.jobTitle || validated.location) {
    job.fingerprint = generateJobFingerprint(job.companyName, job.jobTitle, job.location);
  }
  if (validated.sourceUrl) {
    job.canonicalUrl = canonicalizeUrl(validated.sourceUrl);
  }

  await job.save();
  sendSuccess(res, job, 'Job updated successfully', 200, req);
}

export async function deleteJob(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const job = await JobModel.findByIdAndDelete(id);
  if (!job) {
    throw AppError.notFound('Job not found');
  }
  sendSuccess(res, { id }, 'Job deleted successfully', 200, req);
}

export async function toggleSaveJob(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const job = await JobModel.findById(id);
  if (!job) {
    throw AppError.notFound('Job not found');
  }

  job.savedStatus = !job.savedStatus;
  await job.save();

  sendSuccess(
    res,
    job,
    job.savedStatus ? 'Job saved to bookmarks' : 'Job removed from bookmarks',
    200,
    req
  );
}

export async function toggleArchiveJob(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const job = await JobModel.findById(id);
  if (!job) {
    throw AppError.notFound('Job not found');
  }

  job.archivedStatus = !job.archivedStatus;
  if (job.archivedStatus) {
    job.processingStatus = 'archived';
  } else if (job.processingStatus === 'archived') {
    job.processingStatus = 'discovered';
  }

  await job.save();

  sendSuccess(
    res,
    job,
    job.archivedStatus ? 'Job archived successfully' : 'Job restored from archive',
    200,
    req
  );
}
