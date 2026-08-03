import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { createApp } from '../app.js';
import { ResumeModel } from '../models/resume.model.js';
import { connectDatabase } from '../database/connection.js';
import { extractTextFromPdf } from '../services/extraction/pdf-extractor.js';
import { parseResumeText } from '../services/parsing/deterministic-parser.service.js';

describe('Resume Pure Functions Unit Tests', () => {
  it('extractTextFromPdf should detect scanned/short PDFs as requiresOcr', async () => {
    const emptyPdfBuffer = Buffer.from('%PDF-1.4 empty pdf');
    const result = await extractTextFromPdf(emptyPdfBuffer);

    expect(result).toHaveProperty('requiresOcr', true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('parseResumeText should extract email, phone, and skills from raw text', () => {
    const raw = `
      Jane Architect
      Email: jane.architect@example.com
      Phone: +1 (555) 234-5678
      
      TECHNICAL SKILLS
      TypeScript, React, Node.js, Python, MongoDB, Docker
      
      WORK EXPERIENCE
      Senior AI Engineer at TechCorp (2021 - Present)
    `;

    const parsed = parseResumeText(raw);
    expect(parsed.parsedContent.contactInfo?.email).toBe('jane.architect@example.com');
    expect(parsed.parsedContent.contactInfo?.phone).toBe('+1 (555) 234-5678');
    expect(parsed.parsedContent.skills).toContain('TypeScript');
    expect(parsed.parsedContent.skills).toContain('React');
    expect(parsed.confidence).toBeGreaterThanOrEqual(80);
  });
});

describe('Resume API Integration Tests', () => {
  const app = createApp();
  const testUploadDir = path.resolve('./test-uploads-resumes');
  let isDbAvailable = false;

  beforeAll(async () => {
    isDbAvailable = await connectDatabase();
    if (!isDbAvailable) {
      mongoose.set('bufferCommands', false);
    }
  });

  beforeEach(async () => {
    if (isDbAvailable && mongoose.connection.readyState === 1) {
      await ResumeModel.deleteMany({});
    }
    if (!fs.existsSync(testUploadDir)) {
      fs.mkdirSync(testUploadDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(testUploadDir)) {
      try {
        fs.rmSync(testUploadDir, { recursive: true, force: true });
      } catch {
        /* ignore cleanup */
      }
    }
  });

  it('POST /api/v1/resumes/upload should reject unsupported MIME types', async () => {
    const res = await request(app)
      .post('/api/v1/resumes/upload')
      .attach('file', Buffer.from('plain text file'), 'invalid.txt');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Only PDF and DOCX');
  });

  it('POST /api/v1/resumes/upload should upload PDF resume when DB is connected', async (ctx) => {
    if (!isDbAvailable) {
      ctx.skip();
      return;
    }

    const dummyPdfContent = Buffer.from(
      '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF'
    );

    const res1 = await request(app)
      .post('/api/v1/resumes/upload')
      .attach('file', dummyPdfContent, 'Jane_Resume.pdf');

    expect(res1.status).toBe(201);
    expect(res1.body.success).toBe(true);
    expect(res1.body.data.isMaster).toBe(true);
    expect(res1.body.data).toHaveProperty('checksum');

    const createdId = res1.body.data.id;

    const resDuplicate = await request(app)
      .post('/api/v1/resumes/upload')
      .attach('file', dummyPdfContent, 'Jane_Resume_Copy.pdf');

    expect(resDuplicate.status).toBe(200);
    expect(resDuplicate.body.message).toContain('Duplicate resume detected');
    expect(resDuplicate.body.data.id).toBe(createdId);
  });
});
