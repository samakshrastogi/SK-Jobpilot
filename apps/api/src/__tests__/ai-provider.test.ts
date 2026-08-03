import { describe, it, expect, beforeEach } from 'vitest';
import { MockAIProvider } from '../ai/providers/mock.provider.js';
import { aiBudgetManager } from '../ai/utils/budget-manager.js';
import { calculateCosineSimilarity } from '../ai/utils/cosine-similarity.js';
import { z } from 'zod';

describe('AI Provider Abstraction & Budget Manager', () => {
  let provider: MockAIProvider;

  beforeEach(() => {
    provider = new MockAIProvider();
  });

  it('should generate text response via MockAIProvider', async () => {
    const res = await provider.generateText({ prompt: 'Hello world test prompt' });
    expect(res.provider).toBe('mock');
    expect(res.data).toContain('Mock AI response');
    expect(res.usage.totalTokens).toBeGreaterThan(0);
  });

  it('should generate structured JSON response validating Zod schema', async () => {
    const schema = z.object({
      primaryTitle: z.string(),
      coreSkills: z.array(z.string()),
    });

    const res = await provider.generateStructured({
      prompt: 'Analyze candidate skills',
      schema,
      promptId: 'candidate-profile-analysis',
      promptVersion: '1.0',
    });

    expect(res.data.primaryTitle).toBe('Lead Software Architect');
    expect(res.data.coreSkills).toContain('TypeScript');
  });

  it('should compute vector cosine similarity accurately', () => {
    const vecA = [1, 0, 0];
    const vecB = [1, 0, 0];
    const vecC = [0, 1, 0];

    expect(calculateCosineSimilarity(vecA, vecB)).toBe(1.0);
    expect(calculateCosineSimilarity(vecA, vecC)).toBe(0.0);
  });

  it('should reject cosine similarity calculation for mismatched vector dimensions', () => {
    expect(() => calculateCosineSimilarity([1, 2], [1, 2, 3])).toThrow();
  });

  it('should track daily budget status cleanly', () => {
    aiBudgetManager.recordSuccess(150);
    const status = aiBudgetManager.getStatus();
    expect(status.dailyRequestsCount).toBeGreaterThanOrEqual(1);
    expect(status.circuitState).toBe('closed');
  });
});
