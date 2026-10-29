import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query, queryOne, execute } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'COACH' && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const coach = await queryOne<any>(
      'SELECT id FROM coach_profiles WHERE user_id = ?',
      [user.id]
    );

    const coachId = coach?.id || 'cch_001';

    const appointments = await query<any>(
      `SELECT b.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone, u.avatar as customer_avatar
       FROM bookings b
       JOIN customer_profiles cp ON b.customer_id = cp.id
       JOIN users u ON cp.user_id = u.id
       WHERE b.coach_id = ?
       ORDER BY b.scheduled_at DESC`,
      [coachId]
    );

    return NextResponse.json({ appointments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'COACH' && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
    }

    await execute('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);

    return NextResponse.json({ success: true, message: `Appointment status updated to ${status}.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

