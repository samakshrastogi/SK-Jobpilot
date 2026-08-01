import type { Response, Request } from 'express';
import type { ApiResponse, PaginatedResponse, PaginatedMeta } from '@sk-job-pilot/shared';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string = 'Operation successful',
  statusCode: number = 200,
  req?: Request
): Response {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: (req?.headers['x-request-id'] as string) || undefined,
    },
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message: string = 'An error occurred',
  statusCode: number = 500,
  code: string = 'INTERNAL_ERROR',
  details?: unknown,
  stack?: string,
  req?: Request
): Response {
  const payload: ApiResponse = {
    success: false,
    message,
    error: {
      code,
      details,
      stack,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: (req?.headers['x-request-id'] as string) || undefined,
    },
  };
  return res.status(statusCode).json(payload);
}

export function sendPaginated<T>(
  res: Response,
  items: T[],
  pagination: PaginatedMeta,
  message: string = 'Data retrieved successfully',
  req?: Request
): Response {
  const payload: PaginatedResponse<T> = {
    success: true,
    message,
    data: items,
    pagination,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: (req?.headers['x-request-id'] as string) || undefined,
    },
  };
  return res.status(200).json(payload);
}
