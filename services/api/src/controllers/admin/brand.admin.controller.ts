// ============================================================================
// @tanmayee/api — Admin Brand Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { brandRepository } from '../../repositories/brand.repository';
import { adminRepository } from '../../repositories/admin.repository';
import { AppError } from '../../middleware/error-handler.middleware';

export class BrandAdminController {
  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brands = await brandRepository.findAll();
      res.json({ success: true, data: brands });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brand = await brandRepository.create(req.body);

      await adminRepository.recordAudit({
        user_id: req.user?.id,
        action: 'CREATE_BRAND',
        entity_type: 'brand',
        entity_id: brand.id,
        new_value: brand,
      });

      res.status(201).json({ success: true, data: brand });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updated = await brandRepository.update(id, req.body);

      if (!updated) {
        throw new AppError('Brand not found', 404, 'BRAND_NOT_FOUND');
      }

      await adminRepository.recordAudit({
        user_id: req.user?.id,
        action: 'UPDATE_BRAND',
        entity_type: 'brand',
        entity_id: id,
        new_value: updated,
      });

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
}

export const brandAdminController = new BrandAdminController();
