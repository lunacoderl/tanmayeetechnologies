// ============================================================================
// @tanmayee/api — Public Analytics Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { analyticsRepository } from '../repositories/analytics.repository';

export class AnalyticsController {
  async trackEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.sessionId!;
      const { event_name, product_id, category_id, metadata } = req.body;

      const record = await analyticsRepository.recordEvent(
        sessionId,
        event_name,
        product_id,
        category_id,
        metadata || {}
      );

      res.status(201).json({
        success: true,
        data: record,
      });
    } catch (err) {
      next(err);
    }
  }

  async trackBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.sessionId!;
      const { events } = req.body;

      if (Array.isArray(events)) {
        for (const e of events) {
          await analyticsRepository.recordEvent(
            sessionId,
            e.event_name,
            e.product_id,
            e.category_id,
            e.metadata || {}
          );
        }
      }

      res.status(201).json({
        success: true,
        message: 'Events tracked successfully',
      });
    } catch (err) {
      next(err);
    }
  }
}

export const analyticsController = new AnalyticsController();
