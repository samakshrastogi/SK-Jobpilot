import type { Request, Response } from 'express';
import { JobModel } from '../models/job.model.js';
import { ApplicationModel } from '../models/application.model.js';
import { TailoredResumeModel } from '../models/tailored-resume.model.js';
import { JobMatchModel } from '../models/job-match.model.js';
import { AutomationConfigurationModel } from '../models/automation-configuration.model.js';
import { sendSuccess } from '../utils/response.js';

export async function fetchDashboardSummary(req: Request, res: Response): Promise<void> {
  const totalJobs = await JobModel.countDocuments({ archivedStatus: false });
  const savedJobs = await JobModel.countDocuments({ savedStatus: true, archivedStatus: false });
  const activeApplications = await ApplicationModel.countDocuments();
  const interviews = await ApplicationModel.countDocuments({ status: 'interview' });
  const pendingTailoredResumes = await TailoredResumeModel.countDocuments({
    approvalStatus: { $in: ['generated', 'under_review'] },
  });

  const matches = await JobMatchModel.find({ overallScore: { $ne: null } });
  let averageMatchScore: number | null = null;
  if (matches.length > 0) {
    const totalScore = matches.reduce((acc, m) => acc + (m.overallScore || 0), 0);
    averageMatchScore = Math.round(totalScore / matches.length);
  }

  const automationConfig = await AutomationConfigurationModel.findOne();

  const summary = {
    totalJobs,
    savedJobs,
    activeApplications,
    interviews,
    pendingTailoredResumes,
    averageMatchScore,
    automationStatus: automationConfig?.enabled ? 'active' : 'paused',
    nextAutomationRun: automationConfig?.nextRunAt ? automationConfig.nextRunAt.toISOString() : null,
  };

  sendSuccess(res, summary, 'Dashboard summary calculated cleanly from MongoDB', 200, req);
}
