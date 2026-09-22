/**
 * Deterministic Candidate Matching Engine.
 * Evaluates candidate page evidence against requested catalog specifications.
 */

import {
  normalizeModel,
  normalizeCapacity,
  normalizeStarRating,
  normalizeSeries
} from './normalizers.js';

export const MatchStatus = {
  EXACT_MATCH: 'exact_match',
  PROBABLE_MATCH: 'probable_match',
  AMBIGUOUS: 'ambiguous',
  MISMATCH: 'mismatch',
  NOT_FOUND: 'not_found',
  BLOCKED: 'blocked',
  SKIPPED: 'skipped',
  EXTRACTION_FAILED: 'extraction_failed'
};

/**
 * Evaluates whether extracted candidate page evidence matches the requested catalog product.
 *
 * @param {Object} candidateData - Candidate extracted data (title, model, sku, specs, etc.)
 * @param {Object} requestedProduct - The product from the catalog
 * @returns {Object} Match evaluation result
 */
export function evaluateProductMatch(candidateData = {}, requestedProduct = {}) {
  const isRockwell = (requestedProduct.brand || '').toLowerCase() === 'rockwell';

  if (isRockwell) {
    return evaluateRockwellMatch(candidateData, requestedProduct);
  } else {
    return evaluateBluestarMatch(candidateData, requestedProduct);
  }
}

/**
 * Rockwell Match Evaluation:
 * - Exact model match required for `exact_match`
 * - Model mismatch is an absolute rejection (`mismatch`)
 * - If model missing on page, can at most be `probable_match` if category and capacity match
 */
function evaluateRockwellMatch(candidate, requested) {
  const requestedModel = normalizeModel(requested.model);
  const requestedCapacity = normalizeCapacity(requested.capacity);
  const matchReasons = [];

  const candidateTitle = (candidate.title || '').toUpperCase();
  const candidateModel = normalizeModel(candidate.model || candidate.sku || '');
  const candidateText = [
    candidateTitle,
    candidateModel,
    JSON.stringify(candidate.specifications || {}).toUpperCase(),
    (candidate.description || '').toUpperCase()
  ].join(' ');

  const candidateAttrs = {
    title: candidate.title || null,
    extracted_model: candidate.model || null,
    extracted_sku: candidate.sku || null,
    specifications: candidate.specifications || {}
  };

  const requestedAttrs = {
    model: requested.model,
    category: requested.category,
    capacity: requested.capacity
  };

  // 1. Check for Model Conflict (e.g. page explicitly mentions a DIFFERENT model)
  if (candidateModel && candidateModel !== requestedModel) {
    // If the candidate model is clearly another model (e.g. GFR350D5UC4S vs GFR350D5UC5S)
    return {
      match_status: MatchStatus.MISMATCH,
      match_confidence: 0.0,
      match_reasons: [`Model mismatch: requested ${requestedModel}, but page explicitly specified ${candidateModel}`],
      matched_model: candidateModel,
      matched_sku: candidate.sku || null,
      candidate_attributes: candidateAttrs,
      requested_attributes: requestedAttrs
    };
  }

  // 2. Check for Exact Model Occurrence
  const hasExactModelInText = requestedModel && (
    candidateModel === requestedModel ||
    candidateText.includes(requestedModel) ||
    candidateTitle.includes(requestedModel)
  );

  // Check capacity match
  const candidateCap = normalizeCapacity(
    candidate.specifications?.Capacity ||
    candidate.specifications?.['Gross Capacity'] ||
    candidate.specifications?.['Net Capacity'] ||
    candidateTitle
  );

  const capacityMatches = requestedCapacity.numeric && candidateCap.numeric
    ? requestedCapacity.numeric === candidateCap.numeric
    : (requestedCapacity.standard && candidateText.includes(requestedCapacity.standard.toUpperCase()));

  if (hasExactModelInText) {
    matchReasons.push(`Exact normalized model ${requestedModel} verified in listing`);
    if (capacityMatches) {
      matchReasons.push(`Capacity verified: ${requested.capacity}`);
    }
    return {
      match_status: MatchStatus.EXACT_MATCH,
      match_confidence: capacityMatches ? 0.99 : 0.95,
      match_reasons: matchReasons,
      matched_model: requested.model,
      matched_sku: candidate.sku || null,
      candidate_attributes: candidateAttrs,
      requested_attributes: requestedAttrs
    };
  }

  // If candidate explicitly mentions a competing model code in title
  // e.g. title has "GFR350D5UC4S" when requested is "GFR350D5UC5S"
  const modelPattern = /\b[A-Z0-9]{3,}[0-9/A-Z-]+\b/g;
  const titleTokens = candidateTitle.match(modelPattern) || [];
  for (const token of titleTokens) {
    const normToken = normalizeModel(token);
    if (normToken !== requestedModel && normToken.startsWith(requestedModel.substring(0, 4))) {
      return {
        match_status: MatchStatus.MISMATCH,
        match_confidence: 0.0,
        match_reasons: [`Near-match model rejection: listing title contains sibling model ${normToken} instead of ${requestedModel}`],
        matched_model: normToken,
        matched_sku: null,
        candidate_attributes: candidateAttrs,
        requested_attributes: requestedAttrs
      };
    }
  }

  // 3. No exact model found
  if (capacityMatches) {
    return {
      match_status: MatchStatus.PROBABLE_MATCH,
      match_confidence: 0.65,
      match_reasons: [`Model ${requestedModel} not explicitly found, but capacity matches ${requested.capacity}`],
      matched_model: null,
      matched_sku: null,
      candidate_attributes: candidateAttrs,
      requested_attributes: requestedAttrs
    };
  }

  return {
    match_status: MatchStatus.MISMATCH,
    match_confidence: 0.1,
    match_reasons: [`No match found for Rockwell model ${requestedModel}`],
    matched_model: null,
    matched_sku: null,
    candidate_attributes: candidateAttrs,
    requested_attributes: requestedAttrs
  };
}

