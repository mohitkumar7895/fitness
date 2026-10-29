import { NextResponse } from 'next/server';
import { getSessionUser, hashPassword } from '@/lib/auth';
import { query, execute } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Superadmin only.' }, { status: 403 });
    }

    const users = await query<any>(
      'SELECT id, name, email, role, phone, is_active, created_at FROM users ORDER BY created_at DESC'
    );

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Superadmin only.' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, role, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password required' }, { status: 400 });
    }

    const id = `usr_${Math.random().toString(36).substring(2, 9)}`;
    const hashedPassword = await hashPassword(password);

    await execute(
      `INSERT INTO users (id, name, email, password, role, phone, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [id, name, email, hashedPassword, role || 'ADMIN', phone || null]
    );

    return NextResponse.json({ success: true, message: 'User account created.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Superadmin only.' }, { status: 403 });
    }

    const body = await request.json();
    const { id, role, is_active, password } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    if (password) {
      const hashedPassword = await hashPassword(password);
      await execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    }

    await execute(
      `UPDATE users SET
        role = COALESCE(?, role),
        is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [role, is_active !== undefined ? (is_active ? 1 : 0) : null, id]
    );

    return NextResponse.json({ success: true, message: 'User updated.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Superadmin only.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    if (id === user.id) {
      return NextResponse.json({ error: 'Cannot delete current logged in admin account' }, { status: 400 });
    }

    await execute('DELETE FROM users WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'User deleted.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

