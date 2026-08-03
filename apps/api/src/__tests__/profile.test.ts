import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../app.js';
import { CandidateProfileModel } from '../models/candidate-profile.model.js';
import { connectDatabase } from '../database/connection.js';

describe('Candidate Profile API', () => {
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
      await CandidateProfileModel.deleteMany({});
    }
  });

  it('GET /api/v1/profile should return structured default empty profile when none exists', async (ctx) => {
    if (!isDbAvailable) {
      ctx.skip();
      return;
    }

    const res = await request(app).get('/api/v1/profile');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.personalInfo.fullName).toBe('SK JobPilot User');
    expect(res.body.data.skills).toHaveProperty('languages');
  });

  it('PUT /api/v1/profile should create master profile and enforce single profile', async (ctx) => {
    if (!isDbAvailable) {
      ctx.skip();
      return;
    }

    const payload = {
      personalInfo: {
        fullName: 'Jane Architect',
        email: 'jane@example.com',
        phone: '+1 555 0199',
        location: 'San Francisco, CA',
      },
      professionalInfo: {
        currentTitle: 'Lead Software Architect',
        summary: 'Experienced AI and Full Stack Architect',
        totalExperienceMonths: 96,
        preferredRoles: ['Architect', 'Staff Engineer'],
        remotePreference: 'remote_only',
        expectedSalary: { amount: 200000, currency: 'USD', period: 'yearly' },
      },
      skills: {
        languages: ['TypeScript', 'Python'],
        backend: ['Node.js', 'Express'],
        frontend: ['React', 'Next.js'],
        databases: ['MongoDB', 'PostgreSQL'],
        cloudDevOps: ['Docker', 'AWS'],
        aiAutomation: ['Gemini', 'LangChain'],
        tools: ['Git', 'Vite'],
      },
      experience: [
        {
          company: 'TechCorp',
          position: 'Lead Architect',
          startDate: '2022-01-01',
          isCurrent: true,
          description: 'Building agentic AI systems.',
        },
      ],
      education: [],
      projects: [],
      certificates: [],
      jobPreferences: {
        targetTitles: ['Lead Architect'],
        minExperienceYears: 5,
        maxExperienceYears: 15,
      },
    };

    const res1 = await request(app).put('/api/v1/profile').send(payload);
    expect(res1.status).toBe(200);
    expect(res1.body.success).toBe(true);
    expect(res1.body.data.personalInfo.fullName).toBe('Jane Architect');

    const count = await CandidateProfileModel.countDocuments();
    expect(count).toBe(1);

    const payloadUpdated = {
      ...payload,
      personalInfo: { ...payload.personalInfo, fullName: 'Jane Senior Architect' },
    };
    const res2 = await request(app).put('/api/v1/profile').send(payloadUpdated);
    expect(res2.status).toBe(200);
    expect(res2.body.data.personalInfo.fullName).toBe('Jane Senior Architect');

    const countAfter = await CandidateProfileModel.countDocuments();
    expect(countAfter).toBe(1);
  });
});