/**
 * Blue Star Match Evaluation:
 * - Multi-attribute scoring: category, star rating, capacity, series
 * - Category mismatch -> hard rejection
 * - Capacity mismatch -> hard rejection
 * - Star rating mismatch -> hard rejection
 * - Missing SKU -> configuration match (probable_match), NEVER exact_match unless verified SKU
 */
function evaluateBluestarMatch(candidate, requested) {
  const matchReasons = [];
  const candidateTitle = (candidate.title || '').toUpperCase();
  const candidateText = [
    candidateTitle,
    candidate.model || '',
    candidate.sku || '',
    JSON.stringify(candidate.specifications || {}).toUpperCase(),
    (candidate.description || '').toUpperCase()
  ].join(' ');

  const candidateAttrs = {
    title: candidate.title || null,
    extracted_model: candidate.model || null,
    extracted_sku: candidate.sku || null,
    specifications: candidate.specifications || {}
  };

  const requestedAttrs = {
    category: requested.category,
    series: requested.series,
    star_rating: requested.star_rating,
    capacity: requested.capacity
  };

  // 1. Category Check
  const reqCatLower = (requested.category || '').toLowerCase();
  const isAC = reqCatLower.includes('ac') || reqCatLower.includes('air conditioner');
  const isCassette = reqCatLower.includes('cassette');
  const isWindow = reqCatLower.includes('window');
  const isVerticool = reqCatLower.includes('verticool');
  const isSplit = reqCatLower.includes('split');

  if (isAC) {
    // Verify it is indeed an AC listing
    if (!candidateText.includes('AC') && !candidateText.includes('AIR CONDITIONER')) {
      return {
        match_status: MatchStatus.MISMATCH,
        match_confidence: 0.0,
        match_reasons: ['Listing is not an Air Conditioner'],
        matched_model: null,
        matched_sku: null,
        candidate_attributes: candidateAttrs,
        requested_attributes: requestedAttrs
      };
    }

    if (isCassette && !candidateText.includes('CASSETTE')) {
      return {
        match_status: MatchStatus.MISMATCH,
        match_confidence: 0.0,
        match_reasons: ['Category mismatch: Cassette AC requested but listing is not Cassette'],
        matched_model: null,
        matched_sku: null,
        candidate_attributes: candidateAttrs,
        requested_attributes: requestedAttrs
      };
    }

    if (isWindow && !candidateText.includes('WINDOW')) {
      return {
        match_status: MatchStatus.MISMATCH,
        match_confidence: 0.0,
        match_reasons: ['Category mismatch: Window AC requested but listing is not Window AC'],
        matched_model: null,
        matched_sku: null,
        candidate_attributes: candidateAttrs,
        requested_attributes: requestedAttrs
      };
    }

    if (isVerticool && !candidateText.includes('VERTICOOL')) {
      return {
        match_status: MatchStatus.MISMATCH,
        match_confidence: 0.0,
        match_reasons: ['Category mismatch: Verticool requested but listing is not Verticool'],
        matched_model: null,
        matched_sku: null,
        candidate_attributes: candidateAttrs,
        requested_attributes: requestedAttrs
      };
    }
  }

  // 2. Capacity Check (e.g. 1.5 Ton vs 1.50 TR)
  const reqCap = normalizeCapacity(requested.capacity);
  const candCap = normalizeCapacity(
    candidate.specifications?.['Tonnage'] ||
    candidate.specifications?.['Capacity in Tons'] ||
    candidate.specifications?.['Capacity'] ||
    candidateTitle
  );

  if (reqCap.numeric && candCap.numeric) {
    if (Math.abs(reqCap.numeric - candCap.numeric) > 0.05) {
      return {
        match_status: MatchStatus.MISMATCH,
        match_confidence: 0.0,
        match_reasons: [`Capacity mismatch: requested ${reqCap.standard}, listing specifies ${candCap.standard}`],
        matched_model: null,
        matched_sku: null,
        candidate_attributes: candidateAttrs,
        requested_attributes: requestedAttrs
      };
    }
    matchReasons.push(`Capacity matched: ${candCap.standard}`);
  } else {
    // Verify capacity string presence in text
    if (!candidateText.includes(reqCap.standard.toUpperCase())) {
      return {
        match_status: MatchStatus.MISMATCH,
        match_confidence: 0.1,
        match_reasons: [`Capacity ${requested.capacity} not found in listing`],
        matched_model: null,
        matched_sku: null,
        candidate_attributes: candidateAttrs,
        requested_attributes: requestedAttrs
      };
    }
    matchReasons.push(`Capacity string matched in text: ${requested.capacity}`);
  }

  // 3. Star Rating Check
  const reqStars = normalizeStarRating(requested.star_rating);
  const candStars = normalizeStarRating(
    candidate.specifications?.['Star Rating'] ||
    candidate.specifications?.['BEE Star Rating'] ||
    candidateTitle
  );

  if (reqStars.stars && candStars.stars) {
    if (reqStars.stars !== candStars.stars) {
      return {
        match_status: MatchStatus.MISMATCH,
        match_confidence: 0.0,
        match_reasons: [`Star rating mismatch: requested ${reqStars.standard}, listing is ${candStars.standard}`],
        matched_model: null,
        matched_sku: null,
        candidate_attributes: candidateAttrs,
        requested_attributes: requestedAttrs
      };
    }
    matchReasons.push(`Star rating matched: ${candStars.standard}`);
  }

  // 4. Series Check
  const reqSeries = normalizeSeries(requested.series);
  const candSeries = normalizeSeries(candidate.specifications?.Series || candidateTitle);
  const seriesMatches = reqSeries && candSeries && (
    candSeries.includes(reqSeries) || candidateTitle.includes(reqSeries)
  );

  if (seriesMatches) {
    matchReasons.push(`Series matched: ${requested.series}`);
  }

  // Compute confidence score
  let confidence = 0.5; // Base score for brand & category
  if (matchReasons.some(r => r.includes('Capacity'))) confidence += 0.2;
  if (matchReasons.some(r => r.includes('Star rating'))) confidence += 0.15;
  if (seriesMatches) confidence += 0.1;

  // Blue star rule: unless exact matching SKU/model is confirmed, classify as probable_match (configuration match)
  const isExactSku = Boolean(candidate.model && candidate.model.length > 5 && candidateText.includes(candidate.model));
  const finalStatus = isExactSku ? MatchStatus.EXACT_MATCH : MatchStatus.PROBABLE_MATCH;

  return {
    match_status: finalStatus,
    match_confidence: Math.min(confidence, isExactSku ? 0.98 : 0.88),
    match_reasons: matchReasons,
    matched_model: candidate.model || null,
    matched_sku: candidate.sku || null,
    candidate_attributes: candidateAttrs,
    requested_attributes: requestedAttrs
  };
}
