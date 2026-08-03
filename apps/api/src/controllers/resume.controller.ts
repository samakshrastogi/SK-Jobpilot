import type { Request, Response } from 'express';
import createHash from 'crypto';
import fs from 'fs';
import path from 'path';
import { ResumeModel } from '../models/resume.model.js';
import { env } from '../config/env.js';
import { AppError } from '../errors/app-error.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';
import { extractDocumentText } from '../services/extraction/extractor-dispatcher.js';
import { parseResumeText } from '../services/parsing/deterministic-parser.service.js';
import { syncResumeIntoCandidateProfile } from '../services/onboarding.service.js';

export async function uploadResume(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    throw AppError.badRequest('No resume file provided');
  }

  const { originalname, mimetype, size, path: filePath, buffer } = req.file;

  // Calculate SHA-256 checksum
  const fileBuffer = buffer || fs.readFileSync(filePath);
  const checksum = createHash.createHash('sha256').update(fileBuffer).digest('hex');

  // Check for duplicate upload by checksum
  const existingByChecksum = await ResumeModel.findOne({ checksum });
  if (existingByChecksum) {
    // Cleanup temporary uploaded file if saved to disk by multer
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch {
        /* ignore */
      }
    }
    sendSuccess(
      res,
      existingByChecksum,
      'Duplicate resume detected with identical content checksum',
      200,
      req
    );
    return;
  }

  // Ensure storage directory exists
  const storageDir = path.resolve(env.RESUME_STORAGE_DIR);
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  // Generate collision-safe filename
  const sanitizedOriginal = path.basename(originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueName = `${Date.now()}-${sanitizedOriginal}`;
  const targetPath = path.join(storageDir, uniqueName);

  // Write file to persistent storage directory if not already there
  if (filePath !== targetPath) {
    fs.writeFileSync(targetPath, fileBuffer);
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch {
        /* ignore */
      }
    }
  }

  // Extract raw text
  const extractionResult = await extractDocumentText(fileBuffer, mimetype, originalname);
  const { text: rawText, warnings: extractionWarnings, requiresOcr } = extractionResult;

  // Deterministic Parsing
  const parseResult = parseResumeText(rawText);
  const combinedWarnings = [...(extractionWarnings || []), ...(parseResult.warnings || [])];

  const parsingStatus = requiresOcr
    ? 'requires_ocr'
    : rawText.trim().length === 0
      ? 'error'
      : 'parsed';

  // Check if any resume is currently master
  const masterCount = await ResumeModel.countDocuments({ isMaster: true });
  const isMaster = masterCount === 0;

  const resume = await ResumeModel.create({
    name: originalname.replace(/\.[^/.]+$/, ''),
    originalFileName: originalname,
    storagePath: targetPath,
    mimeType: mimetype,
    fileSize: size,
    checksum,
    sourceType: 'upload',
    rawText,
    parsedContent: parseResult.parsedContent,
    parsingStatus,
    parsingConfidence: parseResult.confidence,
    warnings: combinedWarnings,
    isMaster,
    version: '1.0',
  });

  if (parsingStatus === 'parsed') {
    await syncResumeIntoCandidateProfile(resume);
  }

  sendSuccess(res, resume, 'Resume uploaded, parsed, and synchronized to candidate profile', 201, req);
}

export async function getResumes(req: Request, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
  const skip = (page - 1) * limit;

  const totalItems = await ResumeModel.countDocuments();
  const resumes = await ResumeModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  sendPaginated(
    res,
    resumes,
    {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    'Resumes retrieved successfully',
    req
  );
}

export async function getResumeById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const resume = await ResumeModel.findById(id);
  if (!resume) {
    throw AppError.notFound('Resume not found');
  }
  sendSuccess(res, resume, 'Resume retrieved successfully', 200, req);
}

export async function deleteResume(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const resume = await ResumeModel.findById(id);
  if (!resume) {
    throw AppError.notFound('Resume not found');
  }

  // Delete physical storage file if exists
  if (resume.storagePath && fs.existsSync(resume.storagePath)) {
    try {
      fs.unlinkSync(resume.storagePath);
    } catch {
      /* ignore cleanup error */
    }
  }

  await ResumeModel.findByIdAndDelete(id);

  // If deleted resume was master, pick another resume to be master if available
  if (resume.isMaster) {
    const fallback = await ResumeModel.findOne().sort({ createdAt: -1 });
    if (fallback) {
      fallback.isMaster = true;
      await fallback.save();
    }
  }

  sendSuccess(res, { id }, 'Resume and associated file deleted successfully', 200, req);
}

export async function setMasterResume(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const resume = await ResumeModel.findById(id);
  if (!resume) {
    throw AppError.notFound('Resume not found');
  }

  // Unset all existing master resumes
  await ResumeModel.updateMany({ isMaster: true }, { $set: { isMaster: false } });

  resume.isMaster = true;
  await resume.save();

  sendSuccess(res, resume, 'Master resume updated successfully', 200, req);
}
