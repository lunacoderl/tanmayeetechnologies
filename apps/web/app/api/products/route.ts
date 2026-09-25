import { NextResponse } from 'next/server';
import { getMergedProducts } from '@tanmayee/database';

export async function GET() {
  try {
    const products = getMergedProducts();
    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
