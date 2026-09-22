/**
 * Structured logger for Apify Actor execution.
 * Emits JSON logs adhering to the 10 core event types.
 */

export const LogEvents = {
  PRODUCT_DISCOVERY_STARTED: 'product_discovery_started',
  CANDIDATE_DISCOVERED: 'candidate_discovered',
  CANDIDATE_REJECTED: 'candidate_rejected',
  CANDIDATE_SELECTED: 'candidate_selected',
  PRODUCT_DETAIL_STARTED: 'product_detail_started',
  PRODUCT_EXTRACTED: 'product_extracted',
  PRODUCT_NOT_FOUND: 'product_not_found',
  PLATFORM_BLOCKED: 'platform_blocked',
  AI_EXTRACTION_FAILED: 'ai_extraction_failed',
  RECORD_SAVED: 'record_saved'
};

export class StructuredLogger {
  constructor(context = {}) {
    this.context = context;
  }

  log(event, data = {}) {
    const timestamp = new Date().toISOString();
    const payload = {
      timestamp,
      event,
      ...this.context,
      ...data
    };

    // Sanitize any accidental sensitive fields
    if (payload.apiKey) payload.apiKey = '***';
    if (payload.token) payload.token = '***';
    if (payload.html && typeof payload.html === 'string' && payload.html.length > 500) {
      payload.html = `${payload.html.substring(0, 500)}...[truncated]`;
    }

    const jsonStr = JSON.stringify(payload);
    console.log(jsonStr);
    return payload;
  }

  discoveryStarted(product, platform, query) {
    return this.log(LogEvents.PRODUCT_DISCOVERY_STARTED, {
      product_id: product.product_id,
      brand: product.brand,
      model: product.model || product.series,
      platform,
      query
    });
  }

  candidateDiscovered(product, platform, candidate) {
    return this.log(LogEvents.CANDIDATE_DISCOVERED, {
      product_id: product.product_id,
      platform,
      title: candidate.title,
      url: candidate.url,
      candidate_score: candidate.score
    });
  }

  candidateRejected(product, platform, candidate, reason) {
    return this.log(LogEvents.CANDIDATE_REJECTED, {
      product_id: product.product_id,
      platform,
      title: candidate.title,
      reason
    });
  }

  candidateSelected(product, platform, candidate) {
    return this.log(LogEvents.CANDIDATE_SELECTED, {
      product_id: product.product_id,
      platform,
      selected_url: candidate.url,
      title: candidate.title
    });
  }

  detailStarted(product, platform, url) {
    return this.log(LogEvents.PRODUCT_DETAIL_STARTED, {
      product_id: product.product_id,
      platform,
      url
    });
  }

  productExtracted(product, platform, matchResult) {
    return this.log(LogEvents.PRODUCT_EXTRACTED, {
      product_id: product.product_id,
      platform,
      match_status: matchResult.match_status,
      match_confidence: matchResult.match_confidence
    });
  }

  productNotFound(product, platform, reason) {
    return this.log(LogEvents.PRODUCT_NOT_FOUND, {
      product_id: product.product_id,
      platform,
      reason
    });
  }

  platformBlocked(product, platform, reason) {
    return this.log(LogEvents.PLATFORM_BLOCKED, {
      product_id: product?.product_id,
      platform,
      reason
    });
  }

  aiExtractionFailed(product, platform, errorMsg) {
    return this.log(LogEvents.AI_EXTRACTION_FAILED, {
      product_id: product?.product_id,
      platform,
      error: errorMsg
    });
  }

  recordSaved(product, platform, status, matchStatus) {
    return this.log(LogEvents.RECORD_SAVED, {
      product_id: product.product_id,
      platform,
      status,
      match_status: matchStatus
    });
  }
}
