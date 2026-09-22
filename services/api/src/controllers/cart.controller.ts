// ============================================================================
// @tanmayee/api — Cart Controller
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { cartRepository } from '../repositories/cart.repository';
import { analyticsRepository } from '../repositories/analytics.repository';
import { AnalyticsEvent } from '@tanmayee/config';
import { AppError } from '../middleware/error-handler.middleware';

export class CartController {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.sessionId!;
      const cart = await cartRepository.getEnrichedCart(sessionId);
      res.json({
        success: true,
        data: cart,
      });
    } catch (err) {
      next(err);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.sessionId!;
      const { product_id, quantity = 1 } = req.body;

      const cart = await cartRepository.getOrCreateCart(sessionId);
      const item = await cartRepository.addItem(cart.id, product_id, quantity);

      // Track add to cart event
      analyticsRepository.recordEvent(
        sessionId,
        AnalyticsEvent.ADD_TO_CART,
        product_id,
        null,
        { quantity }
      );

      const enrichedCart = await cartRepository.getEnrichedCart(sessionId);

      res.status(201).json({
        success: true,
        data: {
          added_item: item,
          cart: enrichedCart,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async updateItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.sessionId!;
      const id = req.params.id as string;
      const { quantity } = req.body;

      const cart = await cartRepository.getOrCreateCart(sessionId);

      if (quantity <= 0) {
        await cartRepository.removeItem(cart.id, id);
      } else {
        const updated = await cartRepository.updateItem(cart.id, id, quantity);
        if (!updated) {
          throw new AppError('Cart item not found', 404, 'ITEM_NOT_FOUND');
        }
      }

      const enrichedCart = await cartRepository.getEnrichedCart(sessionId);

      res.json({
        success: true,
        data: enrichedCart,
      });
    } catch (err) {
      next(err);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.sessionId!;
      const id = req.params.id as string;

      const cart = await cartRepository.getOrCreateCart(sessionId);
      await cartRepository.removeItem(cart.id, id);

      analyticsRepository.recordEvent(
        sessionId,
        AnalyticsEvent.REMOVE_FROM_CART,
        null,
        null,
        { item_id: id }
      );

      const enrichedCart = await cartRepository.getEnrichedCart(sessionId);

      res.json({
        success: true,
        data: enrichedCart,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const cartController = new CartController();
