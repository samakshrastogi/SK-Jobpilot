import mammoth from 'mammoth';
import type { ExtractionResult } from './pdf-extractor.js';

export async function extractTextFromDocx(buffer: Buffer): Promise<ExtractionResult> {
  const warnings: string[] = [];
  try {
    const result = await mammoth.extractRawText({ buffer });
    const rawText = result.value || '';
    const trimmed = rawText.trim();

    if (result.messages && result.messages.length > 0) {
      result.messages.forEach((m) => warnings.push(`DOCX Warning: ${m.message}`));
    }

    if (trimmed.length < 30) {
      warnings.push('DOCX yields fewer than 30 characters of text.');
    }

    return {
      text: rawText,
      pageCount: 1,
      warnings,
      requiresOcr: trimmed.length < 30,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'DOCX extraction error';
    warnings.push(`DOCX Extraction error: ${message}`);
    return {
      text: '',
      pageCount: 0,
      warnings,
      requiresOcr: false,
    };
  }
}
