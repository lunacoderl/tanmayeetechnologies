// ============================================================================
// @tanmayee/api — Main Route Aggregator
// ============================================================================

import { Router } from 'express';
import { publicRouter } from './public.routes';
import { adminRouter } from './admin.routes';
import { publicRateLimiter } from '../middleware/rate-limit.middleware';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Tanmayee Technologies B2B Commerce Platform',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount Public and Admin subrouters
apiRouter.use('/public', publicRateLimiter as any, publicRouter);
apiRouter.use('/admin', adminRouter);

// Aliases for convenience (/api/products -> /api/public/products)
apiRouter.use('/', publicRateLimiter as any, publicRouter);
