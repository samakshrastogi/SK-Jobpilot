import { extractTextFromPdf, type ExtractionResult } from './pdf-extractor.js';
import { extractTextFromDocx } from './docx-extractor.js';

export async function extractDocumentText(
  buffer: Buffer,
  mimeType: string,
  filename: string
): Promise<ExtractionResult> {
  const ext = filename.toLowerCase().split('.').pop() || '';

  if (mimeType === 'application/pdf' || ext === 'pdf') {
    return extractTextFromPdf(buffer);
  }

  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword' ||
    ext === 'docx' ||
    ext === 'doc'
  ) {
    return extractTextFromDocx(buffer);
  }

  return {
    text: '',
    pageCount: 0,
    warnings: [`Unsupported MIME type: ${mimeType}`],
    requiresOcr: false,
  };
}
