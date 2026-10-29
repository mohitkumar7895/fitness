import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'COACH' && user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const coach = await queryOne<any>(
      'SELECT id, title, rating FROM coach_profiles WHERE user_id = ?',
      [user.id]
    );

    const coachId = coach?.id || 'cch_001';

    // Total assigned clients
    const clientsCount = await queryOne<any>(
      'SELECT COUNT(*) as count FROM customer_profiles WHERE assigned_coach_id = ?',
      [coachId]
    );

    // Active workout plans
    const workoutCount = await queryOne<any>(
      'SELECT COUNT(*) as count FROM workout_plans WHERE coach_id = ? AND is_active = 1',
      [coachId]
    );

    // Upcoming sessions
    const sessions = await query<any>(
      `SELECT b.*, u.name as customer_name, u.avatar as customer_avatar
       FROM bookings b
       JOIN customer_profiles cp ON b.customer_id = cp.id
       JOIN users u ON cp.user_id = u.id
       WHERE b.coach_id = ? AND b.status = 'CONFIRMED'
       ORDER BY b.scheduled_at ASC LIMIT 5`,
      [coachId]
    );

    // Recent clients
    const clients = await query<any>(
      `SELECT cp.*, u.name, u.email, u.phone, u.avatar
       FROM customer_profiles cp
       JOIN users u ON cp.user_id = u.id
       WHERE cp.assigned_coach_id = ?
       LIMIT 6`,
      [coachId]
    );

    return NextResponse.json({
      coach,
      totalClients: clientsCount?.count || 0,
      activeWorkoutPlans: workoutCount?.count || 0,
      sessions,
      clients,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

