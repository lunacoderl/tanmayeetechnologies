# Tanmayee Technologies — Product Catalog Extractor (Apify Actor)

A production-grade, ethical Apify Actor built with **Playwright**, **Crawlee**, and optional **OpenAI Structured Extraction** to collect detailed product specifications, high-resolution media, pricing, and availability for the 155-item canonical Rockwell and Blue Star cooling catalog.

---

## Architecture Overview

```text
                  CANONICAL 155-PRODUCT CATALOG
           [97 Rockwell Models + 58 Blue Star Configurations]
                               │
                       BATCHING & SLICER
               [Dynamic Slices: batchIndex & batchSize]
                               │
                        QUERY GENERATOR
        "Rockwell {MODEL}"  |  "Blue Star {SERIES} {STAR} {CAPACITY}"
                               │
                    STAGE A: DISCOVERY CRAWLER
       [Respects Domain Rate Limiting & Platform-Specific Rules]
      - Rockwell Official Store (shop.rockwell.co.in)
      - Blue Star Consumer Store (consumer.bluestarindia.com)
      - Optional: Amazon, Flipkart, Croma, Reliance Digital, Google Shopping
                               │
                    STAGE B: DETAIL EXTRACTION
       [JSON-LD + Clean DOM State + High-Res Image Extractor]
                               │
                 DETERMINISTIC MATCHING ENGINE
       - Rockwell: Strict exact model match required
       - Blue Star: Multi-attribute scoring (Category, Capacity, Star, Series)
                               │
                   OPTIONAL AI ENHANCEMENT
       - OpenAI Structured Output (gpt-4o-mini)
       - Strict token budget limiter & hallucination shields
                               │
                    EXACT RECORD PERSISTENCE
        [Actor.pushData() for EVERY attempted product × platform]
```

---

## Key Features

1. **Exact 155 Catalog Items Preserved**:
   - 97 Rockwell commercial freezers and chillers with exact alphanumeric model codes (e.g. `GFR1210F/C`, `GFR450D/C5 EUTECTIC`, `FOW5504D2D`).
   - 58 Blue Star air conditioning configurations (Split AC, Window AC, Cassette AC, Mega Split, Verticool) with distinct star ratings and tonnages.
2. **Deterministic Matching Engine**:
   - **Rockwell**: Strict model matching. Near-model codes (e.g. `GFR350D5UC5S` vs `GFR350D5UC4S`) are flagged as explicit `mismatch`.
   - **Blue Star**: Multi-factor scoring. Confirms capacity (`1.5 Ton` <-> `1.50 TR`), star rating (`5 Star`), and series. Configuration matches are clearly classified as `probable_match` unless an exact manufacturer SKU is found.
3. **Per-Domain Sliding Window Rate Limiter**:
   - Enforces `maxRequestsPerMinutePerDomain` (default 6 rpm) to prevent rate limits and IP bans.
4. **Resilient Dataset Guarantee**:
   - Exactly one record is pushed per attempted `product_id × platform` pair—including `not_found`, `blocked`, `skipped`, `mismatch`, and `failed`.
5. **Apify Free Tier Optimization**:
   - Built-in dynamic batching (`batchIndex` and `batchSize: 20` or `batchSize: 5`) so you can run slices without exceeding the free tier's 4 GB RAM concurrency limit.
   - Includes `scripts/run-all-batches.js` for sequential batch execution.

---

## Quick Start & Local Pilot

### 1. Prerequisites
- Node.js 18+ or 20+
- Apify CLI (`npm install -g apify-cli`)

### 2. Install Dependencies
```bash
cd actors/product-catalog-actor
npm install
npx playwright install chromium
```

### 3. Run Unit Tests
```bash
npm test
```
Validates catalog integrity, query generation, and deterministic matching rules.

### 4. Run Low-Cost Pilot Run
Run a dry run pilot on the first 5 products:
```bash
npm run pilot
```

---

## Input Configuration Reference

Configured in `INPUT_SCHEMA.json` or provided via Apify Console:

