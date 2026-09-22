// ============================================================================
// @tanmayee/api — Express Application Factory
// ============================================================================

import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import { corsMiddleware } from './middleware/cors.middleware';
import { sessionMiddleware } from './middleware/session.middleware';
import { errorHandler } from './middleware/error-handler.middleware';
import { apiRouter } from './routes';

export function createApp(): Express {
  const app = express();

  // Security headers
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  // CORS
  app.use(corsMiddleware);

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Anonymous customer intelligence session tracker
  app.use(sessionMiddleware);

  // Mount API router
  app.use('/api', apiRouter);

  // Root redirect/status
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'Tanmayee Technologies API',
      status: 'online',
      documentation: '/api/health',
    });
  });

  // 404 Handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found on this server',
      },
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
