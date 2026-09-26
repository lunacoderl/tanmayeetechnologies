import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@tanmayee/database';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const NOTIFICATIONS_FILE = path.resolve(process.cwd(), 'stock-notifications.json');

function getStoredNotifications(): any[] {
  try {
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      const data = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch {}
  return [];
}

function saveNotificationToFile(item: any) {
  try {
    const list = getStoredNotifications();
    list.unshift(item);
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(list.slice(0, 200), null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save notification to file:', e);
  }
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, product_name, model_number, customer_phone, customer_name, customer_email, notes } = body;

    if (!customer_phone) {
      return NextResponse.json({ success: false, error: 'Customer phone number is required' }, { status: 400 });
    }

    const notificationId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `sn-${Date.now()}`;
    const now = new Date().toISOString();

    const record = {
      id: notificationId,
      product_id: product_id || null,
      product_name: product_name || 'Commercial Equipment',
      model_number: model_number || 'N/A',
      customer_phone,
      customer_name: customer_name || 'Customer',
      customer_email: customer_email || null,
      notes: notes || null,
      status: 'PENDING_CALL',
      created_at: now,
    };

    // 1. Try to record in Supabase service_requests
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        await supabase.from('service_requests').insert({
          id: notificationId,
          customer_name: record.customer_name,
          customer_phone: record.customer_phone,
          customer_email: record.customer_email,
          description: `STOCK_ALERT: Customer wants to be notified when available. product: ${record.product_name}, model: ${record.model_number}. Notes: ${record.notes || 'None'}`,
          status: 'NEW',
          created_at: now,
        });
      }
    } catch (dbErr) {
      console.warn('Supabase stock notification notice:', dbErr);
    }

    // 2. Save locally for guaranteed fallback availability in Admin
    saveNotificationToFile(record);

    return NextResponse.json({
      success: true,
      message: 'Notification request registered successfully. Our sales team will call you once the product is in stock.',
      data: record,
    });
  } catch (err: any) {
    console.error('POST /api/stock-notifications error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
