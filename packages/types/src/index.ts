// ============================================================================
// @tanmayee/types — Shared TypeScript Interfaces
// All entity types for the Tanmayee Technologies platform
// ============================================================================

import type {
  ProductStatus,
  PriceDisplay,
  MediaType,
  QuotationStatus,
  CartStatus,
  ServiceRequestStatus,
  RelationType,
  DiscountType,
  OfferRuleType,
  AdminRole,
  AnalyticsEvent,
  AttributeType,
  FilterType,
} from '@tanmayee/config';

// ──────────────────────────────────────────────
// Base
// ──────────────────────────────────────────────
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

// ──────────────────────────────────────────────
// Brand
// ──────────────────────────────────────────────
export interface Brand extends BaseEntity {
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  website_url: string | null;
  sort_order: number;
  is_active: boolean;
}

// ──────────────────────────────────────────────
// Category
// ──────────────────────────────────────────────
export interface Category extends BaseEntity {
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  sort_order: number;
  is_active: boolean;
  product_count: number;
  children?: Category[];
}

export interface CategoryAttribute extends BaseEntity {
  category_id: string;
  attribute_name: string;
  attribute_type: AttributeType;
  attribute_unit: string | null;
  filter_type: FilterType;
  possible_values: string[] | null;
  is_filterable: boolean;
  is_comparable: boolean;
  sort_order: number;
}

// ──────────────────────────────────────────────
// Product
// ──────────────────────────────────────────────
export interface Product extends BaseEntity {
  brand_id: string;
  category_id: string;
  subcategory_id: string | null;
  model_number: string | null;
  sku: string | null;
  product_name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  features: string[] | null;
  applications: string[] | null;
  status: ProductStatus;
  visibility: boolean;
  featured: boolean;
  reference_price: number | null;
  price_display: PriceDisplay;
  price_range_min: number | null;
  price_range_max: number | null;
  currency: string;
  bulk_threshold: number | null;
  bulk_discount_pct: number | null;
  requires_manual_quote: boolean;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  current_version: number;
  view_count?: number;
  published_at?: string | null;
  archived_at?: string | null;
  media?: ProductMedia[] | any[];
}

export interface ProductWithRelations extends Product {
  brand: Brand;
  category: Category;
  subcategory?: Category | null;
  attributes: ProductAttribute[];
  media: ProductMedia[];
  verifications?: ProductVerification[];
  services?: Service[];
}

export interface ProductAttribute {
  id: string;
  product_id: string;
  attribute_name: string;
  attribute_value: string;
  attribute_unit: string | null;
  numeric_value: number | null;
  sort_order: number;
}

