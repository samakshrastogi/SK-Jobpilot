import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../app.js';
import { JobModel } from '../models/job.model.js';
import { connectDatabase } from '../database/connection.js';

describe('Job Storage & Filter API', () => {
  const app = createApp();
  let isDbAvailable = false;

  beforeAll(async () => {
    isDbAvailable = await connectDatabase();
    if (!isDbAvailable) {
      mongoose.set('bufferCommands', false);
    }
  });

  beforeEach(async () => {
    if (isDbAvailable && mongoose.connection.readyState === 1) {
      await JobModel.deleteMany({});
    }
  });

  it('POST /api/v1/jobs should create a job listing and detect duplicate fingerprint', async (ctx) => {
    if (!isDbAvailable) {
      ctx.skip();
      return;
    }

    const jobPayload = {
      companyName: 'Anthropic Labs',
      jobTitle: 'Senior AI Engineer',
      location: 'Remote',
      workMode: 'remote',
      employmentType: 'full_time',
      description: 'Lead LLM application development using React, TypeScript and Node.js.',
      sourceUrl: 'https://careers.anthropic.com/jobs/12345?utm_source=linkedin',
    };

    const res1 = await request(app).post('/api/v1/jobs').send(jobPayload);
    expect(res1.status).toBe(201);
    expect(res1.body.success).toBe(true);
    expect(res1.body.data.companyName).toBe('Anthropic Labs');
    expect(res1.body.data).toHaveProperty('fingerprint');

    const resDuplicate = await request(app).post('/api/v1/jobs').send(jobPayload);
    expect(resDuplicate.status).toBe(200);
    expect(resDuplicate.body.message).toContain('Duplicate job detected');
  });

  it('GET /api/v1/jobs should filter jobs by workMode, savedStatus, and pagination', async (ctx) => {
    if (!isDbAvailable) {
      ctx.skip();
      return;
    }

    await JobModel.create([
      {
        companyName: 'Company A',
        jobTitle: 'Frontend Dev',
        description: 'React TS',
        workMode: 'remote',
        savedStatus: true,
      },
      {
        companyName: 'Company B',
        jobTitle: 'Backend Dev',
        description: 'Node Express',
        workMode: 'onsite',
        savedStatus: false,
      },
    ]);

    const resFiltered = await request(app).get('/api/v1/jobs?workMode=remote&savedOnly=true');
    expect(resFiltered.status).toBe(200);
    expect(resFiltered.body.data.length).toBe(1);
    expect(resFiltered.body.data[0].companyName).toBe('Company A');
  });

  it('PATCH /api/v1/jobs/:id/save and archive should toggle flags correctly', async (ctx) => {
    if (!isDbAvailable) {
      ctx.skip();
      return;
    }

    const job = await JobModel.create({
      companyName: 'Test Corp',
      jobTitle: 'Staff Engineer',
      description: 'High performance systems.',
    });
    const jobIdStr = (job._id as object).toString();

    const resSave = await request(app).patch(`/api/v1/jobs/${jobIdStr}/save`);
    expect(resSave.status).toBe(200);
    expect(resSave.body.data.savedStatus).toBe(true);

    const resArchive = await request(app).patch(`/api/v1/jobs/${jobIdStr}/archive`);
    expect(resArchive.status).toBe(200);
    expect(resArchive.body.data.archivedStatus).toBe(true);
  });
});
