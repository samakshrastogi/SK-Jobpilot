import { Router } from 'express';
import {
  handleCreateBackup,
  handleListBackups,
  handleGenerateCoverLetter,
  handleExportResume,
} from '../controllers/phase5.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';

export const phase5Router = Router();

phase5Router.post('/backups/create', asyncHandler(handleCreateBackup));
phase5Router.get('/backups', asyncHandler(handleListBackups));
phase5Router.post('/cover-letters', asyncHandler(handleGenerateCoverLetter));
phase5Router.post('/resumes/export', asyncHandler(handleExportResume));
