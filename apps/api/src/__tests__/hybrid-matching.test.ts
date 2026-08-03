import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../database/connection.js';
import { JobModel } from '../models/job.model.js';
import { matchCandidateToJob, matchJobsBatch } from '../ai/services/hybrid-matching.service.js';

describe('Hybrid Matching Engine Service', () => {
  beforeAll(async () => {
    const isConnected = await connectDatabase();
    if (!isConnected) {
      mongoose.set('bufferCommands', false);
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await JobModel.deleteMany({});
      await disconnectDatabase();
    }
  });

  it('should calculate match score and return structured match breakdown bounded 0-100', async () => {
    if (mongoose.connection.readyState === 0) return;

    const job = await JobModel.create({
      companyName: 'Tech Corp',
      jobTitle: 'Senior Full Stack Engineer',
      location: 'Remote',
      workMode: 'remote',
      employmentType: 'full_time',
      description: 'Looking for a Senior Full Stack Engineer with TypeScript and React experience.',
    });

    const match = await matchCandidateToJob(job._id.toString(), true);
    expect(match).toBeDefined();
    expect(match.overallScore).toBeGreaterThanOrEqual(0);
    expect(match.overallScore).toBeLessThanOrEqual(100);
    expect(match.matchedRequiredSkills).toBeDefined();
  });

  it('should execute batch matching cleanly using controlled concurrency', async () => {
    if (mongoose.connection.readyState === 0) return;

    const job1 = await JobModel.create({
      companyName: 'Batch Company A',
      jobTitle: 'Backend Architect',
      description: 'Node.js and MongoDB specialist needed.',
    });

    const job2 = await JobModel.create({
      companyName: 'Batch Company B',
      jobTitle: 'Frontend Architect',
      description: 'React and Tailwind CSS specialist needed.',
    });

    const results = await matchJobsBatch([job1._id.toString(), job2._id.toString()]);
    expect(results.length).toBe(2);
  });
});
