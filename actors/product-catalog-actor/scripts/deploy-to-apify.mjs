import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApifyClient } from 'apify-client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const actorDir = path.resolve(__dirname, '..');

const client = new ApifyClient({ token: 'apify_api_tgFtatLhNumYqAvzMCIa1uK5bUFhL13EjzlT' });
const ACTOR_ID = 'IQiZE0gndS4uaVfUp'; // 'tanmayee-catalog-actor'

const filesToUpload = [
  'package.json',
  'package-lock.json',
  'Dockerfile',
  'actor.json',
  'INPUT_SCHEMA.json',
  'README.md',
  'src/main.js',
  'src/config.js',
  'src/catalog.js',
  'src/catalog-resolver.js',
  'src/query-builder.js',
  'src/platforms/index.js',
  'src/platforms/rockwell.js',
  'src/platforms/bluestar.js',
  'src/platforms/amazon.js',
  'src/platforms/flipkart.js',
  'src/platforms/croma.js',
  'src/platforms/reliance-digital.js',
  'src/platforms/google-shopping.js',
  'src/extraction/ai.js',
  'src/extraction/normalizers.js',
  'src/extraction/product-match.js',
  'src/utils/rate-limiter.js',
  'src/utils/retry.js',
  'src/utils/logging.js',
  'src/utils/urls.js'
];

async function deploy() {
  console.log('Packaging actor source files for Apify Cloud...');
  const sourceFiles = [];

  for (const relPath of filesToUpload) {
    const fullPath = path.join(actorDir, relPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      sourceFiles.push({
        name: relPath.replace(/\\/g, '/'),
        format: 'TEXT',
        content
      });
      console.log(`  Added: ${relPath}`);
    } else {
      console.warn(`  Missing file: ${relPath}`);
    }
  }

  console.log(`\nUploading ${sourceFiles.length} files to Apify Cloud Actor ${ACTOR_ID}...`);
  const actor = client.actor(ACTOR_ID);
  await actor.version('0.0').update({
    sourceType: 'SOURCE_FILES',
    sourceFiles
  });

  console.log('✔ Source files uploaded to Apify Cloud!');
  console.log('Initiating actor build on Apify Cloud...');
  const build = await actor.build('0.0');
  console.log(`✔ Build started! Build ID: ${build.id}, Status: ${build.status}`);
}

deploy().catch(err => {
  console.error('Deploy failed:', err);
  process.exit(1);
});
