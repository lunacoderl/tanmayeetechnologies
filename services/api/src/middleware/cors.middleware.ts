// ============================================================================
// @tanmayee/api — CORS Middleware
// ============================================================================

import cors from 'cors';
import { config } from '../config/env';

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (
      config.isDev ||
      config.allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost')
    ) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Session-Token',
    'X-Requested-With',
    'Accept',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Session-Token'],
  maxAge: 86400, // 24 hours
});
