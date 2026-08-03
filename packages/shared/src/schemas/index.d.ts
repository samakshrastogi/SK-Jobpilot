import { z } from 'zod';
export declare const envSchema: z.ZodObject<
  {
    NODE_ENV: z.ZodDefault<z.ZodEnum<['development', 'production', 'test']>>;
    PORT: z.ZodDefault<z.ZodNumber>;
    CLIENT_URL: z.ZodDefault<z.ZodString>;
    MONGODB_URI: z.ZodDefault<z.ZodString>;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<['fatal', 'error', 'warn', 'info', 'debug', 'trace']>>;
    VITE_API_BASE_URL: z.ZodDefault<z.ZodString>;
    GEMINI_API_KEY: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    GEMINI_MODEL: z.ZodDefault<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: number;
    CLIENT_URL: string;
    MONGODB_URI: string;
    LOG_LEVEL: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
    VITE_API_BASE_URL: string;
    GEMINI_API_KEY: string;
    GEMINI_MODEL: string;
  },
  {
    NODE_ENV?: 'development' | 'production' | 'test' | undefined;
    PORT?: number | undefined;
    CLIENT_URL?: string | undefined;
    MONGODB_URI?: string | undefined;
    LOG_LEVEL?: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | undefined;
    VITE_API_BASE_URL?: string | undefined;
    GEMINI_API_KEY?: string | undefined;
    GEMINI_MODEL?: string | undefined;
  }
>;
export type EnvConfig = z.infer<typeof envSchema>;
export declare const paginationQuerySchema: z.ZodObject<
  {
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<['asc', 'desc']>>>;
    search: z.ZodOptional<z.ZodString>;
  },
  'strip',
  z.ZodTypeAny,
  {
    page: number;
    limit: number;
    sortOrder: 'asc' | 'desc';
    sortBy?: string | undefined;
    search?: string | undefined;
  },
  {
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: 'asc' | 'desc' | undefined;
    search?: string | undefined;
  }
>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
//# sourceMappingURL=index.d.ts.map
