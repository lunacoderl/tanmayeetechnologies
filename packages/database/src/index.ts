// ============================================================================
// @tanmayee/database — Supabase Client Factory & Seed Data
// ============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export * from './seed-data';
export * from './seed-products';
export * from './offers-data';
export * from './product-storage';

let supabaseAdmin: SupabaseClient | null = null;
let supabasePublic: SupabaseClient | null = null;

const DEFAULT_SUPABASE_URL = 'https://meczqfzcjhegnlutxzdz.supabase.co';
const DEFAULT_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lY3pxZnpjamhlZ25sdXR4emR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNzYxNzEsImV4cCI6MjEwNTY1MjE3MX0.jlYjvadXn1EZnqqRojCmFERLhBcsTd6J_OKJbePx1Cs';
const DEFAULT_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lY3pxZnpjamhlZ25sdXR4emR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDA3NjE3MSwiZXhwIjoyMTA1NjUyMTcxfQ.dYL9vZHPFFf5U3ACShwswp7nNpOF5m8JWzSStkP3Ih4';

export function isSupabaseConfigured(): boolean {
  return true;
}

/**
 * Get the Supabase admin client (service_role key).
 * Use for server-side operations only — NEVER expose to frontend.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseAdmin) {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      DEFAULT_SERVICE_ROLE_KEY;

    supabaseAdmin = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseAdmin;
}

/**
 * Get the Supabase public client (anon key).
 * Safe for frontend use — respects Row-Level Security.
 */
export function getSupabasePublic(): SupabaseClient | null {
  if (!supabasePublic) {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
    const key =
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      DEFAULT_ANON_KEY;

    supabasePublic = createClient(url, key);
  }
  return supabasePublic;
}

/**
 * Execute raw SQL via the admin client.
 * Used for migrations, materialized view refresh, etc.
 */
export async function executeSQL(sql: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  if (error) throw error;
  return data;
}

/**
 * Refresh the published_catalog materialized view.
 * Called after product publish/unpublish/archive operations.
 */
export async function refreshPublishedCatalog(): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  try {
    await supabase.rpc('refresh_published_catalog');
  } catch (error) {
    console.warn('refreshPublishedCatalog RPC warning:', error);
  }
}

export { type SupabaseClient };
