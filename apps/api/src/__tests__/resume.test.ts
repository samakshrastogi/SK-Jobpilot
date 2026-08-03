import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../app.js';
import { extractTextFromPdf } from '../services/extraction/pdf-extractor.js';
import { parseResumeText } from '../services/parsing/deterministic-parser.service.js';
import { env } from '../config/env.js';

const app = createApp();

describe('Resume Pure Functions Unit Tests', () => {
  it('extractTextFromPdf should detect scanned/short PDFs as requiresOcr', async () => {
    const dummyPdfContent = Buffer.from(
      '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF'
    );

    const result = await extractTextFromPdf(dummyPdfContent);
    expect(result.requiresOcr).toBe(true);
    expect(result.text).toBe('');
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('parseResumeText should extract email, phone, and skills from raw text', () => {
    const sampleText = `
      Samaksh Rastogi
      Senior Software Engineer
      Email: samaksh@example.com
      Phone: +1 555-019-2834
      Skills: TypeScript, Node.js, Express, React, MongoDB, Python, Docker.

      Experience:
      Senior Developer at Tech Corp (2022 - Present)
      - Built REST API services handling high traffic.
    `;

    const parsed = parseResumeText(sampleText);
    expect(parsed.parsedContent.contactInfo?.email).toBe('samaksh@example.com');
    expect(parsed.parsedContent.contactInfo?.phone).toBe('+1 555-019-2834');
    expect(parsed.parsedContent.skills).toContain('TypeScript');
    expect(parsed.parsedContent.skills).toContain('Node.js');
    expect(parsed.parsedContent.skills).toContain('React');
  });
});

describe('Resume API Integration Tests', () => {
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
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('POST /api/v1/resumes/upload should reject unsupported MIME types', async () => {
    const res = await request(app)
      .post('/api/v1/resumes/upload')
      .attach('file', Buffer.from('console.log("hello");'), 'script.js');

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
      .attach('file', dummyPdfContent, 'Candidate_Resume.pdf');

    expect([200, 201]).toContain(res1.status);
    expect(res1.body.success).toBe(true);
    expect(res1.body.data._id || res1.body.data.id).toBeDefined();
    expect(res1.body.data).toHaveProperty('checksum');

    const createdId = res1.body.data._id || res1.body.data.id;

    const resDuplicate = await request(app)
      .post('/api/v1/resumes/upload')
      .attach('file', dummyPdfContent, 'Candidate_Resume_Copy.pdf');

    expect(resDuplicate.status).toBe(200);
    expect(resDuplicate.body.message).toContain('Duplicate resume detected');
    expect(resDuplicate.body.data._id || resDuplicate.body.data.id).toBe(createdId);
  });
});
