import type { ApiResponse } from '@sk-job-pilot/shared';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api/v1';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number = 500, code: string = 'UNKNOWN_ERROR', details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  timeoutMs?: number;
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { body, timeoutMs = 10000, params, headers, ...customConfig } = options;

  let url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const config: RequestInit = {
    method: customConfig.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    signal: options.signal || controller.signal,
    ...customConfig,
  };

  if (body) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    const data = (await response.json().catch(() => ({
      success: response.ok,
      message: response.statusText || 'Response parsing failed',
    }))) as ApiResponse<T>;

    if (!response.ok || !data.success) {
      throw new ApiError(
        data.message || 'API request failed',
        response.status,
        data.error?.code || 'HTTP_ERROR',
        data.error?.details
      );
    }

    return data;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) {
      throw err;
    }

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request timed out or was cancelled', 408, 'REQUEST_TIMEOUT');
    }

    const message = err instanceof Error ? err.message : 'Network failure or server unavailable';
    throw new ApiError(message, 500, 'NETWORK_ERROR');
  }
}
