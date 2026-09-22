// ============================================================================
// @tanmayee/api — Admin Audit Log Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { adminRepository } from '../../repositories/admin.repository';

export class AuditAdminController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const logs = await adminRepository.getAuditLogs(limit);

      res.json({
        success: true,
        data: logs,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const auditAdminController = new AuditAdminController();
