import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { connectDatabase, disconnectDatabase, getDatabaseStatus } from './database/connection.js';
import { startApplicationAgentScheduler, stopApplicationAgentScheduler } from './services/application-agent-scheduler.service.js';

async function startServer() {
  // Connect to database (handles disconnection gracefully)
  await connectDatabase();

  const databaseRetryTimer = setInterval(() => {
    if (getDatabaseStatus() === 'disconnected') void connectDatabase();
  }, 10000);
  databaseRetryTimer.unref();

  startApplicationAgentScheduler();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 SK JobPilot Backend API listening on http://localhost:${env.PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    stopApplicationAgentScheduler();
    server.close(async () => {
      logger.info('HTTP server closed.');
      await disconnectDatabase();
      process.exit(0);
    });

    // Force exit after 10s timeout
    setTimeout(() => {
      logger.error('Could not close connections in time, forcing exit.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((error) => {
  logger.error({ error }, 'Failed to start server');
  process.exit(1);
});
