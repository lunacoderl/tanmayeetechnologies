// ============================================================================
// @tanmayee/api — Public Product Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { productRepository } from '../repositories/product.repository';
import { recommendationService } from '../services/recommendation.service';
import { analyticsRepository } from '../repositories/analytics.repository';
import { AnalyticsEvent } from '@tanmayee/config';
import { AppError } from '../middleware/error-handler.middleware';

export class ProductController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        category: req.query.category as string,
        brand: req.query.brand as string | string[],
        price_min: req.query.price_min ? Number(req.query.price_min) : undefined,
        price_max: req.query.price_max ? Number(req.query.price_max) : undefined,
        search: req.query.search as string,
        attributes: req.query.attributes ? JSON.parse(req.query.attributes as string) : undefined,
        sort: req.query.sort as any,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
      };

      const result = await productRepository.findPublished(filters);

      // Track filter/browse event
      if (req.sessionId) {
        analyticsRepository.recordEvent(
          req.sessionId,
          filters.search ? AnalyticsEvent.SEARCH : AnalyticsEvent.FILTER,
          null,
          filters.category || null,
          { filters }
        );
      }

      res.json({
        success: true,
        data: result.items,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const product = await productRepository.findBySlug(slug);

      if (!product) {
        throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
      }

      // Track view
      if (req.sessionId) {
        analyticsRepository.recordEvent(
          req.sessionId,
          AnalyticsEvent.PRODUCT_VIEW,
          product.id,
          product.category_id,
          { slug, brand: (product as any).brand_name }
        );
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  async getSimilar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const limit = req.query.limit ? Number(req.query.limit) : 4;
      const items = await recommendationService.getSimilarProducts(id, limit);

      res.json({
        success: true,
        data: items,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const productController = new ProductController();
