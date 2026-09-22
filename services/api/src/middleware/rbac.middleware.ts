// ============================================================================
// @tanmayee/api — Role-Based Access Control (RBAC) Middleware
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { AdminRole } from '@tanmayee/config';

export function requireRole(...allowedRoles: AdminRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required before role verification',
        },
      });
      return;
    }

    // SUPER_ADMIN has access to every admin resource
    if (req.user.role === AdminRole.SUPER_ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Requires one of roles: ${allowedRoles.join(', ')}`,
        },
      });
      return;
    }

    next();
  };
}
