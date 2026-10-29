import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query, execute } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookings = await query<any>(
      `SELECT b.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
              cu.name as coach_name
       FROM bookings b
       JOIN customer_profiles cp ON b.customer_id = cp.id
       JOIN users u ON cp.user_id = u.id
       LEFT JOIN coach_profiles cch ON b.coach_id = cch.id
       LEFT JOIN users cu ON cch.user_id = cu.id
       ORDER BY b.scheduled_at DESC`
    );

    return NextResponse.json({ bookings });
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
    const { id, status, scheduled_at, location, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await execute(
      `UPDATE bookings SET
        status = COALESCE(?, status),
        scheduled_at = COALESCE(?, scheduled_at),
        location = COALESCE(?, location),
        notes = COALESCE(?, notes)
       WHERE id = ?`,
      [status, scheduled_at, location, notes, id]
    );

    return NextResponse.json({ success: true, message: 'Booking updated.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

