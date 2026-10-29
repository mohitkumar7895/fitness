import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query, execute, queryOne } from '@/lib/db';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const programs = await query<any>(
      `SELECT p.*, pc.name as category_name, u.name as coach_name
       FROM programs p
       LEFT JOIN program_categories pc ON p.category_id = pc.id
       LEFT JOIN coach_profiles cp ON p.coach_id = cp.id
       LEFT JOIN users u ON cp.user_id = u.id
       ORDER BY p.display_order ASC, p.created_at DESC`
    );

    const categories = await query<any>('SELECT * FROM program_categories');
    const coaches = await query<any>(
      `SELECT cp.id, u.name FROM coach_profiles cp JOIN users u ON cp.user_id = u.id WHERE u.is_active = 1`
    );

    return NextResponse.json({ programs, categories, coaches });
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
    const { title, excerpt, description, duration_weeks, level, price, original_price, features, image, category_id, coach_id, is_featured, is_published } = body;

    if (!title || !price) {
      return NextResponse.json({ error: 'Title and price are required' }, { status: 400 });
    }

    const id = `prg_${Math.random().toString(36).substring(2, 9)}`;
    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    await execute(
      `INSERT INTO programs (
        id, title, slug, category_id, coach_id, excerpt, description, duration_weeks,
        level, price, original_price, features, image, is_featured, is_published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        title,
        slug,
        category_id || null,
        coach_id || null,
        excerpt || '',
        description || '',
        duration_weeks || 8,
        level || 'All Levels',
        parseFloat(price),
        original_price ? parseFloat(original_price) : null,
        features || '',
        image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
        is_featured ? 1 : 0,
        is_published !== false ? 1 : 0,
      ]
    );

    return NextResponse.json({ success: true, message: 'Program created successfully.' });
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
    const { id, title, excerpt, description, duration_weeks, level, price, original_price, features, image, category_id, coach_id, is_featured, is_published } = body;

    if (!id) {
      return NextResponse.json({ error: 'Program ID required' }, { status: 400 });
    }

    await execute(
      `UPDATE programs SET
        title = COALESCE(?, title),
        excerpt = COALESCE(?, excerpt),
        description = COALESCE(?, description),
        duration_weeks = COALESCE(?, duration_weeks),
        level = COALESCE(?, level),
        price = COALESCE(?, price),
        original_price = COALESCE(?, original_price),
        features = COALESCE(?, features),
        image = COALESCE(?, image),
        category_id = COALESCE(?, category_id),
        coach_id = COALESCE(?, coach_id),
        is_featured = COALESCE(?, is_featured),
        is_published = COALESCE(?, is_published)
       WHERE id = ?`,
      [
        title,
        excerpt,
        description,
        duration_weeks ? parseInt(duration_weeks) : null,
        level,
        price ? parseFloat(price) : null,
        original_price ? parseFloat(original_price) : null,
        features,
        image,
        category_id,
        coach_id,
        is_featured !== undefined ? (is_featured ? 1 : 0) : null,
        is_published !== undefined ? (is_published ? 1 : 0) : null,
        id,
      ]
    );

    return NextResponse.json({ success: true, message: 'Program updated successfully.' });
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
      return NextResponse.json({ error: 'Program ID is required' }, { status: 400 });
    }

    await execute('DELETE FROM programs WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Program deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

