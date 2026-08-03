import { Router } from 'express';
import {
  fetchDiscoverySources,
  createDiscoverySource,
  runDiscoverySource,
  fetchDiscoveryRuns,
  streamActivityEvents,
} from '../controllers/discovery.controller.js';
import { asyncHandler } from '../middlewares/async-handler.js';

export const discoveryRouter = Router();

discoveryRouter.get('/discovery/sources', asyncHandler(fetchDiscoverySources));
discoveryRouter.post('/discovery/sources', asyncHandler(createDiscoverySource));
discoveryRouter.post('/discovery/sources/:id/run', asyncHandler(runDiscoverySource));
discoveryRouter.get('/discovery/runs', asyncHandler(fetchDiscoveryRuns));
discoveryRouter.get('/activity/stream', streamActivityEvents);
