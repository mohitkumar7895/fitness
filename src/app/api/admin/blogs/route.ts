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

    const blogs = await query<any>(
      `SELECT b.*, bc.name as category_name, u.name as author_name
       FROM blogs b
       LEFT JOIN blog_categories bc ON b.category_id = bc.id
       LEFT JOIN users u ON b.author_id = u.id
       ORDER BY b.created_at DESC`
    );

    const categories = await query<any>('SELECT * FROM blog_categories');

    return NextResponse.json({ blogs, categories });
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
    const { title, category_id, excerpt, content, featured_image, read_time, tags, is_published } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const id = `blog_${Math.random().toString(36).substring(2, 9)}`;
    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    await execute(
      `INSERT INTO blogs (
        id, title, slug, category_id, author_id, excerpt, content, featured_image,
        read_time, tags, is_published, meta_title, meta_description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        title,
        slug,
        category_id || null,
        user.id,
        excerpt || '',
        content,
        featured_image || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
        read_time || '5 min read',
        tags || 'Workout, Nutrition',
        is_published !== false ? 1 : 0,
        title,
        excerpt || '',
      ]
    );

    return NextResponse.json({ success: true, message: 'Article created successfully.' });
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
    const { id, title, category_id, excerpt, content, featured_image, read_time, tags, is_published } = body;

    if (!id) {
      return NextResponse.json({ error: 'Blog ID required' }, { status: 400 });
    }

    await execute(
      `UPDATE blogs SET
        title = COALESCE(?, title),
        category_id = COALESCE(?, category_id),
        excerpt = COALESCE(?, excerpt),
        content = COALESCE(?, content),
        featured_image = COALESCE(?, featured_image),
        read_time = COALESCE(?, read_time),
        tags = COALESCE(?, tags),
        is_published = COALESCE(?, is_published)
       WHERE id = ?`,
      [
        title,
        category_id,
        excerpt,
        content,
        featured_image,
        read_time,
        tags,
        is_published !== undefined ? (is_published ? 1 : 0) : null,
        id,
      ]
    );

    return NextResponse.json({ success: true, message: 'Article updated.' });
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
      return NextResponse.json({ error: 'Blog ID required' }, { status: 400 });
    }

    await execute('DELETE FROM blogs WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Article deleted.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

