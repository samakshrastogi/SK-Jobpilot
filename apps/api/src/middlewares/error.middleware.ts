import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error.js';
import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error({ err, path: req.path, method: req.method }, 'Error encountered during request');

  if (err instanceof AppError) {
    sendError(
      res,
      err.message,
      err.statusCode,
      err.code,
      err.details,
      env.NODE_ENV === 'development' ? err.stack : undefined,
      req
    );
    return;
  }

  if (err instanceof ZodError) {
    sendError(
      res,
      'Validation failed',
      400,
      'VALIDATION_ERROR',
      err.format(),
      env.NODE_ENV === 'development' ? err.stack : undefined,
      req
    );
    return;
  }

  // Handle generic unknown errors
  sendError(
    res,
    err.message || 'Internal Server Error',
    500,
    'INTERNAL_SERVER_ERROR',
    undefined,
    env.NODE_ENV === 'development' ? err.stack : undefined,
    req
  );
}
