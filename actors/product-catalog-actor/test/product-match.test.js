import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateProductMatch, MatchStatus } from '../src/extraction/product-match.js';
import { normalizeCapacity } from '../src/extraction/normalizers.js';

test('Rockwell exact model match succeeds', () => {
  const requested = {
    brand: 'Rockwell',
    model: 'GFR250D5UC4S',
    category: 'Convertible Green Freezer',
    capacity: '194 L'
  };

  const candidate = {
    title: 'Rockwell GFR250D5UC4S Convertible Green Deep Freezer (194 L, White)',
    model: 'GFR250D5UC4S',
    specifications: {
      Capacity: '194 L',
      'Defrost Type': 'Manual'
    }
  };

  const result = evaluateProductMatch(candidate, requested);
  assert.equal(result.match_status, MatchStatus.EXACT_MATCH);
  assert.ok(result.match_confidence >= 0.95);
  assert.equal(result.matched_model, 'GFR250D5UC4S');
});

test('Nearly identical Rockwell model is strictly rejected as mismatch', () => {
  const requested = {
    brand: 'Rockwell',
    model: 'GFR350D5UC4S',
    category: 'Convertible Green Freezer',
    capacity: '294 L'
  };

  // Candidate is sibling model GFR350D5UC5S
  const candidate = {
    title: 'Rockwell GFR350D5UC5S Convertible Green Freezer 294 L',
    model: 'GFR350D5UC5S',
    specifications: {
      Capacity: '294 L'
    }
  };

  const result = evaluateProductMatch(candidate, requested);
  assert.equal(result.match_status, MatchStatus.MISMATCH);
  assert.equal(result.match_confidence, 0.0);
  assert.ok(result.match_reasons[0].includes('Model mismatch'));
});

test('Blue Star 1.5 Ton 5 Star configuration matches with high confidence', () => {
  const requested = {
    brand: 'Bluestar',
    category: 'Inverter Split AC',
    series: 'G Series',
    star_rating: '5 Star',
    capacity: '1.5 Ton'
  };

  const candidate = {
    title: 'Blue Star 1.5 Ton 5 Star Inverter Split AC (Copper, Convertible, G Series)',
    specifications: {
      Tonnage: '1.5 Ton',
      'Star Rating': '5 Star',
      Series: 'G Series'
    }
  };

  const result = evaluateProductMatch(candidate, requested);
  assert.equal(result.match_status, MatchStatus.PROBABLE_MATCH);
  assert.ok(result.match_confidence >= 0.8);
  assert.ok(result.match_reasons.some(r => r.includes('Capacity')));
  assert.ok(result.match_reasons.some(r => r.includes('Star rating')));
});

test('Blue Star star-rating mismatch is rejected', () => {
  const requested = {
    brand: 'Bluestar',
    category: 'Inverter Split AC',
    series: 'G Series',
    star_rating: '5 Star',
    capacity: '1.5 Ton'
  };

  // Candidate has 3 Star instead of 5 Star
  const candidate = {
    title: 'Blue Star 1.5 Ton 3 Star Inverter Split AC',
    specifications: {
      Tonnage: '1.5 Ton',
      'Star Rating': '3 Star'
    }
  };

  const result = evaluateProductMatch(candidate, requested);
  assert.equal(result.match_status, MatchStatus.MISMATCH);
  assert.equal(result.match_confidence, 0.0);
  assert.ok(result.match_reasons[0].includes('Star rating mismatch'));
});

test('Category mismatch is rejected', () => {
  const requested = {
    brand: 'Bluestar',
    category: 'Commercial Cassette AC',
    series: 'T Series',
    star_rating: '4 Star',
    capacity: '2 Ton'
  };

  // Candidate is Split AC, not Cassette
  const candidate = {
    title: 'Blue Star 2 Ton 4 Star Inverter Split AC',
    specifications: {
      Tonnage: '2 Ton',
      'Star Rating': '4 Star'
    }
  };

  const result = evaluateProductMatch(candidate, requested);
  assert.equal(result.match_status, MatchStatus.MISMATCH);
  assert.ok(result.match_reasons.some(r => r.includes('Cassette')));
});

test('Normalized 1.5 Ton and 1.50 TR capacity equivalence', () => {
  const cap1 = normalizeCapacity('1.5 Ton');
  const cap2 = normalizeCapacity('1.50 TR');
  const cap3 = normalizeCapacity('1.5TR');

  assert.equal(cap1.numeric, 1.5);
  assert.equal(cap2.numeric, 1.5);
  assert.equal(cap3.numeric, 1.5);
  assert.equal(cap1.unit, 'ton');
  assert.equal(cap2.unit, 'ton');
});
