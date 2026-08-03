import dotenv from 'dotenv';
import path from 'path';
import { envSchema, type EnvConfig } from '@sk-job-pilot/shared';

// Load .env file from root or local working directory
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  // Print formatted validation error and throw
  const formattedErrors = parseResult.error.format();
  process.stderr.write(
    `❌ Invalid environment variables:\n${JSON.stringify(formattedErrors, null, 2)}\n`
  );
  throw new Error('Invalid environment configuration');
}

function useIsolatedTestDatabase(config: EnvConfig): EnvConfig {
  if (!process.env.VITEST) return config;
  const isolatedUri = config.MONGODB_URI.replace(/\/([^/?]+)(\?|$)/, (_match, databaseName: string, suffix: string) => {
    const safeName = databaseName.endsWith('_test') ? databaseName : `${databaseName}_test`;
    return `/${safeName}${suffix}`;
  });
  return { ...config, NODE_ENV: 'test', MONGODB_URI: isolatedUri };
}

export const env: EnvConfig = useIsolatedTestDatabase(parseResult.data);
