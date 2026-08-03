import type { Request, Response } from 'express';
import { checkSystemReadiness, getPublicCapabilities } from '../services/system-readiness.service.js';
import { sendSuccess } from '../utils/response.js';

export async function fetchSystemReadiness(req: Request, res: Response): Promise<void> {
  const readiness = await checkSystemReadiness();
  const statusCode = readiness.status === 'unhealthy' ? 503 : 200;
  sendSuccess(res, readiness, 'System readiness retrieved successfully', statusCode, req);
}

export async function fetchSystemDiagnostics(req: Request, res: Response): Promise<void> {
  const readiness = await checkSystemReadiness();
  const diagnostics = {
    ...readiness,
    processUptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    platform: process.platform,
    arch: process.arch,
  };
  sendSuccess(res, diagnostics, 'System diagnostics retrieved successfully', 200, req);
}

export async function fetchSystemVersion(req: Request, res: Response): Promise<void> {
  sendSuccess(
    res,
    {
      appVersion: '1.0.0',
      apiVersion: 'v1.0.0',
      sharedVersion: '1.0.0',
      buildCommit: 'phase-5-production-hardened',
      nodeVersion: process.version,
    },
    'System version retrieved successfully',
    200,
    req
  );
}

export async function fetchPublicConfig(req: Request, res: Response): Promise<void> {
  const config = getPublicCapabilities();
  sendSuccess(res, config, 'Public system capabilities retrieved successfully', 200, req);
}
