import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

mongoose.set('bufferCommands', false);

let isConnected = false;

export async function connectDatabase(): Promise<boolean> {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return true;
  }

  try {
    logger.info('Attempting MongoDB connection...');
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    logger.info('Database connected successfully');
    return true;
  } catch (error) {
    isConnected = false;
    logger.warn(
      { error },
      'Database connection failed. Database-backed endpoints will return 503.'
    );
    return false;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
      isConnected = false;
      logger.info('Database disconnected cleanly.');
    } catch (error) {
      logger.error({ error }, 'Error disconnecting database');
    }
  }
}

export function getDatabaseStatus(): 'connected' | 'disconnected' | 'connecting' {
  const state = mongoose.connection.readyState;
  switch (state) {
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    default:
      return 'disconnected';
  }
}
