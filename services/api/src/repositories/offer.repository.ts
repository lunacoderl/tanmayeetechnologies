// ============================================================================
// @tanmayee/api — Offer Repository
// ============================================================================

import { Offer, OfferRule } from '@tanmayee/types';
import { DiscountType, OfferRuleType } from '@tanmayee/config';
import { v4 as uuidv4 } from 'uuid';

export interface EnrichedOffer extends Offer {
  rules: OfferRule[];
}

const inMemoryOffers: Offer[] = [
  {
    id: 'o0000001-0000-0000-0000-000000000001',
    title: 'Commercial Bulk Procurement Discount',
    description: 'Get an extra 10% discount on procurement orders of 5 or more units across commercial cooling and refrigeration.',
    discount_type: DiscountType.PERCENTAGE,
    discount_value: 10,
    is_active: true,
    starts_at: new Date().toISOString(),
    expires_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'o0000001-0000-0000-0000-000000000002',
    title: 'Blue Star Corporate Cooling Offer',
    description: 'Special corporate quotation pricing for Blue Star Inverter Split & Cassette AC systems.',
    discount_type: DiscountType.PERCENTAGE,
    discount_value: 8,
    is_active: true,
    starts_at: new Date().toISOString(),
    expires_at: null,
    created_at: new Date().toISOString(),
  },
];

const inMemoryOfferRules: OfferRule[] = [
  {
    id: 'or000001-0000-0000-0000-000000000001',
    offer_id: 'o0000001-0000-0000-0000-000000000001',
    rule_type: OfferRuleType.MIN_QTY,
    rule_value: { min_quantity: 5 },
    created_at: new Date().toISOString(),
  },
  {
    id: 'or000001-0000-0000-0000-000000000002',
    offer_id: 'o0000001-0000-0000-0000-000000000002',
    rule_type: OfferRuleType.BRAND,
    rule_value: { brand_slug: 'blue-star' },
    created_at: new Date().toISOString(),
  },
];

export class OfferRepository {
  async findActive(): Promise<EnrichedOffer[]> {
    const now = new Date().getTime();
    const active = inMemoryOffers.filter((o) => {
      if (!o.is_active) return false;
      if (o.starts_at && new Date(o.starts_at).getTime() > now) return false;
      if (o.expires_at && new Date(o.expires_at).getTime() < now) return false;
      return true;
    });

    return active.map((o) => ({
      ...o,
      rules: inMemoryOfferRules.filter((r) => r.offer_id === o.id),
    }));
  }

  async findAllAdmin(): Promise<EnrichedOffer[]> {
    return inMemoryOffers.map((o) => ({
      ...o,
      rules: inMemoryOfferRules.filter((r) => r.offer_id === o.id),
    }));
  }

  async create(data: Partial<Offer>, rules: Partial<OfferRule>[] = []): Promise<EnrichedOffer> {
    const id = uuidv4();
    const newOffer: Offer = {
      id,
      title: data.title!,
      description: data.description || null,
      discount_type: data.discount_type || DiscountType.PERCENTAGE,
      discount_value: data.discount_value || 0,
      is_active: data.is_active ?? true,
      starts_at: data.starts_at || null,
      expires_at: data.expires_at || null,
      created_at: new Date().toISOString(),
    };
    inMemoryOffers.unshift(newOffer);

    const savedRules: OfferRule[] = rules.map((r) => ({
      id: uuidv4(),
      offer_id: id,
      rule_type: r.rule_type!,
      rule_value: r.rule_value || {},
      created_at: new Date().toISOString(),
    }));
    inMemoryOfferRules.push(...savedRules);

    return {
      ...newOffer,
      rules: savedRules,
    };
  }

  async update(id: string, updates: Partial<Offer>): Promise<Offer | null> {
    const idx = inMemoryOffers.findIndex((o) => o.id === id);
    if (idx === -1) return null;

    inMemoryOffers[idx] = {
      ...inMemoryOffers[idx],
      ...updates,
    };
    return inMemoryOffers[idx];
  }
}

export const offerRepository = new OfferRepository();
