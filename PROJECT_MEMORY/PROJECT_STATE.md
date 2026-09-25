# Project State: Tanmayee Technologies Platform

**Last Updated:** 2026-09-25 18:35 IST  
**Status:** **Completed & Verified** — Multi-Image Drag-and-Drop Batch Upload, Live Supabase Two-Way Sync Engine, Product Detail Vertical Gallery with Video Player, Google Image SEO Schema, Dynamic Canonical Sitemap  
**Environment:** Local Development + Supabase Postgres Integration + Apify Cloud Integration (Actor ID: `IQiZE0gndS4uaVfUp`)

---

## 1. System Overview

**Tanmayee Technologies** is Vizag's premier authorized sales & service dealership and distributor:
- **Exclusive Blue Star A/C Shoppe Authorized Sales & Service Dealers**
- **Rockwell Commercial Refrigerators Authorized Sales & Service Distributors**
- **Rating:** 4.6★ (98 Google reviews)
- **Showroom Address:** Plot No. SFS MIG-131, Housing Board Colony PM Palem, Madhurawada, Visakhapatnam, Andhra Pradesh 530041
- **Phone:** `093901 15553` (+91 93901 15553)
- **Store Hours:** Opens 9:00 AM · Closes 9:00 PM (Monday – Sunday)
- **Service Options:** In-Store Shopping, In-Store Pickup, Delivery

The platform consists of:
1. **Web Storefront (`apps/web`)**: Next.js App Router application showcasing 155 commercial cooling products, brand filtering (Blue Star & Rockwell), category filtering, cart & bulk quote generation ("Quotatio"). Features animated floating right-corner CTAs (Call, WhatsApp, Quotatio, Scroll-to-Top), Web Share API integration on cards and detail pages, vibrant specs with icons, and `schema.org/Product` JSON-LD rich snippets. Running on `http://localhost:3000`.
2. **Admin Portal (`apps/admin`)**: Next.js App Router management portal with zero mock data. Contains live 155-product catalog metrics, authentic Visakhapatnam regional quotation & service records, and a full **Offers & Promotions Studio** at `/offers` allowing admin to create, edit, delete, and toggle permanent or time-limited commercial discount rules. Running on `http://localhost:3001`.
3. **Product Catalog Apify Actor (`actors/product-catalog-actor`)**: Specialized Playwright + Node.js web-scraping actor deployed to Apify Cloud (`tanmayee-catalog-actor`, Actor ID `IQiZE0gndS4uaVfUp`), designed to crawl and extract verified catalog data, technical specifications, and authentic CDN images for 155 commercial models.
4. **Shared Packages (`packages/*`)**:
   - `@tanmayee/database`: Seed catalog fallback (155 products), initial commercial offers, Supabase client factory, EAV attribute mapping.
   - `@tanmayee/types`: TypeScript definitions for products, brands, categories, quotes, orders, offers.
   - `@tanmayee/config`: System constants, statuses, company profile, price display modes.

---

## 2. Product Catalog Breakdown (155 Items)

- **Rockwell Catalog (Items 1 to 97)**:
  - Total: 97 distinct models
  - Categories: Convertible Green Freezers, Large Freezers, Eutectic Freezers, Freezers on Wheels, Convertible Hard Top Freezers, Glass Top Freezers, Combi Freezers, Visi Coolers, Visi Freezers, Upright Freezers, Stainless Steel Water Coolers, Reach-Ins, Under Counters, Blast Freezers, Wine Coolers, Car Coolers, Confectionery Showcases.
  - Image Source: Authentic Rockwell Shopify Store CDN (`https://www.rockwell.co.in/cdn/shop/files/...` and `https://cdn.shopify.com/s/files/1/0701/1929/3028/files/...`).
  - Image Audit: Verified 0 non-green-freezers possess green freezer images.
- **Blue Star Catalog (Items 98 to 155)**:
  - Total: 58 models across split ACs, window ACs, and commercial systems.
  - Categories: Inverter Split ACs (G, V, Q, P, D, F Series; 1T, 1.5T, 2T; 3-Star & 5-Star), Fixed Speed Split ACs, Window ACs, Commercial Cassette ACs, Mega Split ACs, Commercial Verticool ACs.
  - Image Source: Authentic Blue Star Consumer Store CDN (`https://cdn.shopify.com/s/files/1/0888/8297/0937/files/...`).

---

## 3. Key Services Status

| Service / Component | Status | Port / Target | Details |
| :--- | :--- | :--- | :--- |
| Storefront (`apps/web`) | **Active** | `http://localhost:3000` | HTTP 200, live Supabase sync, left vertical media gallery with hover/click & video, Image SEO schema, canonical sitemap |
| Admin Portal (`apps/admin`) | **Active** | `http://localhost:3001` | HTTP 200, zero mock data, multi-image batch dropzone upload, live Supabase product & media persistence |
| Apify Actor | **Deployed & Ready** | Apify Cloud ID `IQiZE0gndS4uaVfUp` | Token configured, build succeeded |
| Database (`packages/database`) | **Synchronized** | Supabase Postgres + Local fallback | Live bidirectional sync for products, `product_media`, `product_attributes`, and commercial offers |

