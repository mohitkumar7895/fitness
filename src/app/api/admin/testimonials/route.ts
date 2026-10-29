import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query, execute } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const testimonials = await query<any>(
      'SELECT * FROM testimonials ORDER BY display_order ASC, created_at DESC'
    );

    return NextResponse.json({ testimonials });
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
    const { name, role, company_or_goal, content, result_highlight, before_weight, after_weight, before_image, after_image, rating } = body;

    if (!name || !content) {
      return NextResponse.json({ error: 'Name and testimonial quote required' }, { status: 400 });
    }

    const id = `tstm_${Math.random().toString(36).substring(2, 9)}`;

    await execute(
      `INSERT INTO testimonials (
        id, name, role, company_or_goal, content, result_highlight, before_weight,
        after_weight, before_image, after_image, rating, is_approved, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1)`,
      [
        id,
        name,
        role || 'Member',
        company_or_goal || 'Body Transformation',
        content,
        result_highlight || '-10 kg in 12 weeks',
        before_weight ? parseFloat(before_weight) : null,
        after_weight ? parseFloat(after_weight) : null,
        before_image || null,
        after_image || null,
        rating ? parseInt(rating) : 5,
      ]
    );

    return NextResponse.json({ success: true, message: 'Testimonial added.' });
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
    const { id, is_approved, is_featured, content, result_highlight } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await execute(
      `UPDATE testimonials SET
        is_approved = COALESCE(?, is_approved),
        is_featured = COALESCE(?, is_featured),
        content = COALESCE(?, content),
        result_highlight = COALESCE(?, result_highlight)
       WHERE id = ?`,
      [
        is_approved !== undefined ? (is_approved ? 1 : 0) : null,
        is_featured !== undefined ? (is_featured ? 1 : 0) : null,
        content,
        result_highlight,
        id,
      ]
    );

    return NextResponse.json({ success: true, message: 'Testimonial updated.' });
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
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await execute('DELETE FROM testimonials WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Testimonial deleted.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

