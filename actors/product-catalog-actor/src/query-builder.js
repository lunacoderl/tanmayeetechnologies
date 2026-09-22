/**
 * Search Query Builder for Rockwell & Blue Star.
 * Constructs exact primary queries and controlled secondary variants.
 */

export function buildSearchQueries(product) {
  if (!product) return { primaryQuery: '', secondaryQueries: [] };

  const brand = (product.brand || '').trim();
  const isRockwell = brand.toLowerCase() === 'rockwell';

  if (isRockwell) {
    // Rockwell: Exact model is the primary identity key
    const model = (product.model || '').trim();
    const category = (product.category || '').trim();
    const capacity = (product.capacity || '').trim();

    const primaryQuery = `Rockwell ${model}`.trim();
    const secondaryQueries = [];

    if (category || capacity) {
      secondaryQueries.push(`Rockwell ${model} ${category} ${capacity}`.trim());
    }

    return {
      primaryQuery,
      secondaryQueries
    };
  }

  // Bluestar: Broad but constrained queries with permutations
  const series = (product.series || '').trim();
  const starRating = (product.star_rating || '').trim();
  const capacity = (product.capacity || '').trim();
  const category = (product.category || '').trim();

  // Primary query: "Blue Star {SERIES} {STAR_RATING} {CAPACITY} {CATEGORY}"
  const primaryParts = ['Blue Star', series, starRating, capacity, category].filter(Boolean);
  const primaryQuery = primaryParts.join(' ');

  // Controlled alternatives:
  // 1: "Blue Star {CAPACITY} {STAR_RATING} {SERIES}"
  // 2: "Blue Star {CAPACITY} {CATEGORY} {STAR_RATING}"
  const alt1 = ['Blue Star', capacity, starRating, series].filter(Boolean).join(' ');
  const alt2 = ['Blue Star', capacity, category, starRating].filter(Boolean).join(' ');
  const alt3 = ['Blue Star', series, capacity, 'AC'].filter(Boolean).join(' ');

  const secondarySet = new Set([alt1, alt2, alt3]);
  secondarySet.delete(primaryQuery);

  return {
    primaryQuery,
    secondaryQueries: Array.from(secondarySet)
  };
}
