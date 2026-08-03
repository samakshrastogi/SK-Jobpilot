import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApplicationModel } from '../models/application.model.js';
import { JobModel } from '../models/job.model.js';
import { ResumeModel } from '../models/resume.model.js';
import {
  createApplicationSchema,
  updateApplicationSchema,
  createTimelineEventSchema,
  applicationFilterQuerySchema,
} from '@sk-job-pilot/shared';
import { AppError } from '../errors/app-error.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

function getParamId(req: Request): string {
  const param = req.params.id;
  return Array.isArray(param) ? param[0] : param;
}

export async function createApplication(req: Request, res: Response): Promise<void> {
  const validated = createApplicationSchema.parse(req.body);

  if (!mongoose.Types.ObjectId.isValid(validated.jobId)) {
    throw AppError.badRequest('Invalid job ID format');
  }

  const job = await JobModel.findById(validated.jobId);
  if (!job) {
    throw AppError.notFound('Referenced job not found');
  }

  let resumeId = validated.resumeId;
  if (!resumeId) {
    const masterResume = await ResumeModel.findOne({ isMaster: true });
    if (masterResume) {
      resumeId = (masterResume._id as object).toString();
    }
  }

  // Prevent duplicate active applications for same job unless overridden
  if (!validated.allowDuplicate) {
    const activeExisting = await ApplicationModel.findOne({
      job: new mongoose.Types.ObjectId(validated.jobId),
      status: { $nin: ['rejected', 'withdrawn', 'archived'] },
    });
    if (activeExisting) {
      throw AppError.badRequest(
        'An active application already exists for this job. Pass allowDuplicate: true to override.'
      );
    }
  }

  const initialEvent = {
    date: new Date(),
    status: validated.status,
    title: `Application created with status: ${validated.status.replace(/_/g, ' ')}`,
    description: `Initial application tracking record created for ${job.jobTitle} at ${job.companyName}.`,
  };

  const application = await ApplicationModel.create({
    job: new mongoose.Types.ObjectId(validated.jobId),
    resume:
      resumeId && mongoose.Types.ObjectId.isValid(resumeId)
        ? new mongoose.Types.ObjectId(resumeId)
        : undefined,
    status: validated.status,
    applicationMethod: validated.applicationMethod,
    applicationUrl: validated.applicationUrl || job.applicationUrl || job.sourceUrl || '',
    appliedDate: validated.appliedDate
      ? new Date(validated.appliedDate)
      : validated.status === 'submitted'
        ? new Date()
        : undefined,
    lastActivityDate: new Date(),
    nextFollowUpDate: validated.nextFollowUpDate ? new Date(validated.nextFollowUpDate) : undefined,
    contactPerson: validated.contactPerson,
    contactEmail: validated.contactEmail,
    referralInfo: validated.referralInfo,
    notes: validated.notes,
    salaryEntered: validated.salaryEntered,
    coverLetter: validated.coverLetter,
    timelineEvents: [initialEvent],
  });

  const populated = await ApplicationModel.findById(application._id)
    .populate('job')
    .populate('resume');

  sendSuccess(res, populated, 'Application created successfully', 201, req);
}

export async function getApplications(req: Request, res: Response): Promise<void> {
  const query = applicationFilterQuerySchema.parse(req.query);

  const filter: Record<string, unknown> = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.jobId && mongoose.Types.ObjectId.isValid(query.jobId)) {
    filter.job = new mongoose.Types.ObjectId(query.jobId);
  }

  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const totalItems = await ApplicationModel.countDocuments(filter);
  const applications = await ApplicationModel.find(filter)
    .sort({ lastActivityDate: -1 })
    .skip(skip)
    .limit(limit)
    .populate('job')
    .populate('resume');

  const totalPages = Math.ceil(totalItems / limit) || 1;

  sendPaginated(
    res,
    applications,
    {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    'Applications retrieved successfully',
    req
  );
}

export async function getApplicationById(req: Request, res: Response): Promise<void> {
  const id = getParamId(req);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest('Invalid application ID format');
  }
  const application = await ApplicationModel.findById(id).populate('job').populate('resume');
  if (!application) {
    throw AppError.notFound('Application not found');
  }
  sendSuccess(res, application, 'Application retrieved successfully', 200, req);
}

export async function updateApplication(req: Request, res: Response): Promise<void> {
  const id = getParamId(req);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest('Invalid application ID format');
  }
  const validated = updateApplicationSchema.parse(req.body);

  const application = await ApplicationModel.findById(id);
  if (!application) {
    throw AppError.notFound('Application not found');
  }

  const oldStatus = application.status;
  const newStatus = validated.status;

  Object.assign(application, validated);
  application.lastActivityDate = new Date();

  if (newStatus && newStatus !== oldStatus) {
    application.timelineEvents.push({
      date: new Date(),
      status: newStatus,
      title: `Status changed to ${newStatus.replace(/_/g, ' ')}`,
      description: `Application status updated from ${oldStatus.replace(/_/g, ' ')} to ${newStatus.replace(/_/g, ' ')}.`,
    });
    if (newStatus === 'submitted' && !application.appliedDate) {
      application.appliedDate = new Date();
    }
  }

  await application.save();
  const populated = await ApplicationModel.findById(application._id)
    .populate('job')
    .populate('resume');

  sendSuccess(res, populated, 'Application updated successfully', 200, req);
}

export async function deleteApplication(req: Request, res: Response): Promise<void> {
  const id = getParamId(req);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest('Invalid application ID format');
  }
  const application = await ApplicationModel.findByIdAndDelete(id);
  if (!application) {
    throw AppError.notFound('Application not found');
  }
  sendSuccess(res, { id }, 'Application deleted successfully', 200, req);
}

export async function addTimelineEvent(req: Request, res: Response): Promise<void> {
  const id = getParamId(req);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest('Invalid application ID format');
  }
  const validated = createTimelineEventSchema.parse(req.body);

  const application = await ApplicationModel.findById(id);
  if (!application) {
    throw AppError.notFound('Application not found');
  }

  const event = {
    date: validated.date ? new Date(validated.date) : new Date(),
    status: validated.status,
    title: validated.title,
    description: validated.description,
  };

  application.timelineEvents.push(event);
  application.lastActivityDate = new Date();
  await application.save();

  const populated = await ApplicationModel.findById(application._id)
    .populate('job')
    .populate('resume');
  sendSuccess(res, populated, 'Timeline event added successfully', 200, req);
}
