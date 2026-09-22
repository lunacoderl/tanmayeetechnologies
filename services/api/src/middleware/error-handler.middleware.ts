// ============================================================================
// @tanmayee/api — Centralized Error Handling Middleware
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';

  if (config.isDev) {
    console.error('API Error:', {
      code,
      message,
      stack: err.stack,
      details: err.details,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(config.isDev && { details: err.details, stack: err.stack }),
    },
  });
}
