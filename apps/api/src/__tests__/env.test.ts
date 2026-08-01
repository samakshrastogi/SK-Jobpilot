import { describe, it, expect } from 'vitest';
import { envSchema } from '@sk-job-pilot/shared';

describe('Environment Validation', () => {
  it('should validate default environment variables correctly', () => {
    const validEnv = {
      PORT: '5000',
      NODE_ENV: 'development',
      CLIENT_URL: 'http://localhost:5173',
      MONGODB_URI: 'mongodb://127.0.0.1:27017/sk_job_pilot',
      LOG_LEVEL: 'info',
      VITE_API_BASE_URL: 'http://localhost:5000/api/v1',
    };

    const parsed = envSchema.safeParse(validEnv);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.PORT).toBe(5000);
      expect(parsed.data.NODE_ENV).toBe('development');
    }
  });

  it('should fail on invalid URL', () => {
    const invalidEnv = {
      CLIENT_URL: 'invalid-url',
    };

    const parsed = envSchema.safeParse(invalidEnv);
    expect(parsed.success).toBe(false);
  });
});
