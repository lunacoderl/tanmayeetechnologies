import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@tanmayee/database';
import { COMPANY } from '@tanmayee/config';

export const dynamic = 'force-dynamic';

async function sendResendEmail(quotation: any) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || COMPANY.SALES_EMAIL || 'sales@tanmayeetechnologies.com';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Tanmayee Technologies <onboarding@resend.dev>';

  if (!apiKey) {
    console.info('[Quotation Notification] RESEND_API_KEY not configured. Quotation data successfully saved to database. Admin email notification skipped.');
    return { sent: false, reason: 'NO_API_KEY' };
  }

  const itemsHtml = (quotation.items || [])
    .map(
      (item: any, idx: number) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 12px; font-weight: bold; color: #1e293b;">${idx + 1}. ${item.product_name}</td>
        <td style="padding: 10px 12px; color: #475569; font-family: monospace;">${item.model_number || 'N/A'}</td>
        <td style="padding: 10px 12px; color: #0284c7; font-weight: bold; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 12px; color: #1e293b; text-align: right; font-weight: bold;">₹${((item.unit_price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</td>
      </tr>`
    )
    .join('');

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>New Quotation Request</title></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 24px; color: #0f172a;">
      <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        
        <div style="background: linear-gradient(135deg, #0b2847 0%, #0284c7 100%); padding: 24px 28px; color: #ffffff;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">TANMAYEE TECHNOLOGIES</h1>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #bae6fd; font-weight: 600;">NEW B2B QUOTATION INQUIRY RECEIVED</p>
        </div>

        <div style="padding: 24px 28px 12px 28px;">
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 12px 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 11px; color: #166534; font-weight: 700; text-transform: uppercase;">Quotation Ref:</span>
                <div style="font-size: 18px; font-weight: 900; color: #15803d; font-family: monospace;">${quotation.quotation_number}</div>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 11px; color: #64748b; font-weight: 600;">Total Estimate:</span>
                <div style="font-size: 18px; font-weight: 900; color: #0f172a;">₹${(quotation.grand_total || quotation.subtotal || 0).toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        </div>

        <div style="padding: 12px 28px;">
          <h3 style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #475569; margin: 0 0 10px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px;">Client Information</h3>
          <table style="width: 100%; font-size: 13px; line-height: 1.6;">
            <tr><td style="width: 140px; color: #64748b; font-weight: 600;">Contact Name:</td><td style="font-weight: 700; color: #0f172a;">${quotation.customer_name || 'N/A'}</td></tr>
            <tr><td style="color: #64748b; font-weight: 600;">Mobile Number:</td><td style="font-weight: 700; color: #0284c7;"><a href="tel:${quotation.customer_phone}" style="color: #0284c7; text-decoration: none;">${quotation.customer_phone || 'N/A'}</a></td></tr>
            <tr><td style="color: #64748b; font-weight: 600;">Email:</td><td>${quotation.customer_email ? `<a href="mailto:${quotation.customer_email}">${quotation.customer_email}</a>` : 'Not provided'}</td></tr>
            <tr><td style="color: #64748b; font-weight: 600;">Company / Firm:</td><td style="font-weight: 600;">${quotation.customer_company || 'Commercial Direct'}</td></tr>
            <tr><td style="color: #64748b; font-weight: 600;">Location:</td><td>${quotation.customer_location || 'Visakhapatnam'}</td></tr>
            ${quotation.customer_notes ? `<tr><td style="color: #64748b; font-weight: 600;">Notes:</td><td style="color: #334155; font-style: italic;">${quotation.customer_notes}</td></tr>` : ''}
          </table>
        </div>

        <div style="padding: 12px 28px 24px 28px;">
          <h3 style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #475569; margin: 0 0 10px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px;">Requested Equipment Models</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: left;">
                <th style="padding: 8px 12px; font-weight: 700; color: #475569;">Product</th>
                <th style="padding: 8px 12px; font-weight: 700; color: #475569;">Model</th>
                <th style="padding: 8px 12px; font-weight: 700; color: #475569; text-align: center;">Qty</th>
                <th style="padding: 8px 12px; font-weight: 700; color: #475569; text-align: right;">Est. Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>

        <div style="background: #f1f5f9; padding: 18px 28px; border-top: 1px solid #e2e8f0; text-align: center;">
          <a href="https://wa.me/${String(quotation.customer_phone).replace(/[^0-9]/g, '')}" style="background: #10b981; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 12px; display: inline-block; margin-right: 8px;">Chat on WhatsApp</a>
          <a href="tel:${quotation.customer_phone}" style="background: #0284c7; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 12px; display: inline-block;">Call Customer Now</a>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [adminEmail],
        subject: `New Quotation ${quotation.quotation_number} - ${quotation.customer_name} (${quotation.customer_phone})`,
        html: emailHtml,
      }),
    });

    const data = await res.json();
    return { sent: res.ok, data };
  } catch (err: any) {
    console.error('Resend email error:', err);
    return { sent: false, error: err.message };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      quotation_number,
      customer_name,
      customer_phone,
      customer_email,
      customer_company,
      customer_location,
      customer_notes,
      items,
      subtotal,
      grand_total,
    } = body;

    const quoteNumber =
      quotation_number ||
      `TT-Q-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const quoteRecord = {
      id: body.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `quote-${Date.now()}`),
      quotation_number: quoteNumber,
      customer_name: customer_name || 'Anonymous Client',
      customer_phone: customer_phone || '',
      customer_email: customer_email || null,
      customer_company: customer_company || null,
      customer_location: customer_location || 'Visakhapatnam',
      customer_notes: customer_notes || null,
      subtotal: subtotal || grand_total || 0,
      grand_total: grand_total || subtotal || 0,
      status: 'SUBMITTED',
      created_at: new Date().toISOString(),
      items: Array.isArray(items) ? items : [],
    };

    // 1. Try to record into Supabase quotations table
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        await supabase.from('quotations').insert({
          id: quoteRecord.id,
          quotation_number: quoteRecord.quotation_number,
          customer_name: quoteRecord.customer_name,
          customer_phone: quoteRecord.customer_phone,
          customer_email: quoteRecord.customer_email,
          customer_company: quoteRecord.customer_company,
          customer_location: quoteRecord.customer_location,
          customer_notes: quoteRecord.customer_notes,
          subtotal: quoteRecord.subtotal,
          grand_total: quoteRecord.grand_total,
          status: 'SUBMITTED',
          created_at: quoteRecord.created_at,
        });

        // Insert quotation items if any
        if (Array.isArray(quoteRecord.items) && quoteRecord.items.length > 0) {
          const rows = quoteRecord.items.map((i: any) => ({
            quotation_id: quoteRecord.id,
            product_id: i.id || i.product_id || '00000000-0000-0000-0000-000000000000',
            product_name: i.product_name,
            model_number: i.model_number || 'N/A',
            brand_name: i.brand_name || 'Tanmayee Partner',
            unit_price: i.unit_price || 0,
            quantity: i.quantity || 1,
            subtotal: (i.unit_price || 0) * (i.quantity || 1),
          }));
          await supabase.from('quotation_items').insert(rows);
        }
      }
    } catch (dbErr) {
      console.warn('Supabase quotation record notice:', dbErr);
    }

    // 2. Concurrently send message through Resend email to admin email
    const emailResult = await sendResendEmail(quoteRecord);

    return NextResponse.json({
      success: true,
      data: quoteRecord,
      email: emailResult,
    });
  } catch (err: any) {
    console.error('POST /api/quotations error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to process quotation' },
      { status: 500 }
    );
  }
}
