import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import mongoose from 'mongoose';
import {
  getOrCreateOnboardingState,
  recommendRolesFromProfile,
  selectTargetRoles,
} from '../services/onboarding.service.js';
import { executeHourlyDiscoveryPipeline } from '../services/hourly-discovery.service.js';
import { env } from '../config/env.js';

describe('Onboarding & Hourly Discovery Automation Engine Tests', () => {
  let isDbAvailable = false;

  beforeAll(async () => {
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 1000 });
      }
      isDbAvailable = mongoose.connection.readyState === 1;
    } catch {
      isDbAvailable = false;
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  });

  it('should initialize and retrieve onboarding state', async (ctx) => {
    if (!isDbAvailable) return ctx.skip();
    const state = await getOrCreateOnboardingState();
    expect(state).toBeDefined();
    expect(state.step).toBeGreaterThanOrEqual(1);
  });

  it('should generate evidence-grounded role recommendations', async (ctx) => {
    if (!isDbAvailable) return ctx.skip();
    try {
      const recs = await recommendRolesFromProfile();
      expect(Array.isArray(recs)).toBe(true);
      expect(recs.length).toBeGreaterThan(0);
      expect(recs[0].roleTitle).toBeDefined();
      expect(recs[0].evidence.length).toBeGreaterThan(0);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain('No evidence-backed role title');
    }
  });

  it('should select target roles for candidate', async (ctx) => {
    if (!isDbAvailable) return ctx.skip();
    const selected = await selectTargetRoles(['Backend Engineer', 'Full Stack Engineer']);
    expect(selected).toBeDefined();
    expect(selected.length).toBe(2);
    expect(selected[0].primaryTitle).toBe('Backend Engineer');
  });

  it('should execute hourly discovery pipeline without depending on live providers', async (ctx) => {
    if (!isDbAvailable) return ctx.skip();
    vi.stubGlobal('fetch', vi.fn(async (url: string | URL | Request) => {
      const target = String(url);
      const body = target.includes('remotive.com') ? { jobs: [] } : { jobs: [] };
      return new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }));
    try {
      const res = await executeHourlyDiscoveryPipeline();
      expect(res).toBeDefined();
      expect(res.status).toBeDefined();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
