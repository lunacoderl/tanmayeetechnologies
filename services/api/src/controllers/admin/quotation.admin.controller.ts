// ============================================================================
// @tanmayee/api — Admin Quotation Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { quotationRepository } from '../../repositories/quotation.repository';
import { adminRepository } from '../../repositories/admin.repository';
import { AppError } from '../../middleware/error-handler.middleware';

export class QuotationAdminController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, page, limit } = req.query;
      const result = await quotationRepository.findAllAdmin({
        status: status as string,
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
      const quotation = await quotationRepository.findById(id);

      if (!quotation) {
        throw new AppError('Quotation not found', 404, 'QUOTATION_NOT_FOUND');
      }

      res.json({ success: true, data: quotation });
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status } = req.body;

      const updated = await quotationRepository.updateStatus(id, status);
      if (!updated) {
        throw new AppError('Quotation not found', 404, 'QUOTATION_NOT_FOUND');
      }

      await adminRepository.recordAudit({
        user_id: req.user?.id,
        action: 'UPDATE_QUOTATION_STATUS',
        entity_type: 'quotation',
        entity_id: id,
        new_value: { status },
      });

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
}

export const quotationAdminController = new QuotationAdminController();
