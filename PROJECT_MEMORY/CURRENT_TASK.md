# Current Task: Cloud-First Catalog Persistence, Universal Product ID Resolution, and Storefront Images Box (Lightbox)

**Status:** COMPLETED  
**Assignee:** Antigravity AI Agent  
**Goal:** Transition the platform to a pure cloud-first single source of truth (Supabase Postgres) without local disk overwrites, eliminate product editing and specification loss across admin page navigation by resolving legacy seed IDs to canonical Supabase UUIDs, ensure reliable version history lookup and rollback, and implement a high-end full-screen Images Box (Lightbox) on the public storefront with horizontal thumbnail scrolling.

---

## Task Checklist

- [x] **Pure Cloud-First Persistence (No Local Disk Overwrites):**
  - Removed `node.fs.writeFileSync` to `custom-products.json` in `packages/database/src/product-storage.ts`, eliminating Next.js / Turbopack hot-reload crashes and server recompilations during product saves.
  - Ensured in-memory caches are immediately cleared (`lastSupabaseFetchTime = 0`) upon saving to guarantee instant cloud data freshness.
- [x] **Universal Product Identifier Resolver:**
  - Implemented `resolveCanonicalProductId(identifier)` in `packages/database/src/product-storage.ts` to map UUIDs, slugs, model numbers, and legacy seed IDs (`p0000001-...`) to canonical Supabase UUIDs.
  - Implemented `fetchSingleProduct(identifier)` to retrieve a fully normalized product with live media and attributes directly from Supabase.
- [x] **Dedicated Single-Product API Route:**
  - Created `apps/admin/app/api/products/[id]/route.ts` supporting `GET` (direct cloud fetch) and `PUT` (direct cloud update).
- [x] **Zero-Loss Admin Product Edit Navigation:**
  - Rewrote `apps/admin/app/products/[id]/edit/page.tsx` to fetch directly from `/api/products/${id}`. Eliminated fallback to `SEED_PRODUCTS[0]` and added a loading state until live cloud data is ready.
  - Synchronized form state on save in `apps/admin/components/product/product-form.tsx` with server-returned UUID and version number.
  - Added cache-busting timestamp query parameters (`?t=${Date.now()}`) and `{ cache: 'no-store' }` to `apps/admin/app/products/page.tsx` to prevent stale HTTP caching.
- [x] **Robust Product Version History Resolution:**
  - Fixed `fetchProductVersions(productIdOrSlug)` and `restoreProductVersion()` to resolve canonical UUIDs before querying Supabase `product_versions`.
  - Tested lifecycle end-to-end: verified saving increments version number, records snapshots, and updates product in Supabase.
- [x] **Full-Screen Storefront Images Box (Lightbox):**
  - Upgraded `apps/web/app/products/[slug]/product-detail-client.tsx`:
    - Smooth hover on vertical thumbnails dynamically switches the center showcase view.
    - Clicking on any thumbnail or the center showcase image opens the full-screen Images Box (Lightbox).
    - Added an explicit `"Photos (N)"` / `Maximize2` expand button to the main showcase image.
    - Implemented modal with top bar (brand, model, photo counter, close button), center viewport with previous/next controls, and a bottom horizontal scrollable carousel strip with active highlight rings.
    - Added global keyboard navigation (`Escape`, `ArrowLeft`, `ArrowRight`) and body scroll lock.
- [x] **Verification & Monorepo Health Check:**
  - Turbo typecheck executed across all packages: `@tanmayee/admin`, `@tanmayee/web`, `@tanmayee/api`, `@tanmayee/config`: **4/4 passed (0 errors)**.
  - Successfully verified `/api/products/[id]`, `/api/products/[id]/versions`, and web storefront `/products/[slug]`.


---

## Task Checklist

- [x] **Multi-Image Drag-and-Drop Batch Upload Bug Fix:**
  - Resolved the React state closure bug in `apps/admin/components/media/media-manager.tsx`.
  - Maintained a local running array `accumulatedGallery = [...galleryUrls]` inside `processFiles()`.
  - Multiple dropped files (e.g. 5 images or videos) now sequentially upload to Supabase Storage bucket `product-media` and accumulate without discarding earlier uploads.
