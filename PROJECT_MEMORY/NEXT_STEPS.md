# Next Steps: Product Catalog & Platform Delivery

Priority-ordered execution roadmap:

1. **Deploy to Apify Cloud**:
   - Push updated actor files (including `src/catalog-resolver.js`) via `deploy-to-apify.mjs`.
   - Ensure Apify build status returns `SUCCEEDED`.

2. **Run Catalog Extraction**:
   - Execute Apify run on cloud actor or run actor locally with Node/Apify SDK to populate dataset with all 155 comprehensive product records.
   - Verify Apify dataset has 155 records with authentic image URLs.

3. **Ingest to Platform Database**:
   - Run `node scripts/import-extracted-catalog.js` to format and store the 155 products into `packages/database/src/extracted-catalog.json`.
   - Ensure zero Unsplash URLs and zero duplicate keys.

4. **Verify Storefront and Admin Portals**:
   - Check `http://localhost:3000/products` for high-resolution equipment photos and specs.
   - Check `http://localhost:3001/products` for admin equipment management.
   - Confirm browser console has zero 404s and zero duplicate key warnings.
