import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import {
  type AIProvider,
  type AITextRequest,
  type AIStructuredRequest,
  type AIEmbeddingRequest,
  type AIResponse,
  type AIEmbeddingResponse,
  AIError,
} from '../types.js';
import { aiBudgetManager } from '../utils/budget-manager.js';
import { sanitizeLogText } from '../utils/redaction.js';

export class GeminiProvider implements AIProvider {
  public readonly name = 'gemini';
  private client: GoogleGenAI | null = null;

  constructor() {
    if (env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim().length > 0) {
      this.client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY.trim() });
    }
  }

  private getClient(): GoogleGenAI {
    if (!this.client) {
      if (env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim().length > 0) {
        this.client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY.trim() });
      } else {
        throw new AIError('GEMINI_API_KEY is not configured on server.', 'MISSING_API_KEY', false);
      }
    }
    return this.client;
  }

  public async isAvailable(): Promise<boolean> {
    return Boolean(env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim().length > 0);
  }

  private async executeWithRetry<R>(fn: () => Promise<R>, maxRetries = env.AI_MAX_RETRIES): Promise<R> {
    let attempt = 0;
    let delay = 500;

    while (attempt <= maxRetries) {
      try {
        aiBudgetManager.checkBudgetAndCircuit();
        return await fn();
      } catch (error: unknown) {
        attempt++;
        const isRetryable =
          error instanceof Error &&
          (error.message.includes('429') ||
            error.message.includes('RESOURCE_EXHAUSTED') ||
            error.message.includes('503') ||
            error.message.includes('fetch failed') ||
            error.message.includes('ETIMEDOUT'));

        if (!isRetryable || attempt > maxRetries) {
          aiBudgetManager.recordFailure();
          const safeMessage = sanitizeLogText(error instanceof Error ? error.message : String(error));
          logger.error({ error: safeMessage, attempt }, 'Gemini Provider execution failed.');
          throw new AIError(`Gemini error: ${safeMessage}`, 'GEMINI_EXECUTION_FAILED', isRetryable, error);
        }

        const jitter = Math.random() * 200;
        logger.warn({ attempt, delay: delay + jitter }, 'Retrying Gemini API call...');
        await new Promise((resolve) => setTimeout(resolve, delay + jitter));
        delay *= 2;
      }
    }
    throw new AIError('Max retries exceeded for Gemini request', 'MAX_RETRIES_EXCEEDED', false);
  }

  public async generateText(request: AITextRequest): Promise<AIResponse<string>> {
    const client = this.getClient();
    const startTime = Date.now();
    const modelName = env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash';

    return this.executeWithRetry(async () => {
      const response = await client.models.generateContent({
        model: modelName,
        contents: request.prompt,
        config: {
          systemInstruction: request.systemInstruction,
          temperature: request.temperature ?? env.AI_DEFAULT_TEMPERATURE,
          maxOutputTokens: request.maxOutputTokens ?? 4096,
        },
      });

      const rawText = response.text || '';
      const durationMs = Date.now() - startTime;
      const usageMetadata = response.usageMetadata;
      const usage = {
        inputTokens: usageMetadata?.promptTokenCount || 0,
        outputTokens: usageMetadata?.candidatesTokenCount || 0,
        totalTokens: usageMetadata?.totalTokenCount || 0,
        estimatedCostUsd: ((usageMetadata?.totalTokenCount || 0) / 1000000) * 0.15,
      };

      aiBudgetManager.recordSuccess(usage.totalTokens);

      return {
        data: rawText,
        rawText,
        provider: this.name,
        model: modelName,
        usage,
        durationMs,
      };
    });
  }

  public async generateStructured<T>(request: AIStructuredRequest<T>): Promise<AIResponse<T>> {
    const client = this.getClient();
    const startTime = Date.now();
    const modelName = env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash';

    return this.executeWithRetry(async () => {
      const response = await client.models.generateContent({
        model: modelName,
        contents: request.prompt,
        config: {
          systemInstruction: `${request.systemInstruction || ''}\nIMPORTANT: Respond ONLY with valid, raw JSON matching schema. Do not wrap in markdown codeblocks or quotes.`,
          temperature: request.temperature ?? env.AI_DEFAULT_TEMPERATURE,
          responseMimeType: 'application/json',
        },
      });

      const rawText = response.text || '';
      const durationMs = Date.now() - startTime;

      let cleaned = rawText.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
      }

      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(cleaned);
      } catch (jsonErr) {
        throw new AIError(`Failed to parse Gemini output as JSON: ${(jsonErr as Error).message}`, 'INVALID_JSON_OUTPUT', false);
      }

      const validateResult = request.schema.safeParse(parsedJson);
      if (!validateResult.success) {
        logger.warn({ errors: validateResult.error.format() }, 'Zod schema validation failure on Gemini output.');
        throw new AIError('Gemini output failed Zod schema validation contract', 'SCHEMA_VALIDATION_FAILED', false);
      }

      const usageMetadata = response.usageMetadata;
      const usage = {
        inputTokens: usageMetadata?.promptTokenCount || 0,
        outputTokens: usageMetadata?.candidatesTokenCount || 0,
        totalTokens: usageMetadata?.totalTokenCount || 0,
        estimatedCostUsd: ((usageMetadata?.totalTokenCount || 0) / 1000000) * 0.15,
      };

      aiBudgetManager.recordSuccess(usage.totalTokens);

      return {
        data: validateResult.data,
        rawText,
        provider: this.name,
        model: modelName,
        usage,
        durationMs,
      };
    });
  }

  public async generateEmbedding(request: AIEmbeddingRequest): Promise<AIEmbeddingResponse> {
    const client = this.getClient();
    const modelName = request.model || env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-2';

    return this.executeWithRetry(async () => {
      const response = await client.models.embedContent({
        model: modelName,
        contents: request.text,
      });

      const embedding: number[] = (response as any).embedding?.values || (response as any).embeddings?.[0]?.values || [];
      const usage = {
        inputTokens: Math.ceil(request.text.length / 4),
        outputTokens: 0,
        totalTokens: Math.ceil(request.text.length / 4),
        estimatedCostUsd: 0,
      };

      aiBudgetManager.recordSuccess(usage.totalTokens);

      return {
        embedding,
        dimension: embedding.length,
        model: modelName,
        usage,
      };
    });
  }
}
