import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../app.js';
import { JobModel } from '../models/job.model.js';
import { ApplicationModel } from '../models/application.model.js';
import { connectDatabase } from '../database/connection.js';

describe('Application Tracking API', () => {
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
      await ApplicationModel.deleteMany({});
      await JobModel.deleteMany({});
    }
  });

  it('POST /api/v1/applications should create an application and append initial timeline event', async (ctx) => {
    if (!isDbAvailable) {
      ctx.skip();
      return;
    }

    const job = await JobModel.create({
      companyName: 'Stripe',
      jobTitle: 'Frontend Architect',
      description: 'Payment UI infrastructure',
    });
    const jobIdStr = (job._id as object).toString();

    const res = await request(app).post('/api/v1/applications').send({
      jobId: jobIdStr,
      status: 'preparing',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('preparing');
    expect(res.body.data.timelineEvents.length).toBe(1);

    const resDup = await request(app).post('/api/v1/applications').send({
      jobId: jobIdStr,
      status: 'submitted',
    });
    expect(resDup.status).toBe(400);
    expect(resDup.body.message).toContain('active application already exists');
  });

  it('PATCH /api/v1/applications/:id should update status and append timeline event automatically', async (ctx) => {
    if (!isDbAvailable) {
      ctx.skip();
      return;
    }

    const job = await JobModel.create({
      companyName: 'Linear',
      jobTitle: 'Staff Developer',
      description: 'Issue tracker app',
    });
    const jobIdStr = (job._id as object).toString();

    const appCreated = await ApplicationModel.create({
      job: jobIdStr,
      status: 'planned',
      timelineEvents: [{ date: new Date(), status: 'planned', title: 'Created' }],
    });
    const appIdStr = (appCreated._id as object).toString();

    const resUpdate = await request(app)
      .patch(`/api/v1/applications/${appIdStr}`)
      .send({ status: 'interview' });

    expect(resUpdate.status).toBe(200);
    expect(resUpdate.body.data.status).toBe('interview');
    expect(resUpdate.body.data.timelineEvents.length).toBe(2);
    expect(resUpdate.body.data.timelineEvents[1].status).toBe('interview');
  });
});
