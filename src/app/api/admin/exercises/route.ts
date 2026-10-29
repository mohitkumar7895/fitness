import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query, execute } from '@/lib/db';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN' && user.role !== 'COACH')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exercises = await query<any>('SELECT * FROM exercises ORDER BY category ASC, name ASC');
    return NextResponse.json({ exercises });
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
    const { name, category, target_muscle, equipment, instructions, difficulty, video_url } = body;

    if (!name || !target_muscle) {
      return NextResponse.json({ error: 'Name and target muscle required' }, { status: 400 });
    }

    const id = `ex_${Math.random().toString(36).substring(2, 9)}`;
    const slug = `${slugify(name)}-${Math.random().toString(36).substring(2, 6)}`;

    await execute(
      `INSERT INTO exercises (id, name, slug, category, target_muscle, equipment, instructions, difficulty, video_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        slug,
        category || 'Strength',
        target_muscle,
        equipment || 'Barbell',
        instructions || '',
        difficulty || 'Intermediate',
        video_url || null,
      ]
    );

    return NextResponse.json({ success: true, message: 'Exercise added.' });
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
    const { id, name, category, target_muscle, equipment, instructions, difficulty, video_url } = body;

    if (!id) {
      return NextResponse.json({ error: 'Exercise ID required' }, { status: 400 });
    }

    await execute(
      `UPDATE exercises SET
        name = COALESCE(?, name),
        category = COALESCE(?, category),
        target_muscle = COALESCE(?, target_muscle),
        equipment = COALESCE(?, equipment),
        instructions = COALESCE(?, instructions),
        difficulty = COALESCE(?, difficulty),
        video_url = COALESCE(?, video_url)
       WHERE id = ?`,
      [name, category, target_muscle, equipment, instructions, difficulty, video_url, id]
    );

    return NextResponse.json({ success: true, message: 'Exercise updated.' });
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

    await execute('DELETE FROM exercises WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Exercise deleted.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
