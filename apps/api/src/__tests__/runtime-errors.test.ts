import express from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { automationConfigSchema } from '@sk-job-pilot/shared';
import { createApp } from '../app.js';
import { errorHandler } from '../middlewares/error.middleware.js';

describe('runtime error contracts', () => {
  it('returns validation failures from shared Zod schemas as HTTP 400', async () => {
    const app = express();
    app.get('/invalid', () => {
      automationConfigSchema.parse({
        enabled: true,
        mode: 'prepare_and_review',
        frequency: 'hourly',
        minimumMatchScore: 75,
        maxApplicationsPerHour: 5,
        maxApplicationsPerDay: 51,
      });
    });
    app.use(errorHandler);

    const response = await request(app).get('/invalid');
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('fails database-backed routes quickly with HTTP 503 when MongoDB is disconnected', async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    const startedAt = Date.now();
    const response = await request(createApp()).get('/api/v1/profile');

    expect(response.status).toBe(503);
    expect(response.body.error.code).toBe('SERVICE_UNAVAILABLE');
    expect(Date.now() - startedAt).toBeLessThan(1000);
  });
});