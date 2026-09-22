// ============================================================================
// @tanmayee/api — Admin Auth Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { authService } from '../../services/auth.service';

export class AdminAuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await authService.login(req.body, ip, userAgent);

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json({
        success: true,
        data: req.user,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const adminAuthController = new AdminAuthController();
