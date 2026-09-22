// ============================================================================
// @tanmayee/api — Service Repository
// ============================================================================

import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  SEED_SERVICES,
} from '@tanmayee/database';
import { Service, ServiceRequest } from '@tanmayee/types';
import { ServiceRequestStatus, PriceDisplay } from '@tanmayee/config';
import { v4 as uuidv4 } from 'uuid';

let inMemoryServices: Service[] = [...SEED_SERVICES];
let inMemoryServiceRequests: ServiceRequest[] = [];

export class ServiceRepository {
  async findAll(): Promise<Service[]> {
    const supabase = getSupabaseAdmin();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase services fetch failed, using fallback:', err);
      }
    }
    return inMemoryServices.filter((s) => s.is_active);
  }

  async findBySlug(slug: string): Promise<Service | null> {
    const supabase = getSupabaseAdmin();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('slug', slug)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase service findBySlug failed, using fallback:', err);
      }
    }
    return inMemoryServices.find((s) => s.slug === slug) || null;
  }

  async findById(id: string): Promise<Service | null> {
    return inMemoryServices.find((s) => s.id === id) || null;
  }

  async createService(data: Partial<Service>): Promise<Service> {
    const newService: Service = {
      id: uuidv4(),
      name: data.name!,
      slug: data.slug!,
      short_description: data.short_description || null,
      description: data.description || null,
      image_url: data.image_url || null,
      base_price: data.base_price || null,
      price_display: data.price_display || PriceDisplay.ON_REQUEST,
      is_active: data.is_active ?? true,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      sort_order: data.sort_order || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    inMemoryServices.push(newService);
    return newService;
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
    const idx = inMemoryServices.findIndex((s) => s.id === id);
    if (idx === -1) return null;

    inMemoryServices[idx] = {
      ...inMemoryServices[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return inMemoryServices[idx];
  }

  // ── Service Requests (Leads) ──────────────────────────────────────────

  async createRequest(data: {
    service_id?: string;
    session_id?: string;
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    customer_company?: string;
    description?: string;
  }): Promise<ServiceRequest> {
    const newReq: ServiceRequest = {
      id: uuidv4(),
      service_id: data.service_id || null,
      session_id: data.session_id || null,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_email: data.customer_email || null,
      customer_company: data.customer_company || null,
      description: data.description || null,
      status: ServiceRequestStatus.NEW,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    inMemoryServiceRequests.unshift(newReq);
    return newReq;
  }

  async findAllRequestsAdmin(options: { status?: string; page?: number; limit?: number } = {}) {
    let list = [...inMemoryServiceRequests];
    if (options.status) {
      list = list.filter((r) => r.status === options.status);
    }

    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;

    return {
      items: list.slice(offset, offset + limit),
      total: list.length,
      page,
      limit,
      totalPages: Math.ceil(list.length / limit),
    };
  }

  async updateRequestStatus(id: string, status: ServiceRequestStatus): Promise<ServiceRequest | null> {
    const req = inMemoryServiceRequests.find((r) => r.id === id);
    if (!req) return null;
    req.status = status;
    req.updated_at = new Date().toISOString();
    return req;
  }
}

export const serviceRepository = new ServiceRepository();
