import { z } from 'zod';

export interface AIUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface AIResponse<T = string> {
  data: T;
  rawText: string;
  provider: string;
  model: string;
  usage: AIUsage;
  durationMs: number;
}

export interface AITextRequest {
  systemInstruction?: string;
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
  timeoutMs?: number;
}

export interface AIStructuredRequest<T> extends AITextRequest {
  schema: z.ZodSchema<T>;
  promptId: string;
  promptVersion: string;
}

export interface AIEmbeddingRequest {
  text: string;
  model?: string;
}

export interface AIEmbeddingResponse {
  embedding: number[];
  dimension: number;
  model: string;
  usage: AIUsage;
}

export interface AIProvider {
  name: string;
  generateText(request: AITextRequest): Promise<AIResponse<string>>;
  generateStructured<T>(request: AIStructuredRequest<T>): Promise<AIResponse<T>>;
  generateEmbedding(request: AIEmbeddingRequest): Promise<AIEmbeddingResponse>;
  isAvailable(): Promise<boolean>;
}

export class AIError extends Error {
  public readonly code: string;
  public readonly isRetryable: boolean;
  public readonly originalError?: unknown;

  constructor(
    message: string,
    code = 'AI_PROVIDER_ERROR',
    isRetryable = false,
    originalError?: unknown
  ) {
    super(message);
    this.name = 'AIError';
    this.code = code;
    this.isRetryable = isRetryable;
    this.originalError = originalError;
  }
}
