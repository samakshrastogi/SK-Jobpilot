import { describe, it, expect } from 'vitest';
import { GeminiProvider } from '../ai/providers/gemini.provider.js';
import { env } from '../config/env.js';

describe('Gemini SDK & Embedding Model Migration', () => {
  it('should initialize GeminiProvider cleanly using @google/genai', () => {
    const provider = new GeminiProvider();
    expect(provider.name).toBe('gemini');
  });

  it('should have default embedding model set to gemini-embedding-2', () => {
    expect(env.GEMINI_EMBEDDING_MODEL).toBe('gemini-embedding-2');
  });

  it('should have default text model set to gemini-2.5-flash', () => {
    expect(env.GEMINI_TEXT_MODEL).toBe('gemini-2.5-flash');
  });
});