| Field | Type | Default | Description |
|---|---|---|---|
| `batchSize` | Integer | `5` | Products to process per run. Use `5` for pilots, `20` for production batches. |
| `batchIndex` | Integer | `0` | 0-based batch index. Dynamically calculated based on total items. |
| `brandFilter` | Select | `"all"` | Filter catalog: `"all"`, `"Rockwell"`, or `"Bluestar"`. |
| `startRow` | Integer | `null` | Optional 1-based start row override (1-155). |
| `endRow` | Integer | `null` | Optional 1-based end row override (1-155). |
| `platforms` | Object | See below | Boolean map of platform adapters to enable. |
| `maxConcurrency` | Integer | `2` | Max concurrent browser pages (1-5). |
| `maxRequestsPerMinutePerDomain` | Integer | `6` | Strict per-domain token-bucket rate limiter. |
| `maxCandidatesPerPlatform` | Integer | `3` | Number of organic search candidates to inspect. |
| `useAiExtraction` | Boolean | `false` | Enable OpenAI structured spec extraction. |
| `aiModel` | String | `"gpt-4o-mini"` | OpenAI model for extraction. |
| `dryRun` | Boolean | `false` | Simulates run without external HTTP requests. |

### Recommended Pilot Input
```json
{
  "batchSize": 5,
  "batchIndex": 0,
  "brandFilter": "all",
  "maxConcurrency": 2,
  "maxRequestsPerMinutePerDomain": 6,
  "useAiExtraction": false,
  "dryRun": false,
  "platforms": {
    "rockwellOfficial": true,
    "bluestarOfficial": true,
    "amazon": false,
    "flipkart": false,
    "croma": false,
    "relianceDigital": false,
    "googleShopping": false
  }
}
```

---

## Deploying to Apify

### Using Apify CLI
```bash
# 1. Log in to your Apify account
apify login

# 2. Deploy the actor
cd actors/product-catalog-actor
apify push
```

### Setting Environment Secrets in Apify
1. In Apify Console, navigate to your Actor > **Settings** > **Environment variables**.
2. Add:
   - `OPENAI_API_KEY`: your OpenAI secret key (only if `useAiExtraction` is enabled).
   - `APIFY_TOKEN`: your Apify token (automatically injected in Apify runs).

---

## Sequential Batch Execution on Free Tier

Apify's Free Tier includes $5 credit and max 4096 MB RAM. Running 8 browser actors simultaneously will fail due to RAM limits.

Use the sequential orchestrator script:
```bash
APIFY_TOKEN=your_token node scripts/run-all-batches.js
```
This iterates through all batches (20 items each) sequentially on your account, waiting for each run to complete before launching the next.

---

## Output Record Schema

Every record in the Apify default dataset contains:

```json
{
  "run_id": "run-id",
  "product_id": "rockwell-001-gfr250d5uc4s",
  "catalog_index": 1,
  "brand_source_row": 1,
  "requested_product": {
    "brand": "Rockwell",
    "category": "Convertible Green Freezer",
    "model": "GFR250D5UC4S",
    "capacity": "194 L"
  },
  "platform": "Rockwell Official Store",
  "platform_key": "rockwellOfficial",
  "status": "success",
  "match_status": "exact_match",
  "match_confidence": 0.99,
  "match_reasons": ["Exact normalized model GFR250D5UC4S verified in listing"],
  "matched_model": "GFR250D5UC4S",
  "title": "Rockwell Convertible Green Deep Freezer 194 Litres (GFR250D5UC4S)",
  "price": { "currency": "INR", "amount": 26990, "display": "₹26,990" },
  "specifications": { "Capacity": "194 L", "Defrost Type": "Manual" },
  "images": ["https://shop.rockwell.co.in/media/..."],
  "error": null,
  "timestamp": "2026-09-22T14:30:00.000Z"
}
```

---

## Ethical & Terms-Aware Operation
- The actor does **not** bypass CAPTCHAs, bot shields, or authentication paywalls.
- When an anti-bot challenge is encountered, the platform logs a `platform_blocked` event and saves a structured record with `status: "blocked"` rather than crashing.
- Polite per-domain rate limits prevent overloading target servers.
