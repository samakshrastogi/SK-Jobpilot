import { TargetRoleModel } from '../models/target-role.model.js';
import { AutomationConfigurationModel } from '../models/automation-configuration.model.js';
import { DiscoverySourceModel } from '../models/discovery-source.model.js';
import { executeDiscoveryRun } from '../discovery/services/scheduler.service.js';

export async function executeHourlyDiscoveryPipeline() {
  const config = await AutomationConfigurationModel.findOne();
  if (config && !config.enabled) {
    return { status: 'skipped', reason: 'Automation is currently disabled by user configuration.' };
  }

  const activeRoles = await TargetRoleModel.find({ active: true });
  if (activeRoles.length === 0) {
    return { status: 'skipped', reason: 'No active target roles selected.' };
  }

  const activeSources = await DiscoverySourceModel.find({ enabled: true });
  let totalDiscovered = 0;
  let totalInserted = 0;

  for (const source of activeSources) {
    try {
      const res = await executeDiscoveryRun(source.id.toString(), 'scheduled');
      totalDiscovered += res.jobsDiscovered;
      totalInserted += res.jobsInserted;
    } catch {
      // Continue to next source gracefully
    }
  }

  // Update automation configuration execution status
  if (config) {
    config.lastRunAt = new Date();
    config.nextRunAt = new Date(Date.now() + 60 * 60 * 1000);
    await config.save();
  }

  return {
    status: 'completed',
    rolesProcessedCount: activeRoles.length,
    sourcesRunCount: activeSources.length,
    jobsDiscovered: totalDiscovered,
    jobsInserted: totalInserted,
    executedAt: new Date().toISOString(),
  };
}
