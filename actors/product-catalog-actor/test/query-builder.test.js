import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSearchQueries } from '../src/query-builder.js';

test('Rockwell query builder produces exact model query first', () => {
  const rockwellProduct = {
    brand: 'Rockwell',
    model: 'GFR250D5UC4S',
    category: 'Convertible Green Freezer',
    capacity: '194 L'
  };

  const queries = buildSearchQueries(rockwellProduct);
  assert.equal(queries.primaryQuery, 'Rockwell GFR250D5UC4S');
  assert.ok(queries.secondaryQueries.length > 0);
  assert.ok(queries.secondaryQueries[0].includes('GFR250D5UC4S'));
  assert.ok(queries.secondaryQueries[0].includes('194 L'));
});

test('Blue Star query builder produces constrained query and permutations', () => {
  const bluestarProduct = {
    brand: 'Bluestar',
    series: 'G Series',
    star_rating: '5 Star',
    capacity: '1.5 Ton',
    category: 'Inverter Split AC'
  };

  const queries = buildSearchQueries(bluestarProduct);
  assert.equal(queries.primaryQuery, 'Blue Star G Series 5 Star 1.5 Ton Inverter Split AC');
  assert.ok(queries.secondaryQueries.length >= 2);
  assert.ok(queries.secondaryQueries.some(q => q.includes('1.5 Ton') && q.includes('5 Star')));
});
