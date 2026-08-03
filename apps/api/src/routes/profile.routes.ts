import { Router } from 'express';
import { getProfile, updateProfile, patchProfile } from '../controllers/profile.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';

export const profileRouter = Router();

profileRouter.get('/profile', asyncHandler(getProfile));
profileRouter.put('/profile', asyncHandler(updateProfile));
profileRouter.patch('/profile', asyncHandler(patchProfile));
