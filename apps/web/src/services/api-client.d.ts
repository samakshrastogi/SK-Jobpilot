import type { ApiResponse } from '@sk-job-pilot/shared';
export declare class ApiError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly details?: unknown;
    constructor(message: string, statusCode?: number, code?: string, details?: unknown);
}
export interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: any;
    timeoutMs?: number;
    params?: Record<string, string | number | boolean | undefined>;
}
export declare function apiFetch<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>>;
//# sourceMappingURL=api-client.d.ts.map