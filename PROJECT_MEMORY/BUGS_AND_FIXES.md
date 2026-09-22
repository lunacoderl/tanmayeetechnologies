# Bug Registry & Fix Log

## BUG-001: React Duplicate Key Warning
- **Error:** `installHook.js:1 Encountered two children with the same key, 'p0000001-0000-0000-0000-000000000001'`.
- **Root Cause:** When `mergeExtractedCatalog()` in `packages/database/src/seed-products.ts` or fallback arrays merged initial mock items with newly imported items, ID collisions or non-unique indices occurred when rendered in table or card iterations.
- **Fix:**
  1. Updated `packages/database/src/seed-products.ts` with strict `seenIds` validation ensuring every product ID from 1 to 155 is uniquely generated (`p0000001` through `p0000155`).
  2. Applied compound unique keys `key={`${product.id}-${idx}`}` in listing loops to guarantee React key uniqueness even during hot module replacement.
- **Status:** **RESOLVED**

---

## BUG-002: Static Asset 404 Error
- **Error:** `Failed to load resource: the server responded with a status of 404 (Not Found)`.
- **Root Cause:** Browser requests to `/favicon.ico` on both `apps/web` (port 3000) and `apps/admin` (port 3001) were returning 404 because favicon files were missing in the public directory.
- **Fix:** Placed standard valid `favicon.ico` in both `apps/web/public/` and `apps/admin/public/`. Both now return HTTP 200.
- **Status:** **RESOLVED**

---

## BUG-003: Storefront Displaying Unsplash Images Instead of Genuine Product Photography
- **Error:** Product cards and admin tables were displaying generic Unsplash refrigerator/AC photos instead of actual Rockwell and Blue Star equipment.
- **Root Cause:**
  1. The initial dry-run mode wrote synthetic `example.com` image URLs.
  2. `scripts/import-extracted-catalog.js` and `packages/database/src/seed-products.ts` fell back to hardcoded Unsplash photos whenever image URLs contained `example.com` or were empty.
  3. Playwright crawler was originally blocking `.png`, `.jpg`, `.jpeg` requests.
- **Fix:**
  1. Created `actors/product-catalog-actor/src/catalog-resolver.js` which extracts authentic product images directly from Rockwell's Shopify CDN (`https://www.rockwell.co.in/cdn/shop/files/...`) and Blue Star's CDN (`https://cdn.shopify.com/s/files/1/0888/8297/0937/files/...`).
  2. Updated `import-extracted-catalog.js` to strictly enforce authentic CDN images and reject Unsplash placeholders.
- **Status:** **RESOLVED**

---

## BUG-004: Rockwell Brand and Category Filtering Returning 0 Products
- **Error:** Clicking "Rockwell" brand or category links (e.g. "Freezers", "Visi Coolers") returned 0 products, even though all 97 Rockwell products were displayed under "All Products".
- **Root Cause:**
  1. `scripts/import-extracted-catalog.js` assigned `brand_id: b0000002-...` to Rockwell items, whereas `SEED_BRANDS` defined Rockwell as `b0000001-...-0002`.
  2. Category IDs in the import script did not align with `SEED_CATEGORIES` UUIDs.
  3. `apps/web/app/brands/[slug]/page.tsx` and `categories/[slug]/page.tsx` strictly matched on exact ID rather than accommodating both UUID and normalized slug/name matches.
- **Fix:**
  1. Synchronized `BRAND_IDS.rockwell` in `scripts/import-extracted-catalog.js` to `b0000001-0000-0000-0000-000000000002`.
  2. Mapped all categories to canonical `SEED_CATEGORIES` UUIDs.
  3. Enhanced brand filter to match both UUID and normalized name (`p.brand_name.toLowerCase().includes('rockwell')`).
  4. Enhanced category filter with parent-category grouping (e.g. `freezers` matches all 44 freezer sub-types; `visi-coolers` matches all 16 visi models; `water-coolers-dispensers` matches all 12 water cooler models).
  5. Updated `apps/web/app/products/page.tsx` sidebar filter to match brands and categories by canonical IDs and parent groupings.
