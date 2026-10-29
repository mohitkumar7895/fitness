import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get customer profile id
    const profile = await queryOne<any>(
      'SELECT id FROM customer_profiles WHERE user_id = ?',
      [user.id]
    );

    if (!profile) {
      return NextResponse.json({ workoutPlan: null, exercises: [] });
    }

    // Get active workout plan
    const workoutPlan = await queryOne<any>(
      `SELECT wp.*, cch.title as coach_title, u.name as coach_name
       FROM workout_plans wp
       LEFT JOIN coach_profiles cch ON wp.coach_id = cch.id
       LEFT JOIN users u ON cch.user_id = u.id
       WHERE wp.customer_id = ? AND wp.is_active = 1
       ORDER BY wp.created_at DESC LIMIT 1`,
      [profile.id]
    );

    if (!workoutPlan) {
      return NextResponse.json({ workoutPlan: null, exercises: [] });
    }

    // Get exercises for this plan
    const exercises = await query<any>(
      `SELECT we.*, e.name as exercise_name, e.category, e.target_muscle, e.equipment, e.instructions, e.difficulty
       FROM workout_exercises we
       JOIN exercises e ON we.exercise_id = e.id
       WHERE we.workout_plan_id = ?
       ORDER BY FIELD(we.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), we.order_index ASC`,
      [workoutPlan.id]
    );

    return NextResponse.json({ workoutPlan, exercises });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

