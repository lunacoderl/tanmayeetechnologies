-- ============================================================================
-- Tanmayee Technologies Platform — Complete Database Schema
-- PostgreSQL (Supabase)
-- ============================================================================
-- Run this migration against your Supabase PostgreSQL database.
-- Order matters: tables with foreign keys are created after their dependencies.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. BRANDS
-- ============================================================================
CREATE TABLE IF NOT EXISTS brands (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    logo_url        TEXT,
    description     TEXT,
    seo_title       VARCHAR(255),
    seo_description TEXT,
    website_url     TEXT,
    sort_order      INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands(is_active);

-- ============================================================================
-- 2. CATEGORIES (self-referencing for parent/child hierarchy)
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id       UUID REFERENCES categories(id) ON DELETE SET NULL,
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    description     TEXT,
    image_url       TEXT,
    seo_title       VARCHAR(255),
    seo_description TEXT,
    sort_order      INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT true,
    product_count   INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- ============================================================================
-- 3. CATEGORY ATTRIBUTES — Dynamic filter/spec definitions per category
-- ============================================================================
CREATE TABLE IF NOT EXISTS category_attributes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id     UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    attribute_name  VARCHAR(255) NOT NULL,
    attribute_type  VARCHAR(50) DEFAULT 'text'
                    CHECK (attribute_type IN ('text', 'number', 'boolean', 'enum')),
    attribute_unit  VARCHAR(50),
    filter_type     VARCHAR(50) DEFAULT 'select'
                    CHECK (filter_type IN ('select', 'range', 'checkbox', 'search')),
    possible_values JSONB,
    is_filterable   BOOLEAN DEFAULT true,
    is_comparable   BOOLEAN DEFAULT true,
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category_id, attribute_name)
);

CREATE INDEX IF NOT EXISTS idx_cat_attrs_category ON category_attributes(category_id);

-- ============================================================================
-- 4. ADMIN USERS (created before products for FK references)
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    full_name       VARCHAR(255),
    role            VARCHAR(50) DEFAULT 'CONTENT_MANAGER'
                    CHECK (role IN ('SUPER_ADMIN', 'PRODUCT_MANAGER',
                                    'SERVICE_MANAGER', 'SALES', 'CONTENT_MANAGER')),
    is_active       BOOLEAN DEFAULT true,
    mfa_enabled     BOOLEAN DEFAULT false,
    mfa_secret      TEXT,
    last_login_at   TIMESTAMPTZ,
    login_attempts  INTEGER DEFAULT 0,
    locked_until    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. PRODUCTS — Core product table
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id              UUID NOT NULL REFERENCES brands(id),
    category_id           UUID NOT NULL REFERENCES categories(id),
    subcategory_id        UUID REFERENCES categories(id),
    model_number          VARCHAR(255),
    sku                   VARCHAR(255) UNIQUE,
    product_name          VARCHAR(500) NOT NULL,
    slug                  VARCHAR(500) NOT NULL UNIQUE,
    short_description     TEXT,
    description           TEXT,
    features              JSONB,
    applications          JSONB,
    status                VARCHAR(20) DEFAULT 'DRAFT'
                          CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    visibility            BOOLEAN DEFAULT true,
    featured              BOOLEAN DEFAULT false,
    reference_price       DECIMAL(12,2),
    price_display         VARCHAR(50) DEFAULT 'ON_REQUEST'
                          CHECK (price_display IN ('ON_REQUEST', 'SHOW', 'RANGE')),
    price_range_min       DECIMAL(12,2),
    price_range_max       DECIMAL(12,2),
    currency              VARCHAR(3) DEFAULT 'INR',
    bulk_threshold        INTEGER,
    bulk_discount_pct     DECIMAL(5,2),
    requires_manual_quote BOOLEAN DEFAULT false,
    seo_title             VARCHAR(255),
    seo_description       TEXT,
    canonical_url         TEXT,
    current_version       INTEGER DEFAULT 1,
    view_count            INTEGER DEFAULT 0,
    search_vector         TSVECTOR,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    published_at          TIMESTAMPTZ,
    archived_at           TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_model ON products(model_number);

