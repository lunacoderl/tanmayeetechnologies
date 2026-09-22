// ============================================================================
// @tanmayee/api — Dynamic Filter Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { categoryRepository } from '../repositories/category.repository';
import { AppError } from '../middleware/error-handler.middleware';

export class FilterController {
  async getFiltersForCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categorySlug = req.params.categorySlug as string;
      const category = await categoryRepository.findBySlug(categorySlug);

      if (!category) {
        throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
      }

      const attributes = await categoryRepository.findAttributes(category.id);

      res.json({
        success: true,
        data: {
          category_id: category.id,
          category_name: category.name,
          category_slug: category.slug,
          filters: attributes,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const filterController = new FilterController();
