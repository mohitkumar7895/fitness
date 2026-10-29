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
      `SELECT wp.*, u.name as customer_name
       FROM workout_plans wp
       LEFT JOIN customer_profiles cp ON wp.customer_id = cp.id
       LEFT JOIN users u ON cp.user_id = u.id
       WHERE wp.coach_id = ?
       ORDER BY wp.created_at DESC`,
      [coachId]
    );

    const exercises = await query<any>('SELECT id, name, category, target_muscle FROM exercises ORDER BY name ASC');
    const clients = await query<any>(
      `SELECT cp.id, u.name FROM customer_profiles cp JOIN users u ON cp.user_id = u.id WHERE cp.assigned_coach_id = ?`,
      [coachId]
    );

    return NextResponse.json({ plans, exercises, clients });
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
    const { title, customer_id, description, goal, duration_weeks, level, exercises } = body;

    if (!title || !customer_id) {
      return NextResponse.json({ error: 'Title and customer are required' }, { status: 400 });
    }

    const planId = `wp_${Math.random().toString(36).substring(2, 9)}`;

    await execute(
      `INSERT INTO workout_plans (id, coach_id, customer_id, title, description, goal, duration_weeks, level, is_template, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 1)`,
      [planId, coachId, customer_id, title, description || null, goal || 'Hypertrophy', duration_weeks || 4, level || 'Intermediate']
    );

    // Insert exercises if supplied
    if (exercises && Array.isArray(exercises)) {
      for (let i = 0; i < exercises.length; i++) {
        const ex = exercises[i];
        await execute(
          `INSERT INTO workout_exercises (id, workout_plan_id, exercise_id, day_of_week, sets, reps, rest_seconds, weight_kg, order_index, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            `we_${Math.random().toString(36).substring(2, 9)}`,
            planId,
            ex.exercise_id,
            ex.day_of_week || 'Monday',
            ex.sets || 4,
            ex.reps || '8-10',
            ex.rest_seconds || 60,
            ex.weight_kg || 20,
            i,
            ex.notes || null,
          ]
        );
      }
    }

    return NextResponse.json({ success: true, message: 'Workout plan created and assigned successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

