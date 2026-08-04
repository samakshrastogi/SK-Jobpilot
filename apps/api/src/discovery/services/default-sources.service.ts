import { DiscoverySourceModel } from '../../models/discovery-source.model.js';

const DEFAULT_SOURCES = [
  {
    name: 'Jobicy live remote jobs', providerType: 'jobicy' as const, companyName: 'Multiple companies',
    careersUrl: 'https://jobicy.com/api/v2/remote-jobs', enabled: true, scheduleEnabled: true, scheduleExpression: '0 * * * *',
  },
  {
    name: 'Remotive live remote jobs', providerType: 'remotive' as const, companyName: 'Multiple companies',
    careersUrl: 'https://remotive.com/api/remote-jobs', enabled: true, scheduleEnabled: true, scheduleExpression: '15 */6 * * *',
  },
  {
    name: 'The Muse India software jobs', providerType: 'themuse' as const, companyName: 'Multiple companies',
    careersUrl: 'https://www.themuse.com/api/public/jobs', enabled: true, scheduleEnabled: true, scheduleExpression: '30 */4 * * *',
  },
];

export async function ensureDefaultDiscoverySources(): Promise<void> {
  await Promise.all(DEFAULT_SOURCES.map((source) => DiscoverySourceModel.updateOne(
    { providerType: source.providerType, careersUrl: source.careersUrl },
    { $setOnInsert: source },
    { upsert: true },
  )));
}
