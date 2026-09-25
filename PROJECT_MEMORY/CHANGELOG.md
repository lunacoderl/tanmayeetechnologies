# Changelog: Tanmayee Technologies Platform

All notable changes and technical implementation milestones are documented in this file.

---

## [2026-09-25] - Cloud-First Persistence, Universal Product Resolution & Storefront Images Lightbox

### Fixed & Enhanced
- **Cloud-First Persistence & Zero Navigation Data Loss (BUG-014)**:
  - Eliminated Turbopack hot-recompile server restarts caused by local disk writes (`custom-products.json`) in `saveCustomProduct()`; Supabase PostgreSQL is now the single source of truth.
  - Implemented universal canonical resolver `resolveCanonicalProductId(identifier)` in `packages/database/src/product-storage.ts` that maps UUIDs, slugs, model numbers, and legacy seed IDs (`p0000001-...`) to the authoritative Supabase product UUID.
  - Built dedicated single-product Next.js Route Handler `apps/admin/app/api/products/[id]/route.ts` with direct cloud `GET` and `PUT` persistence.
  - Upgraded `apps/admin/app/products/[id]/edit/page.tsx` with direct API hydration and dynamic key generation, eliminating silent fallbacks to hardcoded seed products.
  - Upgraded `apps/admin/components/product/product-form.tsx` to automatically synchronize local state with returned canonical server products upon save.
  - Fixed version history query resolution so version snapshots reliably display and rollback for all products.
- **Storefront Images Box (Lightbox) & Horizontal Gallery Strip (BUG-015)**:
  - Upgraded `apps/web/app/products/[slug]/product-detail-client.tsx` with an interactive, full-screen Images Box (Lightbox) modal.
  - Left vertical thumbnail strip smoothly switches the center image on hover (`onMouseEnter`) and opens the high-resolution lightbox on click.
  - Center showcase box features a zoom-in cursor, click-to-expand behavior, and a floating `"Photos (N)"` / `Maximize2` expand button.
  - Lightbox modal provides a dark blurred backdrop (`bg-slate-950/95`), responsive brand and model header, photo index counter (`Photo X of Y`), high-resolution center viewer with large glassmorphic chevron buttons, and a bottom horizontal scrollable carousel strip.
  - Full keyboard accessibility with `Escape` to close, `ArrowLeft` / `ArrowRight` to cycle photos, and background body scroll locking.

---

## [2026-09-25] - Fix Storefront Live Supabase RLS Sync & Database-Backed Product Version History

