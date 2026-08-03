import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    fileParallelism: false,
    maxConcurrency: 1,
    alias: {
      '@sk-job-pilot/shared': path.resolve(__dirname, '../../packages/shared/dist/index.js'),
      '@sk-job-pilot/config': path.resolve(__dirname, '../../packages/config'),
    },
  },
});
