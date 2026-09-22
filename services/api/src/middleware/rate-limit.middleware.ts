// ============================================================================
// @tanmayee/api — Rate Limiting Middleware
// ============================================================================

import rateLimit from 'express-rate-limit';
import { RATE_LIMITS } from '@tanmayee/config';

export const publicRateLimiter = rateLimit({
  windowMs: RATE_LIMITS.PUBLIC_WINDOW_MS,
  max: RATE_LIMITS.PUBLIC_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please slow down and try again shortly.',
    },
  },
});

export const authRateLimiter = rateLimit({
  windowMs: RATE_LIMITS.AUTH_WINDOW_MS,
  max: RATE_LIMITS.AUTH_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication requests. Please try again in a minute.',
    },
  },
});

export const loginRateLimiter = rateLimit({
  windowMs: RATE_LIMITS.LOGIN_WINDOW_MS,
  max: RATE_LIMITS.LOGIN_MAX_ATTEMPTS,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    error: {
      code: 'LOGIN_RATE_LIMIT_EXCEEDED',
      message: 'Too many failed login attempts. Please try again after 15 minutes.',
    },
  },
});
