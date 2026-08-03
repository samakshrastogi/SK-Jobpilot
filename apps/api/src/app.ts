import express, { type Express, type Request } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import pinoHttpModule from 'pino-http';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { requestIdMiddleware } from './middlewares/request-id.js';
import { globalRateLimiter } from './middlewares/rate-limiter.js';
import { notFoundHandler } from './middlewares/not-found.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { apiRouter } from './routes/index.js';

// Resolve pinoHttp function across ESM/CJS interop
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pinoHttp =
  (pinoHttpModule as any).default || (pinoHttpModule as any).pinoHttp || pinoHttpModule;

export function createApp(): Express {
  const app: Express = express();

  // Basic security & optimization middlewares
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        const allowedWebOrigins = new Set([env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173']);
        callback(null, !origin || allowedWebOrigins.has(origin) || origin.startsWith('chrome-extension://'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    })
  );
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Custom request ID & rate limiting
  app.use(requestIdMiddleware);
  app.use(globalRateLimiter);

  // Request logging middleware
  if (env.NODE_ENV !== 'test') {
    app.use(
      pinoHttp({
        logger,
        customProps: (req: Request) => ({
          requestId: req.headers['x-request-id'],
        }),
      })
    );
  }

  // Mount API routes under /api/v1
  app.use('/api/v1', apiRouter);

  // 404 & Error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
