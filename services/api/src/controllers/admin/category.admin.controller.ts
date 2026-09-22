// ============================================================================
// @tanmayee/api — Admin Category Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { categoryRepository } from '../../repositories/category.repository';
import { adminRepository } from '../../repositories/admin.repository';
import { AppError } from '../../middleware/error-handler.middleware';

export class CategoryAdminController {
  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryRepository.findAllTree();
      res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryRepository.create(req.body);

      await adminRepository.recordAudit({
        user_id: req.user?.id,
        action: 'CREATE_CATEGORY',
        entity_type: 'category',
        entity_id: category.id,
        new_value: category,
      });

      res.status(201).json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updated = await categoryRepository.update(id, req.body);

      if (!updated) {
        throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
      }

      await adminRepository.recordAudit({
        user_id: req.user?.id,
        action: 'UPDATE_CATEGORY',
        entity_type: 'category',
        entity_id: id,
        new_value: updated,
      });

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
}

export const categoryAdminController = new CategoryAdminController();
