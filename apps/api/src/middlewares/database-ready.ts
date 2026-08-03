import type { Request, Response, NextFunction } from 'express';
import { getDatabaseStatus } from '../database/connection.js';
import { AppError } from '../errors/app-error.js';

const DATABASE_ROUTE_PREFIXES = new Set([
  'profile', 'resumes', 'jobs', 'applications', 'ai', 'discovery', 'interviews',
  'saved-answers', 'follow-ups', 'review-queue', 'onboarding', 'automation',
  'dashboard', 'cover-letters', 'backups', 'resume-exports',
]);

export function requireDatabase(req: Request, _res: Response, next: NextFunction): void {
  const prefix = req.path.split('/').filter(Boolean)[0] || '';
  if (!DATABASE_ROUTE_PREFIXES.has(prefix) || getDatabaseStatus() === 'connected') {
    next();
    return;
  }

  next(AppError.serviceUnavailable(
    'Database is unavailable. Start MongoDB (docker compose up -d mongodb) and retry shortly.'
  ));
}