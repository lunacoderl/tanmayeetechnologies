// ============================================================================
// @tanmayee/api — Service Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { serviceRepository } from '../repositories/service.repository';
import { analyticsRepository } from '../repositories/analytics.repository';
import { AnalyticsEvent } from '@tanmayee/config';
import { AppError } from '../middleware/error-handler.middleware';

export class ServiceController {
  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const services = await serviceRepository.findAll();
      res.json({
        success: true,
        data: services,
      });
    } catch (err) {
      next(err);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const service = await serviceRepository.findBySlug(slug);

      if (!service) {
        throw new AppError('Service not found', 404, 'SERVICE_NOT_FOUND');
      }

      if (req.sessionId) {
        analyticsRepository.recordEvent(
          req.sessionId,
          AnalyticsEvent.SERVICE_VIEW,
          null,
          null,
          { service_id: service.id, slug }
        );
      }

      res.json({
        success: true,
        data: service,
      });
    } catch (err) {
      next(err);
    }
  }

  async createRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.sessionId;
      const { service_id, customer_name, customer_phone, customer_email, customer_company, description } = req.body;

      const request = await serviceRepository.createRequest({
        service_id,
        session_id: sessionId,
        customer_name,
        customer_phone,
        customer_email,
        customer_company,
        description,
      });

      if (sessionId) {
        analyticsRepository.recordEvent(
          sessionId,
          AnalyticsEvent.SERVICE_REQUEST,
          null,
          null,
          { request_id: request.id, customer_phone }
        );
      }

      res.status(201).json({
        success: true,
        data: request,
        message: 'Your service request has been received. Our team will contact you shortly.',
      });
    } catch (err) {
      next(err);
    }
  }
}

export const serviceController = new ServiceController();
