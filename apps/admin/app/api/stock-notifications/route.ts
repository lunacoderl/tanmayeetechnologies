import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@tanmayee/database';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const NOTIFICATIONS_FILE = path.resolve(process.cwd(), '../web/stock-notifications.json');
const LOCAL_ADMIN_FILE = path.resolve(process.cwd(), 'stock-notifications.json');

function getStoredNotifications(): any[] {
  try {
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      const data = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch {}
  try {
    if (fs.existsSync(LOCAL_ADMIN_FILE)) {
      const data = fs.readFileSync(LOCAL_ADMIN_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch {}
  return [];
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .ilike('description', '%STOCK_ALERT%')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map((d: any) => {
          let prodInfo = { product_name: 'Commercial Equipment', model_number: 'N/A' };
          try {
            const desc = d.description || '';
            const match = desc.match(/product:\s*([^,]+),\s*model:\s*([^\n]+)/i);
            if (match) {
              prodInfo.product_name = match[1].trim();
              prodInfo.model_number = match[2].trim();
            }
          } catch {}
          return {
            id: d.id,
            customer_phone: d.customer_phone,
            customer_name: d.customer_name || 'Customer',
            product_name: prodInfo.product_name,
            model_number: prodInfo.model_number,
            status: d.status || 'NEW',
            created_at: d.created_at,
          };
        });
        return NextResponse.json({ success: true, notifications: mapped });
      }
    }

    const localList = getStoredNotifications();
    return NextResponse.json({ success: true, notifications: localList });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, notifications: getStoredNotifications() });
  }
}
