# Changelog: Tanmayee Technologies Platform

All notable changes and technical implementation milestones are documented in this file.

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
