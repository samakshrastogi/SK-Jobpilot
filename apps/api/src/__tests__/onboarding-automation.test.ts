import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import {
  getOrCreateOnboardingState,
  recommendRolesFromProfile,
  selectTargetRoles,
} from '../services/onboarding.service.js';
import { executeHourlyDiscoveryPipeline } from '../services/hourly-discovery.service.js';
import { env } from '../config/env.js';

describe('Onboarding & Hourly Discovery Automation Engine Tests', () => {
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

  it('should initialize and retrieve onboarding state', async () => {
    const state = await getOrCreateOnboardingState();
    expect(state).toBeDefined();
    expect(state.step).toBeGreaterThanOrEqual(1);
  });

  it('should generate evidence-grounded role recommendations', async () => {
    const recs = await recommendRolesFromProfile();
    expect(recs).toBeDefined();
    expect(Array.isArray(recs)).toBe(true);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].roleTitle).toBeDefined();
  });

  it('should select target roles for candidate', async () => {
    const selected = await selectTargetRoles(['Backend Engineer', 'Full Stack Engineer']);
    expect(selected).toBeDefined();
    expect(selected.length).toBe(2);
    expect(selected[0].primaryTitle).toBe('Backend Engineer');
  });

  it('should execute hourly discovery pipeline', async () => {
    const res = await executeHourlyDiscoveryPipeline();
    expect(res).toBeDefined();
    expect(res.status).toBeDefined();
  });
});
