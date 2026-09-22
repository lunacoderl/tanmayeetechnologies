/**
 * URL Utilities for canonicalization, parameter stripping, and high-res image resolving.
 */

const TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'ref',
  'ref_',
  'tag',
  'ascsubtag',
  'linkCode',
  'pf_rd_r',
  'pf_rd_p',
  'pf_rd_m',
  'pf_rd_s',
  'pf_rd_t',
  'pf_rd_i',
  'qid',
  'sr',
  'keywords',
  'sprefix',
  'crid',
  'dchild',
  'pd_rd_r',
  'pd_rd_w',
  'pd_rd_wg'
]);

export function cleanCanonicalUrl(rawUrl, baseUrl = '') {
  if (!rawUrl) return null;
  try {
    const urlObj = new URL(rawUrl, baseUrl);
    const searchParams = new URLSearchParams(urlObj.search);

    for (const param of Array.from(searchParams.keys())) {
      if (TRACKING_PARAMS.has(param.toLowerCase()) || param.toLowerCase().startsWith('utm_')) {
        searchParams.delete(param);
      }
    }

    urlObj.search = searchParams.toString();
    urlObj.hash = '';
    return urlObj.toString();
  } catch {
    return rawUrl;
  }
}

export function deduplicateUrls(urls = []) {
  if (!Array.isArray(urls)) return [];
  const seen = new Set();
  const cleaned = [];

  for (const u of urls) {
    if (!u || typeof u !== 'string') continue;
    const trimmed = u.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) continue;

    // Normalize image URLs (e.g., expand common Amazon thumbnail variants)
    const normalized = expandHighResImage(trimmed);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      cleaned.push(normalized);
    }
  }

  return cleaned;
}

/**
 * Strips known thumbnail dimension modifiers from Amazon, Flipkart, etc. to get original asset.
 */
export function expandHighResImage(imageUrl) {
  if (!imageUrl) return imageUrl;
  
  // Amazon: replace ._SX300_ or ._AC_US40_ with ._UL1500_ or remove modifier
  if (imageUrl.includes('images-amazon.com') || imageUrl.includes('media-amazon.com')) {
    return imageUrl.replace(/\._[A-Z0-9_,]+_\./i, '.');
  }

  // Flipkart: replace /image/128/128/ with /image/832/832/
  if (imageUrl.includes('rukminim1.flixcart.com') || imageUrl.includes('rukminim2.flixcart.com')) {
    return imageUrl.replace(/\/image\/\d+\/\d+\//, '/image/1080/1080/');
  }

  return imageUrl;
}
