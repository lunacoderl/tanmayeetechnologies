// ============================================================================
// @tanmayee/database — Commercial Offers & Bulk Rules
// ============================================================================

export interface CommercialOffer {
  id: string;
  code: string;
  name: string;
  description: string;
  discount_type: 'PERCENTAGE' | 'FLAT';
  discount_value: number;
  min_quantity: number;
  max_quantity?: number | null;
  min_order_value?: number | null;
  applicable_scope:
    | 'ALL_PRODUCTS'
    | 'ROCKWELL_ONLY'
    | 'BLUE_STAR_ONLY'
    | 'FREEZERS_ONLY'
    | 'VISI_COOLERS_ONLY'
    | 'WATER_COOLERS_ONLY'
    | 'AC_ONLY';
  is_permanent: boolean;
  start_date: string;
  end_date?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export const INITIAL_OFFERS: CommercialOffer[] = [
  {
    id: 'off-1',
    code: 'BULK5',
    name: 'Tier 1 Bulk Procurement Incentive',
    description: 'Automatic 5% B2B procurement discount for orders of 5 to 9 commercial units.',
    discount_type: 'PERCENTAGE',
    discount_value: 5,
    min_quantity: 5,
    max_quantity: 9,
    min_order_value: null,
    applicable_scope: 'ALL_PRODUCTS',
    is_permanent: true,
    start_date: '2026-01-01T00:00:00Z',
    end_date: null,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'off-2',
    code: 'BULK8',
    name: 'Tier 2 Institutional Volume Rebate',
    description: 'Automatic 8% volume rebate for corporate, hospital, and school orders of 10 to 24 units.',
    discount_type: 'PERCENTAGE',
    discount_value: 8,
    min_quantity: 10,
    max_quantity: 24,
    min_order_value: null,
    applicable_scope: 'ALL_PRODUCTS',
    is_permanent: true,
    start_date: '2026-01-01T00:00:00Z',
    end_date: null,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'off-3',
    code: 'BULK12',
    name: 'Tier 3 Enterprise Fleet Discount',
    description: 'Exclusive 12% enterprise rate for projects exceeding 25 cooling or refrigeration units.',
    discount_type: 'PERCENTAGE',
    discount_value: 12,
    min_quantity: 25,
    max_quantity: null,
    min_order_value: null,
    applicable_scope: 'ALL_PRODUCTS',
    is_permanent: true,
    start_date: '2026-01-01T00:00:00Z',
    end_date: null,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'off-4',
    code: 'VIZAGB2B',
    name: 'Vizag Industrial Commercial Expo Offer',
    description: 'Flat ₹3,000 instant invoice discount on commercial Blue Star & Rockwell orders above ₹60,000.',
    discount_type: 'FLAT',
    discount_value: 3000,
    min_quantity: 1,
    max_quantity: null,
    min_order_value: 60000,
    applicable_scope: 'ALL_PRODUCTS',
    is_permanent: false,
    start_date: '2026-09-01T00:00:00Z',
    end_date: '2026-11-30T23:59:59Z',
    is_active: true,
    created_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'off-5',
    code: 'ROCKWELL10',
    name: 'Rockwell Deep Freezer Commercial Fest',
    description: 'Special 10% discount on 2 or more Rockwell Green Freezers or Hard Top commercial freezers.',
    discount_type: 'PERCENTAGE',
    discount_value: 10,
    min_quantity: 2,
    max_quantity: null,
    min_order_value: null,
    applicable_scope: 'FREEZERS_ONLY',
    is_permanent: false,
    start_date: '2026-09-15T00:00:00Z',
    end_date: '2026-10-31T23:59:59Z',
    is_active: true,
    created_at: '2026-09-15T00:00:00Z',
  },
];
