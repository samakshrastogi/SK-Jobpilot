import { AutomationConfigurationModel } from '../models/automation-configuration.model.js';
import { getDatabaseStatus } from '../database/connection.js';
import { executeApplicationAgent } from './application-agent.service.js';
import { logger } from '../utils/logger.js';

let schedulerTimer: NodeJS.Timeout | null = null;

export function startApplicationAgentScheduler(): void {
  if (schedulerTimer) return;
  schedulerTimer = setInterval(() => { void runIfDue(); }, 60_000);
  schedulerTimer.unref();
  void runIfDue();
}

export function stopApplicationAgentScheduler(): void {
  if (schedulerTimer) clearInterval(schedulerTimer);
  schedulerTimer = null;
}

async function runIfDue(): Promise<void> {
  if (getDatabaseStatus() !== 'connected') return;
  const config = await AutomationConfigurationModel.findOne();
  if (!config?.enabled) return;
  if (config.nextRunAt && config.nextRunAt.getTime() > Date.now()) return;
  try {
    await executeApplicationAgent('scheduled');
  } catch (error) {
    logger.error({ error }, 'Scheduled application agent run failed');
  }
}