- **Status:** **RESOLVED**

---

## BUG-005: Product Visual Uniformity Across Capacity Tiers
- **Error:** In categories like Visi Coolers (170L to 998L), Water Coolers (40L to 400L), and Freezers (62L to 1295L), all products displayed similar images, making it difficult for users to visually distinguish capacity differences.
- **Root Cause:** Single generic product photography was previously applied across entire categories regardless of physical door count, lid configuration, or tap count.
- **Fix:**
  1. Created `getRockwellPhysicalConfiguration` in `actors/product-catalog-actor/src/catalog-resolver.js` to classify products by structural form:
     - Visi Coolers: Compact Single Door, Tall Single Door with Canopy, High-Capacity Single Door, Double Sliding Glass Doors.
     - Water Coolers: 1 Faucet (40 L/hr), 2 Faucets (80 L/hr), High-Flow (120 L/hr), 3 Faucets (150 L/hr), 4 Faucets Industrial (400 L/hr).
     - Freezers: Single Compact Lid (<210L), Single Solid Lid (250-350L), Double Solid Heavy-Duty Lid (390-650L), Jumbo 3/4-Lid Industrial (>750L).
  2. Assigned tier-specific authentic CDN images corresponding to the physical build.
  3. Added prominent dark glassmorphic badge pills on `ProductCard` and product detail pages highlighting exact capacity and door/lid/tap configuration.
- **Status:** **RESOLVED**

---

## BUG-006: Rockwell Non-Green Freezer Products Displaying Green Freezer Images
- **Error:** Combi Freezers, Blast Freezers, Upright Freezers, and Hard Top Freezers were incorrectly showing green convertible freezer (`GFR...`) images.
- **Root Cause:**
  1. `ROCKWELL_SPECIFIC_IMAGES` map in `actors/product-catalog-actor/src/catalog-resolver.js` had entries mapping `SFR` series numbers to `GFR250.png`.
  2. Fallback `else` block in `resolveRockwellProduct()` defaulted unspecified categories to `GFR...` green freezer image URLs.
- **Fix:**
  1. Updated `catalog-resolver.js` with explicit category-level image routing:
     - Combi Freezers: `https://cdn.shopify.com/s/files/1/0701/1929/3028/files/COMBI400A1.png?v=1756385844`
     - Blast Freezers: `https://cdn.shopify.com/s/files/1/0701/1929/3028/files/Group34127_6.png?v=1756387284`
     - Upright Freezers: `https://cdn.shopify.com/s/files/1/0701/1929/3028/files/Group34126_4.png?v=1756385896`
     - Eutectic Freezers: `https://cdn.shopify.com/s/files/1/0701/1929/3028/files/Group34126_3.png?v=1756385869`
     - Hard Top Freezers: `SFR250.png` (Single Lid) and `SFRN550DD1_2.png` / `refri.png` (Double Lid)
  2. Re-generated dataset and verified with automated script audit that 0 non-green-freezers possess green freezer images.
- **Status:** **RESOLVED**

---

## BUG-007: Cart Context Method and Property Mismatches in Build
- **Error:** `Property 'openCart' does not exist on type 'CartContextType'`, `Property 'totalItems' does not exist on type 'CartContextType'`.
- **Root Cause:** Components (`floating-ctas.tsx`, `product-detail-client.tsx`) invoked `openCart` and `totalItems`, while `CartContextType` defined `openDrawer` and `itemCount`.
- **Fix:** Added `openCart`, `closeCart`, and `totalItems` aliases to `CartContextType` and `CartProvider` in `apps/web/lib/cart-context.tsx`. Production build succeeded with exit code 0.
- **Status:** **RESOLVED**


