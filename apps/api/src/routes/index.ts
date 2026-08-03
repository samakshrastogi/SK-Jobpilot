import { Router } from 'express';
import { healthRouter } from './health.routes.js';
import { profileRouter } from './profile.routes.js';
import { resumeRouter } from './resume.routes.js';
import { jobRouter } from './job.routes.js';
import { applicationRouter } from './application.routes.js';

export const apiRouter = Router();

apiRouter.use('/', healthRouter);
apiRouter.use('/', profileRouter);
apiRouter.use('/', resumeRouter);
apiRouter.use('/', jobRouter);
apiRouter.use('/', applicationRouter);
