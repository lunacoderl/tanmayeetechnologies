// ============================================================================
// @tanmayee/api — Admin Publish Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { publishingService } from '../../services/publishing.service';

export class PublishAdminController {
  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await publishingService.refreshCatalog(req.user?.id);
      res.json({
        success: true,
        data: result,
        message: 'Published catalog snapshot successfully refreshed',
      });
    } catch (err) {
      next(err);
    }
  }
}

export const publishAdminController = new PublishAdminController();
