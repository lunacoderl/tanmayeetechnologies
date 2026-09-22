/**
 * Google Shopping Discovery Fallback Platform Adapter (google.com/shopping)
 * Disabled by default. Only used if explicitly enabled in input.
 */

import { cleanCanonicalUrl, deduplicateUrls } from '../utils/urls.js';
import { parsePrice } from '../extraction/normalizers.js';

export class GoogleShoppingPlatformAdapter {
  constructor(config = {}) {
    this.name = 'Google Shopping (Fallback)';
    this.key = 'googleShopping';
    this.enabled = config.enabled ?? false;
    this.baseUrl = 'https://www.google.com';
  }

  buildSearchUrl(query) {
    return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`;
  }

  async discoverCandidates({ page, product, query, logger, maxCandidates = 3 }) {
    logger?.discoveryStarted(product, this.name, query);

    const candidates = [];
    try {
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});

      const cards = await page.$$('.sh-dgr__content, .sh-np__click-target, div[data-docid]');
      for (const card of cards.slice(0, maxCandidates * 2)) {
        const titleEl = await card.$('h3, .tAxDx, .translate-content');
        if (!titleEl) continue;

        const title = (await titleEl.innerText() || '').trim();
        const linkEl = await card.$('a[href*="/shopping/product/"], a.sh-dgr__content, a');
        const href = linkEl ? await linkEl.getAttribute('href') : null;
        if (!href || !title) continue;

        const priceEl = await card.$('.a8Pemb, .OFFNJ, span[aria-hidden="true"]');
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
    return candidates[0];
  }

  async extractProductPage({ page, product, sourceUrl, logger }) {
    logger?.detailStarted(product, this.name, sourceUrl);

    await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});

    const title = (await page.title()) || '';
    const rawImages = await page.$$eval('img', els => els.map(e => e.src)).catch(() => []);

    return {
      title: title.trim(),
      description: null,
      images: deduplicateUrls(rawImages).slice(0, 3),
      videos: [],
      price: parsePrice(0),
      mrp: parsePrice(0),
      offers: [],
      rating: null,
      review_count: 0,
      specifications: {},
      warranty: null,
      manufacturer: 'Unknown',
      availability: 'Unknown',
      canonical_url: sourceUrl,
      model: null,
      sku: null,
      json_ld: null
    };
  }
}
