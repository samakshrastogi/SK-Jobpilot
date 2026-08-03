import { URL } from 'url';
import { AppError } from '../../errors/app-error.js';

export function validateUrlForSsrf(targetUrl: string): URL {
  if (!targetUrl || typeof targetUrl !== 'string') {
    throw AppError.badRequest('Target URL is required');
  }

  let parsed: URL;
  try {
    parsed = new URL(targetUrl);
  } catch {
    throw AppError.badRequest(`Invalid URL format: ${targetUrl}`);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw AppError.badRequest(`Protocol ${parsed.protocol} is not supported. Only http and https are allowed.`);
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost and loopbacks
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.local')
  ) {
    throw AppError.badRequest(`Access to internal host ${hostname} is blocked for SSRF protection.`);
  }

  // Block private IPv4 ranges
  if (
    /^10\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) ||
    /^169\.254\./.test(hostname)
  ) {
    throw AppError.badRequest(`Access to private IP ${hostname} is blocked for SSRF protection.`);
  }

  return parsed;
}

export async function safeFetch(url: string, options: { timeoutMs?: number; maxSizeMb?: number } = {}): Promise<string> {
  validateUrlForSsrf(url);

  const timeoutMs = options.timeoutMs || 15000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'SK-JobPilot-Bot/1.0 (Compliant Job Assistant)',
        Accept: 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,*/*;q=0.8',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    const maxSize = (options.maxSizeMb || 5) * 1024 * 1024;
    if (text.length > maxSize) {
      throw new Error(`Response size exceeds maximum limit of ${options.maxSizeMb || 5}MB`);
    }

    return text;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if ((err as Error).name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw err;
  }
}
