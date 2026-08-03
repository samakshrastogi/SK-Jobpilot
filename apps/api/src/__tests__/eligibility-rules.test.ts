import { describe, expect, it } from 'vitest';
import { evaluateMandatoryEligibility } from '../services/eligibility-rules.service.js';

describe('mandatory eligibility rules', () => {
  it('hard-blocks rigid experience requirements above candidate experience', () => {
    const result = evaluateMandatoryEligibility({ title: 'Backend Engineer', description: 'Minimum 4 years required. Must have Python.', employmentType: 'full_time', candidateExperienceYears: 2, candidateSkills: ['Python'] });
    expect(result.decision).toBe('skip');
    expect(result.hardBlockers[0]).toContain('4 years');
  });

  it('hard-blocks internships and excluded seniority', () => {
    const result = evaluateMandatoryEligibility({ title: 'Senior Software Engineering Intern', description: 'Build APIs with Node.js.', employmentType: 'internship', candidateExperienceYears: 2, candidateSkills: ['Node.js'] });
    expect(result.hardBlockers).toHaveLength(2);
    expect(result.decision).toBe('skip');
  });

  it('does not turn nice-to-have gaps into hard blockers', () => {
    const result = evaluateMandatoryEligibility({ title: 'Software Engineer I', description: 'Build TypeScript APIs. Terraform is nice to have.', employmentType: 'full_time', candidateExperienceYears: 2, candidateSkills: ['TypeScript'] });
    expect(result.hardBlockers).toEqual([]);
    expect(result.strengths).toContain('TypeScript');
  });
});
