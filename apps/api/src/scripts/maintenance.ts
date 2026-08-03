import mongoose from 'mongoose';
import { CandidateProfileModel } from '../models/candidate-profile.model.js';
import { ResumeModel } from '../models/resume.model.js';
import { JobModel } from '../models/job.model.js';
import { ApplicationModel } from '../models/application.model.js';
import { TailoredResumeModel } from '../models/tailored-resume.model.js';
import { env } from '../config/env.js';

export async function runMaintenanceCheck() {
  const issues: string[] = [];

  const candidateCount = await CandidateProfileModel.countDocuments();
  if (candidateCount === 0) {
    issues.push('WARNING: Candidate profile has not been created yet.');
  }

  const masterResumeCount = await ResumeModel.countDocuments({ isMaster: true });
  if (masterResumeCount === 0) {
    issues.push('WARNING: No master resume marked in system.');
  }

  const orphanApplications = await ApplicationModel.find({ jobId: { $exists: false } });
  if (orphanApplications.length > 0) {
    issues.push(`ERROR: Found ${orphanApplications.length} orphan applications without jobId.`);
  }

  const orphanTailored = await TailoredResumeModel.find({ jobId: { $exists: false } });
  if (orphanTailored.length > 0) {
    issues.push(`ERROR: Found ${orphanTailored.length} orphan tailored resumes without jobId.`);
  }

  return {
    success: issues.length === 0,
    issuesFoundCount: issues.length,
    issues,
    summary: issues.length === 0 ? 'Database integrity check passed cleanly 100%!' : `Discovered ${issues.length} integrity warnings/errors.`,
  };
}

export async function runMaintenanceRepair() {
  const checkResult = await runMaintenanceCheck();
  let repairedCount = 0;

  const res1 = await ApplicationModel.deleteMany({ jobId: { $exists: false } });
  repairedCount += res1.deletedCount || 0;

  const res2 = await TailoredResumeModel.deleteMany({ jobId: { $exists: false } });
  repairedCount += res2.deletedCount || 0;

  return {
    repairedCount,
    summary: `Maintenance repair completed. Repaired/cleaned ${repairedCount} orphan records.`,
  };
}

if (process.argv[1]?.includes('maintenance.ts')) {
  mongoose.connect(env.MONGODB_URI).then(async () => {
    console.log('Running SK JobPilot Maintenance Check & Repair...');
    const repair = await runMaintenanceRepair();
    console.log('Repair result:', repair);
    const check = await runMaintenanceCheck();
    console.log('Post-repair check:', check);
    await mongoose.disconnect();
  });
}
