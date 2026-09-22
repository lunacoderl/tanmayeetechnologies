/**
 * Platform Adapter Registry & Factory
 */

import { RockwellPlatformAdapter } from './rockwell.js';
import { BluestarPlatformAdapter } from './bluestar.js';
import { AmazonPlatformAdapter } from './amazon.js';
import { FlipkartPlatformAdapter } from './flipkart.js';
import { CromaPlatformAdapter } from './croma.js';
import { RelianceDigitalPlatformAdapter } from './reliance-digital.js';
import { GoogleShoppingPlatformAdapter } from './google-shopping.js';

export function createPlatformAdapters(platformToggles = {}) {
  const adapters = {
    rockwellOfficial: new RockwellPlatformAdapter({ enabled: platformToggles.rockwellOfficial ?? true }),
    bluestarOfficial: new BluestarPlatformAdapter({ enabled: platformToggles.bluestarOfficial ?? true }),
    amazon: new AmazonPlatformAdapter({ enabled: platformToggles.amazon ?? false }),
    flipkart: new FlipkartPlatformAdapter({ enabled: platformToggles.flipkart ?? false }),
    croma: new CromaPlatformAdapter({ enabled: platformToggles.croma ?? false }),
    relianceDigital: new RelianceDigitalPlatformAdapter({ enabled: platformToggles.relianceDigital ?? false }),
    googleShopping: new GoogleShoppingPlatformAdapter({ enabled: platformToggles.googleShopping ?? false })
  };

  return adapters;
}

/**
 * Returns the relevant enabled adapters for a given product.
 * Avoids searching Blue Star official store for a Rockwell freezer, and vice-versa.
 */
export function getActivePlatformsForProduct(adapters, product, platformToggles = {}) {
  const brand = (product.brand || '').toLowerCase();
  const active = [];

  for (const [key, adapter] of Object.entries(adapters)) {
    const isToggledOn = platformToggles[key] ?? adapter.enabled;
    if (!isToggledOn) continue;

    // Brand-official exclusivity rule:
    if (key === 'rockwellOfficial' && brand !== 'rockwell') continue;
    if (key === 'bluestarOfficial' && brand !== 'bluestar') continue;

    active.push(adapter);
  }

  return active;
}
