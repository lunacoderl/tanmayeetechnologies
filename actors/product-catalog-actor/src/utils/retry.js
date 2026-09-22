/**
 * Robust retry utility with exponential backoff and jitter.
 */

export async function withRetry(fn, options = {}) {
  const {
    maxRetries = 2,
    baseDelayMs = 1000,
    maxDelayMs = 10000,
    factor = 2,
    shouldRetry = isRetryableError,
    onRetry = () => {}
  } = options;

  let attempt = 0;

  while (true) {
    try {
      return await fn(attempt);
    } catch (error) {
      attempt++;
      if (attempt > maxRetries || !shouldRetry(error)) {
        throw error;
      }

      const rawDelay = baseDelayMs * Math.pow(factor, attempt - 1);
      const jitter = Math.random() * 0.3 * rawDelay;
      const delay = Math.min(rawDelay + jitter, maxDelayMs);

      onRetry(error, attempt, delay);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

export function isRetryableError(error) {
  if (!error) return false;
  const msg = String(error.message || error).toLowerCase();

  // Retryable transient network / timeout issues
  if (
    msg.includes('etimedout') ||
    msg.includes('econnreset') ||
    msg.includes('econnrefused') ||
    msg.includes('timeout') ||
    msg.includes('socket hang up') ||
    msg.includes('rate limit') ||
    msg.includes('429') ||
    msg.includes('502') ||
    msg.includes('503') ||
    msg.includes('504')
  ) {
    return true;
  }

  // Non-retryable
  if (
    msg.includes('404') ||
    msg.includes('401') ||
    msg.includes('403') ||
    msg.includes('disallowed by robots') ||
    msg.includes('invalid url')
  ) {
    return false;
  }

  return true;
}
