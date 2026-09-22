/**
 * Normalization utilities for capacities, star ratings, models, prices, and specifications.
 */

/**
 * Normalizes model strings:
 * - Converts en-dash / em-dash to standard hyphen
 * - Collapses repeated whitespace
 * - Preserves crucial punctuation: '/', '+', hyphens
 * - Uppercase for uniform comparison
 */
export function normalizeModel(model) {
  if (!model) return '';
  return String(model)
    .trim()
    .replace(/[\u2010\u2013\u2014]/g, '-') // Unicode dashes
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

/**
 * Normalizes capacity into structured metric (tonnage or liters)
 */
export function normalizeCapacity(capacityStr) {
  if (!capacityStr) return { raw: '', numeric: null, unit: null, standard: '' };
  const raw = String(capacityStr).trim();
  const lower = raw.toLowerCase().replace(/[\u2010\u2013\u2014]/g, '-');

  // Handle Dual capacity e.g. "169 / 201 L"
  if (lower.includes('/')) {
    const parts = lower.split('/').map(p => p.trim());
    return {
      raw,
      numeric: null,
      unit: 'dual',
      standard: raw
    };
  }

  // Handle Tonnage / TR: "1.5 Ton", "1.50 TR", "1.5TR", "2+ Ton"
  const tonMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:ton|tr|tons|t\b)/i);
  if (tonMatch) {
    const val = parseFloat(tonMatch[1]);
    const isPlus = lower.includes('+');
    const std = isPlus ? `${val}+ Ton` : `${val} Ton`;
    return {
      raw,
      numeric: val,
      unit: 'ton',
      standard: std,
      isPlus
    };
  }

  // Handle Liters: "194 L", "194 Litres", "194ltr", "194l"
  const literMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:l|ltr|litre|litres|liter|liters)\b/i);
  if (literMatch) {
    const val = parseFloat(literMatch[1]);
    return {
      raw,
      numeric: val,
      unit: 'liter',
      standard: `${val} L`
    };
  }

  return {
    raw,
    numeric: null,
    unit: 'other',
    standard: raw
  };
}

/**
 * Normalizes star ratings (1 to 5)
 */
export function normalizeStarRating(ratingStr) {
  if (!ratingStr) return { raw: '', stars: null, standard: null };
  const raw = String(ratingStr).trim();
  const match = raw.match(/([1-5])\s*(?:star|\*|stars)/i);

  if (match) {
    const stars = parseInt(match[1], 10);
    return {
      raw,
      stars,
      standard: `${stars} Star`
    };
  }

  return { raw, stars: null, standard: null };
}

/**
 * Normalizes series names e.g. "G Series", "G-Series", "Series G" -> "G Series"
 */
export function normalizeSeries(seriesStr) {
  if (!seriesStr) return '';
  const clean = String(seriesStr).trim().toUpperCase();
  const match = clean.match(/([A-Z0-9]+)\s*(?:SERIES|-SERIES)/i) || clean.match(/SERIES\s*([A-Z0-9]+)/i);
  if (match) {
    return `${match[1]} SERIES`;
  }
  return clean;
}

/**
 * Parses Indian Rupee prices (₹, Rs., commas)
 */
export function parsePrice(priceVal) {
  if (priceVal == null) return { currency: 'INR', amount: 0, display: '₹0', available: false };
  
  if (typeof priceVal === 'number') {
    return {
      currency: 'INR',
      amount: priceVal,
      display: `₹${priceVal.toLocaleString('en-IN')}`,
      available: priceVal > 0
    };
  }

  const str = String(priceVal).trim();
  // Remove currency signs, commas, and whitespace
  const cleanNumStr = str.replace(/[₹Rs.\s,]/gi, '').match(/\d+(?:\.\d+)?/);

  if (!cleanNumStr) {
    return { currency: 'INR', amount: 0, display: str || '₹0', available: false };
  }

  const amount = Math.round(parseFloat(cleanNumStr[0]));
  return {
    currency: 'INR',
    amount,
    display: `₹${amount.toLocaleString('en-IN')}`,
    available: amount > 0
  };
}
