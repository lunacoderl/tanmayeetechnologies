// ============================================================================
// @tanmayee/api — Cart Repository
// ============================================================================

import { Cart, CartItem, Product } from '@tanmayee/types';
import { CartStatus } from '@tanmayee/config';
import { productRepository } from './product.repository';
import { v4 as uuidv4 } from 'uuid';

export interface EnrichedCartItem extends CartItem {
  product: Product;
  line_subtotal: number;
}

export interface EnrichedCart {
  id: string;
  session_id: string;
  status: CartStatus;
  items: EnrichedCartItem[];
  item_count: number;
  subtotal: number;
  is_bulk: boolean;
  applicable_discount_pct: number;
  discount_amount: number;
  estimated_total: number;
  created_at: string;
  updated_at: string;
}

const inMemoryCarts = new Map<string, Cart>();
const inMemoryCartItems = new Map<string, CartItem[]>();

export class CartRepository {
  async getOrCreateCart(sessionId: string): Promise<Cart> {
    let cart = Array.from(inMemoryCarts.values()).find(
      (c) => c.session_id === sessionId && c.status === CartStatus.ACTIVE
    );

    if (!cart) {
      cart = {
        id: uuidv4(),
        session_id: sessionId,
        status: CartStatus.ACTIVE,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      inMemoryCarts.set(cart.id, cart);
      inMemoryCartItems.set(cart.id, []);
    }

    return cart;
  }

  async getCart(cartId: string): Promise<Cart | null> {
    return inMemoryCarts.get(cartId) || null;
  }

  async getCartItems(cartId: string): Promise<CartItem[]> {
    return inMemoryCartItems.get(cartId) || [];
  }

  async addItem(cartId: string, productId: string, quantity = 1): Promise<CartItem> {
    const items = inMemoryCartItems.get(cartId) || [];
    const existing = items.find((i) => i.product_id === productId);

    if (existing) {
      existing.quantity += quantity;
      return existing;
    }

    const newItem: CartItem = {
      id: uuidv4(),
      cart_id: cartId,
      product_id: productId,
      quantity,
      added_at: new Date().toISOString(),
    };

    items.push(newItem);
    inMemoryCartItems.set(cartId, items);
    return newItem;
  }

  async updateItem(cartId: string, itemId: string, quantity: number): Promise<CartItem | null> {
    const items = inMemoryCartItems.get(cartId) || [];
    const item = items.find((i) => i.id === itemId);
    if (!item) return null;

    item.quantity = quantity;
    return item;
  }

  async removeItem(cartId: string, itemId: string): Promise<boolean> {
    const items = inMemoryCartItems.get(cartId) || [];
    const filtered = items.filter((i) => i.id !== itemId);
    inMemoryCartItems.set(cartId, filtered);
    return true;
  }

  async clearCart(cartId: string): Promise<void> {
    inMemoryCartItems.set(cartId, []);
  }

  /**
   * Enriches cart with current product data, prices, bulk discount checks, and totals
   */
  async getEnrichedCart(sessionId: string): Promise<EnrichedCart> {
    const cart = await this.getOrCreateCart(sessionId);
    const rawItems = await this.getCartItems(cart.id);

    const enrichedItems: EnrichedCartItem[] = [];
    let subtotal = 0;
    let totalQuantity = 0;
    let hasBulkItem = false;
    let maxBulkDiscount = 0;

    for (const item of rawItems) {
      const product = await productRepository.findById(item.product_id);
      if (product) {
        const unitPrice = product.reference_price || 0;
        const lineTotal = unitPrice * item.quantity;
        subtotal += lineTotal;
        totalQuantity += item.quantity;

        // Check bulk threshold
        if (product.bulk_threshold && item.quantity >= product.bulk_threshold) {
          hasBulkItem = true;
          maxBulkDiscount = Math.max(maxBulkDiscount, product.bulk_discount_pct || 10);
        }

        enrichedItems.push({
          ...item,
          product,
          line_subtotal: lineTotal,
        });
      }
    }

    const isBulk = hasBulkItem || totalQuantity >= 5;
    const discountPct = isBulk ? (maxBulkDiscount > 0 ? maxBulkDiscount : 8) : 0;
    const discountAmount = Math.round((subtotal * discountPct) / 100);
    const estimatedTotal = subtotal - discountAmount;

    return {
      id: cart.id,
      session_id: sessionId,
      status: cart.status,
      items: enrichedItems,
      item_count: totalQuantity,
      subtotal,
      is_bulk: isBulk,
      applicable_discount_pct: discountPct,
      discount_amount: discountAmount,
      estimated_total: estimatedTotal,
      created_at: cart.created_at,
      updated_at: cart.updated_at || cart.created_at,
    };
  }
}

export const cartRepository = new CartRepository();
