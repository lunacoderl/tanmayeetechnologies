/**
 * Rockwell Official Store Platform Adapter (shop.rockwell.co.in)
 */

import { cleanCanonicalUrl, deduplicateUrls } from '../utils/urls.js';
import { parsePrice } from '../extraction/normalizers.js';

export class RockwellPlatformAdapter {
  constructor(config = {}) {
    this.name = 'Rockwell Official Store';
    this.key = 'rockwellOfficial';
    this.enabled = config.enabled ?? true;
    this.baseUrl = 'https://www.rockwell.co.in';
  }

  buildSearchUrl(query) {
    return `${this.baseUrl}/?s=${encodeURIComponent(query)}`;
  }

  async discoverCandidates({ page, product, query, logger, maxCandidates = 3 }) {
    logger?.discoveryStarted(product, this.name, query);

    const candidates = [];
    try {
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});

      // Check for search results items on Rockwell WordPress/WooCommerce site
      const items = await page.$$('.product, .type-product, article.post, .entry-title, .product-item, .product-item-info');
      for (const item of items.slice(0, maxCandidates * 3)) {
        const titleEl = await item.$('.entry-title a, h2 a, h3 a, .product-item-link, a.product-item-photo, a');
        if (!titleEl) continue;

        const title = (await titleEl.innerText() || '').trim();
        const rawUrl = await titleEl.getAttribute('href');
        if (!rawUrl || !title) continue;

        const priceEl = await item.$('.price');
        const priceText = priceEl ? await priceEl.innerText() : '';

        const candidate = {
          title,
          url: cleanCanonicalUrl(rawUrl, this.baseUrl),
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
    const reqModel = (product.model || '').toUpperCase();

    // Prefer candidate containing exact Rockwell model in title
    for (const cand of candidates) {
      if (reqModel && cand.title.toUpperCase().includes(reqModel)) {
        return cand;
      }
    }

    // Default to first organic candidate
    return candidates[0];
  }

  async extractProductPage({ page, product, sourceUrl, logger }) {
    logger?.detailStarted(product, this.name, sourceUrl);

    await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});

    // Canonical URL
    const canonicalHref = await page.$eval('link[rel="canonical"]', el => el.href).catch(() => null);
    const canonicalUrl = cleanCanonicalUrl(canonicalHref || sourceUrl, this.baseUrl);

    // Title
    const title = (await page.$eval('h1.page-title, .page-title-wrapper span', el => el.innerText).catch(() => ''))
      || (await page.title()) || '';

    // Description
    const description = await page.$eval('.description .value, #description, .product.attribute.overview', el => el.innerText)
      .catch(() => null);

    // Images
    const rawImages = await page.$$eval(
      'meta[property="og:image"], .woocommerce-product-gallery__image img, .wp-post-image, img[src*="wp-content/uploads"], .fotorama__nav__shaft img, .gallery-placeholder img',
      els => els.map(el => el.getAttribute('content') || el.getAttribute('data-large_image') || el.getAttribute('data-src') || el.getAttribute('src') || el.getAttribute('data-full'))
    ).catch(() => []);

    const images = deduplicateUrls(rawImages);

    // Pricing
    const currentPriceText = await page.$eval('.product-info-price .price, .price-final_price .price', el => el.innerText)
      .catch(() => null);
    const mrpText = await page.$eval('.old-price .price, .mrp-price .price', el => el.innerText)
      .catch(() => null);

    const price = parsePrice(currentPriceText);
    const mrp = parsePrice(mrpText || currentPriceText);

    // Specifications
    const specifications = {};
    const specRows = await page.$$('.data.table.additional-attributes tr, #product-attribute-specs-table tr')
      .catch(() => []);

    for (const row of specRows) {
      const label = (await row.$eval('th, .label', el => el.innerText).catch(() => '')).trim();
      const val = (await row.$eval('td, .data', el => el.innerText).catch(() => '')).trim();
      if (label && val) specifications[label] = val;
    }

    // Availability
    const stockText = await page.$eval('.stock.available, .stock.unavailable', el => el.innerText).catch(() => '');
    const availability = stockText.toLowerCase().includes('in stock')
      ? 'In stock'
      : (stockText.toLowerCase().includes('out of stock') ? 'Out of stock' : 'In stock');

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

    const modelFromSpecs = specifications.Model || specifications['Model Name'] || specifications.SKU || null;

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
      manufacturer: 'Rockwell Industries Ltd',
      availability,
      canonical_url: canonicalUrl,
      model: modelFromSpecs,
      sku: jsonLdData?.sku || null,
      json_ld: jsonLdData
    };
  }
}
