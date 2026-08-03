import { describe, expect, it } from 'vitest';
import { isRoleAligned } from '../services/application-agent.service.js';

describe('application agent policy', () => {
  it('accepts selected role-family titles and rejects unrelated jobs', () => {
    expect(isRoleAligned('Senior Backend Software Engineer', ['Backend Engineer'])).toBe(true);
    expect(isRoleAligned('Product Marketing Manager', ['Backend Engineer'])).toBe(false);
  });

  it('allows processing when no target roles are configured', () => {
    expect(isRoleAligned('Software Engineer', [])).toBe(true);
  });
});