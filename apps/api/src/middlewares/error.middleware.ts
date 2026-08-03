import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error.js';
import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

interface ZodLikeError extends Error {
  issues: unknown[];
  format?: () => unknown;
}

function isZodLikeError(error: Error): error is ZodLikeError {
  return error.name === 'ZodError' && Array.isArray((error as Partial<ZodLikeError>).issues);
}

function isDatabaseUnavailableError(error: Error): boolean {
  return error.name === 'MongooseServerSelectionError' ||
    error.name === 'MongooseError' && /buffering timed out|not connected|before initial connection/i.test(error.message);
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    const log = err.statusCode >= 500 && err.statusCode !== 503 ? logger.error.bind(logger) : logger.warn.bind(logger);
    log({ err, path: req.path, method: req.method }, 'Request failed');
    sendError(res, err.message, err.statusCode, err.code, err.details,
      env.NODE_ENV === 'development' ? err.stack : undefined, req);
    return;
  }

  if (isZodLikeError(err)) {
    logger.warn({ issues: err.issues, path: req.path, method: req.method }, 'Request validation failed');
    sendError(res, 'Validation failed', 400, 'VALIDATION_ERROR',
      typeof err.format === 'function' ? err.format() : err.issues,
      env.NODE_ENV === 'development' ? err.stack : undefined, req);
    return;
  }

  if (isDatabaseUnavailableError(err)) {
    logger.error({ err, path: req.path, method: req.method }, 'Database request failed');
    sendError(res, 'Database is unavailable. Start MongoDB and retry shortly.', 503,
      'SERVICE_UNAVAILABLE', undefined,
      env.NODE_ENV === 'development' ? err.stack : undefined, req);
    return;
  }

  logger.error({ err, path: req.path, method: req.method }, 'Unexpected request failure');
  sendError(res, err.message || 'Internal Server Error', 500, 'INTERNAL_SERVER_ERROR', undefined,
    env.NODE_ENV === 'development' ? err.stack : undefined, req);
}