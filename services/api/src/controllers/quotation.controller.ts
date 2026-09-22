// ============================================================================
// @tanmayee/api — Quotation Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { quotationService } from '../services/quotation.service';
import { quotationRepository } from '../repositories/quotation.repository';
import { AppError } from '../middleware/error-handler.middleware';

export class QuotationController {
  async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.sessionId!;
      const quotation = await quotationService.generateFromCart(sessionId);

      res.status(201).json({
        success: true,
        data: quotation,
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const quote = await quotationRepository.findById(id);

      if (!quote) {
        throw new AppError('Quotation not found', 404, 'QUOTATION_NOT_FOUND');
      }

      res.json({
        success: true,
        data: quote,
      });
    } catch (err) {
      next(err);
    }
  }

  async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const sessionId = req.sessionId!;
      const { customer_name, customer_phone, customer_email, customer_company, customer_location, customer_notes } = req.body;

      const result = await quotationService.submitQuotation(
        id,
        {
          name: customer_name,
          phone: customer_phone,
          email: customer_email,
          company: customer_company,
          location: customer_location,
          notes: customer_notes,
        },
        sessionId
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const quotationController = new QuotationController();
