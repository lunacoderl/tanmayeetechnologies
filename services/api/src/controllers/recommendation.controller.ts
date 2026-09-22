// ============================================================================
// @tanmayee/api — Recommendation Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { recommendationService } from '../services/recommendation.service';

export class RecommendationController {
  async getPersonalized(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.sessionId || req.header('X-Session-Token') || 'default-session';
      const limit = req.query.limit ? Number(req.query.limit) : 6;

      const recommendations = await recommendationService.getPersonalizedRecommendations(sessionId, limit);

      res.json({
        success: true,
        data: recommendations,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const recommendationController = new RecommendationController();
