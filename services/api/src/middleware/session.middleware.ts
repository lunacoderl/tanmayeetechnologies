// ============================================================================
// @tanmayee/api — Anonymous Session Middleware
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export function sessionMiddleware(req: Request, res: Response, next: NextFunction): void {
  let sessionToken = req.header('X-Session-Token');

  if (!sessionToken || sessionToken.trim() === '') {
    sessionToken = uuidv4();
  }

  req.sessionId = sessionToken;
  res.setHeader('X-Session-Token', sessionToken);
  next();
}
