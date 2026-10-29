import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query, queryOne, execute } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await queryOne<any>(
      'SELECT id, assigned_coach_id FROM customer_profiles WHERE user_id = ?',
      [user.id]
    );

    if (!profile) {
      return NextResponse.json({ appointments: [] });
    }

    const appointments = await query<any>(
      `SELECT b.*, cu.name as coach_name, cu.avatar as coach_avatar, cp.title as coach_title
       FROM bookings b
       LEFT JOIN coach_profiles cp ON b.coach_id = cp.id
       LEFT JOIN users cu ON cp.user_id = cu.id
       WHERE b.customer_id = ?
       ORDER BY b.scheduled_at DESC`,
      [profile.id]
    );

    // List coaches for booking selection
    const coaches = await query<any>(
      `SELECT cp.id, cp.title, cp.hourly_rate, u.name, u.avatar
       FROM coach_profiles cp
       JOIN users u ON cp.user_id = u.id
       WHERE u.is_active = 1`
    );

    return NextResponse.json({ appointments, coaches, assignedCoachId: profile.assigned_coach_id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await queryOne<any>(
      'SELECT id FROM customer_profiles WHERE user_id = ?',
      [user.id]
    );

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { coach_id, title, scheduled_at, duration_minutes, type, notes } = body;

    if (!coach_id || !scheduled_at) {
      return NextResponse.json({ error: 'Coach and schedule time are required' }, { status: 400 });
    }

    const bookingId = `bk_${Math.random().toString(36).substring(2, 9)}`;
    await execute(
      `INSERT INTO bookings (id, customer_id, coach_id, title, scheduled_at, duration_minutes, type, status, location, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', 'Main Fitness Suite', ?)`,
      [
        bookingId,
        profile.id,
        coach_id,
        title || '1-on-1 Coaching Session',
        scheduled_at,
        duration_minutes || 60,
        type || 'PERSONAL_TRAINING',
        notes || null,
      ]
    );

    // Create notification
    await execute(
      `INSERT INTO notifications (id, user_id, title, message, type, link)
       VALUES (?, ?, 'Appointment Confirmed', 'Your session has been booked with your coach.', 'BOOKING', '/appointments')`,
      [`notif_${Math.random().toString(36).substring(2, 9)}`, user.id]
    );

    return NextResponse.json({ success: true, message: 'Appointment booked successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

