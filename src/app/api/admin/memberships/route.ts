import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query, execute } from '@/lib/db';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plans = await query<any>(
      'SELECT * FROM membership_plans ORDER BY display_order ASC, price ASC'
    );

    return NextResponse.json({ plans });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, tag, duration_months, price, original_price, billing_period, features, is_popular, is_published } = body;

    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    const id = `plan_${Math.random().toString(36).substring(2, 9)}`;
    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    await execute(
      `INSERT INTO membership_plans (
        id, name, slug, tag, duration_months, price, original_price, billing_period, features, is_popular, is_published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        slug,
        tag || null,
        duration_months ? parseInt(duration_months) : 1,
        parseFloat(price),
        original_price ? parseFloat(original_price) : null,
        billing_period || 'monthly',
        features || '',
        is_popular ? 1 : 0,
        is_published !== false ? 1 : 0,
      ]
    );

    return NextResponse.json({ success: true, message: 'Membership plan created.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, tag, duration_months, price, original_price, billing_period, features, is_popular, is_published } = body;

    if (!id) {
      return NextResponse.json({ error: 'Plan ID required' }, { status: 400 });
    }

    await execute(
      `UPDATE membership_plans SET
        name = COALESCE(?, name),
        tag = COALESCE(?, tag),
        duration_months = COALESCE(?, duration_months),
        price = COALESCE(?, price),
        original_price = COALESCE(?, original_price),
        billing_period = COALESCE(?, billing_period),
        features = COALESCE(?, features),
        is_popular = COALESCE(?, is_popular),
        is_published = COALESCE(?, is_published)
       WHERE id = ?`,
      [
        name,
        tag,
        duration_months ? parseInt(duration_months) : null,
        price ? parseFloat(price) : null,
        original_price ? parseFloat(original_price) : null,
        billing_period,
        features,
        is_popular !== undefined ? (is_popular ? 1 : 0) : null,
        is_published !== undefined ? (is_published ? 1 : 0) : null,
        id,
      ]
    );

    return NextResponse.json({ success: true, message: 'Membership plan updated.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Plan ID required' }, { status: 400 });
    }

    await execute('DELETE FROM membership_plans WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Plan deleted.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

