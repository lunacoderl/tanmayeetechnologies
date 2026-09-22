// ============================================================================
// @tanmayee/api — Admin Analytics Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { analyticsRepository } from '../../repositories/analytics.repository';

export class AnalyticsAdminController {
  async getDashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await analyticsRepository.getDashboardStats();
      res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  }

  async listLeads(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const leads = await analyticsRepository.listLeadsAdmin();
      res.json({ success: true, data: leads });
    } catch (err) {
      next(err);
    }
  }
}

export const analyticsAdminController = new AnalyticsAdminController();
