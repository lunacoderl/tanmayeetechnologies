// ============================================================================
// @tanmayee/validation — Shared Zod Schemas
// Used by both API (server-side validation) and frontend (form validation)
// ============================================================================

import { z } from 'zod';

// ──────────────────────────────────────────────
// Common
// ──────────────────────────────────────────────
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const uuidSchema = z.string().uuid();

export const slugSchema = z
  .string()
  .min(1)
  .max(500)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format');

// ──────────────────────────────────────────────
// Product
// ──────────────────────────────────────────────
export const createProductSchema = z.object({
  brand_id: uuidSchema,
  category_id: uuidSchema,
  subcategory_id: uuidSchema.nullable().optional(),
  model_number: z.string().max(255).nullable().optional(),
  sku: z.string().max(255).nullable().optional(),
  product_name: z.string().min(1).max(500),
  slug: slugSchema,
  short_description: z.string().max(1000).nullable().optional(),
  description: z.string().nullable().optional(),
  features: z.array(z.string()).nullable().optional(),
  applications: z.array(z.string()).nullable().optional(),
  reference_price: z.number().positive().nullable().optional(),
  price_display: z.enum(['ON_REQUEST', 'SHOW', 'RANGE']).default('ON_REQUEST'),
  price_range_min: z.number().positive().nullable().optional(),
  price_range_max: z.number().positive().nullable().optional(),
  bulk_threshold: z.number().int().positive().nullable().optional(),
  bulk_discount_pct: z.number().min(0).max(100).nullable().optional(),
  requires_manual_quote: z.boolean().default(false),
  seo_title: z.string().max(255).nullable().optional(),
  seo_description: z.string().max(500).nullable().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const publishProductSchema = z.object({
  product_id: uuidSchema,
});

// ──────────────────────────────────────────────
// Product Attributes (EAV)
// ──────────────────────────────────────────────
export const productAttributeSchema = z.object({
  attribute_name: z.string().min(1).max(255),
  attribute_value: z.string().min(1),
  attribute_unit: z.string().max(50).nullable().optional(),
  numeric_value: z.number().nullable().optional(),
  sort_order: z.number().int().default(0),
});

export const batchProductAttributesSchema = z.object({
  product_id: uuidSchema,
  attributes: z.array(productAttributeSchema),
});

// ──────────────────────────────────────────────
// Product Media
// ──────────────────────────────────────────────
export const productMediaSchema = z.object({
  product_id: uuidSchema,
  type: z.enum([
    'MAIN_IMAGE',
    'GALLERY',
    'VIDEO',
    'BROCHURE',
    'MANUAL',
    'SPECIFICATION',
  ]),
  url: z.string().url(),
  alt_text: z.string().max(500).nullable().optional(),
  title: z.string().max(500).nullable().optional(),
  caption: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  is_primary: z.boolean().default(false),
});

// ──────────────────────────────────────────────
// Brand
// ──────────────────────────────────────────────
export const createBrandSchema = z.object({
  name: z.string().min(1).max(255),
  slug: slugSchema,
  logo_url: z.string().url().nullable().optional(),
  description: z.string().nullable().optional(),
  seo_title: z.string().max(255).nullable().optional(),
  seo_description: z.string().nullable().optional(),
  website_url: z.string().url().nullable().optional(),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const updateBrandSchema = createBrandSchema.partial();

// ──────────────────────────────────────────────
// Category
// ──────────────────────────────────────────────
export const createCategorySchema = z.object({
  parent_id: uuidSchema.nullable().optional(),
  name: z.string().min(1).max(255),
  slug: slugSchema,
  description: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  seo_title: z.string().max(255).nullable().optional(),
  seo_description: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

// ──────────────────────────────────────────────
// Category Attributes (filter definitions)
// ──────────────────────────────────────────────
export const categoryAttributeSchema = z.object({
  category_id: uuidSchema,
  attribute_name: z.string().min(1).max(255),
  attribute_type: z.enum(['text', 'number', 'boolean', 'enum']).default('text'),
  attribute_unit: z.string().max(50).nullable().optional(),
  filter_type: z.enum(['select', 'range', 'checkbox', 'search']).default('select'),
  possible_values: z.array(z.string()).nullable().optional(),
  is_filterable: z.boolean().default(true),
  is_comparable: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

// ──────────────────────────────────────────────
// Cart
// ──────────────────────────────────────────────
export const addToCartSchema = z.object({
  product_id: uuidSchema,
  quantity: z.number().int().min(1).max(9999).default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(9999),
});

// ──────────────────────────────────────────────
// Quotation
// ──────────────────────────────────────────────
export const generateQuotationSchema = z.object({
  cart_id: uuidSchema,
});

export const submitQuotationSchema = z.object({
  quotation_id: uuidSchema,
  customer_name: z.string().min(1).max(255),
  customer_phone: z
    .string()
    .min(10)
    .max(20)
    .regex(/^[+]?[\d\s-]{10,20}$/, 'Invalid phone number'),
  customer_email: z.string().email().max(255).optional(),
  customer_company: z.string().max(255).optional(),
  customer_location: z.string().max(255).optional(),
  customer_notes: z.string().max(2000).optional(),
});

// ──────────────────────────────────────────────
// Service
// ──────────────────────────────────────────────
export const createServiceSchema = z.object({
  name: z.string().min(1).max(255),
  slug: slugSchema,
  short_description: z.string().max(500).nullable().optional(),
  description: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  base_price: z.number().positive().nullable().optional(),
  price_display: z.enum(['ON_REQUEST', 'SHOW', 'RANGE']).default('ON_REQUEST'),
  seo_title: z.string().max(255).nullable().optional(),
  seo_description: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
});

export const serviceRequestSchema = z.object({
  service_id: uuidSchema.optional(),
  customer_name: z.string().min(1).max(255),
  customer_phone: z
    .string()
    .min(10)
    .max(20)
    .regex(/^[+]?[\d\s-]{10,20}$/, 'Invalid phone number'),
  customer_email: z.string().email().max(255).optional(),
  customer_company: z.string().max(255).optional(),
  description: z.string().max(2000).optional(),
});

// ──────────────────────────────────────────────
// Offer
// ──────────────────────────────────────────────
export const createOfferSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  discount_type: z.enum(['PERCENTAGE', 'FIXED', 'CUSTOM']),
  discount_value: z.number().positive().nullable().optional(),
  is_active: z.boolean().default(true),
  starts_at: z.string().datetime().nullable().optional(),
  expires_at: z.string().datetime().nullable().optional(),
  rules: z
    .array(
      z.object({
        rule_type: z.enum(['BRAND', 'CATEGORY', 'PRODUCT', 'MIN_QTY', 'MIN_VALUE']),
        rule_value: z.record(z.unknown()),
      })
    )
    .optional(),
});

// ──────────────────────────────────────────────
// Search & Filters
// ──────────────────────────────────────────────
export const searchSchema = z.object({
  q: z.string().min(1).max(200),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const productFiltersSchema = z.object({
  brand: z.union([z.string(), z.array(z.string())]).optional(),
  category: z.string().optional(),
  attributes: z.record(z.union([z.string(), z.array(z.string())])).optional(),
  price_min: z.coerce.number().positive().optional(),
  price_max: z.coerce.number().positive().optional(),
  sort: z
    .enum(['relevance', 'name_asc', 'name_desc', 'price_asc', 'price_desc', 'newest'])
    .default('relevance'),
  search: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ──────────────────────────────────────────────
// Analytics Events
// ──────────────────────────────────────────────
export const trackEventSchema = z.object({
  event_name: z.enum([
    'PRODUCT_VIEW',
    'SEARCH',
    'FILTER',
    'COMPARE',
    'WISHLIST',
    'ADD_TO_CART',
    'REMOVE_FROM_CART',
    'BROCHURE_DOWNLOAD',
    'WHATSAPP_CLICK',
    'CALL_CLICK',
    'QUOTE_STARTED',
    'QUOTE_SUBMITTED',
    'SERVICE_VIEW',
    'SERVICE_REQUEST',
  ]),
  product_id: uuidSchema.nullable().optional(),
  category_id: uuidSchema.nullable().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const batchEventsSchema = z.object({
  events: z.array(trackEventSchema).min(1).max(50),
});

// ──────────────────────────────────────────────
// Admin Auth
// ──────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const mfaVerifySchema = z.object({
  token: z.string().length(6),
});

// ──────────────────────────────────────────────
// Admin User
// ──────────────────────────────────────────────
export const createAdminUserSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(12)
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  full_name: z.string().min(1).max(255),
  role: z.enum([
    'SUPER_ADMIN',
    'PRODUCT_MANAGER',
    'SERVICE_MANAGER',
    'SALES',
    'CONTENT_MANAGER',
  ]),
});

// ──────────────────────────────────────────────
// File Upload Validation
// ──────────────────────────────────────────────
export const fileUploadSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  mimetype: z.string().refine(
    (mime) =>
      [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/avif',
        'application/pdf',
      ].includes(mime),
    'Invalid file type. Allowed: JPEG, PNG, WebP, AVIF, PDF'
  ),
  size: z.number().max(10 * 1024 * 1024, 'File size must be under 10MB'),
});

// ──────────────────────────────────────────────
// Type exports
// ──────────────────────────────────────────────
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type SubmitQuotationInput = z.infer<typeof submitQuotationSchema>;
export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;
export type CreateOfferInput = z.infer<typeof createOfferSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;
export type TrackEventInput = z.infer<typeof trackEventSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;
