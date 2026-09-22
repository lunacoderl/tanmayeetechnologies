import test from 'node:test';
import assert from 'node:assert/strict';
import { getCanonicalCatalog, sliceCatalog, ROCKWELL_CATALOG, BLUESTAR_CATALOG } from '../src/catalog.js';

test('Catalog integrity and count verification', () => {
  assert.equal(ROCKWELL_CATALOG.length, 97, 'Rockwell catalog must contain exactly 97 entries');
  assert.equal(BLUESTAR_CATALOG.length, 58, 'Blue Star catalog must contain exactly 58 entries');

  const fullCatalog = getCanonicalCatalog();
  assert.equal(fullCatalog.length, 155, 'Canonical catalog must contain exactly 155 entries');

  // Verify unique product_id and catalog_index
  const productIds = new Set();
  const catalogIndices = new Set();

  for (let i = 0; i < fullCatalog.length; i++) {
    const item = fullCatalog[i];
    assert.ok(item.product_id, `Item ${i} must have product_id`);
    assert.ok(!productIds.has(item.product_id), `Duplicate product_id found: ${item.product_id}`);
    productIds.add(item.product_id);

    assert.equal(item.catalog_index, i + 1, `catalog_index must be consecutive 1-based (expected ${i + 1})`);
    catalogIndices.add(item.catalog_index);
  }

  assert.equal(productIds.size, 155, 'All 155 product_ids must be unique');
  assert.equal(catalogIndices.size, 155, 'All 155 catalog_indices must be unique');

  // Verify Rockwell preserve special punctuation
  const item7 = fullCatalog[6]; // Row 7 GFR1210F/C
  assert.equal(item7.model, 'GFR1210F/C');
  assert.equal(item7.capacity, '998 L');
  assert.equal(item7.brand_source_row, 7);

  const item13 = fullCatalog[12]; // Row 13 GFR450D/C5 EUTECTIC
  assert.equal(item13.model, 'GFR450D/C5 EUTECTIC');
  assert.equal(item13.capacity, '415 L');

  const item16 = fullCatalog[15]; // Row 16 FOW5504D2D
  assert.equal(item16.model, 'FOW5504D2D');

  // Verify Bluestar entries
  const bs1 = fullCatalog[97]; // Row 1 Bluestar (catalog index 98)
  assert.equal(bs1.brand, 'Bluestar');
  assert.equal(bs1.brand_source_row, 1);
  assert.equal(bs1.catalog_index, 98);
  assert.equal(bs1.series, 'G Series');
  assert.equal(bs1.star_rating, '5 Star');
  assert.equal(bs1.capacity, '1 Ton');

  const bs4 = fullCatalog[100]; // Row 4 Bluestar 2+ Ton
  assert.equal(bs4.capacity, '2+ Ton');
});

test('Dynamic catalog slicing logic', () => {
  // Batch size 20 over 155 items -> 8 batches
  const batch0 = sliceCatalog({ batchIndex: 0, batchSize: 20 });
  assert.equal(batch0.items.length, 20);
  assert.equal(batch0.totalBatches, 8);
  assert.equal(batch0.items[0].catalog_index, 1);
  assert.equal(batch0.items[19].catalog_index, 20);

  const batch7 = sliceCatalog({ batchIndex: 7, batchSize: 20 });
  assert.equal(batch7.items.length, 15); // 155 - 140 = 15
  assert.equal(batch7.items[0].catalog_index, 141);
  assert.equal(batch7.items[14].catalog_index, 155);

  // Pilot batch: batchSize 5 -> 31 batches
  const pilot = sliceCatalog({ batchIndex: 0, batchSize: 5 });
  assert.equal(pilot.items.length, 5);
  assert.equal(pilot.totalBatches, 31);
  assert.equal(pilot.items[0].catalog_index, 1);
  assert.equal(pilot.items[4].catalog_index, 5);

  // Brand filter: Rockwell only -> 97 items
  const rockwellOnly = sliceCatalog({ brandFilter: 'Rockwell', batchSize: 97 });
  assert.equal(rockwellOnly.filteredTotal, 97);
  assert.equal(rockwellOnly.items.length, 97);

  // Brand filter: Bluestar only -> 58 items
  const bluestarOnly = sliceCatalog({ brandFilter: 'Bluestar', batchSize: 58 });
  assert.equal(bluestarOnly.filteredTotal, 58);
  assert.equal(bluestarOnly.items.length, 58);
});
