import mongoose from 'mongoose';
import { ResumeModel } from '../models/resume.model.js';
import { JobModel } from '../models/job.model.js';
import { ApplicationModel } from '../models/application.model.js';
import { env } from '../config/env.js';

export async function removeSampleData(confirm = false) {
  const isDryRun = !confirm;
  console.log(`[SAMPLE DATA CLEANUP] Mode: ${isDryRun ? 'DRY-RUN (Pass --confirm to execute deletion)' : 'CONFIRMED EXECUTION'}`);

  const sampleResumeRegex = /Jane_Resume|Sample_Resume|Jane Doe/i;
  const sampleJobRegex = /Staff Engineer at Test Corp|Test Corp|Stripe|Linear/i;

  const resumesToDelete = await ResumeModel.find({
    $or: [{ name: sampleResumeRegex }, { originalFileName: sampleResumeRegex }],
  });

  const jobsToDelete = await JobModel.find({
    $or: [{ companyName: sampleJobRegex }, { jobTitle: sampleJobRegex }],
  });

  console.log(`Found ${resumesToDelete.length} sample resumes:`, resumesToDelete.map((r) => r.name));
  console.log(`Found ${jobsToDelete.length} sample jobs:`, jobsToDelete.map((j) => `${j.companyName} - ${j.jobTitle}`));

  if (!isDryRun) {
    const resumeIds = resumesToDelete.map((r) => r._id);
    const jobIds = jobsToDelete.map((j) => j._id);

    if (resumeIds.length > 0) {
      await ResumeModel.deleteMany({ _id: { $in: resumeIds } });
    }
    if (jobIds.length > 0) {
      await JobModel.deleteMany({ _id: { $in: jobIds } });
      await ApplicationModel.deleteMany({ jobId: { $in: jobIds } });
    }

    console.log('✅ Sample database records removed successfully.');
  }

  return {
    isDryRun,
    sampleResumesFound: resumesToDelete.length,
    sampleJobsFound: jobsToDelete.length,
  };
}

if (process.argv[1]?.includes('cleanup-samples.ts')) {
  const isConfirm = process.argv.includes('--confirm');
  mongoose.connect(env.MONGODB_URI).then(async () => {
    await removeSampleData(isConfirm);
    await mongoose.disconnect();
  });
}
