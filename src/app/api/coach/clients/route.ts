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
      'SELECT id FROM coach_profiles WHERE user_id = ?',
      [user.id]
    );

    const coachId = coach?.id || 'cch_001';

    const clients = await query<any>(
      `SELECT cp.*, u.name, u.email, u.phone, u.avatar,
              mp.name as plan_name, m.status as membership_status,
              (SELECT weight FROM progress_records WHERE customer_id = cp.id ORDER BY recorded_date DESC LIMIT 1) as latest_weight,
              (SELECT recorded_date FROM progress_records WHERE customer_id = cp.id ORDER BY recorded_date DESC LIMIT 1) as last_logged_date
       FROM customer_profiles cp
       JOIN users u ON cp.user_id = u.id
       LEFT JOIN memberships m ON m.customer_id = cp.id AND m.status = 'ACTIVE'
       LEFT JOIN membership_plans mp ON m.plan_id = mp.id
       WHERE cp.assigned_coach_id = ?
       ORDER BY cp.created_at DESC`,
      [coachId]
    );

    return NextResponse.json({ clients });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

