// ============================================================================
// @tanmayee/api — Admin Service Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { serviceRepository } from '../../repositories/service.repository';
import { adminRepository } from '../../repositories/admin.repository';
import { AppError } from '../../middleware/error-handler.middleware';

export class ServiceAdminController {
  async listRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, page, limit } = req.query;
      const result = await serviceRepository.findAllRequestsAdmin({
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

  async updateRequestStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status } = req.body;

      const updated = await serviceRepository.updateRequestStatus(id, status);
      if (!updated) {
        throw new AppError('Service request not found', 404, 'REQUEST_NOT_FOUND');
      }

      await adminRepository.recordAudit({
        user_id: req.user?.id,
        action: 'UPDATE_SERVICE_REQUEST_STATUS',
        entity_type: 'service_request',
        entity_id: id,
        new_value: { status },
      });

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  async createService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = await serviceRepository.createService(req.body);

      await adminRepository.recordAudit({
        user_id: req.user?.id,
        action: 'CREATE_SERVICE',
        entity_type: 'service',
        entity_id: service.id,
        new_value: service,
      });

      res.status(201).json({ success: true, data: service });
    } catch (err) {
      next(err);
    }
  }

  async updateService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updated = await serviceRepository.updateService(id, req.body);

      if (!updated) {
        throw new AppError('Service not found', 404, 'SERVICE_NOT_FOUND');
      }

      await adminRepository.recordAudit({
        user_id: req.user?.id,
        action: 'UPDATE_SERVICE',
        entity_type: 'service',
        entity_id: id,
        new_value: updated,
      });

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
}

export const serviceAdminController = new ServiceAdminController();
