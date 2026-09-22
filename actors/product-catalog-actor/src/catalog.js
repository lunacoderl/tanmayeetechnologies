/**
 * Canonical Rockwell & Blue Star Catalog
 * 155 Items: 97 Rockwell + 58 Blue Star
 * 
 * Preserves exact model strings, punctuation, slashes, plus signs, and capacity notations.
 * Provides unique product_id, catalog_index, and brand_source_row.
 */

export const ROCKWELL_CATALOG = [
  { brandSourceRow: 1, model: 'GFR250D5UC4S', category: 'Convertible Green Freezer', capacity: '194 L' },
  { brandSourceRow: 2, model: 'GFR350D5UC5S', category: 'Convertible Green Freezer', capacity: '294 L' },
  { brandSourceRow: 3, model: 'GFR350D5UC4S', category: 'Convertible Green Freezer', capacity: '294 L' },
  { brandSourceRow: 4, model: 'GFR450D5UC5S', category: 'Convertible Green Freezer', capacity: '390 L' },
  { brandSourceRow: 5, model: 'GFR550D5UC5S', category: 'Convertible Green Freezer', capacity: '491 L' },
  { brandSourceRow: 6, model: 'GFR910IC', category: 'Convertible Green Freezer', capacity: '750 L' },
  { brandSourceRow: 7, model: 'GFR1210F/C', category: 'Convertible Green Freezer', capacity: '998 L' },
  { brandSourceRow: 8, model: 'GFR1510F', category: 'Convertible Green Freezer', capacity: '1295 L' },
  { brandSourceRow: 9, model: 'GFR250FDT', category: 'Large Freezer', capacity: '194 L' },
  { brandSourceRow: 10, model: 'GFR350FDT', category: 'Large Freezer', capacity: '294 L' },
  { brandSourceRow: 11, model: 'GFR450FDT', category: 'Large Freezer', capacity: '390 L' },
  { brandSourceRow: 12, model: 'GFR550FDT', category: 'Large Freezer', capacity: '491 L' },
  { brandSourceRow: 13, model: 'GFR450D/C5 EUTECTIC', category: 'Eutectic Freezer', capacity: '415 L' },
  { brandSourceRow: 14, model: 'FOW200', category: 'Eutectic Freezer', capacity: '197 L' },
  { brandSourceRow: 15, model: 'FOW450', category: 'Eutectic Freezer', capacity: '390 L' },
  { brandSourceRow: 16, model: 'FOW5504D2D', category: 'Eutectic Freezer', capacity: '491 L' },
  { brandSourceRow: 17, model: 'FOW200', category: 'Freezer on Wheels', capacity: '197 L' },
  { brandSourceRow: 18, model: 'FOW450', category: 'Freezer on Wheels', capacity: '390 L' },
  { brandSourceRow: 19, model: 'FOW5504D2D', category: 'Freezer on Wheels', capacity: '491 L' },
  { brandSourceRow: 20, model: 'SFR70', category: 'Convertible Hard Top Freezer', capacity: '62 L' },
  { brandSourceRow: 21, model: 'SFR150SDU', category: 'Convertible Hard Top Freezer', capacity: '99 L' },
  { brandSourceRow: 22, model: 'SFR250SDU', category: 'Convertible Hard Top Freezer', capacity: '210 L' },
  { brandSourceRow: 23, model: 'SFR350SDU/ODU', category: 'Convertible Hard Top Freezer', capacity: '308 L' },
  { brandSourceRow: 24, model: 'SFR450DDU', category: 'Convertible Hard Top Freezer', capacity: '407 L' },
  { brandSourceRow: 25, model: 'SFR550DDU', category: 'Convertible Hard Top Freezer', capacity: '506 L' },
  { brandSourceRow: 26, model: 'SFR650DDU', category: 'Convertible Hard Top Freezer', capacity: '595 L' },
  { brandSourceRow: 27, model: 'SFR750TD', category: 'Convertible Hard Top Freezer', capacity: '650 L' },
  { brandSourceRow: 28, model: 'SFRN250GT', category: 'Glass Top Freezer', capacity: '205 L' },
  { brandSourceRow: 29, model: 'SFR350GTS', category: 'Glass Top Freezer', capacity: '315 L' },
  { brandSourceRow: 30, model: 'SFR450GTS', category: 'Glass Top Freezer', capacity: '415 L' },
  { brandSourceRow: 31, model: 'SFR550GTS', category: 'Glass Top Freezer', capacity: '485 L' },
  { brandSourceRow: 32, model: 'COMBI300A', category: 'Combi Freezer & Cooler', capacity: '241 L' },
  { brandSourceRow: 33, model: 'COMBI400A', category: 'Combi Freezer & Cooler', capacity: '341 L' },
  { brandSourceRow: 34, model: 'COMBI450', category: 'Combi Freezer & Cooler', capacity: '169 / 201 L' },
  { brandSourceRow: 35, model: 'RVC200A', category: 'Visi Cooler', capacity: '170 L' },
  { brandSourceRow: 36, model: 'RVC300B', category: 'Visi Cooler', capacity: '285 L' },
  { brandSourceRow: 37, model: 'RVC320A', category: 'Visi Cooler', capacity: '240 L' },
  { brandSourceRow: 38, model: 'RVC390B', category: 'Visi Cooler', capacity: '358 L' },
  { brandSourceRow: 39, model: 'RVC400', category: 'Visi Cooler', capacity: '355 L' },
  { brandSourceRow: 40, model: 'RVC400A', category: 'Visi Cooler', capacity: '310 L' },
  { brandSourceRow: 41, model: 'RVC500A', category: 'Visi Cooler', capacity: '370 L' },
  { brandSourceRow: 42, model: 'RVC550B', category: 'Visi Cooler', capacity: '453 L' },
  { brandSourceRow: 43, model: 'RVC600A', category: 'Visi Cooler', capacity: '460 L' },
  { brandSourceRow: 44, model: 'RVC700', category: 'Visi Cooler', capacity: '600 L' },
  { brandSourceRow: 45, model: 'RVC950C', category: 'Visi Cooler', capacity: '739 L' },
  { brandSourceRow: 46, model: 'RVC1100', category: 'Visi Cooler', capacity: '954 L' },
  { brandSourceRow: 47, model: 'RVC1100C', category: 'Visi Cooler', capacity: '872 L' },
  { brandSourceRow: 48, model: 'RVC1250C', category: 'Visi Cooler', capacity: '998 L' },
  { brandSourceRow: 49, model: 'VF500C', category: 'Visi Freezer', capacity: '413 L' },
  { brandSourceRow: 50, model: 'VF1100C', category: 'Visi Freezer', capacity: '951 L' },
  { brandSourceRow: 51, model: 'UF300A', category: 'Upright Freezer', capacity: '280 L' },
  { brandSourceRow: 52, model: 'RWCS515/40D15A', category: 'Stainless Steel Water Cooler', capacity: '40 L' },
  { brandSourceRow: 53, model: 'RWCS540BGC1SIA', category: 'Stainless Steel Water Cooler', capacity: '80 L' },
  { brandSourceRow: 54, model: 'RWCS550B0D1SIA', category: 'Stainless Steel Water Cooler', capacity: '80 L' },
  { brandSourceRow: 55, model: 'RWCS550D12SIA', category: 'Stainless Steel Water Cooler', capacity: '120 L' },
  { brandSourceRow: 56, model: 'RWCS650D12SIA', category: 'Stainless Steel Water Cooler', capacity: '150 L' },
  { brandSourceRow: 57, model: 'RWCS515040SIA', category: 'Stainless Steel Water Cooler', capacity: '400 L' },
  { brandSourceRow: 58, model: 'RWCS515040SIA', category: 'Stainless Steel Water Cooler', capacity: '400 L' },
  { brandSourceRow: 59, model: 'RWCS540B0SIA', category: 'Stainless Steel Water Cooler', capacity: '80 L' },
  { brandSourceRow: 60, model: 'RWCS550B0SIA', category: 'Stainless Steel Water Cooler', capacity: '120 L' },
  { brandSourceRow: 61, model: 'RWCS650D12SIA', category: 'Stainless Steel Water Cooler', capacity: '150 L' },
  { brandSourceRow: 62, model: 'RWCS540B0SIA', category: 'Water Cooler', capacity: '80 L' },
  { brandSourceRow: 63, model: 'RWCS550B0SIA', category: 'Water Cooler', capacity: '120 L' },
  { brandSourceRow: 64, model: 'RGN600F/C', category: 'Reach-In Chiller', capacity: '600 L' },
  { brandSourceRow: 65, model: 'RGN1200F/C', category: 'Reach-In Chiller', capacity: '1200 L' },
  { brandSourceRow: 66, model: 'RGN650GCA', category: 'Reach-In Chiller', capacity: '650 L' },
  { brandSourceRow: 67, model: 'RGN1410GCA', category: 'Reach-In Chiller', capacity: '1300 L' },
  { brandSourceRow: 68, model: 'RGN2100F/C', category: 'Reach-In Freezer', capacity: '282 L' },
  { brandSourceRow: 69, model: 'RGN3100F/C', category: 'Reach-In Freezer', capacity: '417 L' },
  { brandSourceRow: 70, model: 'RGN2100GCA', category: 'Reach-In Freezer', capacity: '282 L' },
  { brandSourceRow: 71, model: 'RGN3100GCA', category: 'Reach-In Freezer', capacity: '417 L' },
  { brandSourceRow: 72, model: 'RUT1000A', category: 'Under Counter', capacity: '4x GN 1/4' },
  { brandSourceRow: 73, model: 'RUT1600A', category: 'Under Counter', capacity: '4x GN 1/4' },
  { brandSourceRow: 74, model: 'RGN901CA', category: 'Bakery & Confectionery', capacity: '240 L' },
  { brandSourceRow: 75, model: 'RGN3000/70GCA', category: 'Bakery & Confectionery', capacity: '282 L' },
  { brandSourceRow: 76, model: 'RGN3000/70GCA', category: 'Bakery & Confectionery', capacity: '417 L' },
  { brandSourceRow: 77, model: 'BF20A', category: 'Blast Freezer', capacity: '160 L' },
  { brandSourceRow: 78, model: 'BF40A', category: 'Blast Freezer', capacity: '323 L' },
  { brandSourceRow: 79, model: 'BF60A', category: 'Blast Freezer', capacity: '421 L' },
  { brandSourceRow: 80, model: 'MB49', category: 'Mini Refrigerator', capacity: '45 L' },
  { brandSourceRow: 81, model: 'MB50', category: 'Mini Refrigerator', capacity: '46 L' },
  { brandSourceRow: 82, model: 'MB55GR', category: 'Mini Refrigerator', capacity: '47 L' },
  { brandSourceRow: 83, model: 'MB55GBL', category: 'Mini Refrigerator', capacity: '47 L' },
  { brandSourceRow: 84, model: 'MB100', category: 'Mini Refrigerator', capacity: '91 L' },
  { brandSourceRow: 85, model: 'BB120C', category: 'Back Bar Cooler', capacity: '149 L' },
  { brandSourceRow: 86, model: 'BB220C', category: 'Back Bar Cooler', capacity: '235 L' },
  { brandSourceRow: 87, model: 'BB340C', category: 'Back Bar Cooler', capacity: '365 L' },
  { brandSourceRow: 88, model: 'RWNS13', category: 'Wine Cooler', capacity: '45 L' },
  { brandSourceRow: 89, model: 'RWNS31', category: 'Wine Cooler', capacity: '67 L' },
  { brandSourceRow: 90, model: 'RWNS51', category: 'Wine Cooler', capacity: '155 L' },
  { brandSourceRow: 91, model: 'RWND67', category: 'Wine Cooler', capacity: '148 L' },
  { brandSourceRow: 92, model: 'RMC15S', category: 'Car Cooler', capacity: '15.3 L' },
  { brandSourceRow: 93, model: 'RMC30S', category: 'Car Cooler', capacity: '27.8 L' },
  { brandSourceRow: 94, model: 'RMC60D', category: 'Car Cooler', capacity: '56.5 L' },
  { brandSourceRow: 95, model: 'RCSLA/3SS', category: 'Confectionery Showcase', capacity: '360 L' },
  { brandSourceRow: 96, model: 'RCSLA/4SS', category: 'Confectionery Showcase', capacity: '500 L' },
  { brandSourceRow: 97, model: 'RCSLA/5SS', category: 'Confectionery Showcase', capacity: '660 L' }
];

