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

    const plans = await query<any>(
      `SELECT dp.*, u.name as customer_name
       FROM diet_plans dp
       LEFT JOIN customer_profiles cp ON dp.customer_id = cp.id
       LEFT JOIN users u ON cp.user_id = u.id
       WHERE dp.coach_id = ?
       ORDER BY dp.created_at DESC`,
      [coachId]
    );

    const clients = await query<any>(
      `SELECT cp.id, u.name FROM customer_profiles cp JOIN users u ON cp.user_id = u.id WHERE cp.assigned_coach_id = ?`,
      [coachId]
    );

    return NextResponse.json({ plans, clients });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
    const body = await request.json();
    const { title, customer_id, description, daily_calories, target_protein, target_carbs, target_fat } = body;

    if (!title || !customer_id) {
      return NextResponse.json({ error: 'Title and customer are required' }, { status: 400 });
    }

    const planId = `dp_${Math.random().toString(36).substring(2, 9)}`;

    await execute(
      `INSERT INTO diet_plans (id, coach_id, customer_id, title, description, daily_calories, target_protein, target_carbs, target_fat, is_template, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1)`,
      [
        planId,
        coachId,
        customer_id,
        title,
        description || null,
        daily_calories || 2400,
        target_protein || 180,
        target_carbs || 220,
        target_fat || 65,
      ]
    );

    return NextResponse.json({ success: true, message: 'Diet plan assigned successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

