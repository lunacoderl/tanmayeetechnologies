// ============================================================================
// @tanmayee/api — Search Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { searchRepository } from '../repositories/search.repository';
import { analyticsRepository } from '../repositories/analytics.repository';
import { AnalyticsEvent } from '@tanmayee/config';

export class SearchController {
  async query(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = (req.query.q as string) || '';
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;

      if (!q.trim()) {
        res.json({
          success: true,
          data: [],
          pagination: { page: 1, limit, total: 0 },
        });
        return;
      }

      const result = await searchRepository.search(q, page, limit);

      // Track search event
      if (req.sessionId) {
        analyticsRepository.recordEvent(
          req.sessionId,
          AnalyticsEvent.SEARCH,
          null,
          null,
          { query: q, results_count: result.total }
        );
      }

      res.json({
        success: true,
        data: result.items,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async suggestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = (req.query.q as string) || '';
      const limit = req.query.limit ? Number(req.query.limit) : 5;

      const results = await searchRepository.suggestions(q, limit);

      res.json({
        success: true,
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const searchController = new SearchController();