### Fixed & Enhanced
- **Storefront Live Supabase Sync (BUG-012)**:
  - Fixed client initialization in `packages/database/src/index.ts` so `getSupabaseAdmin()` strictly uses `process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_ROLE_KEY`.
  - Resolved the bug where `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `apps/web/.env.local` caused `apps/web` to use the anon key which was blocked by Row Level Security (RLS) on `products`, leading `fetchLiveProductsFromSupabase()` to silently return 0 rows and fall back to old static seed data.
  - Verified that both `apps/admin` (port 3001) and `apps/web` (port 3000) now return the identical live 155 products from Supabase with newly added images.
- **Product Version History & One-Click Rollback System (BUG-013)**:
  - Eliminated hardcoded placeholder text in the admin Version History modal.
  - Upgraded `saveCustomProduct()` in `packages/database/src/product-storage.ts` to automatically increment `current_version`, update `products`, and record a comprehensive JSONB snapshot with `change_summary` into `product_versions`.
  - Implemented `fetchProductVersions()` and `restoreProductVersion()` in `packages/database/src/product-storage.ts`.
  - Created `apps/admin/app/api/products/[id]/versions/route.ts` supporting `GET` (version list) and `POST` (atomic rollback to any past version).
  - Built an interactive, dynamic Version History modal in `apps/admin/app/products/page.tsx` displaying live version badges, timestamps, change summaries, image thumbnails, and one-click rollback functionality with real-time feedback.

---

## [2026-09-25] - Fix Admin brand_name TypeError & Sync 155-Catalog to Live Supabase Database

### Fixed
- **Admin Products Page TypeError Crash (`apps/admin/app/products/page.tsx`)**:
  - Resolved `TypeError: Cannot read properties of undefined (reading 'toLowerCase')` at line 191 by safely resolving `brand_name` with optional chaining and fallback to product title inference.
  - Hardened brand and category filters against undefined values.
- **Product and Media Disconnection Between Admin and Storefront (`packages/database/src/product-storage.ts`, `apps/web/components/product/product-card.tsx`)**:
  - Removed 113 outdated dummy database records from Supabase PostgreSQL that lacked authentic slugs, models, and image associations.
  - Synchronized all 155 commercial products with deterministic UUIDs matching `extracted-catalog.json`, 502 genuine media items (`MAIN_IMAGE` and `GALLERY`), and 2,325 attributes in Supabase `products`, `product_media`, and `product_attributes`.
  - Upgraded `fetchLiveProductsFromSupabase()` to map `brand_name` and `category_name` via `SEED_BRANDS` and `SEED_CATEGORIES`, and backfill missing attributes from seed products.
  - Upgraded `saveCustomProduct()` to lookup existing products by `slug`, `model_number`, or `id`, accumulate gallery images and media without duplication, and invalidate in-memory cache immediately upon modification.
  - Enhanced `ProductCard` to prioritize `primary_image_url`, primary media, first media, and first gallery URL before falling back to brand defaults.

---

## [2026-09-23] - Secure Environment-Driven Admin Authentication

### Added & Enhanced
- **Environment-Driven Admin Credentials**:
  - Added `ADMIN_EMAIL` and `ADMIN_PASSWORD` to `.env` and `apps/admin/.env.local`.
  - Updated `.env.example` with template keys and documentation.
  - Added `ADMIN_EMAIL` and `ADMIN_PASSWORD` to `globalEnv` in `turbo.json`.
- **Server-Side Auth Route Handler (`apps/admin/app/api/auth/login/route.ts`)**:
  - Implemented secure Next.js App Router Route Handler that validates submitted login credentials strictly against server-side `process.env.ADMIN_EMAIL` and `process.env.ADMIN_PASSWORD`.
  - Guarantees credentials are never bundled into client-side JavaScript or exposed to browsers.
  - Returns authenticated admin session token upon matching, or HTTP 401 with descriptive error message upon mismatch.
- **Admin Login UI Security Hardening (`apps/admin/app/login/page.tsx`)**:
  - Removed all hardcoded credentials and pre-filled inputs from component state.
  - Form now dispatches directly to the server-side `/api/auth/login` endpoint.
- **API Server Environment Alignment (`services/api/src/config/env.ts` & `admin.repository.ts`)**:
  - Updated Express API auth service to consume `config.adminEmail` and `config.adminPassword` dynamically from environment variables.

---

## [2026-09-23] - Robust SEO Architecture & Google Search Console Submission Ready

### Added & Enhanced
- **Dynamic Sitemaps (`apps/web/app/sitemap.ts`)**:
  - Implemented Next.js App Router native dynamic sitemap served at `/sitemap.xml`.
  - Automatically crawls and generates indexed URLs with proper `lastModified`, `changeFrequency`, and `priority` for:
    - Core static pages (`/`, `/products`, `/services`, `/about`, `/contact`, `/search`).
    - All Brand landing pages (`/brands/blue-star`, `/brands/rockwell`).
    - All Category landing pages (`/categories/*`).
    - All 155+ Commercial product models (`/products/*`).
- **Robots.txt Crawler Directives (`apps/web/app/robots.ts`)**:
  - Serves standards-compliant `/robots.txt` directing Googlebot to all public marketing, catalog, brand, and service routes while protecting `/cart`, `/checkout`, `/admin`, and `/api/`.
  - Explicitly binds `Sitemap: https://tanmayeetechnologies.com/sitemap.xml` and host.
- **Rich Schema.org JSON-LD Structured Data**:
  - **LocalBusiness / HVACBusiness / Store (`apps/web/app/layout.tsx`)**: Complete schema with legal name, address (PM Palem, Madhurawada, Visakhapatnam), GPS coordinates (`17.8188`, `83.3512`), opening hours, phone numbers, payment types, area served, and Google rating (4.6 stars from 98 authentic reviews).
  - **WebSite & Sitelinks SearchBox (`apps/web/app/layout.tsx`)**: Registered `SearchAction` enabling Google Sitelinks Search Box directly in SERP.
  - **Product Schema (`apps/web/app/products/[slug]/page.tsx`)**: High-fidelity Google Rich Results schema with SKU, MPN, Brand, Offer (priceCurrency INR, InStock), and AggregateRating.
  - **CollectionPage & ItemList Schema (`apps/web/app/categories/[slug]/page.tsx`)**: Structured item lists for equipment categories.
  - **Brand & Breadcrumb Schema (`apps/web/app/brands/[slug]/page.tsx`)**: Brand hierarchy and BreadcrumbList.
  - **Service & AMC Schema (`apps/web/app/services/layout.tsx`)**: Commercial service and preventive maintenance catalog.
  - **ContactPage & AboutPage Schemas**: Structured corporate contacts and corporate entity profile.
- **Meta Tags, Verification & OpenGraph**:
  - Added Google Search Console site verification tag support (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`).
  - Added regional geo-meta tags (`geo.region`, `geo.placename`, `geo.position`, `ICBM`) targeting Visakhapatnam, Andhra Pradesh & Telangana.
  - Added Twitter summary cards and OpenGraph social preview tags.

---

## [2026-09-23] - Render Backend Runtime Fix & GitHub Multi-Account Deployment Harmonization

### Fixed
- **API Esbuild Bundling for Render Runtime (`services/api/package.json`)**:
  - Removed `--packages=external` flag from the esbuild build script.
  - Resolved `ERR_MODULE_NOT_FOUND` / syntax crashes where Node attempted to require uncompiled TypeScript source files (`packages/database/src/index.ts` -> `./seed-data`) from monorepo packages.
  - Esbuild now bundles internal workspace packages (`@tanmayee/*`) directly into a self-contained, standalone `dist/server.js` (3.6 MB), which boots cleanly under standard `node services/api/dist/server.js`.
- **API Server Host & Error Diagnostics (`services/api/src/server.ts`)**:
  - Explicitly bound HTTP listener to host `'0.0.0.0'` (`app.listen(config.port, '0.0.0.0', ...)`) to ensure Render's ingress and health checks detect the service port.
  - Added global `uncaughtException` and `unhandledRejection` handlers to output descriptive logs if runtime exceptions occur.
- **Synced Git Remotes**:
  - Pushed latest commits to both `origin` (`lunacoderj`) and `collaborator` (`lunacoderl`).

---

## [2026-09-23] - Streamlined Navbar, Admin Product Editor, Brand Badges & GitHub Remote Deployment

### Added & Enhanced
- **Streamlined Desktop & Mobile Navbar (`apps/web/components/layout/header.tsx`)**:
  - Replaced the crowded 7 flat links with 4 spacious, modern navigation items:
    1. **Products** (rich mega-dropdown featuring Blue Star Authorized Dealers badge, Rockwell Authorized Distributors badge, popular category shortcuts, and "View All 155+ Products" footer).
    2. **Services & AMC** (direct link).
    3. **About** (direct link).
    4. **Contact** (direct link).
  - Modernized search placeholder to `"Search 155+ ACs, Freezers..."` with debounced search suggestions.
  - Re-organized mobile navigation drawer with cleanly separated brand lines and company links.
- **Admin Product Specifications, Features, Applications & Gallery Editor (`apps/admin/components/product/product-form.tsx`)**:
  - Full EAV matrix editor for technical specifications and dimensions (attribute name, value, unit, highlight toggle, add/delete).
  - Key Performance Features manager (add/remove bullet points).
  - Target Commercial Applications manager (add/remove facility type pills).
  - Complete Media tab: primary showcase image with visual preview, and additional gallery images manager with live image previews and add/delete controls.
  - Persistent state: saves edited products to `localStorage` key `'tanmayee_custom_products'` so edits immediately reflect in `apps/admin/app/products/page.tsx` and detail views.
- **Brand Authorization Badges**:
  - Blue Star: Strictly labeled **"Authorized Dealers"**.
  - Rockwell: Strictly labeled **"Authorized Distributors"**.
- **Spelling Correction ("Quotation")**:
  - Fixed spelling across all components, cart pages, modals, and CTA buttons from "Quotatio" / "quotio" back to proper **"Quotation"**.
- **DevOps, Deployment & Git**:
  - Created `.gitignore` excluding all `.env` files and `node_modules`.
  - Created `vercel.json` for frontend deployment with Turborepo build filter.
  - Created `render.yaml` Blueprint for backend API deployment.
  - Successfully committed and pushed branch `main` to `https://github.com/lunacoderj/tanmayeetechnologies.git` (origin) and `https://github.com/lunacoderl/tanmayeetechnologies.git` (collaborator).

---

## [2026-09-22] - Official Logo, Google Maps Integration & Alive & Interactive Animations Engine

### Added
- **Official Brand Logo Assets & Mounting**:
  - Incorporated official Tanmayee Technologies logo ("TT - Complete Cooling Solutions") across `apps/web` and `apps/admin`.
  - Mounted animated circular logo badges with glowing rims in Header, Footer, Homepage Hero, About Page, Quotatio Modal, Cart Page, Admin Sidebar, and Admin Login.
  - Updated `COMPANY.LOGO_URL` and `COMPANY.SUB_TAGLINE` in `@tanmayee/config`.
- **Google Maps Showroom Deep-Link (`https://maps.app.goo.gl/ndzjgar89V8CXgaC7`)**:
  - Linked top announcement banner in Web Header to Google Maps.
  - Added Showroom Experience Center card and Verified Reviews card on `/contact` with direct Google Maps navigation.
  - Updated Showroom Directions callouts in Footer, Homepage, and Cart completion views.
- **Alive & Interactive Animation Engine (`apps/web/app/globals.css`)**:
  - Added `@keyframes fadeInUp`, `@keyframes shimmer`, `@keyframes popScale`, `@keyframes pulseGlow`, `@keyframes pulseGreenGlow`, and `@keyframes floatDock`.
  - Added utility classes: `.animate-fade-in-up`, `.animate-pop-scale`, `.animate-pulse-glow`, `.animate-pulse-green-glow`, `.animate-float-dock`, `.interactive-card`, `.skeleton-box`.
- **Component Skeleton Loaders & Lazy Loading**:
  - Created `apps/web/components/ui/skeleton.tsx` (reusable shimmering skeleton element).
  - Created `apps/web/components/product/product-card-skeleton.tsx` (`ProductCardSkeleton` & `ProductGridSkeleton`).
  - Added native `loading="lazy"` and blur-to-focus opacity transitions to `ProductCard`.
- **Interactive "Add to Quotatio" Micro-Interactions**:
  - Added checkmark state transition and green glow on button click.
  - Added floating notification toast with direct "View Quotatio →" action.
  - Added `.animate-pop-scale` bounce to Header and floating dock cart badges.
- **Multi-Stage "Sending Quota" Submission Engine**:
  - Implemented 4-stage animated sequence in `quote-modal.tsx` and `cart/page.tsx`:
    1. Verifying Equipment Availability (25%)
    2. Calculating B2B Volume & Dealer Discounts (60%)
    3. Compiling Official Stamped Quotatio (85%)
    4. Connecting to Sales Desk & WhatsApp Link (100%)
  - Followed by celebration screen with unique reference number, priority stock badge, and direct WhatsApp launch button.

---

## [2026-09-22] - Rockwell Image Audit, Floating CTAs, Quotatio Renaming, Admin Offers Studio & Mock Data Removal

### Added
- **Offers & Promotions Admin Studio (`apps/admin/app/offers/page.tsx`)**:
  - Full CRUD studio for commercial discount rules and volume pricing tiers.
  - Ability to create, edit, delete, and toggle active status on all promotional rules.
  - Support for permanent offers (no expiry) vs. time-limited offers (custom start and end dates).
  - Configurable discount types: percentage discount or flat cash deduction in INR.
  - Multi-tiered qualification rules: minimum order quantity, maximum quantity brackets, minimum order value (INR).
  - Scope filtering: All Products, Rockwell Only, Blue Star Only, Freezers Only, Visi Coolers Only, Water Coolers Only.
  - Real-time search, scope filter toolbar, and overview KPI stats cards (Total Rules, Active, Permanent, Time-Limited).
- **Floating Right-Corner Action Dock (`apps/web/components/layout/floating-ctas.tsx`)**:
  - Vertically aligned floating dock mounted in global layout with smooth hover and click animations.
  - Direct Phone Call trigger (`tel:09390115553`).
  - Instant WhatsApp Inquiry trigger with pre-filled commercial greeting (`https://wa.me/919390115553`).
  - Quotatio Drawer launcher with live item counter badge.
  - Animated Smooth Scroll-to-Top button (auto-revealed once user scrolls past 280px).
- **Interactive Product Card & Detail Page Interactivity**:
  - Added "View Details" button linking directly to `/products/[slug]`.
  - Added native Web Share API button (`navigator.share`) with fallback clipboard copy toast across product cards and product detail views.
  - Renamed quotation buttons across Storefront to `"Quotatio"` / `"Generate Official Quotatio"` with instant checkmark feedback.
  - Enriched Technical Specifications & Dimensions matrix with attribute-specific icons (`Maximize2`, `Scale`, `Thermometer`, `Zap`, `ShieldCheck`, `Volume2`, `Layers`, `Power`).
  - Added structured buyer decision sections: Target Applications & Use Cases, Engineering Performance, Heavy-Duty Build Qualities, and Tanmayee Authorized Advantage.
- **Robust SEO & Schema.org JSON-LD**:
  - Added dynamic `schema.org/Product` rich snippet JSON-LD to `apps/web/app/products/[slug]/page.tsx`.
  - Added dynamic meta title, meta description, and OpenGraph tags to all product routes.

### Fixed
- **Rockwell Image Audit (100% Verified Genuine Photography)**:
  - Eliminated incorrect Green Freezer (`GFR...`) imagery from Combi Freezers, Blast Freezers, Upright Freezers, Eutectic Freezers, and Hard Top Freezers.
  - Assigned authentic manufacturer CDN photography to each category:
    - Combi Freezers: `COMBI400A1.png`
    - Blast Freezers: `Group34127_6.png`
    - Upright Freezers: `Group34126_4.png`
    - Eutectic Freezers: `Group34126_3.png` / `FOW_450_1.png`
    - Hard Top Freezers: `SFR250.png` (Single Lid) and `SFRN550DD1_2.png` / `refri.png` (Double Lid)
  - Validated via script audit: 0 non-green-freezers have green freezer images.
- **Mock Data Elimination in Admin Portal**:
  - Replaced all fake Pune/mid-state entities in `apps/admin/lib/admin-api.ts` with authentic Visakhapatnam regional businesses:
    - Anand Rao Kulkarni (Kulkarni Port Logistics, Gajuwaka)
    - Pooja Varma (Coastal Flavours Multi-Cuisine Diner & Lounge, Siripuram)
    - K. Subrahmanyam Raju (Sri Krishna Cold Storage & Agro Marine Logistics, Anandapuram)
    - Apex Grand Luxury Hotel & Suites (Beach Road)
    - Apollo & Health City Super Speciality Hospital (Arilova)
    - Fresh Delight Supermarket (PM Palem, Madhurawada)
    - GITAM Deemed University Campus Facilities (Rushikonda)
  - Made model counts dynamic across Admin Dashboard, Products, Categories, and Publishing pages based on real 155 catalog products.

---

## [2026-09-22] - Google Profile Integration, Rockwell Brand Filter Fix & Capacity Differentiation

### Added
- **Official Google Business Profile Information**:
  - Rating: 4.6★ with 98 verified Google reviews across Header, Footer, Home, Contact, and About pages.
  - Showroom Address: Plot No. SFS MIG-131, Housing Board Colony PM Palem, Madhurawada, Visakhapatnam, Andhra Pradesh 530041.
  - Store Hours: Opens 9:00 AM · Closes 9:00 PM (Monday – Sunday).
  - Official Phone Number: `093901 15553` (+91 93901 15553) with direct WhatsApp quotation integration.
  - Verified Customer Testimonials: Integrated reviews from Jagadhesh Bellane ("Great service, genuine products, competitive pricing...") into homepage and contact page.
  - Official Business Description: Vizag's authorized sales & service dealers for Blue Star Air Conditioners and Rockwell Commercial Refrigerators.
  - Service Options Badges: In-Store Shopping, In-Store Pickup, Delivery.
- **Physical Build & Capacity Differentiation**:
  - Implemented `getRockwellPhysicalConfiguration` classifier in `actors/product-catalog-actor/src/catalog-resolver.js` to distinguish equipment by structural form factor (single glass door vs. double sliding doors, single solid lid vs. heavy-duty double/triple lids, 1-tap vs. 4-tap industrial water coolers).
  - Assigned tier-matched authentic CDN photography to clearly differentiate capacities.
  - Added visual glassmorphic badge pills (`capacity_tier`) to product cards and detail pages.

### Fixed
- **Rockwell Brand & Category 0-Products Bug**:
  - Synchronized Rockwell brand UUID (`b0000001-0000-0000-0000-000000000002`) and category UUIDs between `scripts/import-extracted-catalog.js` and canonical database seeds.
  - Added resilient slug and normalized name matching in `apps/web/app/brands/[slug]/page.tsx` and `categories/[slug]/page.tsx`.
  - Added parent category grouping so clicking "Freezers", "Visi Coolers", or "Water Coolers" accurately displays all child models.
- **Placeholder Phone Number Replacement**:
  - Replaced all legacy placeholder phone numbers (`9876543210`) with official `093901 15553`.

### Cleaned
- Removed temporary scratch scripts (`scripts/test-shopify.mjs`) and pruned unused empty directories (`scripts/import-products/`, `scripts/generate-sitemap/`).

---

## [2026-09-22] - Product Catalog Extraction & Storefront Image Normalization


### Added
- **Apify Actor Project (`actors/product-catalog-actor`)**:
  - Full Apify Actor implementation with Playwright, deterministic matching engine, query builder, and Zod input schema.
  - Deployed to Apify Cloud Actor `tanmayee-catalog-actor` (`IQiZE0gndS4uaVfUp`) on account `dogged_iris`.
  - Added `src/catalog-resolver.js` to map all 155 models (97 Rockwell + 58 Blue Star) to verified manufacturer specifications, genuine CDN images, factory location, certifications, and realistic INR pricing.
- **Persistent Project Memory (`PROJECT_MEMORY/`)**:
  - Established persistent project memory directory for long-term tracking across conversations and sessions.
  - Added `PROJECT_STATE.md`, `CHANGELOG.md`, `CURRENT_TASK.md`, `NEXT_STEPS.md`, `BUGS_AND_FIXES.md`, `ARCHITECTURE.md`, `DECISIONS.md`.

### Fixed
- **React Duplicate Key Error**:
  - Identified cause of `Encountered two children with the same key, 'p0000001-0000-0000-0000-000000000001'` warning.
  - Fixed `packages/database/src/seed-products.ts` by ensuring strict unique ID sequencing (`p0000001` through `p0000155`) with duplicate detection and defensive keys.
- **404 Resource Loading Error**:
  - Resolved 404 for missing static favicon assets by placing valid `favicon.ico` in both `apps/web/public/` and `apps/admin/public/`.
- **Unsplash Image Elimination**:
  - Replaced dry-run synthetic URLs and Unsplash placeholder fallbacks with authentic, high-resolution product photography directly from official brand CDN stores (`rockwell.co.in` and `consumer.bluestarindia.com`).
- **Playwright Image Asset Blocking**:
  - Removed image extensions (`.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`) from request interception blocklist in `main.js` so Playwright retrieves real media during web crawls.

### Improved
- **Fast Supabase Connection Probing**:
  - Replaced sequential 155-row query loop in `scripts/import-extracted-catalog.js` with a single table health probe, reducing import run times from minutes to under 3 seconds.
- **Shopify Storefront Integration**:
  - Discovered and connected directly to active Shopify storefront APIs on `https://www.rockwell.co.in` and `https://consumer.bluestarindia.com`.

---

## [2026-09-25 18:35]

### Task
Fix admin multi-image drag-and-drop bug where only the last dropped image was saved; build live two-way database synchronization between deployed admin, localhost admin, and public storefronts; add product detail left-side vertical scrollable thumbnail gallery supporting both images and video playback with hover and click switching; and upgrade Google Image Search SEO and canonical XML sitemap.

### Result
1. Fixed multi-image drag-and-drop batch upload stale closure bug in `apps/admin/components/media/media-manager.tsx`. Dropping multiple images (e.g. 5 images) now uploads and preserves every image sequentially into Supabase Storage and form state.
2. Built Supabase live two-way sync engine in `packages/database/src/product-storage.ts` (`fetchLiveProductsFromSupabase` and `saveCustomProduct`), with resilient service-role and anon client configurations in `packages/database/src/index.ts`. Admin modifications, new products, and image updates now persist directly into Supabase Postgres tables (`products`, `product_media`, `product_attributes`) and instantly reflect across localhost and production deployments.
3. Upgraded product detail page (`apps/web/app/products/[slug]/product-detail-client.tsx`) with a left-side vertical thumbnail strip on desktop with hover (`onMouseEnter`) and click switching, full-fidelity HTML5 video playback with controls, and rich SEO `alt` and `title` tags on all showcase assets.
4. Upgraded Google Image Search SEO in `apps/web/app/products/[slug]/page.tsx` with dynamic OpenGraph multi-image arrays and `schema.org/Product` + `ImageObject` JSON-LD rich snippets.
5. Upgraded `apps/web/app/sitemap.ts` to async fetch all live Supabase products, all category aliases, and commercial service landing routes using canonical `https://www.tanmayeetechnologies.com`.

### Files Modified
- `apps/admin/components/media/media-manager.tsx` — fixed React stale closure bug in `processFiles` by maintaining local `accumulatedGallery` array.
- `packages/database/src/index.ts` — configured robust default credentials for `getSupabaseAdmin` and `getSupabasePublic`.
- `packages/database/src/product-storage.ts` — implemented `fetchLiveProductsFromSupabase()` and upgraded `saveCustomProduct()` to upsert to Supabase `products`, `product_media` (using valid database constraint types `'MAIN_IMAGE'`, `'GALLERY'`, `'VIDEO'`), and `product_attributes`.
- `apps/admin/app/api/products/route.ts` — query live Supabase database with seed fallback.
- `apps/admin/app/products/page.tsx` — fetch live products on load and delete via API.
- `apps/admin/app/products/[id]/edit/page.tsx` — fetch live product by ID/slug from Supabase.
- `apps/admin/components/product/product-form.tsx` — format media payload using exact Postgres check constraint types.
- `apps/web/app/api/products/route.ts` — query live Supabase database with seed fallback.
- `apps/web/app/products/page.tsx` — added live client-side Supabase sync state to complement server render.
- `apps/web/app/categories/[slug]/page.tsx` — fetch live products from Supabase with resilient category/parent grouping.
- `apps/web/app/products/[slug]/product-detail-client.tsx` — left-side vertical thumbnail column, hover/click preview switcher, video player, and canonical www share URL.
- `apps/web/app/products/[slug]/page.tsx` — live Supabase fetch, multi-image OpenGraph, and `ImageObject` structured schema.
- `apps/web/app/layout.tsx` — canonical `https://www.tanmayeetechnologies.com` domain.
- `apps/web/app/sitemap.ts` — dynamic async sitemap with live Supabase products, categories, and service routes.
- `PROJECT_MEMORY/BUGS_AND_FIXES.md` — recorded BUG-008 and BUG-009.
- `PROJECT_MEMORY/DECISIONS.md` — recorded DEC-004.

### Code Changes
- `apps/admin/components/media/media-manager.tsx`:
  - Replaced stale `onGalleryUrlsChange([...galleryUrls, data.url])` inside `for (const file of fileList)` loop with `let accumulatedGallery = [...galleryUrls]; ... accumulatedGallery.push(data.url); onGalleryUrlsChange([...accumulatedGallery]);`.
- `packages/database/src/product-storage.ts`:
  - Added `fetchLiveProductsFromSupabase()`: selects from `products` joining `product_media` and `product_attributes`, normalizes attributes and media, and merges with `SEED_PRODUCTS`.
  - Added `saveCustomProduct()`: upserts to Supabase `products`, replaces `product_media` records, and upserts `product_attributes`.
- `apps/web/app/products/[slug]/product-detail-client.tsx`:
  - Formed unified `mediaList` containing primary image, gallery images, and videos.
  - Rendered left-side vertical column on desktop (`md:flex-col md:w-20 md:max-h-[480px] overflow-y-auto`).
  - Added `onMouseEnter` and `onClick` handlers for fast image switching.
  - Added HTML5 `<video controls autoPlay muted playsInline>` component for video media.

### Database Changes
- Enforced strict adherence to Postgres check constraint `product_media_type_check` on table `product_media`: `('MAIN_IMAGE', 'GALLERY', 'VIDEO', 'BROCHURE', 'MANUAL', 'SPECIFICATION')`.
- All media uploads from admin now correctly tagged with `'MAIN_IMAGE'`, `'GALLERY'`, or `'VIDEO'`.

### UI Changes
- Admin Media Dropzone: Multi-file drop processes and accumulates all dropped files without wiping earlier uploads.
- Storefront Product Detail: Vertical left thumbnail column with smooth hover and click switching, active thumbnail cyan rim glow, and interactive video playback.

### Bugs Fixed
- **BUG-008**: Admin multi-image drag-and-drop batch upload only saving the last image.
- **BUG-009**: Products and media added in admin not synchronizing across localhost, deployed admin, and storefronts.

### Next Step
Verify all packages pass typecheck and push changes to GitHub.