export interface ProductMedia {
  id: string;
  product_id: string;
  type: MediaType;
  url: string;
  alt_text: string | null;
  title: string | null;
  caption: string | null;
  mime_type: string | null;
  file_size: number | null;
  dimensions: { width: number; height: number } | null;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductVersion {
  id: string;
  product_id: string;
  version_number: number;
  snapshot: Record<string, unknown>;
  change_summary: string | null;
  changed_by: string | null;
  created_at: string;
}

export interface ProductVerification {
  id: string;
  product_id: string;
  manufacturer_verified: boolean;
  catalog_verified: boolean;
  tanmayee_catalog_verified: boolean;
  source_url: string | null;
  verification_notes: string | null;
  verified_by: string | null;
  verified_at: string | null;
}

export interface ProductRelation {
  id: string;
  product_id: string;
  related_id: string;
  relation_type: RelationType;
  sort_order: number;
}

// ──────────────────────────────────────────────
// Published Catalog (materialized view row)
// ──────────────────────────────────────────────
export interface PublishedProduct {
  id: string;
  brand_id: string;
  category_id: string;
  subcategory_id: string | null;
  model_number: string | null;
  sku: string | null;
  product_name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  features: string[] | null;
  applications: string[] | null;
  reference_price: number | null;
  price_display: PriceDisplay;
  price_range_min: number | null;
  price_range_max: number | null;
  currency: string;
  bulk_threshold: number | null;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  published_at: string;
  brand_name: string;
  brand_slug: string;
  brand_logo: string | null;
  category_name: string;
  category_slug: string;
  attributes: Array<{ name: string; value: string; unit: string | null }>;
  media: Array<{
    url: string;
    type: MediaType;
    alt: string | null;
    is_primary: boolean;
    sort_order: number;
  }>;
}

// ──────────────────────────────────────────────
// Service
// ──────────────────────────────────────────────
export interface Service extends BaseEntity {
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  base_price: number | null;
  price_display: PriceDisplay;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
  sort_order: number;
}

export interface ServiceRequest extends BaseEntity {
  service_id: string | null;
  session_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  customer_company: string | null;
  description: string | null;
  status: ServiceRequestStatus;
}

// ──────────────────────────────────────────────
// Cart
// ──────────────────────────────────────────────
export interface Cart extends BaseEntity {
  session_id: string | null;
  status: CartStatus;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  added_at: string;
  // Joined data (not stored, fetched)
  product?: PublishedProduct | Product;
}

export interface CartWithItems extends Cart {
  items: CartItem[];
}

// ──────────────────────────────────────────────
// Quotation (Immutable Snapshots)
// ──────────────────────────────────────────────
export interface Quotation extends BaseEntity {
  quotation_number: string;
  cart_id: string | null;
  session_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  customer_company: string | null;
  customer_location: string | null;
  customer_notes: string | null;
  subtotal: number;
  discount_total: number;
  grand_total: number;
  status: QuotationStatus;
  is_bulk: boolean;
  pdf_url: string | null;
  valid_until: string | null;
}

export interface QuotationItem {
  id: string;
  quotation_id: string;
  product_id: string | null;
  product_name: string;
  model_number: string | null;
  brand_name: string | null;
  unit_price: number | null;
  quantity: number;
  discount_pct: number;
  subtotal: number;
  specifications: Record<string, string> | null;
}

export interface QuotationService {
  id: string;
  quotation_id: string;
  service_id: string | null;
  service_name: string;
  quantity: number;
  price_note: string;
}

export interface QuotationWithItems extends Quotation {
  items: QuotationItem[];
  services: QuotationService[];
}

// ──────────────────────────────────────────────
// Offers
// ──────────────────────────────────────────────
export interface Offer extends BaseEntity {
  title: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number | null;
  is_active: boolean;
  starts_at: string | null;
  expires_at: string | null;
}

export interface OfferRule {
  id: string;
  offer_id: string;
  rule_type: OfferRuleType;
  rule_value: Record<string, unknown>;
  created_at?: string;
}

export interface OfferWithRules extends Offer {
  rules: OfferRule[];
}

// ──────────────────────────────────────────────
// Anonymous Session & Analytics
// ──────────────────────────────────────────────
export interface AnonymousSession {
  id: string;
  session_token: string;
  interest_profile: InterestProfile;
  lead_score: number;
  first_seen_at: string;
  last_seen_at: string;
  converted_at: string | null;
  ip_hash?: string | null;
  user_agent?: string | null;
}

export interface InterestProfile {
  categories?: Record<string, number>;
  brands?: Record<string, number>;
  search_terms?: string[];
  price_range?: { min?: number; max?: number };
  top_category?: string | null;
  top_brand?: string | null;
}

export interface AnalyticsEventRecord {
  id: string;
  session_id: string | null;
  event_name: AnalyticsEvent;
  product_id: string | null;
  category_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ──────────────────────────────────────────────
// Wishlist
// ──────────────────────────────────────────────
export interface WishlistItem {
  id: string;
  session_id: string;
  product_id: string;
  created_at: string;
  product?: PublishedProduct;
}

// ──────────────────────────────────────────────
// Admin
// ──────────────────────────────────────────────
export interface AdminUser {
  id: string;
  email: string;
  password_hash?: string;
  full_name: string | null;
  role: AdminRole;
  is_active: boolean;
  mfa_enabled: boolean;
  mfa_secret?: string | null;
  last_login_at: string | null;
  login_attempts?: number;
  locked_until?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface AdminAuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent?: string | null;
  created_at: string;
}

// ──────────────────────────────────────────────
// API Response Types
// ──────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// ──────────────────────────────────────────────
// Search & Filter Types
// ──────────────────────────────────────────────
export interface SearchResult {
  products: PublishedProduct[];
  categories: Category[];
  brands: Brand[];
  total: number;
}

export interface FilterOption {
  attribute_name: string;
  attribute_unit: string | null;
  filter_type: FilterType;
  values: Array<{
    value: string;
    count: number;
  }>;
  range?: {
    min: number;
    max: number;
  };
}

export interface ProductFilters {
  brand?: string[];
  category?: string;
  attributes?: Record<string, string[]>;
  price_min?: number;
  price_max?: number;
  sort?: 'relevance' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'newest';
  page?: number;
  limit?: number;
  search?: string;
}

// ──────────────────────────────────────────────
// Dashboard Stats
// ──────────────────────────────────────────────
export interface DashboardStats {
  today_visitors: number;
  product_views: number;
  new_enquiries: number;
  new_quotations: number;
  bulk_enquiries: number;
  service_requests: number;
  hot_leads: number;
  top_products: Array<{ product_id: string; product_name: string; views: number }>;
  top_searches: Array<{ term: string; count: number }>;
}
