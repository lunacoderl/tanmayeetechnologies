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
