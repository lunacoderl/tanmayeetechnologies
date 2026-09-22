/**
 * Global Actor Configuration & Domain Rules
 */

export const DEFAULT_CONFIG = {
  batchSize: 5,
  batchIndex: 0,
  brandFilter: 'all',
  maxConcurrency: 2,
  maxRequestsPerMinutePerDomain: 6,
  maxCandidatesPerPlatform: 3,
  pageTimeoutSecs: 45,
  maxRetries: 2,
  useAiExtraction: false,
  aiProvider: 'openai',
  aiModel: 'gpt-4o-mini',
  minimumConfidenceToSaveAsMatch: 0.8,
  saveRawEvidence: false,
  dryRun: false,
  platforms: {
    rockwellOfficial: true,
    bluestarOfficial: true,
    amazon: false,
    flipkart: false,
    croma: false,
    relianceDigital: false,
    googleShopping: false
  }
};

export const DOMAIN_METADATA = {
  rockwellOfficial: {
    name: 'Rockwell Official Store',
    domain: 'rockwell.co.in',
    baseUrl: 'https://www.rockwell.co.in',
    isOfficial: true,
    brand: 'Rockwell'
  },
  bluestarOfficial: {
    name: 'Blue Star Official Consumer',
    domain: 'bluestarindia.com',
    baseUrl: 'https://www.bluestarindia.com',
    isOfficial: true,
    brand: 'Bluestar'
  },
  amazon: {
    name: 'Amazon India',
    domain: 'amazon.in',
    baseUrl: 'https://www.amazon.in',
    isOfficial: false
  },
  flipkart: {
    name: 'Flipkart',
    domain: 'flipkart.com',
    baseUrl: 'https://www.flipkart.com',
    isOfficial: false
  },
  croma: {
    name: 'Croma',
    domain: 'croma.com',
    baseUrl: 'https://www.croma.com',
    isOfficial: false
  },
  relianceDigital: {
    name: 'Reliance Digital',
    domain: 'reliancedigital.in',
    baseUrl: 'https://www.reliancedigital.in',
    isOfficial: false
  },
  googleShopping: {
    name: 'Google Shopping (Fallback)',
    domain: 'google.com',
    baseUrl: 'https://www.google.com/shopping',
    isOfficial: false
  }
};

export const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
];
