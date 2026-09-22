'use client';

// ============================================================================
// @tanmayee/admin — New Product Creation (/products/new)
// ============================================================================

import React from 'react';
import { ProductForm } from '../../../components/product/product-form';

export default function NewProductPage() {
  return <ProductForm isEdit={false} />;
}
