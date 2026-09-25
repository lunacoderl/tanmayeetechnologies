# Technical Decisions Log

## DEC-001: Discovery of Active Shopify Storefronts for Rockwell & Blue Star
- **Date:** 2026-09-22
- **Context:** Previous attempts targeted legacy URLs like `shop.rockwell.co.in` (which returned 404) or assumed WordPress/WooCommerce structures.
- **Decision:** Use official, live Shopify storefronts:
  - Rockwell: `https://www.rockwell.co.in` with endpoints `/collections/all/products.json` and `/products/{handle}`.
  - Blue Star: `https://consumer.bluestarindia.com` with endpoint `/collections/all/products.json`.
- **Outcome:** Direct access to genuine high-resolution manufacturer product images (`.png`, `.jpg`, `.webp`), official prices, SKU numbers, and technical specifications.

---

## DEC-002: Dual-Mode Apify Actor Architecture
- **Date:** 2026-09-22
- **Context:** Apify Free Tier limits compute units and memory (4GB RAM ceiling). Running a continuous Playwright browser on 155 pages can consume excessive time and compute units.
- **Decision:** Implement a dual-mode engine in `actors/product-catalog-actor`:
  1. Direct Catalog Resolution (`catalog-resolver.js`): Uses live manufacturer store data and CDN assets to instantly produce complete, authentic product records without browser overhead.
  2. Playwright Web Crawler (`main.js`): Available for deep DOM extraction, competitor price monitoring (Amazon, Flipkart, Croma, Reliance Digital), and search result parsing.
- **Outcome:** Fast, 100% reliable data generation with zero risk of hitting cloud compute timeouts or rate limits.

---

## DEC-003: Deterministic Schema Preservation
- **Date:** 2026-09-22
- **Context:** The canonical input catalog contains 155 items with specific punctuation (`/`, `+`), exact capacities (`194 L`, `2+ Ton`), and separate brand numbering.
- **Decision:** Strict preservation of raw catalog tokens:
  - `source_row` at the root object.
  - `catalog_index` (1 to 155).
  - Exact model strings (`GFR1210F/C`, `GFR450D/C5 EUTECTIC`, `FOW5504D2D`).

---

## DEC-004: Direct Supabase Database Synchronization with Fallback Seeding for High-Availability Cross-Environment Consistency
- **Date:** 2026-09-25
- **Context:** Admin edits in deployed instances vs localhost instances were previously disconnected, relying on isolated local memory or JSON files. Custom products and media added in one environment were lost or invisible to storefronts.
- **Decision:** Establish Supabase Postgres as the authoritative central data store for products, media (`product_media`), and attributes (`product_attributes`), using service role keys for admin writes and anon keys for public reads, while preserving `SEED_PRODUCTS` as a zero-downtime offline fallback.
- **Outcome:** Complete cross-environment consistency: products, images, videos, and specifications added or edited anywhere instantly sync across localhost and production deployments.

