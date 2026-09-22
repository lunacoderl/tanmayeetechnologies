'use client';

// ============================================================================
// @tanmayee/web — Cart Context & State Management
// ============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@tanmayee/types';

export interface CartItemEntry {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItemEntry[];
  itemCount: number;
  totalItems: number;
  subtotal: number;
  isBulk: boolean;
  discountPct: number;
  discountAmount: number;
  estimatedTotal: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  openCart: () => void;
  closeDrawer: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isQuoteModalOpen: boolean;
  openQuoteModal: () => void;
  closeQuoteModal: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'tt_cart_items_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemEntry[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const seen = new Set<string>();
          const deduped: CartItemEntry[] = [];
          for (const item of parsed) {
            if (item?.product?.id && !seen.has(item.product.id)) {
              seen.add(item.product.id);
              deduped.push(item);
            }
          }
          setItems(deduped);
        }
      }
    } catch {
      // Ignore local storage parse error
    }
    setMounted(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Ignore local storage error
      }
    }
  }, [items, mounted]);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  let subtotal = 0;
  let hasBulk = false;
  let maxBulkPct = 0;

  items.forEach((item) => {
    const price = item.product.reference_price || 0;
    subtotal += price * item.quantity;
    if (item.product.bulk_threshold && item.quantity >= item.product.bulk_threshold) {
      hasBulk = true;
      maxBulkPct = Math.max(maxBulkPct, item.product.bulk_discount_pct || 10);
    }
  });

  const isBulk = hasBulk || itemCount >= 5;
  const discountPct = isBulk ? (maxBulkPct > 0 ? maxBulkPct : 8) : 0;
  const discountAmount = Math.round((subtotal * discountPct) / 100);
  const estimatedTotal = subtotal - discountAmount;

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsDrawerOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalItems: itemCount,
        subtotal,
        isBulk,
        discountPct,
        discountAmount,
        estimatedTotal,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        openCart: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        closeCart: () => setIsDrawerOpen(false),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isQuoteModalOpen,
        openQuoteModal: () => setIsQuoteModalOpen(true),
        closeQuoteModal: () => setIsQuoteModalOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
