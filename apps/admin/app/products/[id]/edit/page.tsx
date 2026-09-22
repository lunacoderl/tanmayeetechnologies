'use client';

// ============================================================================
// @tanmayee/admin — Product Edit Page (/products/[id]/edit)
// ============================================================================

import React, { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { SEED_PRODUCTS } from '@tanmayee/database';
import { ProductForm } from '../../../../components/product/product-form';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);

  // Match by id or fallback to first product
  const baseProduct = SEED_PRODUCTS.find((p) => p.id === id) || SEED_PRODUCTS[0];
  const [product, setProduct] = useState<any>(baseProduct);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('tanmayee_custom_products');
        if (stored) {
          const list = JSON.parse(stored);
          const found = list.find((p: any) => p.id === id);
          if (found) {
            setProduct(found);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load custom product from localStorage', e);
    }
  }, [id]);

  if (!product) {
    notFound();
  }

  return <ProductForm initialData={product} isEdit={true} />;
}
