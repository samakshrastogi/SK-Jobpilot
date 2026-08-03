import { env } from '../config/env.js';
import type { AIProvider } from './types.js';
import { GeminiProvider } from './providers/gemini.provider.js';
import { MockAIProvider } from './providers/mock.provider.js';

let activeProviderInstance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (activeProviderInstance) {
    return activeProviderInstance;
  }

  const providerType = env.AI_PROVIDER || 'gemini';

  if (providerType === 'mock' || env.NODE_ENV === 'test') {
    activeProviderInstance = new MockAIProvider();
    return activeProviderInstance;
  }

  activeProviderInstance = new GeminiProvider();
  return activeProviderInstance;
}

export function setAIProvider(provider: AIProvider): void {
  activeProviderInstance = provider;
}
