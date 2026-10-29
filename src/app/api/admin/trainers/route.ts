import { NextResponse } from 'next/server';
import { getSessionUser, hashPassword } from '@/lib/auth';
import { query, execute } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trainers = await query<any>(
      `SELECT cp.*, u.name, u.email, u.phone, u.avatar, u.is_active
       FROM coach_profiles cp
       JOIN users u ON cp.user_id = u.id
       ORDER BY cp.display_order ASC, cp.created_at DESC`
    );

    return NextResponse.json({ trainers });
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
    const { name, email, phone, password, title, bio, experience_years, certifications, specializations, hourly_rate, avatar } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const userId = `usr_${Math.random().toString(36).substring(2, 9)}`;
    const coachId = `cch_${Math.random().toString(36).substring(2, 9)}`;
    const hashedPassword = await hashPassword(password || 'coach123');

    // Create user
    await execute(
      `INSERT INTO users (id, name, email, password, role, phone, avatar, is_active)
       VALUES (?, ?, ?, ?, 'COACH', ?, ?, 1)`,
      [userId, name, email, hashedPassword, phone || null, avatar || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=400&auto=format&fit=crop']
    );

    // Create coach profile
    await execute(
      `INSERT INTO coach_profiles (
        id, user_id, title, bio, experience_years, certifications, specializations, hourly_rate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        coachId,
        userId,
        title || 'Master Trainer',
        bio || '',
        experience_years ? parseInt(experience_years) : 5,
        certifications || '',
        specializations || '',
        hourly_rate ? parseFloat(hourly_rate) : 65,
      ]
    );

    return NextResponse.json({ success: true, message: 'Coach created successfully.' });
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
    const { id, user_id, name, phone, title, bio, experience_years, certifications, specializations, hourly_rate, rating, avatar, is_available } = body;

    if (!id || !user_id) {
      return NextResponse.json({ error: 'Trainer ID and User ID required' }, { status: 400 });
    }

    // Update user info
    await execute(
      `UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), avatar = COALESCE(?, avatar) WHERE id = ?`,
      [name, phone, avatar, user_id]
    );

    // Update coach profile
    await execute(
      `UPDATE coach_profiles SET
        title = COALESCE(?, title),
        bio = COALESCE(?, bio),
        experience_years = COALESCE(?, experience_years),
        certifications = COALESCE(?, certifications),
        specializations = COALESCE(?, specializations),
        hourly_rate = COALESCE(?, hourly_rate),
        rating = COALESCE(?, rating),
        is_available = COALESCE(?, is_available)
       WHERE id = ?`,
      [
        title,
        bio,
        experience_years ? parseInt(experience_years) : null,
        certifications,
        specializations,
        hourly_rate ? parseFloat(hourly_rate) : null,
        rating ? parseFloat(rating) : null,
        is_available !== undefined ? (is_available ? 1 : 0) : null,
        id,
      ]
    );

    return NextResponse.json({ success: true, message: 'Trainer updated successfully.' });
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
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await execute('DELETE FROM users WHERE id = ?', [userId]);
    return NextResponse.json({ success: true, message: 'Trainer removed successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

