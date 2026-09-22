// ============================================================================
// @tanmayee/api — Public Brand Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { brandRepository } from '../repositories/brand.repository';
import { productRepository } from '../repositories/product.repository';
import { AppError } from '../middleware/error-handler.middleware';

export class BrandController {
  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brands = await brandRepository.findAll();
      res.json({
        success: true,
        data: brands,
      });
    } catch (err) {
      next(err);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const brand = await brandRepository.findBySlug(slug);

      if (!brand) {
        throw new AppError('Brand not found', 404, 'BRAND_NOT_FOUND');
      }

      const products = await productRepository.findPublished({
        brand: brand.slug,
        limit: 50,
      });

      res.json({
        success: true,
        data: {
          ...brand,
          products: products.items,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const brandController = new BrandController();
