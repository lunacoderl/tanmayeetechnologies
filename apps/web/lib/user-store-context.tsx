'use client';

// ============================================================================
// @tanmayee/web — User Store Context
// Features:
// 1. Persistent Wishlist (localStorage)
// 2. Persistent Compare List (localStorage, up to 4 items)
// 3. User Interaction Tracking (views, searches, preferred categories & brands)
// 4. Recommendation Engine ("Products You May Like")
// ============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@tanmayee/types';
import { SEED_PRODUCTS } from '@tanmayee/database';

interface UserInteractionData {
  viewedProductIds: string[];
  preferredCategories: Record<string, number>;
  preferredBrands: Record<string, number>;
  recentSearches: string[];
}

interface UserStoreContextType {
  // Wishlist
  wishlist: Product[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;

  // Compare
  compareList: Product[];
  compareCount: number;
  isInCompare: (productId: string) => boolean;
  toggleCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;

  // Modals & Drawers
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  isCompareOpen: boolean;
  openCompare: () => void;
  closeCompare: () => void;

  // Interaction Tracking & Recommendations
  trackProductView: (product: Product) => void;
  trackCategoryClick: (categoryId: string) => void;
  trackSearchQuery: (query: string) => void;
  getRecommendedProducts: (limit?: number, excludeIds?: string[]) => Product[];
}

const UserStoreContext = createContext<UserStoreContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'tt_wishlist_v1';
const COMPARE_STORAGE_KEY = 'tt_compare_v1';
const INTERACTIONS_STORAGE_KEY = 'tt_user_behavior_v1';

export function UserStoreProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [interactions, setInteractions] = useState<UserInteractionData>({
    viewedProductIds: [],
    preferredCategories: {},
    preferredBrands: {},
    recentSearches: [],
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCompare = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (savedCompare) setCompareList(JSON.parse(savedCompare));

      const savedInteractions = localStorage.getItem(INTERACTIONS_STORAGE_KEY);
      if (savedInteractions) setInteractions(JSON.parse(savedInteractions));
    } catch {
      // Ignore parse errors
    }
    setMounted(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      } catch {}
    }
  }, [wishlist, mounted]);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareList));
      } catch {}
    }
  }, [compareList, mounted]);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(INTERACTIONS_STORAGE_KEY, JSON.stringify(interactions));
      } catch {}
    }
  }, [interactions, mounted]);

  // Wishlist actions
  const isInWishlist = (productId: string) => wishlist.some((p) => p.id === productId);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  // Compare actions
  const isInCompare = (productId: string) => compareList.some((p) => p.id === productId);

  const toggleCompare = (product: Product) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length >= 4) {
          alert('You can compare a maximum of 4 products at once.');
          return prev;
        }
        return [...prev, product];
      }
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => setCompareList([]);

  // Behavioral Tracking
  const trackProductView = (product: Product) => {
    setInteractions((prev) => {
      const viewed = [product.id, ...prev.viewedProductIds.filter((id) => id !== product.id)].slice(0, 20);
      const catCount = (prev.preferredCategories[product.category_id] || 0) + 1;
      const brandCount = (prev.preferredBrands[product.brand_id] || 0) + 1;

      return {
        ...prev,
        viewedProductIds: viewed,
        preferredCategories: { ...prev.preferredCategories, [product.category_id]: catCount },
        preferredBrands: { ...prev.preferredBrands, [product.brand_id]: brandCount },
      };
    });
  };

  const trackCategoryClick = (categoryId: string) => {
    setInteractions((prev) => ({
      ...prev,
      preferredCategories: {
        ...prev.preferredCategories,
        [categoryId]: (prev.preferredCategories[categoryId] || 0) + 2,
      },
    }));
  };

  const trackSearchQuery = (query: string) => {
    if (!query.trim()) return;
    setInteractions((prev) => ({
      ...prev,
      recentSearches: [query.trim(), ...prev.recentSearches.filter((q) => q !== query.trim())].slice(0, 10),
    }));
  };

  // Recommendation Engine
  const getRecommendedProducts = (limit = 4, excludeIds: string[] = []): Product[] => {
    const allProducts = SEED_PRODUCTS as Product[];
    const excludeSet = new Set(excludeIds);

    // Score products based on user interactions
    const scored = allProducts
      .filter((p) => !excludeSet.has(p.id))
      .map((p) => {
        let score = 0;
        // Category affinity
        if (interactions.preferredCategories[p.category_id]) {
          score += interactions.preferredCategories[p.category_id] * 3;
        }
        // Brand affinity
        if (interactions.preferredBrands[p.brand_id]) {
          score += interactions.preferredBrands[p.brand_id] * 2;
        }
        // Recently viewed boost (but not exact current product)
        if (interactions.viewedProductIds.includes(p.id)) {
          score += 1;
        }
        // Featured boost
        if (p.featured) score += 2;

        return { product: p, score };
      });

    scored.sort((a, b) => b.score - a.score);

    const result = scored.slice(0, limit).map((s) => s.product);

    // Fallback if not enough scored items
    if (result.length < limit) {
      const remaining = allProducts.filter((p) => !excludeSet.has(p.id) && !result.some((r) => r.id === p.id));
      result.push(...remaining.slice(0, limit - result.length));
    }

    return result;
  };

  return (
    <UserStoreContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,

        compareList,
        compareCount: compareList.length,
        isInCompare,
        toggleCompare,
        removeFromCompare,
        clearCompare,

        isWishlistOpen,
        openWishlist: () => setIsWishlistOpen(true),
        closeWishlist: () => setIsWishlistOpen(false),
        isCompareOpen,
        openCompare: () => setIsCompareOpen(true),
        closeCompare: () => setIsCompareOpen(false),

        trackProductView,
        trackCategoryClick,
        trackSearchQuery,
        getRecommendedProducts,
      }}
    >
      {children}
    </UserStoreContext.Provider>
  );
}

export function useUserStore() {
  const context = useContext(UserStoreContext);
  if (!context) {
    throw new Error('useUserStore must be used within a UserStoreProvider');
  }
  return context;
}
