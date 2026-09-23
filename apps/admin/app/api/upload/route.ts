import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase Service Role Key for server-side Storage upload (bypasses RLS)
const DEFAULT_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lY3pxZnpjamhlZ25sdXR4emR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDA3NjE3MSwiZXhwIjoyMTA1NjUyMTcxfQ.dYL9vZHPFFf5U3ACShwswp7nNpOF5m8JWzSStkP3Ih4';

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://meczqfzcjhegnlutxzdz.supabase.co';

const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  DEFAULT_SERVICE_KEY;

const BUCKET_NAME = 'product-media';

function getSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
  });
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const contentType = req.headers.get('content-type') || '';

    let fileBuffer: Buffer;
    let fileName: string;
    let mimeType: string;
    let mediaType: 'image' | 'video' = 'image';

    if (contentType.includes('application/json')) {
      const body = await req.json();
      const base64Data = body.base64 || body.data;
      if (!base64Data) {
        return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
      }

      // Format: data:image/png;base64,....
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        fileBuffer = Buffer.from(matches[2], 'base64');
      } else {
        mimeType = 'image/png';
        fileBuffer = Buffer.from(base64Data, 'base64');
      }

      const ext = mimeType.split('/')[1] || 'png';
      fileName = body.fileName || `cropped-${Date.now()}.${ext}`;
      mediaType = mimeType.startsWith('video') ? 'video' : 'image';
    } else {
      // Multipart form data
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      fileName = file.name || `media-${Date.now()}`;
      mimeType = file.type || 'application/octet-stream';
      mediaType = mimeType.startsWith('video') ? 'video' : 'image';
    }

    // Sanitize file name
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `products/${Date.now()}-${sanitizedName}`;

    // Upload to Supabase bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: uploadError.message || 'Failed to upload to Supabase' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filePath,
      fileName,
      mediaType,
      size: fileBuffer.length,
    });
  } catch (err: any) {
    console.error('Upload API route error:', err);
    return NextResponse.json(
      { error: err?.message || 'Server error during upload' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const filePath = searchParams.get('filePath');

    let targetPath = filePath;
    if (!targetPath && url) {
      // Extract path after /product-media/
      const match = url.match(/product-media\/(.+)$/);
      if (match) targetPath = match[1];
    }

    if (targetPath) {
      await supabase.storage.from(BUCKET_NAME).remove([targetPath]);
    }

    return NextResponse.json({ success: true, message: 'Deleted from Supabase' });
  } catch (err: any) {
    console.error('Delete API route error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
