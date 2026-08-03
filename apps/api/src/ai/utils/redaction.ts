export function sanitizeLogText(text: string): string {
  if (!text) return '';
  let sanitized = text;
  // Redact API Keys
  sanitized = sanitized.replace(/AIzaSy[A-Za-z0-9_-]{33}/g, '[REDACTED_API_KEY]');
  sanitized = sanitized.replace(/([a-zA-Z0-9_-]{30,60})/g, (match) => {
    if (match.toLowerCase().includes('key') || match.toLowerCase().includes('token')) {
      return '[REDACTED_SECRET]';
    }
    return match;
  });
  // Redact Emails
  sanitized = sanitized.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    '[REDACTED_EMAIL]'
  );
  // Redact Phone Numbers
  sanitized = sanitized.replace(
    /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    '[REDACTED_PHONE]'
  );
  return sanitized;
}

export function generateFingerprint(input: string): string {
  if (!input) return 'empty';
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `fp_${Math.abs(hash).toString(36)}`;
}
