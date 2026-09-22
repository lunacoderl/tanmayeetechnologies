/**
 * Sequential Batch Runner for Apify Free Tier.
 * Uses only the authenticated user's own Apify account token (APIFY_TOKEN).
 * Executes batches sequentially to stay strictly within compute and 4GB RAM limits.
 */

import { ApifyClient } from 'apify-client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sliceCatalog } from '../src/catalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load APIFY_TOKEN from environment or local .env
let token = process.env.APIFY_TOKEN;
if (!token) {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/APIFY_TOKEN=([^\r\n]+)/);
    if (match) token = match[1].trim();
  }
}

if (!token) {
  console.error('Error: APIFY_TOKEN is required in environment or actors/product-catalog-actor/.env');
  process.exit(1);
}

const client = new ApifyClient({ token });

const BATCH_SIZE = 20; // 20 products per batch
const ACTOR_ID = process.env.APIFY_ACTOR_ID || 'IQiZE0gndS4uaVfUp'; // 'tanmayee-catalog-actor' on user Apify account

async function runSequentialBatches() {
  console.log('════════════════════════════════════════════════════════════════');
  console.log(' Tanmayee Technologies — Sequential Catalog Batch Orchestrator');
  console.log(` Target Actor ID: ${ACTOR_ID}`);
  console.log(` Batch Size: ${BATCH_SIZE}`);
  console.log(' Mode: Standard Sequential Execution (Single Account)');
  console.log('════════════════════════════════════════════════════════════════\n');

  // Compute total dynamic batches
  const initialInfo = sliceCatalog({ batchSize: BATCH_SIZE });
  const totalBatches = initialInfo.totalBatches;

  console.log(`Total catalog items: ${initialInfo.totalCatalogProducts}`);
  console.log(`Total sequential batches to run: ${totalBatches} (Batches 0 to ${totalBatches - 1})\n`);

  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const batchInfo = sliceCatalog({ batchIndex, batchSize: BATCH_SIZE });
    console.log(`----------------------------------------------------------------`);
    console.log(`▶ Starting Batch ${batchIndex + 1}/${totalBatches}`);
    console.log(`  Items in batch: ${batchInfo.items.length} (Catalog indices ${batchInfo.startCatalogIndex} - ${batchInfo.endCatalogIndex})`);

    const runInput = {
      batchSize: BATCH_SIZE,
      batchIndex: batchIndex,
      brandFilter: 'all',
      maxConcurrency: 2,
      maxRequestsPerMinutePerDomain: 6,
      useAiExtraction: false,
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

    try {
      console.log(`  Calling Apify actor run on user account...`);
      const run = await client.actor(ACTOR_ID).call(runInput, {
        waitSecs: 300 // wait for run to complete
      });

      console.log(`  ✔ Batch ${batchIndex + 1} completed! Status: ${run.status}, Run ID: ${run.id}`);
      console.log(`  Dataset ID: ${run.defaultDatasetId}`);
    } catch (err) {
      console.error(`  ✖ Batch ${batchIndex + 1} encountered an error:`, err.message);
      console.log('  Pausing 10 seconds before continuing to next batch...');
      await new Promise(r => setTimeout(r, 10000));
    }
  }

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log(' All sequential batches completed.');
  console.log('════════════════════════════════════════════════════════════════');
}

runSequentialBatches().catch(console.error);