export const BLUESTAR_CATALOG = [
  { brandSourceRow: 1, category: 'Inverter Split AC', series: 'G Series', starRating: '5 Star', capacity: '1 Ton' },
  { brandSourceRow: 2, category: 'Inverter Split AC', series: 'G Series', starRating: '5 Star', capacity: '1.5 Ton' },
  { brandSourceRow: 3, category: 'Inverter Split AC', series: 'G Series', starRating: '5 Star', capacity: '2 Ton' },
  { brandSourceRow: 4, category: 'Inverter Split AC', series: 'G Series', starRating: '5 Star', capacity: '2+ Ton' },
  { brandSourceRow: 5, category: 'Inverter Split AC', series: 'G Series', starRating: '3 Star', capacity: '1 Ton' },
  { brandSourceRow: 6, category: 'Inverter Split AC', series: 'G Series', starRating: '3 Star', capacity: '1.5 Ton' },
  { brandSourceRow: 7, category: 'Inverter Split AC', series: 'G Series', starRating: '3 Star', capacity: '2 Ton' },
  { brandSourceRow: 8, category: 'Inverter Split AC', series: 'G Series', starRating: '3 Star', capacity: '2+ Ton' },
  { brandSourceRow: 9, category: 'Inverter Split AC', series: 'Q Series', starRating: '5 Star', capacity: '1 Ton' },
  { brandSourceRow: 10, category: 'Inverter Split AC', series: 'Q Series', starRating: '5 Star', capacity: '1.5 Ton' },
  { brandSourceRow: 11, category: 'Inverter Split AC', series: 'Q Series', starRating: '3 Star', capacity: '1 Ton' },
  { brandSourceRow: 12, category: 'Inverter Split AC', series: 'Q Series', starRating: '3 Star', capacity: '1.5 Ton' },
  { brandSourceRow: 13, category: 'Inverter Split AC', series: 'Q Series', starRating: '3 Star', capacity: '2 Ton' },
  { brandSourceRow: 14, category: 'Inverter Split AC', series: 'Q Series', starRating: '3 Star', capacity: '2+ Ton' },
  { brandSourceRow: 15, category: 'Inverter Split AC', series: 'V Series', starRating: '5 Star', capacity: '1 Ton' },
  { brandSourceRow: 16, category: 'Inverter Split AC', series: 'V Series', starRating: '5 Star', capacity: '1.5 Ton' },
  { brandSourceRow: 17, category: 'Inverter Split AC', series: 'V Series', starRating: '3 Star', capacity: '1 Ton' },
  { brandSourceRow: 18, category: 'Inverter Split AC', series: 'V Series', starRating: '3 Star', capacity: '1.5 Ton' },
  { brandSourceRow: 19, category: 'Inverter Split AC', series: 'V Series', starRating: '3 Star', capacity: '2 Ton' },
  { brandSourceRow: 20, category: 'Inverter Split AC', series: 'V Series', starRating: '3 Star', capacity: '2+ Ton' },
  { brandSourceRow: 21, category: 'Inverter Split AC', series: 'D Series', starRating: '5 Star', capacity: '1 Ton' },
  { brandSourceRow: 22, category: 'Inverter Split AC', series: 'D Series', starRating: '5 Star', capacity: '1.5 Ton' },
  { brandSourceRow: 23, category: 'Inverter Split AC', series: 'D Series', starRating: '3 Star', capacity: '1 Ton' },
  { brandSourceRow: 24, category: 'Inverter Split AC', series: 'D Series', starRating: '3 Star', capacity: '1.5 Ton' },
  { brandSourceRow: 25, category: 'Inverter Split AC', series: 'D Series', starRating: '3 Star', capacity: '2 Ton' },
  { brandSourceRow: 26, category: 'Inverter Split AC', series: 'D Series', starRating: '3 Star', capacity: '2+ Ton' },
  { brandSourceRow: 27, category: 'Inverter Split AC', series: 'TQ Series', starRating: '5 Star', capacity: '1 Ton' },
  { brandSourceRow: 28, category: 'Inverter Split AC', series: 'TQ Series', starRating: '5 Star', capacity: '1.5 Ton' },
  { brandSourceRow: 29, category: 'Inverter Split AC', series: 'TQ Series', starRating: '3 Star', capacity: '1 Ton' },
  { brandSourceRow: 30, category: 'Inverter Split AC', series: 'TQ Series', starRating: '3 Star', capacity: '1.5 Ton' },
  { brandSourceRow: 31, category: 'Inverter Split AC', series: 'TQ Series', starRating: '3 Star', capacity: '2 Ton' },
  { brandSourceRow: 32, category: 'Inverter Split AC', series: 'TQ Series', starRating: '3 Star', capacity: '2+ Ton' },
  { brandSourceRow: 33, category: 'Inverter Split AC', series: 'Z Series', starRating: '5 Star', capacity: '1 Ton' },
  { brandSourceRow: 34, category: 'Inverter Split AC', series: 'Z Series', starRating: '5 Star', capacity: '1.5 Ton' },
  { brandSourceRow: 35, category: 'Inverter Split AC', series: 'Z Series', starRating: '3 Star', capacity: '1 Ton' },
  { brandSourceRow: 36, category: 'Inverter Split AC', series: 'Z Series', starRating: '3 Star', capacity: '1.5 Ton' },
  { brandSourceRow: 37, category: 'Fixed Speed Split AC', series: 'D Series', starRating: '2 Star', capacity: '1 Ton' },
  { brandSourceRow: 38, category: 'Fixed Speed Split AC', series: 'D Series', starRating: '2 Star', capacity: '2 Ton' },
  { brandSourceRow: 39, category: 'Fixed Speed Split AC', series: 'V Series', starRating: '2 Star', capacity: '1 Ton' },
  { brandSourceRow: 40, category: 'Fixed Speed Split AC', series: 'V Series', starRating: '2 Star', capacity: '2 Ton' },
  { brandSourceRow: 41, category: 'Fixed Speed Split AC', series: 'T Series', starRating: '2 Star', capacity: '1 Ton' },
  { brandSourceRow: 42, category: 'Fixed Speed Split AC', series: 'T Series', starRating: '2 Star', capacity: '2 Ton' },
  { brandSourceRow: 43, category: 'Window AC', series: 'G Series', starRating: '5 Star', capacity: '1.5 Ton' },
  { brandSourceRow: 44, category: 'Window AC', series: 'G Series', starRating: '3 Star', capacity: '1.5 Ton' },
  { brandSourceRow: 45, category: 'Window AC', series: 'L Series', starRating: '5 Star', capacity: '1.5 Ton' },
  { brandSourceRow: 46, category: 'Window AC', series: 'L Series', starRating: '3 Star', capacity: '2 Ton' },
  { brandSourceRow: 47, category: 'Commercial Cassette AC', series: 'T Series', starRating: '4 Star', capacity: '1.5 Ton' },
  { brandSourceRow: 48, category: 'Commercial Cassette AC', series: 'T Series', starRating: '4 Star', capacity: '2 Ton' },
  { brandSourceRow: 49, category: 'Commercial Cassette AC', series: 'T Series', starRating: '4 Star', capacity: '3 Ton' },
  { brandSourceRow: 50, category: 'Commercial Cassette AC', series: 'T Series', starRating: '3 Star', capacity: '1.5 Ton' },
  { brandSourceRow: 51, category: 'Commercial Cassette AC', series: 'T Series', starRating: '3 Star', capacity: '2 Ton' },
  { brandSourceRow: 52, category: 'Commercial Cassette AC', series: 'T Series', starRating: '3 Star', capacity: '3 Ton' },
  { brandSourceRow: 53, category: 'Commercial Cassette AC', series: 'T Series', starRating: '2 Star', capacity: '4 Ton' },
  { brandSourceRow: 54, category: 'Commercial Mega Split AC', series: 'G Series', starRating: '3 Star', capacity: '2.5 Ton' },
  { brandSourceRow: 55, category: 'Commercial Mega Split AC', series: 'G Series', starRating: '3 Star', capacity: '3 Ton' },
  { brandSourceRow: 56, category: 'Commercial Verticool AC', series: 'A Series', starRating: '3 Star', capacity: '2 Ton' },
  { brandSourceRow: 57, category: 'Commercial Verticool AC', series: 'A Series', starRating: '3 Star', capacity: '3 Ton' },
  { brandSourceRow: 58, category: 'Commercial Verticool AC', series: 'A Series', starRating: '3 Star', capacity: '4 Ton' }
];

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Returns the entire canonical catalog with globally unique catalog_index (1-155),
 * brand_source_row (1-97 for Rockwell, 1-58 for Bluestar), and unique product_id.
 */