- [x] **Live Two-Way Database Synchronization Engine:**
  - Enforced Supabase client initialization in `packages/database/src/index.ts` with reliable default project configuration.
  - Implemented `fetchLiveProductsFromSupabase()` in `packages/database/src/product-storage.ts`, querying Supabase `products`, `product_media`, and `product_attributes`, normalizing them to `Product`, and merging with seed products.
  - Rewrote `saveCustomProduct()` in `packages/database/src/product-storage.ts` to perform atomic upserts to Supabase `products`, replace rows in `product_media` with valid database constraint types (`'MAIN_IMAGE'`, `'GALLERY'`, `'VIDEO'`), and upsert `product_attributes`.
  - Updated API route endpoints:
    - `apps/admin/app/api/products/route.ts`: Queries live Supabase with fallback.
    - `apps/web/app/api/products/route.ts`: Queries live Supabase with fallback.
  - Updated Admin pages:
    - `apps/admin/app/products/page.tsx`: Fetches live products and handles deletions via API.
    - `apps/admin/app/products/[id]/edit/page.tsx`: Fetches live product by ID/slug.
    - `apps/admin/components/product/product-form.tsx`: Formats media using valid Postgres enum types.
  - Updated Web Storefront:
    - `apps/web/app/products/page.tsx`: Added live client-side Supabase sync state.
    - `apps/web/app/categories/[slug]/page.tsx`: Fetches live products from Supabase with resilient category/parent grouping.
- [x] **Product Detail Left-Side Vertical Thumbnail Gallery & Video Player:**
  - Upgraded `apps/web/app/products/[slug]/product-detail-client.tsx`:
    - Created unified `mediaList` aggregating primary image, gallery images, and video assets.
    - Added left-side vertical column on desktop (`md:flex-col md:w-20 md:max-h-[480px] overflow-y-auto`).
    - Added both `onMouseEnter` and `onClick` handlers to seamlessly switch preview image/video.
    - Added dynamic video player (`<video controls autoPlay muted playsInline>`) rendering when active media is a video.
    - Added rich descriptive `alt` and `title` tags on all showcase assets for Google Image indexing.
- [x] **Google Image Search SEO & Dynamic Canonical Sitemap:**
  - Injected OpenGraph image arrays and `schema.org/Product` + `ImageObject` JSON-LD rich snippets in `apps/web/app/products/[slug]/page.tsx`.
  - Configured canonical base URL `https://www.tanmayeetechnologies.com` in `apps/web/app/layout.tsx`.
  - Upgraded `apps/web/app/sitemap.ts` to async fetch all live Supabase products, all category aliases, and commercial service landing routes.
- [x] **Verification & Health Check:**
  - Turbo typecheck executed across all packages: `@tanmayee/admin`, `@tanmayee/web`, `@tanmayee/api`, `@tanmayee/config`: **4/4 passed (exit code 0)**.
- [x] **Admin brand_name TypeError & Supabase Catalog Sync (BUG-010, BUG-011):**
  - Eliminated `TypeError: Cannot read properties of undefined (reading 'toLowerCase')` on admin products page by safely deriving `brand_name` and `category_name` via `SEED_BRANDS` and `SEED_CATEGORIES`.
  - Executed `scripts/sync-catalog-to-supabase.mjs`: purged 113 outdated dummy database rows and seeded all 155 authentic commercial models with deterministic UUIDs, 502 media records, and 2,325 attributes into Supabase.
  - Ensured seamless 2-way connection between Admin and Storefront cards/details with prioritized image fallback.
- [x] **Storefront RLS Key Fix & Live Database Product Version History (BUG-012, BUG-013):**
  - Fixed `getSupabaseAdmin()` key resolution to strictly use `SUPABASE_SERVICE_ROLE_KEY`, bypassing RLS on server-side queries so `apps/web` no longer silently falls back to stale static seed data.
  - Built comprehensive product version history persistence in Supabase `product_versions` on every product save.
  - Created `/api/products/[id]/versions` API route supporting version queries and one-click rollback.
  - Replaced hardcoded version modal in `apps/admin/app/products/page.tsx` with dynamic version list, live active badges, change summaries, and one-click restore functionality.

