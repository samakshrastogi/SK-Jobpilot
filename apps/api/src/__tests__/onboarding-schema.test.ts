import { describe, expect, it } from 'vitest';
import { selectTargetRolesSchema, updateOnboardingStepSchema } from '@sk-job-pilot/shared';

describe('onboarding contracts', () => {
  it('accepts multiple roles, trims them, and removes duplicates', () => {
    const result = selectTargetRolesSchema.parse({
      roleTitles: [' Backend Engineer ', 'Full Stack Engineer', 'Backend Engineer'],
    });

    expect(result.roleTitles).toEqual(['Backend Engineer', 'Full Stack Engineer']);
  });

  it('requires at least one valid target role', () => {
    expect(() => selectTargetRolesSchema.parse({ roleTitles: [] })).toThrow();
    expect(() => selectTargetRolesSchema.parse({ roleTitles: [''] })).toThrow();
  });

  it('allows only wizard steps one through six', () => {
    expect(updateOnboardingStepSchema.parse({ step: 6 })).toEqual({ step: 6 });
    expect(() => updateOnboardingStepSchema.parse({ step: 0 })).toThrow();
    expect(() => updateOnboardingStepSchema.parse({ step: 7 })).toThrow();
  });
});