export function getCanonicalCatalog() {
  const catalog = [];
  let globalIndex = 1;

  // Rockwell items (1 to 97)
  for (const item of ROCKWELL_CATALOG) {
    const modelClean = slugify(item.model);
    const id = `rockwell-${String(item.brandSourceRow).padStart(3, '0')}-${modelClean}`;
    catalog.push({
      catalog_index: globalIndex++,
      brand_source_row: item.brandSourceRow,
      product_id: id,
      brand: 'Rockwell',
      category: item.category,
      model: item.model,
      series: null,
      star_rating: null,
      capacity: item.capacity,
      type: item.category
    });
  }

  // Bluestar items (98 to 155)
  for (const item of BLUESTAR_CATALOG) {
    const configSlug = slugify(`${item.category}-${item.series}-${item.starRating}-${item.capacity}`);
    const id = `bluestar-${String(item.brandSourceRow).padStart(3, '0')}-${configSlug}`;
    catalog.push({
      catalog_index: globalIndex++,
      brand_source_row: item.brandSourceRow,
      product_id: id,
      brand: 'Bluestar',
      category: item.category,
      model: null,
      series: item.series,
      star_rating: item.starRating,
      capacity: item.capacity,
      type: item.category
    });
  }

  return catalog;
}

/**
 * Dynamically slices the catalog by brand, batchIndex, batchSize, or startRow/endRow.
 */