-- ============================================================================
-- 6. PRODUCT ATTRIBUTES — EAV for dynamic specifications
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_attributes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    attribute_name  VARCHAR(255) NOT NULL,
    attribute_value TEXT NOT NULL,
    attribute_unit  VARCHAR(50),
    numeric_value   DECIMAL(12,4),
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_attrs ON product_attributes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_attrs_filter ON product_attributes(attribute_name, numeric_value);
CREATE INDEX IF NOT EXISTS idx_product_attrs_name_value ON product_attributes(attribute_name, attribute_value);

-- ============================================================================
-- 7. PRODUCT MEDIA
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_media (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    type            VARCHAR(50) NOT NULL
                    CHECK (type IN ('MAIN_IMAGE', 'GALLERY', 'VIDEO',
                                    'BROCHURE', 'MANUAL', 'SPECIFICATION')),
    url             TEXT NOT NULL,
    alt_text        VARCHAR(500),
    title           VARCHAR(500),
    caption         TEXT,
    mime_type       VARCHAR(100),
    file_size       INTEGER,
    dimensions      JSONB,
    sort_order      INTEGER DEFAULT 0,
    is_primary      BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_media ON product_media(product_id);

-- ============================================================================
-- 8. PRODUCT VERSIONS — Full version history
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_versions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    version_number  INTEGER NOT NULL,
    snapshot        JSONB NOT NULL,
    change_summary  TEXT,
    changed_by      UUID REFERENCES admin_users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_product_versions ON product_versions(product_id);

-- ============================================================================
-- 9. PRODUCT VERIFICATIONS — Source verification tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_verifications (
    id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id                UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    manufacturer_verified     BOOLEAN DEFAULT false,
    catalog_verified          BOOLEAN DEFAULT false,
    tanmayee_catalog_verified BOOLEAN DEFAULT false,
    source_url                TEXT,
    verification_notes        TEXT,
    verified_by               UUID REFERENCES admin_users(id),
    verified_at               TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_product_verifications ON product_verifications(product_id);

-- ============================================================================
-- 10. PRODUCT RELATIONS — Similar, complementary, upgrade, accessory
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_relations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    related_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    relation_type   VARCHAR(50) DEFAULT 'SIMILAR'
                    CHECK (relation_type IN ('SIMILAR', 'COMPLEMENTARY', 'UPGRADE', 'ACCESSORY')),
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, related_id, relation_type)
);

-- ============================================================================
-- 11. SERVICES
-- ============================================================================
CREATE TABLE IF NOT EXISTS services (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    short_description TEXT,
    description     TEXT,
    image_url       TEXT,
    base_price      DECIMAL(12,2),
    price_display   VARCHAR(50) DEFAULT 'ON_REQUEST'
                    CHECK (price_display IN ('ON_REQUEST', 'SHOW', 'RANGE')),
    is_active       BOOLEAN DEFAULT true,
    seo_title       VARCHAR(255),
    seo_description TEXT,
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 12. PRODUCT ↔ SERVICE LINKS
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_services (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    service_id      UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    UNIQUE(product_id, service_id)
);

-- ============================================================================
-- 13. OFFERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS offers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    discount_type   VARCHAR(20)
                    CHECK (discount_type IN ('PERCENTAGE', 'FIXED', 'CUSTOM')),
    discount_value  DECIMAL(12,2),
    is_active       BOOLEAN DEFAULT true,
    starts_at       TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 14. OFFER RULES — Eligibility conditions
-- ============================================================================
CREATE TABLE IF NOT EXISTS offer_rules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id        UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    rule_type       VARCHAR(50) NOT NULL
                    CHECK (rule_type IN ('BRAND', 'CATEGORY', 'PRODUCT', 'MIN_QTY', 'MIN_VALUE')),
    rule_value      JSONB NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offer_rules ON offer_rules(offer_id);

-- ============================================================================
-- 15. ANONYMOUS SESSIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS anonymous_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token   VARCHAR(255) NOT NULL UNIQUE,
    interest_profile JSONB DEFAULT '{}',
    lead_score      INTEGER DEFAULT 0,
    first_seen_at   TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at    TIMESTAMPTZ DEFAULT NOW(),
    converted_at    TIMESTAMPTZ,
    ip_hash         VARCHAR(64),
    user_agent      TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON anonymous_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_score ON anonymous_sessions(lead_score DESC);

-- ============================================================================
-- 16. ANALYTICS EVENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID REFERENCES anonymous_sessions(id),
    event_name      VARCHAR(100) NOT NULL,
    product_id      UUID REFERENCES products(id),
    category_id     UUID REFERENCES categories(id),
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_time ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_product ON analytics_events(product_id);

-- ============================================================================
-- 17. CARTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS carts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID REFERENCES anonymous_sessions(id),
    status          VARCHAR(20) DEFAULT 'ACTIVE'
                    CHECK (status IN ('ACTIVE', 'CONVERTED', 'ABANDONED')),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_carts_session ON carts(session_id);

-- ============================================================================
-- 18. CART ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS cart_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id         UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products(id),
    quantity        INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    added_at        TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cart_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);

