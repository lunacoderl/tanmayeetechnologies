/**
 * Per-domain token bucket rate limiter.
 * Guarantees that requests to the same domain are spaced out according to
 * maxRequestsPerMinutePerDomain, preventing rate limit blocks and 429 errors.
 */

export class DomainRateLimiter {
  constructor(maxRequestsPerMinute = 6) {
    this.maxRpm = Math.max(1, maxRequestsPerMinute);
    this.minIntervalMs = Math.ceil(60000 / this.maxRpm);
    this.domainLastRequestTime = new Map();
    this.domainQueues = new Map();
  }

  /**
   * Acquire permission to execute a request on a specific domain.
   * Resolves only when sufficient time has elapsed.
   *
   * @param {string} domainOrUrl
   * @returns {Promise<number>} time waited in ms
   */
  async throttle(domainOrUrl) {
    const domain = this.extractDomain(domainOrUrl);

    // Chain requests for the same domain sequentially
    const currentQueue = this.domainQueues.get(domain) || Promise.resolve();
    
    let resolveQueue;
    const nextQueue = new Promise((res) => { resolveQueue = res; });
    this.domainQueues.set(domain, nextQueue);

    await currentQueue;

    const now = Date.now();
    const lastTime = this.domainLastRequestTime.get(domain) || 0;
    const timeSinceLast = now - lastTime;
    let waitTime = 0;

    if (timeSinceLast < this.minIntervalMs) {
      waitTime = this.minIntervalMs - timeSinceLast;
      // Add minor jitter (+/- 10%) to look natural and avoid lockstep requests
      const jitter = Math.floor(Math.random() * (this.minIntervalMs * 0.1));
      waitTime += jitter;
      await new Promise(r => setTimeout(r, waitTime));
    }

    this.domainLastRequestTime.set(domain, Date.now());
    resolveQueue();

    return waitTime;
  }

  extractDomain(domainOrUrl) {
    try {
      if (domainOrUrl.startsWith('http://') || domainOrUrl.startsWith('https://')) {
        const u = new URL(domainOrUrl);
        return u.hostname.replace(/^www\./, '').toLowerCase();
      }
      return domainOrUrl.replace(/^www\./, '').toLowerCase();
    } catch {
      return domainOrUrl.toLowerCase();
    }
  }
}
