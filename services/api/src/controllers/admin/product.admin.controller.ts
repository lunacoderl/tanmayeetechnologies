// ============================================================================
// @tanmayee/api — Admin Product Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { productRepository } from '../../repositories/product.repository';
import { adminRepository } from '../../repositories/admin.repository';
import { publishingService } from '../../services/publishing.service';
import { AppError } from '../../middleware/error-handler.middleware';

export class ProductAdminController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, page, limit, search } = req.query;
      const result = await productRepository.findAllAdmin({
        status: status as string,
        search: search as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });

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

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const product = await productRepository.findById(id);

      if (!product) {
        throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productRepository.create(req.body);

      await adminRepository.recordAudit({
        user_id: req.user?.id,
        action: 'CREATE_PRODUCT',
        entity_type: 'product',
        entity_id: product.id,
        new_value: product,
      });

      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { change_summary, ...updates } = req.body;

      const oldProduct = await productRepository.findById(id);
      if (!oldProduct) {
        throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
      }

      const updated = await productRepository.update(
        id,
        updates,
        req.user?.id,
        change_summary
      );

      await adminRepository.recordAudit({
        user_id: req.user?.id,
        action: 'UPDATE_PRODUCT',
        entity_type: 'product',
        entity_id: id,
        old_value: oldProduct,
        new_value: updated,
      });

      res.json({
        success: true,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async publish(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const published = await productRepository.publish(id);

      if (!published) {
        throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
      }

      // Refresh published catalog view
      await publishingService.refreshCatalog(req.user?.id);

      await adminRepository.recordAudit({
        user_id: req.user?.id,
        action: 'PUBLISH_PRODUCT',
        entity_type: 'product',
        entity_id: id,
      });

      res.json({
        success: true,
        data: published,
        message: 'Product published and catalog snapshot refreshed successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  async archive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const archived = await productRepository.archive(id);

      if (!archived) {
        throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
      }

      await publishingService.refreshCatalog(req.user?.id);

      await adminRepository.recordAudit({
        user_id: req.user?.id,
        action: 'ARCHIVE_PRODUCT',
        entity_type: 'product',
        entity_id: id,
      });

      res.json({
        success: true,
        data: archived,
      });
    } catch (err) {
      next(err);
    }
  }

  async getVersions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const versions = await productRepository.getVersions(id);

      res.json({
        success: true,
        data: versions,
      });
    } catch (err) {
      next(err);
    }
  }

  async restoreVersion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const version = req.params.version as string;
      const restored = await productRepository.restoreVersion(id, Number(version));

      if (!restored) {
        throw new AppError('Version not found', 404, 'VERSION_NOT_FOUND');
      }

      await adminRepository.recordAudit({
        user_id: req.user?.id,
        action: 'RESTORE_PRODUCT_VERSION',
        entity_type: 'product',
        entity_id: id,
        new_value: { restored_version: version },
      });

      res.json({
        success: true,
        data: restored,
        message: `Restored to version ${version}`,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const productAdminController = new ProductAdminController();