-- ============================================================================
-- 19. QUOTATIONS — Immutable business records
-- ============================================================================
CREATE TABLE IF NOT EXISTS quotations (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_number  VARCHAR(50) NOT NULL UNIQUE,
    cart_id           UUID REFERENCES carts(id),
    session_id        UUID REFERENCES anonymous_sessions(id),
    customer_name     VARCHAR(255),
    customer_phone    VARCHAR(20),
    customer_email    VARCHAR(255),
    customer_company  VARCHAR(255),
    customer_location VARCHAR(255),
    customer_notes    TEXT,
    subtotal          DECIMAL(12,2),
    discount_total    DECIMAL(12,2) DEFAULT 0,
    grand_total       DECIMAL(12,2),
    status            VARCHAR(20) DEFAULT 'GENERATED'
                      CHECK (status IN ('GENERATED', 'SUBMITTED', 'VIEWED',
                                        'FOLLOWED_UP', 'CONVERTED', 'EXPIRED')),
    is_bulk           BOOLEAN DEFAULT false,
    pdf_url           TEXT,
    valid_until       TIMESTAMPTZ,
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotations_number ON quotations(quotation_number);
CREATE INDEX IF NOT EXISTS idx_quotations_session ON quotations(session_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);

-- ============================================================================
-- 20. QUOTATION ITEMS — Immutable product snapshots
-- ============================================================================
CREATE TABLE IF NOT EXISTS quotation_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id    UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    product_id      UUID REFERENCES products(id),
    product_name    VARCHAR(500) NOT NULL,
    model_number    VARCHAR(255),
    brand_name      VARCHAR(255),
    unit_price      DECIMAL(12,2),
    quantity        INTEGER NOT NULL,
    discount_pct    DECIMAL(5,2) DEFAULT 0,
    subtotal        DECIMAL(12,2) NOT NULL,
    specifications  JSONB
);

-- ============================================================================
-- 21. QUOTATION SERVICES
-- ============================================================================
CREATE TABLE IF NOT EXISTS quotation_services (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id    UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    service_id      UUID REFERENCES services(id),
    service_name    VARCHAR(255) NOT NULL,
    quantity        INTEGER DEFAULT 1,
    price_note      TEXT DEFAULT 'To be confirmed separately'
);

-- ============================================================================
-- 22. SERVICE REQUESTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id      UUID REFERENCES services(id),
    session_id      UUID REFERENCES anonymous_sessions(id),
    customer_name   VARCHAR(255),
    customer_phone  VARCHAR(20),
    customer_email  VARCHAR(255),
    customer_company VARCHAR(255),
    description     TEXT,
    status          VARCHAR(20) DEFAULT 'NEW'
                    CHECK (status IN ('NEW', 'CONTACTED', 'IN_PROGRESS',
                                      'COMPLETED', 'CANCELLED')),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 23. WISHLIST ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS wishlist_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID NOT NULL REFERENCES anonymous_sessions(id),
    product_id      UUID NOT NULL REFERENCES products(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, product_id)
);

