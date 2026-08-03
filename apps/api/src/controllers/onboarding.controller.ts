import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import {
  getOrCreateOnboardingState,
  updateOnboardingStep,
  recommendRolesFromProfile,
  selectTargetRoles,
} from '../services/onboarding.service.js';
import { executeApplicationAgent } from '../services/application-agent.service.js';
import { TargetRoleModel } from '../models/target-role.model.js';
import { AutomationConfigurationModel } from '../models/automation-configuration.model.js';
import { ReviewQueueItemModel } from '../models/review-queue-item.model.js';
import { ApplicationModel } from '../models/application.model.js';
import { selectTargetRolesSchema, automationConfigSchema, updateOnboardingStepSchema } from '@sk-job-pilot/shared';
import { sendSuccess } from '../utils/response.js';
import { AppError } from '../errors/app-error.js';

export async function fetchOnboardingState(req: Request, res: Response): Promise<void> {
  const state = await getOrCreateOnboardingState();
  sendSuccess(res, state, 'Onboarding state retrieved successfully', 200, req);
}

export async function handleUpdateOnboardingStep(req: Request, res: Response): Promise<void> {
  const { step } = updateOnboardingStepSchema.parse(req.body);
  const state = await updateOnboardingStep(step);
  sendSuccess(res, state, 'Onboarding step updated successfully', 200, req);
}

export async function handleGenerateRoleRecommendations(req: Request, res: Response): Promise<void> {
  const recommendations = await recommendRolesFromProfile();
  sendSuccess(res, recommendations, 'Role recommendations generated successfully based on profile evidence', 200, req);
}

export async function handleSelectTargetRoles(req: Request, res: Response): Promise<void> {
  const validated = selectTargetRolesSchema.parse(req.body);
  const selected = await selectTargetRoles(validated.roleTitles);
  sendSuccess(res, selected, 'Target roles selected successfully', 200, req);
}

export async function fetchSelectedTargetRoles(req: Request, res: Response): Promise<void> {
  const selected = await TargetRoleModel.find({ active: true });
  sendSuccess(res, selected, 'Selected target roles retrieved successfully', 200, req);
}

export async function fetchAutomationConfig(req: Request, res: Response): Promise<void> {
  let config = await AutomationConfigurationModel.findOne();
  if (!config) {
    config = await AutomationConfigurationModel.create({
      enabled: true,
      mode: 'prepare_and_review',
      frequency: 'hourly',
      minimumMatchScore: 75,
      maxApplicationsPerHour: 5,
      maxApplicationsPerDay: 20,
    });
  }
  sendSuccess(res, config, 'Automation configuration retrieved successfully', 200, req);
}

export async function handleUpdateAutomationConfig(req: Request, res: Response): Promise<void> {
  const validated = automationConfigSchema.parse(req.body);
  const safeConfig = {
    ...validated,
    mode: validated.mode === 'safe_auto_apply' ? 'prepare_and_review' as const : validated.mode,
  };
  let config = await AutomationConfigurationModel.findOne();
  if (!config) {
    config = await AutomationConfigurationModel.create({ ...safeConfig, autoSubmitSafeApplications: false });
  } else {
    Object.assign(config, safeConfig, { autoSubmitSafeApplications: false });
    await config.save();
  }
  sendSuccess(res, config, 'Automation configuration updated successfully', 200, req);
}

export async function handleRunHourlyPipelineNow(req: Request, res: Response): Promise<void> {
  const result = await executeApplicationAgent('manual');
  sendSuccess(res, result, 'Application agent pipeline executed successfully', 200, req);
}

export async function fetchReviewQueue(req: Request, res: Response): Promise<void> {
  const items = await ReviewQueueItemModel.find({ status: 'pending' }).sort({ createdAt: -1 }).populate('jobId');
  sendSuccess(res, items, 'Review queue items retrieved successfully', 200, req);
}

const reviewDecisionSchema = z.object({
  status: z.enum(['approved', 'rejected', 'resolved']),
  userCorrection: z.string().trim().max(5000).optional().default(''),
});

export async function updateReviewQueueItem(req: Request, res: Response): Promise<void> {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) throw AppError.badRequest('Invalid review queue item ID');
  const validated = reviewDecisionSchema.parse(req.body);
  const item = await ReviewQueueItemModel.findByIdAndUpdate(id, validated, { new: true }).populate('jobId');
  if (!item) throw AppError.notFound('Review queue item not found');
  if (item.applicationId) {
    const application = await ApplicationModel.findById(item.applicationId);
    if (application && validated.status === 'rejected') {
      application.status = 'rejected';
      application.lastActivityDate = new Date();
      application.timelineEvents.push({ status: 'rejected', title: 'Application rejected during review', description: validated.userCorrection });
      await application.save();
    }
  }
  sendSuccess(res, item, 'Review queue decision saved successfully', 200, req);
}