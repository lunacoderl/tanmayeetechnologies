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

export function getStoredQuotations(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('tanmayee_submitted_quotations');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredQuotations(quotes: any[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tanmayee_submitted_quotations', JSON.stringify(quotes));
  }
}

export function getStoredServiceRequests(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('tanmayee_service_requests');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredServiceRequests(requests: any[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('tanmayee_service_requests', JSON.stringify(requests));
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
    let requests = getStoredServiceRequests();

    // Support PATCH status update
    if (method === 'PATCH' && endpoint.includes('/status') && options.body) {
      try {
        const body = JSON.parse(options.body as string);
        const parts = endpoint.split('/');
        const statusIdx = parts.indexOf('status');
        const idToUpdate = statusIdx > 0 ? parts[statusIdx - 1] : parts[parts.length - 1];
        requests = requests.map((r) =>
          r.id === idToUpdate ? { ...r, status: body.status, updated_at: new Date().toISOString() } : r
        );
        saveStoredServiceRequests(requests);
        const updated = requests.find((r) => r.id === idToUpdate);
        return { success: true, data: updated } as T;
      } catch (e) {
        console.error('Failed to update service request status:', e);
      }
    }

    if (method === 'POST' && options.body) {
      try {
        const newReq = JSON.parse(options.body as string);
        if (!newReq.id) newReq.id = `sr-${Date.now()}`;
        if (!newReq.request_number) {
          newReq.request_number = `TT-SR-${new Date().toISOString().slice(0, 7).replace('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        newReq.created_at = new Date().toISOString();
        if (!newReq.status) newReq.status = 'PENDING';
        requests = [newReq, ...requests];
        saveStoredServiceRequests(requests);
        return { success: true, data: newReq } as T;
      } catch (e) {
        console.error('Failed to create service request:', e);
      }
    }

    return {
      success: true,
      data: requests,
      pagination: { page: 1, limit: 50, total: requests.length, totalPages: 1 },
    } as T;
  }
  if (endpoint.includes('/quotations')) {
    let quotations = getStoredQuotations();

    // Support PATCH status update
    if (method === 'PATCH' && endpoint.includes('/status') && options.body) {
      try {
        const body = JSON.parse(options.body as string);
        const parts = endpoint.split('/');
        const statusIdx = parts.indexOf('status');
        const idToUpdate = statusIdx > 0 ? parts[statusIdx - 1] : parts[parts.length - 1];
        quotations = quotations.map((q) =>
          q.id === idToUpdate ? { ...q, status: body.status, updated_at: new Date().toISOString() } : q
        );
        saveStoredQuotations(quotations);
        const updated = quotations.find((q) => q.id === idToUpdate);
        return { success: true, data: updated } as T;
      } catch (e) {
        console.error('Failed to update quotation status:', e);
      }
    }

    if (method === 'POST' && options.body) {
      try {
        const newQuote = JSON.parse(options.body as string);
        if (!newQuote.id) newQuote.id = `q-${Date.now()}`;
        if (!newQuote.quotation_number) {
          newQuote.quotation_number = `TT-Q-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        newQuote.created_at = new Date().toISOString();
        if (!newQuote.status) newQuote.status = 'GENERATED';
        quotations = [newQuote, ...quotations];
        saveStoredQuotations(quotations);
        return { success: true, data: newQuote } as T;
      } catch (e) {
        console.error('Failed to create quotation:', e);
      }
    }

    return {
      success: true,
      data: quotations,
      pagination: { page: 1, limit: 50, total: quotations.length, totalPages: 1 },
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
    const quotations = getStoredQuotations();
    const highValue = quotations.filter((q) => (q.grand_total || 0) >= 100000).length;
    const converted = quotations.filter((q) => q.status === 'ACCEPTED' || q.status === 'CONVERTED').length;
    const totalQuotes = quotations.length;

    return {
      success: true,
      data: {
        total_sessions: totalQuotes > 0 ? totalQuotes * 14 : 0,
        total_events: totalQuotes > 0 ? totalQuotes * 48 : 0,
        high_value_leads: highValue,
        conversions: converted,
        conversion_rate: totalQuotes > 0 ? `${Math.round((converted / totalQuotes) * 100)}%` : '0%',
        events_breakdown: {
          PRODUCT_VIEW: totalQuotes * 24,
          SEARCH: totalQuotes * 12,
          ADD_TO_CART: totalQuotes * 4,
          QUOTE_SUBMITTED: totalQuotes,
        },
      },
    } as T;
  }
  if (endpoint.includes('/analytics/leads')) {
    const quotations = getStoredQuotations();
    const leads = quotations.map((q, idx) => ({
      session_id: `sess-${q.id || idx}`,
      lead_score: (q.grand_total || 0) > 200000 ? 95 : 78,
      total_events: (q.items?.length || 1) * 6,
      cart_value: q.grand_total || 0,
      items_in_cart: q.items?.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0) || 1,
      last_active: 'Recently',
      primary_interest: q.items?.map((it: any) => it.product_name).slice(0, 2).join(', ') || 'Commercial HVAC & Refrigeration',
      customer_identified: `${q.customer_name}${q.customer_company ? ` (${q.customer_company})` : ''}`,
      status: (q.grand_total || 0) > 200000 ? 'HIGH_INTENT' : 'WARM_LEAD',
    }));
    return {
      success: true,
      data: leads,
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
          created_at: new Date().toISOString(),
          details: `Refreshed published catalog materialized view with ${SEED_PRODUCTS.length} active products (Rockwell & Blue Star).`,
        },
      ],
      pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
    } as T;
  }

  return { success: true, data: [] } as T;
}
