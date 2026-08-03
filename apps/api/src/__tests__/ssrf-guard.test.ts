import { describe, it, expect } from 'vitest';
import { validateUrlForSsrf } from '../discovery/utils/ssrf-guard.js';

describe('SSRF Protection Guard', () => {
  it('should allow valid public HTTP/HTTPS URLs', () => {
    expect(() => validateUrlForSsrf('https://boards-api.greenhouse.io/v1/boards/stripe/jobs')).not.toThrow();
    expect(() => validateUrlForSsrf('https://api.lever.co/v0/postings/airbnb')).not.toThrow();
  });

  it('should reject localhost and loopback addresses', () => {
    expect(() => validateUrlForSsrf('http://localhost:5000/admin')).toThrow(/blocked for SSRF/);
    expect(() => validateUrlForSsrf('http://127.0.0.1:8080')).toThrow(/blocked for SSRF/);
    expect(() => validateUrlForSsrf('http://0.0.0.0:3000')).toThrow(/blocked for SSRF/);
  });

  it('should reject private IPv4 address ranges', () => {
    expect(() => validateUrlForSsrf('http://10.0.0.1/secret')).toThrow(/blocked for SSRF/);
    expect(() => validateUrlForSsrf('http://192.168.1.1/config')).toThrow(/blocked for SSRF/);
    expect(() => validateUrlForSsrf('http://172.16.0.1/internal')).toThrow(/blocked for SSRF/);
  });

  it('should reject cloud metadata endpoints (169.254.169.254)', () => {
    expect(() => validateUrlForSsrf('http://169.254.169.254/latest/meta-data/')).toThrow(/blocked for SSRF/);
  });

  it('should reject non-HTTP/HTTPS protocols', () => {
    expect(() => validateUrlForSsrf('file:///etc/passwd')).toThrow(/Protocol file: is not supported/);
    expect(() => validateUrlForSsrf('ftp://example.com/file')).toThrow(/Protocol ftp: is not supported/);
  });
});
