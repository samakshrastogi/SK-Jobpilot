import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env.js';
import type { SystemReadiness } from '@sk-job-pilot/shared';

export async function checkSystemReadiness(): Promise<SystemReadiness> {
  const dbConnected = mongoose.connection.readyState === 1;
  const hasAiKey = Boolean(env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim().length > 0);

  let storageWritable = false;
  try {
    const dir = path.resolve(env.RESUME_STORAGE_DIR);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const testFile = path.join(dir, `.write_test_${Date.now()}`);
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    storageWritable = true;
  } catch {
    storageWritable = false;
  }

  const isHealthy = dbConnected && storageWritable;
  const status = isHealthy ? (hasAiKey ? 'healthy' : 'degraded') : 'unhealthy';

  return {
    status,
    nodeVersion: process.version,
    database: dbConnected ? 'connected' : 'disconnected',
    redis: 'fallback_in_memory',
    aiProvider: hasAiKey ? 'ready' : 'missing_key',
    storageDirWritable: storageWritable,
    configuredTextModel: env.GEMINI_TEXT_MODEL,
    configuredEmbeddingModel: env.GEMINI_EMBEDDING_MODEL,
    timestamp: new Date().toISOString(),
  };
}

export function getPublicCapabilities() {
  return {
    appVersion: '1.0.0',
    apiVersion: 'v1',
    singleUserMode: true,
    authenticationEnabled: false,
    features: {
      aiEnabled: env.ENABLE_AI_FEATURES,
      embeddingsEnabled: env.ENABLE_EMBEDDINGS,
      discoveryEnabled: true,
      browserAssistantEnabled: true,
      interviewSimulatorEnabled: true,
    },
    configuredModels: {
      text: env.GEMINI_TEXT_MODEL,
      embedding: env.GEMINI_EMBEDDING_MODEL,
    },
  };
}
