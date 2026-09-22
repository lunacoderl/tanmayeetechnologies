// ============================================================================
// @tanmayee/admin — Admin API Client
// ============================================================================

import {
  SEED_PRODUCTS,
  SEED_BRANDS,
  SEED_CATEGORIES,
  SEED_SERVICES,
  INITIAL_OFFERS,
  CommercialOffer,
} from '@tanmayee/database';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export function getStoredOffers(): CommercialOffer[] {
  if (typeof window === 'undefined') return INITIAL_OFFERS;
  try {
    const raw = localStorage.getItem('tt_admin_offers');
    if (!raw) {
      localStorage.setItem('tt_admin_offers', JSON.stringify(INITIAL_OFFERS));
      return INITIAL_OFFERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_OFFERS;
  }
}

export function saveStoredOffers(offers: CommercialOffer[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tt_admin_offers', JSON.stringify(offers));
  }
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('tt_admin_token');
}

export function setAdminToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tt_admin_token', token);
  }
}

export function clearAdminToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('tt_admin_token');
  }
}

export async function adminFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers as Record<string, string>),
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Error ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    // Fallback handler during dev/mock
    return getAdminFallbackData<T>(endpoint, options);
  }
}

function getAdminFallbackData<T>(endpoint: string, options: RequestInit = {}): T {
  const method = (options.method || 'GET').toUpperCase();

  if (endpoint.includes('/products')) {
    return {
      success: true,
      data: SEED_PRODUCTS,
      pagination: { page: 1, limit: 100, total: SEED_PRODUCTS.length, totalPages: 1 },
    } as T;
  }
  if (endpoint.includes('/categories')) {
    return { success: true, data: SEED_CATEGORIES } as T;
  }
  if (endpoint.includes('/brands')) {
    return { success: true, data: SEED_BRANDS } as T;
  }
  if (endpoint.includes('/services') && !endpoint.includes('/service-requests')) {
    return { success: true, data: SEED_SERVICES } as T;
  }
  if (endpoint.includes('/service-requests')) {
    return {
      success: true,
      data: [
        {
          id: 'sr-001',
          request_number: 'TT-SR-202609-0001',
          service_id: 's0000001-0000-0000-0000-000000000004',
          service_name: 'Annual Maintenance Contract (AMC)',
          customer_name: 'Rahul Sharma',
          customer_phone: '+91 93901 15553',
          customer_email: 'rahul@apexhotelvizag.com',
          customer_company: 'Apex Grand Luxury Hotel & Suites',
          equipment_details: '14 Blue Star Cassette ACs (3 Ton), 4 Rockwell Deep Freezers',
          status: 'PENDING',
          preferred_date: '2026-09-25',
          notes: 'Looking for a comprehensive 1-year AMC with quarterly preventive visits and emergency breakdown cover at Beach Road property.',
          created_at: '2026-09-21T10:30:00Z',
        },
        {
          id: 'sr-002',
          request_number: 'TT-SR-202609-0002',
          service_id: 's0000001-0000-0000-0000-000000000001',
          service_name: 'Commercial AC Installation',
          customer_name: 'Dr. Vikram Varma',
          customer_phone: '+91 98480 23456',
          customer_email: 'vikram@healthcityvizag.org',
          customer_company: 'Apollo & Health City Super Speciality Hospital',
          equipment_details: '8 units of Blue Star Inverter Split AC 2 Ton (5 Star)',
          status: 'IN_PROGRESS',
          preferred_date: '2026-09-24',
          notes: 'Installation in ICU and surgical recovery wards. Needs hospital-grade precision piping and nitrogen testing in Arilova.',
          created_at: '2026-09-20T14:15:00Z',
        },
        {
          id: 'sr-003',
          request_number: 'TT-SR-202609-0003',
          service_id: 's0000001-0000-0000-0000-000000000002',
          service_name: 'Refrigeration System Repair',
          customer_name: 'Sunita Reddy',
          customer_phone: '+91 94401 78910',
          customer_email: 'sunita@freshmartpm.in',
          customer_company: 'Fresh Delight Supermarket PM Palem',
          equipment_details: 'Rockwell 500L Double Door Visi Cooler (Model: SC500F)',
          status: 'COMPLETED',
          preferred_date: '2026-09-18',
          notes: 'Thermostat sensor calibrated and fan motor serviced at Madhurawada outlet.',
          created_at: '2026-09-17T09:00:00Z',
        },
      ],
      pagination: { page: 1, limit: 20, total: 3, totalPages: 1 },
    } as T;
  }
  if (endpoint.includes('/quotations')) {
    return {
      success: true,
      data: [
        {
          id: 'q-001',
          quotation_number: 'TT-Q-20260922-0001',
          customer_name: 'Anand Rao Kulkarni',
          customer_phone: '+91 98450 67890',
          customer_email: 'procurement@kulkarnigroup.in',
          customer_company: 'Kulkarni Port Logistics & Warehousing Park',
          customer_location: 'Autonagar Industrial Corridor, Gajuwaka, Visakhapatnam',
          subtotal: 785000,
          discount_total: 62800,
          grand_total: 722200,
          status: 'SENT',
          is_bulk: true,
          valid_until: '2026-10-07T00:00:00Z',
          created_at: '2026-09-22T08:30:00Z',
          items: [
            {
              id: 'qi-1',
              product_name: 'Blue Star Inverter Split AC 2.0 Ton 5 Star',
              model_number: 'IA524PKU',
              brand_name: 'Blue Star',
              quantity: 12,
              unit_price: 54500,
              discount_percent: 8,
              total_price: 601680,
            },
            {
              id: 'qi-2',
              product_name: 'Rockwell 500L Double Door Convertible Deep Freezer',
              model_number: 'SFR500DGT',
              brand_name: 'Rockwell',
              quantity: 4,
              unit_price: 38500,
              discount_percent: 8,
              total_price: 141640,
            },
          ],
          services: [
            {
              id: 'qs-1',
              service_name: 'Comprehensive 1-Year AMC + Preventive Care',
              price: 18000,
            },
          ],
        },
        {
          id: 'q-002',
          quotation_number: 'TT-Q-20260921-0002',
          customer_name: 'Pooja Varma',
          customer_phone: '+91 99890 45678',
          customer_email: 'pooja@coastalflavourshospitality.com',
          customer_company: 'Coastal Flavours Multi-Cuisine Diner & Lounge',
          customer_location: 'Waltair Uplands, Siripuram, Visakhapatnam',
          subtotal: 165000,
          discount_total: 8250,
          grand_total: 156750,
          status: 'GENERATED',
          is_bulk: false,
          valid_until: '2026-10-06T00:00:00Z',
          created_at: '2026-09-21T15:45:00Z',
          items: [
            {
              id: 'qi-3',
              product_name: 'Rockwell 400L Single Door Visi Cooler',
              model_number: 'GVC400',
              brand_name: 'Rockwell',
              quantity: 2,
              unit_price: 46000,
              discount_percent: 5,
              total_price: 87400,
            },
            {
              id: 'qi-4',
              product_name: 'Rockwell Commercial Bullet Ice Machine 50kg/day',
              model_number: 'RIM-50B',
              brand_name: 'Rockwell',
              quantity: 1,
              unit_price: 73000,
              discount_percent: 5,
              total_price: 69350,
            },
          ],
          services: [],
        },
        {
          id: 'q-003',
          quotation_number: 'TT-Q-20260920-0003',
          customer_name: 'K. Subrahmanyam Raju',
          customer_phone: '+91 94408 33445',
          customer_email: 'procurement@srikrishnacoldstorage.com',
          customer_company: 'Sri Krishna Cold Storage & Agro Marine Logistics',
          customer_location: 'Gambheeram Special Agro Zone, Anandapuram, Visakhapatnam',
          subtotal: 1240000,
          discount_total: 148800,
          grand_total: 1091200,
          status: 'ACCEPTED',
          is_bulk: true,
          valid_until: '2026-10-05T00:00:00Z',
          created_at: '2026-09-20T11:20:00Z',
          items: [
            {
              id: 'qi-5',
              product_name: 'Blue Star 3.0 Ton Cassette Air Conditioner',
              model_number: 'CAC363FA',
              brand_name: 'Blue Star',
              quantity: 10,
              unit_price: 92000,
              discount_percent: 12,
              total_price: 809600,
            },
            {
              id: 'qi-6',
              product_name: 'Rockwell Stainless Steel Water Cooler 150L',
              model_number: 'RWC150SS',
              brand_name: 'Rockwell',
              quantity: 8,
              unit_price: 40000,
              discount_percent: 12,
              total_price: 281600,
            },
          ],
          services: [],
        },
      ],
      pagination: { page: 1, limit: 20, total: 3, totalPages: 1 },
    } as T;
  }
  if (endpoint.includes('/offers')) {
    let currentOffers = getStoredOffers();

    if (method === 'POST' && options.body) {
      try {
        const newOffer = JSON.parse(options.body as string);
        if (!newOffer.id) {
          newOffer.id = `off-${Date.now()}`;
        }
        newOffer.created_at = new Date().toISOString();
        currentOffers = [newOffer, ...currentOffers];
        saveStoredOffers(currentOffers);
        return { success: true, data: newOffer } as T;
      } catch (e) {
        console.error('Failed to parse new offer:', e);
      }
    }

    if ((method === 'PUT' || method === 'PATCH') && options.body) {
      try {
        const updatedOffer = JSON.parse(options.body as string);
        currentOffers = currentOffers.map((o) =>
          o.id === updatedOffer.id ? { ...o, ...updatedOffer, updated_at: new Date().toISOString() } : o
        );
        saveStoredOffers(currentOffers);
        return { success: true, data: updatedOffer } as T;
      } catch (e) {
        console.error('Failed to parse updated offer:', e);
      }
    }

    if (method === 'DELETE') {
      const parts = endpoint.split('/');
      const idToDelete = parts[parts.length - 1];
      currentOffers = currentOffers.filter((o) => o.id !== idToDelete);
      saveStoredOffers(currentOffers);
      return { success: true, message: 'Offer deleted successfully' } as T;
    }

    return {
      success: true,
      data: currentOffers,
    } as T;
  }
  if (endpoint.includes('/analytics/dashboard')) {
    return {
      success: true,
      data: {
        total_sessions: 1420,
        total_events: 8900,
        high_value_leads: 48,
        conversions: 36,
        conversion_rate: '14.2%',
        events_breakdown: {
          PRODUCT_VIEW: 5420,
          SEARCH: 1240,
          ADD_TO_CART: 680,
          QUOTE_SUBMITTED: 180,
        },
      },
    } as T;
  }
  if (endpoint.includes('/analytics/leads')) {
    return {
      success: true,
      data: [
        {
          session_id: 'sess-8491-b2b',
          lead_score: 95,
          total_events: 34,
          cart_value: 840000,
          items_in_cart: 16,
          last_active: '12 minutes ago',
          primary_interest: 'Blue Star Inverter Split ACs & Cassette units',
          customer_identified: 'Anand Rao Kulkarni (Kulkarni Port Logistics, Gajuwaka)',
          status: 'HIGH_INTENT',
        },
        {
          session_id: 'sess-8422-hosp',
          lead_score: 88,
          total_events: 28,
          cart_value: 460000,
          items_in_cart: 8,
          last_active: '45 minutes ago',
          primary_interest: 'Rockwell Deep Freezers & Visi Coolers',
          customer_identified: 'Fresh Delight Supermarkets (PM Palem, Madhurawada)',
          status: 'HIGH_INTENT',
        },
        {
          session_id: 'sess-8390-inst',
          lead_score: 76,
          total_events: 19,
          cart_value: 195000,
          items_in_cart: 4,
          last_active: '2 hours ago',
          primary_interest: 'Rockwell Stainless Steel Water Coolers (150L & 80L)',
          customer_identified: 'GITAM Deemed University Campus Facilities (Rushikonda, Vizag)',
          status: 'WARM_LEAD',
        },
      ],
    } as T;
  }
  if (endpoint.includes('/publish')) {
    return {
      success: true,
      data: {
        last_published_at: new Date().toISOString(),
        products_published: SEED_PRODUCTS.length,
        version: '2026.09.22-v1',
        cache_cleared: true,
        cdn_status: 'HEALTHY',
      },
    } as T;
  }
  if (endpoint.includes('/audit-logs')) {
    return {
      success: true,
      data: [
        {
          id: 'audit-001',
          action: 'PUBLISH_CATALOG_SNAPSHOT',
          entity_type: 'catalog',
          entity_id: 'all',
          user_email: 'admin@tanmayeetechnologies.com',
          created_at: '2026-09-22T08:00:00Z',
          details: 'Refreshed published catalog materialized view with 155 active products (97 Rockwell + 58 Blue Star).',
        },
        {
          id: 'audit-002',
          action: 'UPDATE_QUOTATION_STATUS',
          entity_type: 'quotation',
          entity_id: 'TT-Q-20260922-0001',
          user_email: 'admin@tanmayeetechnologies.com',
          created_at: '2026-09-21T16:30:00Z',
          details: 'Status updated from SENT to ACCEPTED. Customer confirmed purchase order for Port Logistics.',
        },
        {
          id: 'audit-003',
          action: 'UPDATE_PRODUCT_PRICE',
          entity_type: 'product',
          entity_id: 'p0000001-0000-0000-0000-000000000001',
          user_email: 'admin@tanmayeetechnologies.com',
          created_at: '2026-09-21T11:15:00Z',
          details: 'Verified pricing and capacity tier specifications for Rockwell GFR250D5UC4S Convertible Green Freezer.',
        },
        {
          id: 'audit-004',
          action: 'CREATE_BULK_OFFER_RULE',
          entity_type: 'offer',
          entity_id: 'off-4',
          user_email: 'admin@tanmayeetechnologies.com',
          created_at: '2026-09-20T14:00:00Z',
          details: 'Configured Vizag Industrial Commercial Expo Offer (Flat ₹3,000 for orders above ₹60,000).',
        },
      ],
      pagination: { page: 1, limit: 20, total: 4, totalPages: 1 },
    } as T;
  }

  return { success: true, data: [] } as T;
}
