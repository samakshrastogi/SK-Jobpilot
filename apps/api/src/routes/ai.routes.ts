import { Router } from 'express';
import {
  runCandidateAnalysis,
  fetchCandidateAnalysis,
  runJobAnalysis,
  fetchJobAnalysis,
  runJobMatch,
  fetchJobMatch,
  runBatchJobMatch,
  runSkillGapAnalysis,
  createTailoredResumeVersion,
  fetchTailoredResumes,
  fetchTailoredResumeById,
  patchTailoredResumeVersion,
  approveTailoredResumeVersion,
  rejectTailoredResumeVersion,
  removeTailoredResumeVersion,
  getAIHealthStatus,
  getAIActivityLogs,
} from '../controllers/ai.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';

export const aiRouter = Router();

// Candidate Analysis
aiRouter.post('/ai/candidate/analyze', asyncHandler(runCandidateAnalysis));
aiRouter.get('/ai/candidate/analysis', asyncHandler(fetchCandidateAnalysis));

// Job Analysis, Matching, Skill Gaps
aiRouter.post('/jobs/:id/analyze', asyncHandler(runJobAnalysis));
aiRouter.get('/jobs/:id/analysis', asyncHandler(fetchJobAnalysis));
aiRouter.post('/jobs/:id/match', asyncHandler(runJobMatch));
aiRouter.get('/jobs/:id/match', asyncHandler(fetchJobMatch));
aiRouter.post('/jobs/match/batch', asyncHandler(runBatchJobMatch));
aiRouter.post('/jobs/:id/gaps', asyncHandler(runSkillGapAnalysis));
aiRouter.get('/jobs/:id/gaps', asyncHandler(runSkillGapAnalysis));

// Resume Tailoring & Version Approvals
aiRouter.post('/jobs/:id/resume-tailoring', asyncHandler(createTailoredResumeVersion));
aiRouter.get('/tailored-resumes', asyncHandler(fetchTailoredResumes));
aiRouter.get('/tailored-resumes/:id', asyncHandler(fetchTailoredResumeById));
aiRouter.patch('/tailored-resumes/:id', asyncHandler(patchTailoredResumeVersion));
aiRouter.post('/tailored-resumes/:id/approve', asyncHandler(approveTailoredResumeVersion));
aiRouter.post('/tailored-resumes/:id/reject', asyncHandler(rejectTailoredResumeVersion));
aiRouter.delete('/tailored-resumes/:id', asyncHandler(removeTailoredResumeVersion));

// AI Health & Logs
aiRouter.get('/ai/health', asyncHandler(getAIHealthStatus));
aiRouter.get('/ai/activity', asyncHandler(getAIActivityLogs));
