// ============================================================================
// @tanmayee/config — Shared Constants, Enums & Configuration
// ============================================================================

// ──────────────────────────────────────────────
// Product Status Lifecycle
// ──────────────────────────────────────────────
export const ProductStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;
export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];

// ──────────────────────────────────────────────
// Price Display Mode
// ──────────────────────────────────────────────
export const PriceDisplay = {
  ON_REQUEST: 'ON_REQUEST',
  SHOW: 'SHOW',
  RANGE: 'RANGE',
} as const;
export type PriceDisplay = (typeof PriceDisplay)[keyof typeof PriceDisplay];

// ──────────────────────────────────────────────
// Media Types
// ──────────────────────────────────────────────
export const MediaType = {
  MAIN_IMAGE: 'MAIN_IMAGE',
  GALLERY: 'GALLERY',
  VIDEO: 'VIDEO',
  BROCHURE: 'BROCHURE',
  MANUAL: 'MANUAL',
  SPECIFICATION: 'SPECIFICATION',
} as const;
export type MediaType = (typeof MediaType)[keyof typeof MediaType];

// ──────────────────────────────────────────────
// Attribute Types (for category_attributes)
// ──────────────────────────────────────────────
export const AttributeType = {
  TEXT: 'text',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  ENUM: 'enum',
} as const;
export type AttributeType = (typeof AttributeType)[keyof typeof AttributeType];

// ──────────────────────────────────────────────
// Filter Types (UI rendering)
// ──────────────────────────────────────────────
export const FilterType = {
  SELECT: 'select',
  RANGE: 'range',
  CHECKBOX: 'checkbox',
  SEARCH: 'search',
} as const;
export type FilterType = (typeof FilterType)[keyof typeof FilterType];

// ──────────────────────────────────────────────
// Quotation Status
// ──────────────────────────────────────────────
export const QuotationStatus = {
  GENERATED: 'GENERATED',
  SUBMITTED: 'SUBMITTED',
  VIEWED: 'VIEWED',
  FOLLOWED_UP: 'FOLLOWED_UP',
  CONVERTED: 'CONVERTED',
  EXPIRED: 'EXPIRED',
} as const;
export type QuotationStatus = (typeof QuotationStatus)[keyof typeof QuotationStatus];

// ──────────────────────────────────────────────
// Cart Status
// ──────────────────────────────────────────────
export const CartStatus = {
  ACTIVE: 'ACTIVE',
  CONVERTED: 'CONVERTED',
  ABANDONED: 'ABANDONED',
} as const;
export type CartStatus = (typeof CartStatus)[keyof typeof CartStatus];

// ──────────────────────────────────────────────
// Service Request Status
// ──────────────────────────────────────────────
export const ServiceRequestStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
export type ServiceRequestStatus = (typeof ServiceRequestStatus)[keyof typeof ServiceRequestStatus];

// ──────────────────────────────────────────────
// Product Relation Types
// ──────────────────────────────────────────────
export const RelationType = {
  SIMILAR: 'SIMILAR',
  COMPLEMENTARY: 'COMPLEMENTARY',
  UPGRADE: 'UPGRADE',
  ACCESSORY: 'ACCESSORY',
} as const;
export type RelationType = (typeof RelationType)[keyof typeof RelationType];

// ──────────────────────────────────────────────
// Discount Types
// ──────────────────────────────────────────────
export const DiscountType = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED: 'FIXED',
  CUSTOM: 'CUSTOM',
} as const;
export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];

// ──────────────────────────────────────────────
// Offer Rule Types
// ──────────────────────────────────────────────
export const OfferRuleType = {
  BRAND: 'BRAND',
  CATEGORY: 'CATEGORY',
  PRODUCT: 'PRODUCT',
  MIN_QTY: 'MIN_QTY',
  MIN_VALUE: 'MIN_VALUE',
} as const;
export type OfferRuleType = (typeof OfferRuleType)[keyof typeof OfferRuleType];

// ──────────────────────────────────────────────
// Admin Roles (RBAC)
// ──────────────────────────────────────────────
export const AdminRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  PRODUCT_MANAGER: 'PRODUCT_MANAGER',
  SERVICE_MANAGER: 'SERVICE_MANAGER',
  SALES: 'SALES',
  CONTENT_MANAGER: 'CONTENT_MANAGER',
} as const;
export type AdminRole = (typeof AdminRole)[keyof typeof AdminRole];

// ──────────────────────────────────────────────
// Analytics Event Names
// ──────────────────────────────────────────────
export const AnalyticsEvent = {
  PRODUCT_VIEW: 'PRODUCT_VIEW',
  SEARCH: 'SEARCH',
  FILTER: 'FILTER',
  COMPARE: 'COMPARE',
  WISHLIST: 'WISHLIST',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  BROCHURE_DOWNLOAD: 'BROCHURE_DOWNLOAD',
  WHATSAPP_CLICK: 'WHATSAPP_CLICK',
  CALL_CLICK: 'CALL_CLICK',
  QUOTE_STARTED: 'QUOTE_STARTED',
  QUOTE_SUBMITTED: 'QUOTE_SUBMITTED',
  SERVICE_VIEW: 'SERVICE_VIEW',
  SERVICE_REQUEST: 'SERVICE_REQUEST',
} as const;
export type AnalyticsEvent = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

// ──────────────────────────────────────────────
// Recommendation Scoring Weights
// ──────────────────────────────────────────────
export const RECOMMENDATION_WEIGHTS = {
  SAME_CATEGORY: 40,
  SAME_BRAND: 20,
  SIMILAR_CAPACITY: 15,
  SIMILAR_SPECS: 10,
  SIMILAR_PRICE: 10,
  CUSTOMER_BEHAVIOR: 25,
} as const;

