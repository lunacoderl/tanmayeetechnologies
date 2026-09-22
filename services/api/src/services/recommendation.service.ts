// ============================================================================
// @tanmayee/api — Recommendation Engine Service
// Multi-factor weighted recommendation algorithm (Spec §60)
// ============================================================================

import { productRepository } from '../repositories/product.repository';
import { analyticsRepository } from '../repositories/analytics.repository';
import { RECOMMENDATION_WEIGHTS } from '@tanmayee/config';

export class RecommendationService {
  /**
   * Get similar products for a given product
   */
  async getSimilarProducts(productId: string, limit = 4) {
    const targetProduct = await productRepository.findById(productId);
    if (!targetProduct) return [];

    const allPublished = await productRepository.findPublished({ limit: 100 });
    const candidates = allPublished.items.filter((p: any) => p.id !== productId);

    const scored = candidates.map((p: any) => {
      let score = 0;

      // 1. Same Category weight
      if (p.category_id === targetProduct.category_id) {
        score += RECOMMENDATION_WEIGHTS.SAME_CATEGORY;
      }

      // 2. Same Brand weight
      if (p.brand_id === targetProduct.brand_id) {
        score += RECOMMENDATION_WEIGHTS.SAME_BRAND;
      }

      // 3. Similar Price (within 30%)
      if (p.reference_price && targetProduct.reference_price) {
        const ratio = Math.abs(p.reference_price - targetProduct.reference_price) / targetProduct.reference_price;
        if (ratio <= 0.3) {
          score += RECOMMENDATION_WEIGHTS.SIMILAR_PRICE * (1 - ratio);
        }
      }

      // 4. Similar Specifications (e.g. capacity)
      const targetCapacity = targetProduct.attributes?.find((a: any) =>
        a.name.toLowerCase().includes('capacity')
      );
      const candCapacity = p.attributes?.find((a: any) =>
        a.name.toLowerCase().includes('capacity')
      );

      if (targetCapacity && candCapacity && targetCapacity.value === candCapacity.value) {
        score += RECOMMENDATION_WEIGHTS.SIMILAR_CAPACITY;
      }

      return { product: p, score };
    });

    scored.sort((a: any, b: any) => b.score - a.score);
    return scored.slice(0, limit).map((s: any) => s.product);
  }

  /**
   * Get personalized recommendations for anonymous visitor based on interest profile
   */
  async getPersonalizedRecommendations(sessionToken: string, limit = 6) {
    const session = await analyticsRepository.getSession(sessionToken);
    const allPublished = await productRepository.findPublished({ limit: 100 });

    if (!session || !session.interest_profile) {
      // If new session, return top viewed products
      return allPublished.items.slice(0, limit);
    }

    const { categories, brands } = session.interest_profile;

    const scored = allPublished.items.map((p: any) => {
      let score = 0;

      // Affinity to category
      if (p.category_id && categories && categories[p.category_id]) {
        score += categories[p.category_id] * RECOMMENDATION_WEIGHTS.CUSTOMER_BEHAVIOR;
      }

      // Affinity to brand
      if (p.brand_name && brands && brands[p.brand_name.toLowerCase()]) {
        score += brands[p.brand_name.toLowerCase()] * (RECOMMENDATION_WEIGHTS.CUSTOMER_BEHAVIOR / 2);
      }

      // Base popularity
      score += Math.min(p.view_count || 0, 20);

      return { product: p, score };
    });

    scored.sort((a: any, b: any) => b.score - a.score);
    return scored.slice(0, limit).map((s: any) => s.product);
  }
}

export const recommendationService = new RecommendationService();
