/**
 * Amazon India Platform Adapter (amazon.in)
 */

import { cleanCanonicalUrl, deduplicateUrls, expandHighResImage } from '../utils/urls.js';
import { parsePrice } from '../extraction/normalizers.js';

export class AmazonPlatformAdapter {
  constructor(config = {}) {
    this.name = 'Amazon India';
    this.key = 'amazon';
    this.enabled = config.enabled ?? false;
    this.baseUrl = 'https://www.amazon.in';
  }

  buildSearchUrl(query) {
    return `${this.baseUrl}/s?k=${encodeURIComponent(query)}`;
  }

  async discoverCandidates({ page, product, query, logger, maxCandidates = 3 }) {
    logger?.discoveryStarted(product, this.name, query);

    const candidates = [];
    try {
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});

      // Locate search result cards
      const resultCards = await page.$$('div[data-component-type="s-search-result"]');
      for (const card of resultCards.slice(0, maxCandidates * 3)) {
        // Filter out sponsored items
        const isSponsored = await card.$('.puis-sponsored-label-text, .s-sponsored-label-info-icon');
        if (isSponsored) continue;

        const titleEl = await card.$('h2 a span, h2 a');
        if (!titleEl) continue;

        const title = (await titleEl.innerText() || '').trim();
        const linkEl = await card.$('h2 a.a-link-normal');
        const href = linkEl ? await linkEl.getAttribute('href') : null;
        if (!href || !title) continue;

        const priceEl = await card.$('.a-price .a-offscreen');
        const priceText = priceEl ? await priceEl.innerText() : '';

        const asin = await card.getAttribute('data-asin');

        const candidate = {
          title,
          url: cleanCanonicalUrl(href, this.baseUrl),
          asin: asin || null,
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
    const title = (await page.$eval('#productTitle', el => el.innerText).catch(() => ''))
      || (await page.title()) || '';

    // Description
    const description = await page.$eval('#feature-bullets, #productDescription', el => el.innerText)
      .catch(() => null);

    // Dynamic High-Res Images
    const rawImages = await page.$$eval('#landingImage, #imgTagWrapperId img, #imageBlock img', els => {
      const urls = [];
      for (const el of els) {
        const dyn = el.getAttribute('data-a-dynamic-image');
        if (dyn) {
          try {
            const parsed = JSON.parse(dyn);
            urls.push(...Object.keys(parsed));
          } catch {}
        }
        const src = el.getAttribute('src');
        if (src) urls.push(src);
      }
      return urls;
    }).catch(() => []);

    const images = deduplicateUrls(rawImages);

    // Pricing
    const priceText = await page.$eval('.priceToPay .a-offscreen, #corePriceDisplay_desktop_feature_div .a-price .a-offscreen', el => el.innerText)
      .catch(() => null);
    const mrpText = await page.$eval('.basisPrice .a-offscreen, #corePriceDisplay_desktop_feature_div .a-price.a-text-price .a-offscreen', el => el.innerText)
      .catch(() => null);

    const price = parsePrice(priceText);
    const mrp = parsePrice(mrpText || priceText);

    // Specifications
    const specifications = {};
    const specRows = await page.$$('table#productDetails_techSpec_section_1 tr, table.prodDetTable tr, #technicalSpecifications_section_1 tr')
      .catch(() => []);

    for (const row of specRows) {
      const key = (await row.$eval('th', el => el.innerText).catch(() => '')).trim();
      const val = (await row.$eval('td', el => el.innerText).catch(() => '')).trim();
      if (key && val) specifications[key] = val;
    }

    // Rating & Reviews
    const ratingStr = await page.$eval('#acrPopover .a-size-base, span[data-hook="rating-out-of-text"]', el => el.innerText)
      .catch(() => null);
    const rating = ratingStr ? parseFloat(ratingStr) || null : null;

    const reviewCountStr = await page.$eval('#acrCustomerReviewText', el => el.innerText).catch(() => null);
    const reviewCount = reviewCountStr ? parseInt(reviewCountStr.replace(/\D/g, ''), 10) || 0 : 0;

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

    const modelExtracted = specifications['Model Number'] || specifications['Item model number'] || specifications.Model || null;
    const manufacturer = specifications.Manufacturer || 'Unknown';

    return {
      title: title.trim(),
      description: description ? description.trim() : null,
      images,
      videos: [],
      price,
      mrp,
      offers: [],
      rating,
      review_count: reviewCount,
      specifications,
      warranty: specifications.Warranty || null,
      manufacturer,
      availability: 'In stock',
      canonical_url: canonicalUrl,
      model: modelExtracted,
      sku: jsonLdData?.sku || null,
      json_ld: jsonLdData
    };
  }
}
