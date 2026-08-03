import { Router } from 'express';
import {
  fetchOnboardingState,
  handleUpdateOnboardingStep,
  handleGenerateRoleRecommendations,
  handleSelectTargetRoles,
  fetchSelectedTargetRoles,
  fetchAutomationConfig,
  handleUpdateAutomationConfig,
  handleRunHourlyPipelineNow,
  fetchReviewQueue,
} from '../controllers/onboarding.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';

export const onboardingRouter = Router();

onboardingRouter.get('/onboarding/state', asyncHandler(fetchOnboardingState));
onboardingRouter.post('/onboarding/step', asyncHandler(handleUpdateOnboardingStep));
onboardingRouter.post('/onboarding/roles/recommend', asyncHandler(handleGenerateRoleRecommendations));
onboardingRouter.post('/onboarding/roles/select', asyncHandler(handleSelectTargetRoles));
onboardingRouter.get('/onboarding/roles/selected', asyncHandler(fetchSelectedTargetRoles));

onboardingRouter.get('/automation/config', asyncHandler(fetchAutomationConfig));
onboardingRouter.put('/automation/config', asyncHandler(handleUpdateAutomationConfig));
onboardingRouter.post('/automation/run-now', asyncHandler(handleRunHourlyPipelineNow));

onboardingRouter.get('/review-queue', asyncHandler(fetchReviewQueue));
