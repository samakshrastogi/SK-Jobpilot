import type { Request, Response } from 'express';
import { getDatabaseStatus } from '../database/connection.js';
import { sendSuccess } from '../utils/response.js';

export function getHealthStatus(req: Request, res: Response): void {
  const dbState = getDatabaseStatus();
  const data = {
    status: dbState === 'connected' ? 'healthy' : 'degraded',
    database: dbState,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  };

  sendSuccess(res, data, dbState === 'connected' ? 'API and database are healthy' : 'API is available; database is disconnected', 200, req);
}

export function getDatabaseHealthStatus(req: Request, res: Response): void {
  const dbState = getDatabaseStatus();
  const isHealthy = dbState === 'connected';
  const statusCode = isHealthy ? 200 : 503;

  const data = {
    status: isHealthy ? 'healthy' : 'degraded',
    database: dbState,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  };

  sendSuccess(
    res,
    data,
    isHealthy ? 'Database connection is healthy' : 'Database connection is not active',
    statusCode,
    req
  );
}
