/**
 * Flipkart Platform Adapter (flipkart.com)
 */

import { cleanCanonicalUrl, deduplicateUrls } from '../utils/urls.js';
import { parsePrice } from '../extraction/normalizers.js';

export class FlipkartPlatformAdapter {
  constructor(config = {}) {
    this.name = 'Flipkart';
    this.key = 'flipkart';
    this.enabled = config.enabled ?? false;
    this.baseUrl = 'https://www.flipkart.com';
  }

  buildSearchUrl(query) {
    return `${this.baseUrl}/search?q=${encodeURIComponent(query)}`;
  }

  async discoverCandidates({ page, product, query, logger, maxCandidates = 3 }) {
    logger?.discoveryStarted(product, this.name, query);

    const candidates = [];
    try {
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});

      // Close login modal if it pops up
      const closeBtn = await page.$('button._2KpZ6l._2doB4z, button[class*="close"]');
      if (closeBtn) await closeBtn.click().catch(() => {});

      const cards = await page.$$('div[data-id], div._1AtVbE div._13oc-S, div._75nlfW, div._1xHGtK');
      for (const card of cards.slice(0, maxCandidates * 3)) {
        // Skip ads
        const isAd = await card.$('div._2I90AL, span:has-text("Ad")');
        if (isAd) continue;

        const linkEl = await card.$('a._1fQZEK, a.IRpwTa, a.s1Q9rs, a[href*="/p/"]');
        if (!linkEl) continue;

        const title = (await linkEl.innerText() || '').trim();
        const href = await linkEl.getAttribute('href');
        if (!href || !title) continue;

        const priceEl = await card.$('div._30jeq3, div.Nx9bqj');
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
    const title = (await page.$eval('span.B_NuCI, h1.G6XhRU, h1 span', el => el.innerText).catch(() => ''))
      || (await page.title()) || '';

    // Description
    const description = await page.$eval('div._1mXcCf, div.RmoJUa', el => el.innerText).catch(() => null);

    // Images
    const rawImages = await page.$$eval('img._396cs4, img.DByuf4, div._2E10G9 img', els =>
      els.map(el => el.getAttribute('src') || el.getAttribute('data-src'))
    ).catch(() => []);

    const images = deduplicateUrls(rawImages);

    // Pricing
    const currentPriceText = await page.$eval('div._30jeq3._16Jk6d, div._30jeq3, div.Nx9bqj.CxhGGd', el => el.innerText)
      .catch(() => null);
    const mrpText = await page.$eval('div._3I9_wc._2p6lqe, div.yRaY8j.A68qe2', el => el.innerText)
      .catch(() => null);

    const price = parsePrice(currentPriceText);
    const mrp = parsePrice(mrpText || currentPriceText);

    // Specifications
    const specifications = {};
    const specRows = await page.$$('div._3k-BhJ tr, table._14cfVK tr, div.row._1s5FDN, table.col-9-12 tr')
      .catch(() => []);

    for (const row of specRows) {
      const key = (await row.$eval('td:first-child, .col-3-12', el => el.innerText).catch(() => '')).trim();
      const val = (await row.$eval('td:last-child, .col-9-12', el => el.innerText).catch(() => '')).trim();
      if (key && val) specifications[key] = val;
    }

    // Rating & Reviews
    const ratingStr = await page.$eval('div._3LWZlK, div.XQDdHH', el => el.innerText).catch(() => null);
    const rating = ratingStr ? parseFloat(ratingStr) || null : null;

    const reviewText = await page.$eval('span._2_R_DZ, span.Wphh3N', el => el.innerText).catch(() => '');
    const revMatch = reviewText.match(/(\d+[\d,]*)\s*Reviews?/i);
    const reviewCount = revMatch ? parseInt(revMatch[1].replace(/,/g, ''), 10) || 0 : 0;

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

    const modelFound = specifications['Model Name'] || specifications['Model Number'] || jsonLdData?.model || null;

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
      warranty: specifications['Warranty Summary'] || specifications.Warranty || null,
      manufacturer: specifications['Manufactured by'] || 'Unknown',
      availability: 'In stock',
      canonical_url: canonicalUrl,
      model: modelFound,
      sku: jsonLdData?.sku || null,
      json_ld: jsonLdData
    };
  }
}