-- ============================================================================
-- 24. ADMIN AUDIT LOGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES admin_users(id),
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(50),
    entity_id       UUID,
    old_value       JSONB,
    new_value       JSONB,
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON admin_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON admin_audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_time ON admin_audit_logs(created_at);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Auto-update search_vector on product insert/update
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.product_name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.model_number, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.short_description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_products_search_vector
    BEFORE INSERT OR UPDATE OF product_name, model_number, short_description, description
    ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_product_search_vector();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_brands_updated_at
    BEFORE UPDATE ON brands FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_categories_updated_at
    BEFORE UPDATE ON categories FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_services_updated_at
    BEFORE UPDATE ON services FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_carts_updated_at
    BEFORE UPDATE ON carts FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_quotations_updated_at
    BEFORE UPDATE ON quotations FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_service_requests_updated_at
    BEFORE UPDATE ON service_requests FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_admin_users_updated_at
    BEFORE UPDATE ON admin_users FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Generate quotation number: TT-Q-YYYYMMDD-NNN
CREATE OR REPLACE FUNCTION generate_quotation_number()
RETURNS TRIGGER AS $$
DECLARE
    today_count INTEGER;
    date_str TEXT;
BEGIN
    date_str := TO_CHAR(NOW(), 'YYYYMMDD');
    SELECT COUNT(*) + 1 INTO today_count
    FROM quotations
    WHERE quotation_number LIKE 'TT-Q-' || date_str || '%';

    NEW.quotation_number := 'TT-Q-' || date_str || '-' || LPAD(today_count::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_quotation_number
    BEFORE INSERT ON quotations
    FOR EACH ROW
    WHEN (NEW.quotation_number IS NULL OR NEW.quotation_number = '')
    EXECUTE FUNCTION generate_quotation_number();

-- ============================================================================
-- PUBLISHED CATALOG — Materialized View
-- Public website reads from this, not directly from products table
-- Refreshed when Admin publishes changes
-- ============================================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS published_catalog AS
SELECT
    p.id,
    p.brand_id,
    p.category_id,
    p.subcategory_id,
    p.model_number,
    p.sku,
    p.product_name,
    p.slug,
    p.short_description,
    p.description,
    p.features,
    p.applications,
    p.reference_price,
    p.price_display,
    p.price_range_min,
    p.price_range_max,
    p.currency,
    p.bulk_threshold,
    p.seo_title,
    p.seo_description,
    p.canonical_url,
    p.published_at,
    p.search_vector,
    p.featured,
    p.view_count,
    b.name AS brand_name,
    b.slug AS brand_slug,
    b.logo_url AS brand_logo,
    c.name AS category_name,
    c.slug AS category_slug,
    COALESCE(
        jsonb_agg(
            DISTINCT jsonb_build_object(
                'name', pa.attribute_name,
                'value', pa.attribute_value,
                'unit', pa.attribute_unit,
                'numeric_value', pa.numeric_value,
                'sort_order', pa.sort_order
            )
        ) FILTER (WHERE pa.id IS NOT NULL),
        '[]'::jsonb
    ) AS attributes,
    COALESCE(
        jsonb_agg(
            DISTINCT jsonb_build_object(
                'url', pm.url,
                'type', pm.type,
                'alt', pm.alt_text,
                'title', pm.title,
                'is_primary', pm.is_primary,
                'sort_order', pm.sort_order
            )
        ) FILTER (WHERE pm.id IS NOT NULL),
        '[]'::jsonb
    ) AS media
FROM products p
JOIN brands b ON p.brand_id = b.id AND b.is_active = true
JOIN categories c ON p.category_id = c.id AND c.is_active = true
LEFT JOIN product_attributes pa ON p.id = pa.product_id
LEFT JOIN product_media pm ON p.id = pm.product_id
WHERE p.status = 'PUBLISHED'
  AND p.visibility = true
GROUP BY p.id, b.id, c.id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_pub_catalog_id ON published_catalog(id);
CREATE INDEX IF NOT EXISTS idx_pub_catalog_slug ON published_catalog(slug);
CREATE INDEX IF NOT EXISTS idx_pub_catalog_brand ON published_catalog(brand_slug);
CREATE INDEX IF NOT EXISTS idx_pub_catalog_category ON published_catalog(category_slug);
CREATE INDEX IF NOT EXISTS idx_pub_catalog_search ON published_catalog USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_pub_catalog_featured ON published_catalog(featured) WHERE featured = true;
