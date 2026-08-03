import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../database/connection.js';
import { JobModel } from '../models/job.model.js';
import { TailoredResumeModel } from '../models/tailored-resume.model.js';
import {
  generateTailoredResume,
  approveTailoredResume,
  rejectTailoredResume,
} from '../ai/services/resume-tailoring.service.js';

describe('Resume Tailoring & Approval Workflow Service', () => {
  beforeAll(async () => {
    const isConnected = await connectDatabase();
    if (!isConnected) {
      mongoose.set('bufferCommands', false);
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await JobModel.deleteMany({});
      await TailoredResumeModel.deleteMany({});
      await disconnectDatabase();
    }
  });

  it('should generate unapproved draft tailored resume version and handle approval flow', async () => {
    if (mongoose.connection.readyState === 0) return;

    const job = await JobModel.create({
      companyName: 'Tailor Target Corp',
      jobTitle: 'Lead Architect',
      description: 'Architecting high-scale distributed systems in Node.js and TypeScript.',
    });

    const tailored = await generateTailoredResume(job._id.toString());
    expect(tailored).toBeDefined();
    expect(tailored.approvalStatus).toBe('generated'); // NEVER automatically approved!
    expect(tailored.proposedExperienceBullets.length).toBeGreaterThan(0);

    // Test Approval Action
    const approved = await approveTailoredResume(tailored.id);
    expect(approved.approvalStatus).toBe('approved');
    expect(approved.approvedAt).toBeDefined();

    // Test Rejection Action
    const rejected = await rejectTailoredResume(tailored.id);
    expect(rejected.approvalStatus).toBe('rejected');
  });
});