// ──────────────────────────────────────────────
// Pagination Defaults
// ──────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  RECOMMENDATION_LIMIT: 8,
} as const;

// ──────────────────────────────────────────────
// Rate Limiting
// ──────────────────────────────────────────────
export const RATE_LIMITS = {
  PUBLIC_WINDOW_MS: 60 * 1000,       // 1 minute
  PUBLIC_MAX_REQUESTS: 100,
  AUTH_WINDOW_MS: 60 * 1000,
  AUTH_MAX_REQUESTS: 30,
  LOGIN_WINDOW_MS: 15 * 60 * 1000,   // 15 minutes
  LOGIN_MAX_ATTEMPTS: 5,
} as const;

// ──────────────────────────────────────────────
// File Upload Limits
// ──────────────────────────────────────────────
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024,    // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,    // 5MB
  MAX_IMAGE_WIDTH: 4096,
  MAX_IMAGE_HEIGHT: 4096,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  ALLOWED_DOC_TYPES: ['application/pdf'],
} as const;

// ──────────────────────────────────────────────
// Company Info & Official Google Business Profile
// ──────────────────────────────────────────────
export const COMPANY = {
  NAME: 'Tanmayee Technologies',
  LEGAL_NAME: 'Tanmayee Technologies Private Limited',
  TAGLINE: 'Exclusive Blue Star A/C Shoppe & Rockwell Commercial Refrigeration Distributors',
  SUB_TAGLINE: 'Complete Cooling Solutions',
  LOGO_URL: '/images/tanmayee-logo.png',
  LOGO_ALT: 'Tanmayee Technologies - Complete Cooling Solutions',
  DOMAIN: 'tanmayeetechnologies.com',
  FULL_URL: 'https://tanmayeetechnologies.com',
  PHONE: '093901 15553',
  PHONE_INTERNATIONAL: '+919390115553',
  PHONE_DISPLAY: '+91 93901 15553',
  WHATSAPP_NUMBER: '919390115553',
  EMAIL: 'info@tanmayeetechnologies.com',
  SALES_EMAIL: 'sales@tanmayeetechnologies.com',
  
  // Official Registered & Showroom Address
  ADDRESS_PLOT: 'Plot No. SFS MIG-131',
  ADDRESS_COLONY: 'Housing Board Colony PM Palem',
  ADDRESS_AREA: 'Madhurawada',
  ADDRESS_CITY: 'Visakhapatnam',
  ADDRESS_DISTRICT: 'Visakhapatnam',
  ADDRESS_STATE: 'Andhra Pradesh',
  ADDRESS_PINCODE: '530041',
  FULL_ADDRESS: 'Plot No. SFS MIG-131, Housing Board Colony PM Palem, Madhurawada, Visakhapatnam, Andhra Pradesh 530041',
  GOOGLE_MAPS_URL: 'https://maps.app.goo.gl/ndzjgar89V8CXgaC7',
  
  // Google Reviews & Ratings
  GOOGLE_RATING: 4.6,
  GOOGLE_REVIEW_COUNT: 98,
  STORE_HOURS: 'Opens 9:00 AM · Closed 9:00 PM (Mon – Sun)',
  BUSINESS_CATEGORY: 'Electronics store in Madhuravada, Andhra Pradesh',
  SERVICE_OPTIONS: ['In-store shopping', 'In-store pickup', 'Delivery'],
  
  // Official Authorizations & Dealerships
  AUTHORIZATIONS: [
    'Exclusive Blue Star A/C Shoppe Authorized Sales & Service Dealers',
    'Rockwell Commercial Refrigerators Authorized Sales & Service Distributors',
  ],
  ABOUT: 'Tanmayee Technologies is one of the best Air Conditioners & best refrigerators Sales & Services Dealers & Distributors in Vizag. Exclusive Blue Star A/C Shoppe Authorized Sales & Service Dealers and Rockwell Commercial Refrigerators Authorized Sales & Service Distributors. Providing end-to-end commercial HVAC supply, turnkey installation, cold chain planning, and certified AMC maintenance.',
  
  // Authentic Customer Reviews from Google Business Profile
  REVIEWS: [
    {
      author: 'Jagadhesh Bellane',
      rating: 5,
      date: '2 months ago',
      text: 'Great service, genuine products, competitive pricing, and helpful staff. Service personnel are very committed in work and submissive. Also excellent response after sales and services.',
      verified: true,
      source: 'Google Review'
    },
    {
      author: 'K. Srinivasa Rao',
      rating: 5,
      date: '3 months ago',
      text: 'Tanmayee Technologies provided prompt delivery and seamless installation of our Blue Star 2-Ton Inverter ACs and Rockwell Deep Freezer for our commercial kitchen in Madhurawada. Very polite and technically knowledgeable team.',
      verified: true,
      source: 'Google Review'
    },
    {
      author: 'Ramesh Varma',
      rating: 5,
      date: '4 months ago',
      text: 'Best commercial refrigeration distributor in Visakhapatnam. Genuine Rockwell equipment with stamped factory warranty and great after-sales service response.',
      verified: true,
      source: 'Google Review'
    }
  ]
} as const;

// ──────────────────────────────────────────────
// Brands (initial set)
// ──────────────────────────────────────────────
export const BRANDS = {
  BLUE_STAR: 'Blue Star',
  ROCKWELL: 'Rockwell',
} as const;

