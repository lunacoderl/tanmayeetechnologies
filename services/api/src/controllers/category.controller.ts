// ============================================================================
// @tanmayee/api — Public Category Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { categoryRepository } from '../repositories/category.repository';
import { productRepository } from '../repositories/product.repository';
import { AppError } from '../middleware/error-handler.middleware';

export class CategoryController {
  async listTree(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryRepository.findAllTree();
      res.json({
        success: true,
        data: categories,
      });
    } catch (err) {
      next(err);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const category = await categoryRepository.findBySlug(slug);

      if (!category) {
        throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
      }

      // Fetch products in this category
      const products = await productRepository.findPublished({
        category: category.slug,
        limit: 50,
      });

      // Fetch filterable attributes for this category
      const attributes = await categoryRepository.findAttributes(category.id);

      res.json({
        success: true,
        data: {
          ...category,
          products: products.items,
          filters: attributes,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const categoryController = new CategoryController();
