import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../database/connection.js';
import { CandidateProfileModel } from '../models/candidate-profile.model.js';
import { analyzeCandidate } from '../ai/services/candidate-analysis.service.js';

describe('Candidate Intelligence Service', () => {
  beforeAll(async () => {
    const isConnected = await connectDatabase();
    if (!isConnected) {
      mongoose.set('bufferCommands', false);
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await CandidateProfileModel.deleteMany({});
      await disconnectDatabase();
    }
  });

  it('should analyze candidate profile and return structured analysis', async () => {
    if (mongoose.connection.readyState === 0) return;

    await CandidateProfileModel.create({
      personalInfo: { fullName: 'Alex Test', email: 'alex@example.com' },
      professionalInfo: { currentTitle: 'Staff Engineer', summary: 'Architecting scalable monorepos' },
      skills: { languages: ['TypeScript', 'Python'], backend: ['Node.js', 'Express'] },
      experience: [{ company: 'Acme Corp', position: 'Lead Developer' }],
      education: [],
      projects: [],
      certificates: [],
      jobPreferences: { targetTitles: ['Lead Architect'] },
    });

    const analysis = await analyzeCandidate(true);
    expect(analysis).toBeDefined();
    expect(analysis.primaryTitle).toBe('Lead Software Architect');
    expect(analysis.coreSkills).toContain('TypeScript');
  });
});
