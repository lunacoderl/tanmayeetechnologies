/**
 * Croma Platform Adapter (croma.com)
 */

import { cleanCanonicalUrl, deduplicateUrls } from '../utils/urls.js';
import { parsePrice } from '../extraction/normalizers.js';

export class CromaPlatformAdapter {
  constructor(config = {}) {
    this.name = 'Croma';
    this.key = 'croma';
    this.enabled = config.enabled ?? false;
    this.baseUrl = 'https://www.croma.com';
  }

  buildSearchUrl(query) {
    return `${this.baseUrl}/searchB?q=${encodeURIComponent(query)}%3Arelevance&text=${encodeURIComponent(query)}`;
  }

  async discoverCandidates({ page, product, query, logger, maxCandidates = 3 }) {
    logger?.discoveryStarted(product, this.name, query);

    const candidates = [];
    try {
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});

      const items = await page.$$('li.product-item, .cp-product, div.product-info');
      for (const item of items.slice(0, maxCandidates * 3)) {
        const linkEl = await item.$('h3 a, .product-title a, a[href*="/p/"]');
        if (!linkEl) continue;

        const title = (await linkEl.innerText() || '').trim();
        const href = await linkEl.getAttribute('href');
        if (!href || !title) continue;

        const priceEl = await item.$('.amount, .new-price, span[data-testid="new-price"]');
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

    const isRockwell = (product.brand || '').toLowerCase() === 'rockwell';
    if (isRockwell && product.model) {
      const targetModel = product.model.toUpperCase();
      for (const c of candidates) {
        if (c.title.toUpperCase().includes(targetModel)) return c;
      }
    }

    return candidates[0];
  }

  async extractProductPage({ page, product, sourceUrl, logger }) {
    logger?.detailStarted(product, this.name, sourceUrl);

    await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});

    // Canonical URL
    const canonicalHref = await page.$eval('link[rel="canonical"]', el => el.href).catch(() => null);
    const canonicalUrl = cleanCanonicalUrl(canonicalHref || sourceUrl, this.baseUrl);

    // Title
    const title = (await page.$eval('h1.pd-title, h1.product-title, h1', el => el.innerText).catch(() => ''))
      || (await page.title()) || '';

    // Description
    const description = await page.$eval('.pd-desc, .overview-text, #overview', el => el.innerText)
      .catch(() => null);

    // Images
    const rawImages = await page.$$eval('meta[property="og:image"], .carousel-slider img, .product-gallery img', els =>
      els.map(el => el.getAttribute('content') || el.getAttribute('src') || el.getAttribute('data-src'))
    ).catch(() => []);

    const images = deduplicateUrls(rawImages);

    // Pricing
    const currentPriceText = await page.$eval('.pd-price .amount, .new-price', el => el.innerText)
      .catch(() => null);
    const mrpText = await page.$eval('.pd-price .old-price, .mrp', el => el.innerText)
      .catch(() => null);

    const price = parsePrice(currentPriceText);
    const mrp = parsePrice(mrpText || currentPriceText);

    // Specifications
    const specifications = {};
    const specRows = await page.$$('.cp-specification tr, .specification-tbl tr, ul.spec-list li')
      .catch(() => []);

    for (const row of specRows) {
      const key = (await row.$eval('th, .spec-title, span:first-child', el => el.innerText).catch(() => '')).trim();
      const val = (await row.$eval('td, .spec-val, span:last-child', el => el.innerText).catch(() => '')).trim();
      if (key && val && key !== val) specifications[key] = val;
    }

    // JSON-LD
    let jsonLdData = null;
    try {
      const jsonLdScripts = await page.$$eval('script[type="application/ld+json"]', els => els.map(e => e.innerText));
      for (const raw of jsonLdScripts) {
        const parsed = JSON.parse(raw);
        if (parsed['@type'] === 'Product') {
          jsonLdData = parsed;
          break;
        }
      }
    } catch {}

    const modelFound = specifications['Model'] || specifications['Model Number'] || jsonLdData?.model || null;

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
      manufacturer: 'Unknown',
      availability: 'In stock',
      canonical_url: canonicalUrl,
      model: modelFound,
      sku: jsonLdData?.sku || null,
      json_ld: jsonLdData
    };
  }
}
