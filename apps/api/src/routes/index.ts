import { Router } from 'express';
import { healthRouter } from './health.routes.js';
import { profileRouter } from './profile.routes.js';
import { resumeRouter } from './resume.routes.js';
import { jobRouter } from './job.routes.js';
import { applicationRouter } from './application.routes.js';
import { aiRouter } from './ai.routes.js';
import { discoveryRouter } from './discovery.routes.js';
import { interviewRouter } from './interviews.routes.js';
import { phase4ApplicationsRouter } from './applications-phase4.routes.js';
import { systemRouter } from './system.routes.js';
import { phase5Router } from './phase5.routes.js';

export const apiRouter = Router();

apiRouter.use('/', healthRouter);
apiRouter.use('/', profileRouter);
apiRouter.use('/', resumeRouter);
apiRouter.use('/', jobRouter);
apiRouter.use('/', applicationRouter);
apiRouter.use('/', aiRouter);
apiRouter.use('/', discoveryRouter);
apiRouter.use('/', interviewRouter);
apiRouter.use('/', phase4ApplicationsRouter);
apiRouter.use('/', systemRouter);
apiRouter.use('/', phase5Router);
