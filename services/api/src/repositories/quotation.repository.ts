// ============================================================================
// @tanmayee/api — Quotation Repository
// Immutable snapshots for B2B procurement quotes
// ============================================================================

import { Quotation, QuotationItem, QuotationService } from '@tanmayee/types';
import { QuotationStatus } from '@tanmayee/config';
import { v4 as uuidv4 } from 'uuid';

export interface EnrichedQuotation extends Quotation {
  items: QuotationItem[];
  services: QuotationService[];
}

const inMemoryQuotations = new Map<string, Quotation>();
const inMemoryQuotationItems = new Map<string, QuotationItem[]>();
const inMemoryQuotationServices = new Map<string, QuotationService[]>();

let quoteCounter = 1;

export class QuotationRepository {
  generateQuotationNumber(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const seq = String(quoteCounter++).padStart(4, '0');
    return `TT-Q-${yyyy}${mm}${dd}-${seq}`;
  }

  async create(
    quoteData: Partial<Quotation>,
    items: Partial<QuotationItem>[],
    services: Partial<QuotationService>[] = []
  ): Promise<EnrichedQuotation> {
    const id = uuidv4();
    const quoteNumber = this.generateQuotationNumber();

    const newQuotation: Quotation = {
      id,
      quotation_number: quoteNumber,
      cart_id: quoteData.cart_id || null,
      session_id: quoteData.session_id || null,
      customer_name: quoteData.customer_name || null,
      customer_phone: quoteData.customer_phone || null,
      customer_email: quoteData.customer_email || null,
      customer_company: quoteData.customer_company || null,
      customer_location: quoteData.customer_location || null,
      customer_notes: quoteData.customer_notes || null,
      subtotal: quoteData.subtotal || 0,
      discount_total: quoteData.discount_total || 0,
      grand_total: quoteData.grand_total || 0,
      status: QuotationStatus.GENERATED,
      is_bulk: quoteData.is_bulk || false,
      pdf_url: null,
      valid_until: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days validity
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    inMemoryQuotations.set(id, newQuotation);

    // Save immutable item snapshots
    const savedItems: QuotationItem[] = items.map((i) => ({
      id: uuidv4(),
      quotation_id: id,
      product_id: i.product_id || null,
      product_name: i.product_name || 'Product',
      model_number: i.model_number || null,
      brand_name: i.brand_name || null,
      unit_price: i.unit_price || 0,
      quantity: i.quantity || 1,
      discount_pct: i.discount_pct || 0,
      subtotal: i.subtotal || 0,
      specifications: i.specifications || {},
    }));
    inMemoryQuotationItems.set(id, savedItems);

    // Save service snapshots
    const savedServices: QuotationService[] = services.map((s) => ({
      id: uuidv4(),
      quotation_id: id,
      service_id: s.service_id || null,
      service_name: s.service_name || 'Service',
      quantity: s.quantity || 1,
      price_note: s.price_note || 'To be confirmed separately',
    }));
    inMemoryQuotationServices.set(id, savedServices);

    return {
      ...newQuotation,
      items: savedItems,
      services: savedServices,
    };
  }

  async findById(id: string): Promise<EnrichedQuotation | null> {
    const quote = inMemoryQuotations.get(id);
    if (!quote) return null;

    return {
      ...quote,
      items: inMemoryQuotationItems.get(id) || [],
      services: inMemoryQuotationServices.get(id) || [],
    };
  }

  async findByNumber(quotationNumber: string): Promise<EnrichedQuotation | null> {
    const quote = Array.from(inMemoryQuotations.values()).find(
      (q) => q.quotation_number === quotationNumber
    );
    if (!quote) return null;

    return {
      ...quote,
      items: inMemoryQuotationItems.get(quote.id) || [],
      services: inMemoryQuotationServices.get(quote.id) || [],
    };
  }

  async updateStatus(id: string, status: QuotationStatus): Promise<Quotation | null> {
    const quote = inMemoryQuotations.get(id);
    if (!quote) return null;

    quote.status = status;
    quote.updated_at = new Date().toISOString();
    return quote;
  }

  async updateContactInfo(id: string, contact: {
    name: string;
    phone: string;
    email?: string;
    company?: string;
    location?: string;
    notes?: string;
  }): Promise<EnrichedQuotation | null> {
    const quote = inMemoryQuotations.get(id);
    if (!quote) return null;

    quote.customer_name = contact.name;
    quote.customer_phone = contact.phone;
    quote.customer_email = contact.email || null;
    quote.customer_company = contact.company || null;
    quote.customer_location = contact.location || null;
    quote.customer_notes = contact.notes || null;
    quote.status = QuotationStatus.SUBMITTED;
    quote.updated_at = new Date().toISOString();

    return {
      ...quote,
      items: inMemoryQuotationItems.get(id) || [],
      services: inMemoryQuotationServices.get(id) || [],
    };
  }

  async findAllAdmin(options: { status?: string; page?: number; limit?: number } = {}) {
    let list = Array.from(inMemoryQuotations.values());

    if (options.status) {
      list = list.filter((q) => q.status === options.status);
    }

    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;

    const enriched = list.slice(offset, offset + limit).map((q) => ({
      ...q,
      items: inMemoryQuotationItems.get(q.id) || [],
      services: inMemoryQuotationServices.get(q.id) || [],
    }));

    return {
      items: enriched,
      total: list.length,
      page,
      limit,
      totalPages: Math.ceil(list.length / limit),
    };
  }
}

export const quotationRepository = new QuotationRepository();
