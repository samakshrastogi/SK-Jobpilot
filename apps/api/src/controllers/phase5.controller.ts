import type { Request, Response } from 'express';
import { createLocalBackup, listBackups } from '../services/backup.service.js';
import { generateCoverLetter } from '../services/cover-letter.service.js';
import { exportTailoredResume } from '../services/resume-export.service.js';
import { createCoverLetterSchema, exportResumeRequestSchema } from '@sk-job-pilot/shared';
import { sendSuccess } from '../utils/response.js';

export async function handleCreateBackup(req: Request, res: Response): Promise<void> {
  const backup = await createLocalBackup();
  sendSuccess(res, backup, 'Local system backup created successfully', 201, req);
}

export async function handleListBackups(req: Request, res: Response): Promise<void> {
  const backups = listBackups();
  sendSuccess(res, backups, 'Backups retrieved successfully', 200, req);
}

export async function handleGenerateCoverLetter(req: Request, res: Response): Promise<void> {
  const validated = createCoverLetterSchema.parse(req.body);
  const letter = await generateCoverLetter(validated.jobId, validated.variant);
  sendSuccess(res, letter, 'Cover letter generated successfully', 201, req);
}

export async function handleExportResume(req: Request, res: Response): Promise<void> {
  const validated = exportResumeRequestSchema.parse(req.body);
  const exported = await exportTailoredResume(validated.tailoredResumeId, validated.format);
  sendSuccess(res, exported, 'Approved tailored resume exported successfully', 200, req);
}
