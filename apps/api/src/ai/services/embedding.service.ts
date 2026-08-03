import { VectorEmbeddingModel } from '../../models/vector-embedding.model.js';
import { getAIProvider } from '../provider-factory.js';
import { generateFingerprint } from '../utils/redaction.js';
import { calculateCosineSimilarity } from '../utils/cosine-similarity.js';

export async function getOrCreateEmbedding(
  entityType: 'candidate_profile' | 'resume' | 'job_description' | 'job_requirements',
  entityId: string,
  text: string
): Promise<number[]> {
  const fingerprint = generateFingerprint(text);

  const existing = await VectorEmbeddingModel.findOne({ entityType, entityId, fingerprint });
  if (existing) {
    return existing.embedding;
  }

  const provider = getAIProvider();
  const response = await provider.generateEmbedding({ text });

  await VectorEmbeddingModel.create({
    entityType,
    entityId,
    fingerprint,
    provider: 'gemini',
    model: response.model,
    dimension: response.dimension,
    embedding: response.embedding,
  });

  return response.embedding;
}

export async function computeSimilarityBetweenEntities(
  typeA: 'candidate_profile' | 'resume' | 'job_description' | 'job_requirements',
  idA: string,
  textA: string,
  typeB: 'candidate_profile' | 'resume' | 'job_description' | 'job_requirements',
  idB: string,
  textB: string
): Promise<number> {
  const [vecA, vecB] = await Promise.all([
    getOrCreateEmbedding(typeA, idA, textA),
    getOrCreateEmbedding(typeB, idB, textB),
  ]);

  return calculateCosineSimilarity(vecA, vecB);
}
