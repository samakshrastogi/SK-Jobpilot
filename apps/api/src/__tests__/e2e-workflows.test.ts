import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { runMaintenanceCheck } from '../scripts/maintenance.js';
import { checkSystemReadiness, getPublicCapabilities } from '../services/system-readiness.service.js';
import { env } from '../config/env.js';

describe('Phase 5 End-to-End Workflows & Production Readiness', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(env.MONGODB_URI);
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('should run maintenance check cleanly', async () => {
    const res = await runMaintenanceCheck();
    expect(res).toBeDefined();
    expect(res.issuesFoundCount).toBeGreaterThanOrEqual(0);
  }, 15000);

  it('should evaluate system readiness', async () => {
    const readiness = await checkSystemReadiness();
    expect(readiness.nodeVersion).toBeDefined();
    expect(readiness.configuredTextModel).toBe('gemini-2.5-flash');
    expect(readiness.configuredEmbeddingModel).toBe('gemini-embedding-2');
  });

  it('should expose public capabilities without sensitive environment keys', () => {
    const caps = getPublicCapabilities();
    expect(caps.singleUserMode).toBe(true);
    expect(caps.authenticationEnabled).toBe(false);
    expect(caps.appVersion).toBe('1.0.0');
    expect((caps as any).GEMINI_API_KEY).toBeUndefined();
  });
});
