import { Router } from 'express';
import multer from 'multer';
import { env } from '../config/env.js';
import { AppError } from '../errors/app-error.js';
import {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
  setMasterResume,
} from '../controllers/resume.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';

const upload = multer({
  limits: {
    fileSize: (env.MAX_RESUME_FILE_SIZE_MB || 10) * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    const ext = file.originalname.toLowerCase().split('.').pop();
    if (allowedTypes.includes(file.mimetype) || ext === 'pdf' || ext === 'docx' || ext === 'doc') {
      cb(null, true);
    } else {
      cb(AppError.badRequest('Invalid file format. Only PDF and DOCX documents are supported.'));
    }
  },
});

export const resumeRouter = Router();

resumeRouter.post('/resumes/upload', upload.single('file'), asyncHandler(uploadResume));
resumeRouter.get('/resumes', asyncHandler(getResumes));
resumeRouter.get('/resumes/:id', asyncHandler(getResumeById));
resumeRouter.delete('/resumes/:id', asyncHandler(deleteResume));
resumeRouter.patch('/resumes/:id/master', asyncHandler(setMasterResume));
