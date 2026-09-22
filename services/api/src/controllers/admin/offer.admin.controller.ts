// ============================================================================
// @tanmayee/api — Admin Offer Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { offerRepository } from '../../repositories/offer.repository';
import { adminRepository } from '../../repositories/admin.repository';
import { AppError } from '../../middleware/error-handler.middleware';

export class OfferAdminController {
  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const offers = await offerRepository.findAllAdmin();
      res.json({ success: true, data: offers });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { rules, ...offerData } = req.body;
      const offer = await offerRepository.create(offerData, rules);

      await adminRepository.recordAudit({
        user_id: req.user?.id,
        action: 'CREATE_OFFER',
        entity_type: 'offer',
        entity_id: offer.id,
        new_value: offer,
      });

      res.status(201).json({ success: true, data: offer });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updated = await offerRepository.update(id, req.body);

      if (!updated) {
        throw new AppError('Offer not found', 404, 'OFFER_NOT_FOUND');
      }

      await adminRepository.recordAudit({
        user_id: req.user?.id,
        action: 'UPDATE_OFFER',
        entity_type: 'offer',
        entity_id: id,
        new_value: updated,
      });

      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
}

export const offerAdminController = new OfferAdminController();
