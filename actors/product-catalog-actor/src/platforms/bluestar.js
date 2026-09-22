/**
 * Blue Star Official Consumer Website Platform Adapter (consumer.bluestarindia.com)
 */

import { cleanCanonicalUrl, deduplicateUrls } from '../utils/urls.js';
import { parsePrice } from '../extraction/normalizers.js';

export class BluestarPlatformAdapter {
  constructor(config = {}) {
    this.name = 'Blue Star Official Consumer';
    this.key = 'bluestarOfficial';
    this.enabled = config.enabled ?? true;
    this.baseUrl = 'https://www.bluestarindia.com';
  }

  buildSearchUrl(query) {
    return `${this.baseUrl}/?s=${encodeURIComponent(query)}`;
  }

  async discoverCandidates({ page, product, query, logger, maxCandidates = 3 }) {
    logger?.discoveryStarted(product, this.name, query);

    const candidates = [];
    try {
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});

      const cards = await page.$$('.product-card, .product-item, .card-product, .product-listing-item, article, .item, a[href*="product"], a[href*="air-conditioner"]');
      for (const card of cards.slice(0, maxCandidates * 3)) {
        const linkEl = await card.$('a.product-link, a.product-title, .title a, a[href*="/product/"], a');
        if (!linkEl) continue;

        const title = (await linkEl.innerText() || '').trim();
        const href = await linkEl.getAttribute('href');
        if (!href || !title) continue;

        const priceEl = await card.$('.price, .current-price, .special-price');
        const priceText = priceEl ? await priceEl.innerText() : '';

        const candidate = {
          title,
          url: cleanCanonicalUrl(href, this.baseUrl),
          price: parsePrice(priceText),
          source: this.key
        };

        candidates.push(candidate);
        logger?.candidateDiscovered(product, this.name, candidate);
        if (candidates.length >= maxCandidates) break;
      }
    } catch (err) {
      logger?.log('discovery_warning', { platform: this.name, error: err.message });
    }

    return candidates;
  }

  chooseBestCandidate({ candidates = [], product }) {
    if (!candidates || candidates.length === 0) return null;

    const reqCap = (product.capacity || '').toUpperCase();
    const reqStar = (product.star_rating || '').toUpperCase();
    const reqSeries = (product.series || '').toUpperCase();

    // Score candidates based on match attributes in title
    let best = candidates[0];
    let maxScore = -1;

    for (const cand of candidates) {
      let score = 0;
      const t = cand.title.toUpperCase();
      if (reqCap && t.includes(reqCap)) score += 3;
      if (reqStar && t.includes(reqStar)) score += 2;
      if (reqSeries && t.includes(reqSeries)) score += 2;

      if (score > maxScore) {
        maxScore = score;
        best = cand;
      }
    }

    return best;
  }

  async extractProductPage({ page, product, sourceUrl, logger }) {
    logger?.detailStarted(product, this.name, sourceUrl);

    await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});

    // Canonical URL
    const canonicalHref = await page.$eval('link[rel="canonical"]', el => el.href).catch(() => null);
    const canonicalUrl = cleanCanonicalUrl(canonicalHref || sourceUrl, this.baseUrl);

    // Title
    const title = (await page.$eval('h1.product-title, .product-name h1, h1', el => el.innerText).catch(() => ''))
      || (await page.title()) || '';

    // Description
    const description = await page.$eval('.product-description, .overview, #description', el => el.innerText)
      .catch(() => null);

    // Images
    const rawImages = await page.$$eval(
      'meta[property="og:image"], .product-gallery img, .swiper-slide img, .product-image img, img[src*="bluestar"], img[src*="product"], .gallery img',
      els => els.map(el => el.getAttribute('content') || el.getAttribute('data-src') || el.getAttribute('src'))
    ).catch(() => []);

    const images = deduplicateUrls(rawImages);

    // Pricing
    const currentPriceText = await page.$eval('.price, .offer-price, .special-price', el => el.innerText)
      .catch(() => null);
    const mrpText = await page.$eval('.mrp, .regular-price, strike', el => el.innerText)
      .catch(() => null);

    const price = parsePrice(currentPriceText);
    const mrp = parsePrice(mrpText || currentPriceText);

    // Specifications
    const specifications = {};
    const specRows = await page.$$('.specification-row, .spec-table tr, .table-specifications tr, .attributes tr')
      .catch(() => []);

    for (const row of specRows) {
      const key = (await row.$eval('th, .spec-title, .key, td:first-child', el => el.innerText).catch(() => '')).trim();
      const val = (await row.$eval('td:last-child, .spec-value, .val', el => el.innerText).catch(() => '')).trim();
      if (key && val && key !== val) {
        specifications[key] = val;
      }
    }

    // JSON-LD structured data extraction
    let jsonLdData = null;
    try {
      const jsonLdScripts = await page.$$eval('script[type="application/ld+json"]', els => els.map(e => e.innerText));
      for (const raw of jsonLdScripts) {
        const parsed = JSON.parse(raw);
        if (parsed['@type'] === 'Product' || parsed.type === 'Product') {
          jsonLdData = parsed;
          break;
        }
      }
    } catch {}

    const modelFound = specifications['Model Number'] || specifications.Model || jsonLdData?.model || jsonLdData?.sku || null;

    return {
      title: title.trim(),
      description: description ? description.trim() : null,
      images,
      videos: [],
      price,
      mrp,
      offers: [],
      rating: null,
      review_count: 0,
      specifications,
      warranty: specifications.Warranty || null,
      manufacturer: 'Blue Star Limited',
      availability: 'In stock',
      canonical_url: canonicalUrl,
      model: modelFound,
      sku: jsonLdData?.sku || null,
      json_ld: jsonLdData
    };
  }
}
