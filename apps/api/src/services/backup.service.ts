import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { CandidateProfileModel } from '../models/candidate-profile.model.js';
import { ResumeModel } from '../models/resume.model.js';
import { JobModel } from '../models/job.model.js';
import { ApplicationModel } from '../models/application.model.js';
import { TailoredResumeModel } from '../models/tailored-resume.model.js';
import { DiscoverySourceModel } from '../models/discovery-source.model.js';
import { InterviewPreparationModel } from '../models/interview-preparation.model.js';
import { SavedAnswerModel } from '../models/saved-answer.model.js';
import { FollowUpReminderModel } from '../models/follow-up-reminder.model.js';

export async function createLocalBackup() {
  const data = {
    metadata: {
      appVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      format: 'sk-jobpilot-backup-v1',
    },
    candidateProfile: await CandidateProfileModel.find(),
    resumes: await ResumeModel.find(),
    jobs: await JobModel.find(),
    applications: await ApplicationModel.find(),
    tailoredResumes: await TailoredResumeModel.find(),
    discoverySources: await DiscoverySourceModel.find(),
    interviewPreps: await InterviewPreparationModel.find(),
    savedAnswers: await SavedAnswerModel.find(),
    reminders: await FollowUpReminderModel.find(),
  };

  const jsonString = JSON.stringify(data, null, 2);
  const checksum = crypto.createHash('sha256').update(jsonString).digest('hex');

  const backupDir = path.resolve('./backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const filename = `sk_jobpilot_backup_${Date.now()}.json`;
  const filePath = path.join(backupDir, filename);
  fs.writeFileSync(filePath, jsonString, 'utf-8');

  return {
    filename,
    filePath,
    checksum,
    sizeBytes: Buffer.byteLength(jsonString),
    recordCounts: {
      jobs: data.jobs.length,
      applications: data.applications.length,
      resumes: data.resumes.length,
      tailoredResumes: data.tailoredResumes.length,
    },
  };
}

export function listBackups() {
  const backupDir = path.resolve('./backups');
  if (!fs.existsSync(backupDir)) return [];

  const files = fs.readdirSync(backupDir).filter((f) => f.endsWith('.json'));
  return files.map((file) => {
    const p = path.join(backupDir, file);
    const stat = fs.statSync(p);
    return {
      filename: file,
      sizeBytes: stat.size,
      createdAt: stat.birthtime.toISOString(),
    };
  });
}
