import pdfParse from 'pdf-parse';

export interface ExtractionResult {
  text: string;
  pageCount: number;
  warnings: string[];
  requiresOcr: boolean;
}

export async function extractTextFromPdf(buffer: Buffer): Promise<ExtractionResult> {
  const warnings: string[] = [];
  try {
    const data = await pdfParse(buffer);
    const rawText = data.text || '';
    const trimmed = rawText.trim();
    const pageCount = data.numpages || 1;

    if (trimmed.length < 30) {
      warnings.push(
        'PDF yields fewer than 30 characters of text. Document appears to be a scanned image.'
      );
      return {
        text: trimmed,
        pageCount,
        warnings,
        requiresOcr: true,
      };
    }

    return {
      text: rawText,
      pageCount,
      warnings,
      requiresOcr: false,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'PDF extraction error';
    warnings.push(`PDF Parsing notice: ${message}`);
    return {
      text: '',
      pageCount: 0,
      warnings,
      requiresOcr: true,
    };
  }
}
