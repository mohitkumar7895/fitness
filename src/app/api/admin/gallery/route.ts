import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query, execute } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await query<any>(
      'SELECT * FROM gallery ORDER BY display_order ASC, created_at DESC'
    );

    return NextResponse.json({ items });
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
    const { title, category, media_url, caption } = body;

    if (!title || !media_url) {
      return NextResponse.json({ error: 'Title and media URL are required' }, { status: 400 });
    }

    const id = `gal_${Math.random().toString(36).substring(2, 9)}`;

    await execute(
      `INSERT INTO gallery (id, title, category, media_url, media_type, caption, is_featured, display_order)
       VALUES (?, ?, ?, ?, 'IMAGE', ?, 1, 0)`,
      [id, title, category || 'FACILITY', media_url, caption || null]
    );

    return NextResponse.json({ success: true, message: 'Media added to gallery.' });
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

    await execute('DELETE FROM gallery WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Media deleted.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

