import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Health Endpoints', () => {
  const app = createApp();

  it('GET /api/v1/health should return 200 and healthy status', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('API');
    expect(['healthy', 'degraded']).toContain(res.body.data.status);
    expect(res.body.data).toHaveProperty('database');
    expect(res.body.data).toHaveProperty('uptime');
  });

  it('GET /api/v1/health/database should return status payload', async () => {
    const res = await request(app).get('/api/v1/health/database');

    expect([200, 503]).toContain(res.status);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('database');
  });
});
