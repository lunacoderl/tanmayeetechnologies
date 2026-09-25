import { NextRequest, NextResponse } from 'next/server';
import { fetchSingleProduct, saveCustomProduct } from '@tanmayee/database';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product identifier is required' },
        { status: 400 }
      );
    }

    const product = await fetchSingleProduct(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: `Product not found for identifier: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (err: any) {
    console.error('API /api/products/[id] GET error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body || !body.product_name) {
      return NextResponse.json(
        { success: false, error: 'Product name and required data missing' },
        { status: 400 }
      );
    }

    const result = await saveCustomProduct({
      ...body,
      id: body.id || id,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product: result.product,
      message: 'Product updated successfully in cloud database',
    });
  } catch (err: any) {
    console.error('API /api/products/[id] PUT error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}