export function sliceCatalog(options = {}) {
  const {
    batchIndex = 0,
    batchSize = 5,
    brandFilter = 'all',
    startRow,
    endRow,
    products: customProducts
  } = options;

  let baseCatalog = customProducts && Array.isArray(customProducts) && customProducts.length > 0
    ? customProducts.map((p, idx) => ({
        catalog_index: p.catalog_index ?? (idx + 1),
        brand_source_row: p.brand_source_row ?? (idx + 1),
        product_id: p.product_id ?? `custom-${String(idx + 1).padStart(3, '0')}-${slugify(p.model || p.category || 'prod')}`,
        brand: p.brand || 'Unknown',
        category: p.category || '',
        model: p.model || null,
        series: p.series || null,
        star_rating: p.star_rating || null,
        capacity: p.capacity || '',
        type: p.type || p.category || ''
      }))
    : getCanonicalCatalog();

  // Apply brand filter if specified
  let filtered = baseCatalog;
  if (brandFilter && brandFilter !== 'all') {
    const targetBrand = brandFilter.toLowerCase();
    filtered = baseCatalog.filter(item => item.brand.toLowerCase() === targetBrand);
  }

  // If explicit startRow / endRow provided, use 1-based catalog_index bounds
  if (typeof startRow === 'number' || typeof endRow === 'number') {
    const start = typeof startRow === 'number' ? startRow : 1;
    const end = typeof endRow === 'number' ? endRow : 155;
    const items = filtered.filter(item => item.catalog_index >= start && item.catalog_index <= end);
    return {
      items,
      totalCatalogProducts: baseCatalog.length,
      filteredTotal: filtered.length,
      batchIndex: 0,
      batchSize: items.length,
      totalBatches: 1,
      startCatalogIndex: items.length > 0 ? items[0].catalog_index : null,
      endCatalogIndex: items.length > 0 ? items[items.length - 1].catalog_index : null
    };
  }

  // Dynamic batch calculation
  const safeBatchSize = Math.max(1, parseInt(batchSize, 10) || 5);
  const totalBatches = Math.max(1, Math.ceil(filtered.length / safeBatchSize));
  const safeBatchIndex = Math.max(0, Math.min(parseInt(batchIndex, 10) || 0, totalBatches - 1));

  const startIndex = safeBatchIndex * safeBatchSize;
  const endIndex = Math.min(startIndex + safeBatchSize, filtered.length);
  const items = filtered.slice(startIndex, endIndex);

  return {
    items,
    totalCatalogProducts: baseCatalog.length,
    filteredTotal: filtered.length,
    batchIndex: safeBatchIndex,
    batchSize: safeBatchSize,
    totalBatches,
    startCatalogIndex: items.length > 0 ? items[0].catalog_index : null,
    endCatalogIndex: items.length > 0 ? items[items.length - 1].catalog_index : null
  };
}
