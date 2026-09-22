// ============================================================================
// @tanmayee/api — Quotation Calculation & Dispatch Service
// ============================================================================

import { quotationRepository, EnrichedQuotation } from '../repositories/quotation.repository';
import { cartRepository } from '../repositories/cart.repository';
import { analyticsRepository } from '../repositories/analytics.repository';
import { AnalyticsEvent, COMPANY } from '@tanmayee/config';
import { AppError } from '../middleware/error-handler.middleware';

export class QuotationService {
  /**
   * Generates a formal quotation from the current cart
   */
  async generateFromCart(sessionId: string): Promise<EnrichedQuotation> {
    const enrichedCart = await cartRepository.getEnrichedCart(sessionId);

    if (enrichedCart.items.length === 0) {
      throw new AppError('Cannot generate quotation for an empty cart', 400, 'EMPTY_CART');
    }

    const quotationItems = enrichedCart.items.map((item) => ({
      product_id: item.product_id,
      product_name: item.product.product_name,
      model_number: item.product.model_number,
      brand_name: (item.product as any).brand_name || 'Brand',
      unit_price: item.product.reference_price || 0,
      quantity: item.quantity,
      discount_pct: enrichedCart.applicable_discount_pct,
      subtotal: item.line_subtotal,
      specifications: (item.product as any).attributes || {},
    }));

    const quote = await quotationRepository.create(
      {
        cart_id: enrichedCart.id,
        session_id: sessionId,
        subtotal: enrichedCart.subtotal,
        discount_total: enrichedCart.discount_amount,
        grand_total: enrichedCart.estimated_total,
        is_bulk: enrichedCart.is_bulk,
      },
      quotationItems,
      []
    );

    // Track analytics
    await analyticsRepository.recordEvent(
      sessionId,
      AnalyticsEvent.QUOTE_STARTED,
      null,
      null,
      { quotation_id: quote.id, quotation_number: quote.quotation_number }
    );

    return quote;
  }

  /**
   * Submits contact info for an existing quotation and generates WhatsApp link
   */
  async submitQuotation(
    quotationId: string,
    contactInfo: {
      name: string;
      phone: string;
      email?: string;
      company?: string;
      location?: string;
      notes?: string;
    },
    sessionId: string
  ) {
    const updated = await quotationRepository.updateContactInfo(quotationId, contactInfo);
    if (!updated) {
      throw new AppError('Quotation not found', 404, 'QUOTATION_NOT_FOUND');
    }

    // Clear cart once quotation is submitted
    if (updated.cart_id) {
      await cartRepository.clearCart(updated.cart_id);
    }

    // Track analytics event
    await analyticsRepository.recordEvent(
      sessionId,
      AnalyticsEvent.QUOTE_SUBMITTED,
      null,
      null,
      {
        quotation_id: updated.id,
        quotation_number: updated.quotation_number,
        grand_total: updated.grand_total,
        customer_phone: contactInfo.phone,
      }
    );

    // Generate WhatsApp direct text message
    const whatsappPhone = process.env.WHATSAPP_PHONE || '919876543210';
    const lines = [
      `Hello ${COMPANY.NAME},`,
      `I would like to enquire about Quotation Ref: *${updated.quotation_number}*`,
      `Customer Name: ${contactInfo.name}`,
      contactInfo.company ? `Company: ${contactInfo.company}` : '',
      `Phone: ${contactInfo.phone}`,
      `Total Estimate: ₹${updated.grand_total.toLocaleString('en-IN')}`,
      `Items:`,
      ...updated.items.map((i) => `• ${i.product_name} x ${i.quantity}`),
      `Please contact me regarding dispatch schedule and commercial terms.`,
    ].filter(Boolean);

    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
      lines.join('\n')
    )}`;

    return {
      quotation: updated,
      whatsapp_url: whatsappUrl,
    };
  }
}

export const quotationService = new QuotationService();
