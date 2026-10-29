import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query, execute } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customers = await query<any>(
      `SELECT u.id as user_id, u.name, u.email, u.phone, u.avatar, u.is_active, u.created_at,
              cp.id as profile_id, cp.height, cp.current_weight, cp.target_weight, cp.fitness_goal,
              cp.assigned_coach_id, cu.name as assigned_coach_name,
              mp.name as plan_name, m.status as membership_status, m.end_date as membership_end_date
       FROM users u
       JOIN customer_profiles cp ON cp.user_id = u.id
       LEFT JOIN coach_profiles cch ON cp.assigned_coach_id = cch.id
       LEFT JOIN users cu ON cch.user_id = cu.id
       LEFT JOIN memberships m ON m.customer_id = cp.id AND m.status = 'ACTIVE'
       LEFT JOIN membership_plans mp ON m.plan_id = mp.id
       WHERE u.role = 'CUSTOMER'
       ORDER BY u.created_at DESC`
    );

    const coaches = await query<any>(
      `SELECT cp.id, u.name FROM coach_profiles cp JOIN users u ON cp.user_id = u.id WHERE u.is_active = 1`
    );

    return NextResponse.json({ customers, coaches });
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
    const { user_id, profile_id, is_active, assigned_coach_id } = body;

    if (user_id && is_active !== undefined) {
      await execute('UPDATE users SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, user_id]);
    }

    if (profile_id && assigned_coach_id !== undefined) {
      await execute('UPDATE customer_profiles SET assigned_coach_id = ? WHERE id = ?', [
        assigned_coach_id || null,
        profile_id,
      ]);
    }

    return NextResponse.json({ success: true, message: 'Customer account updated.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

