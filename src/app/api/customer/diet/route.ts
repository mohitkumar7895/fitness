import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

export async function GET() {
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
      return NextResponse.json({ dietPlan: null, meals: [] });
    }

    const dietPlan = await queryOne<any>(
      `SELECT dp.*, cch.title as coach_title, u.name as coach_name
       FROM diet_plans dp
       LEFT JOIN coach_profiles cch ON dp.coach_id = cch.id
       LEFT JOIN users u ON cch.user_id = u.id
       WHERE dp.customer_id = ? AND dp.is_active = 1
       ORDER BY dp.created_at DESC LIMIT 1`,
      [profile.id]
    );

    if (!dietPlan) {
      return NextResponse.json({ dietPlan: null, meals: [] });
    }

    const meals = await query<any>(
      `SELECT * FROM meals WHERE diet_plan_id = ? ORDER BY id ASC`,
      [dietPlan.id]
    );

    const mealsWithFood = await Promise.all(
      meals.map(async (m) => {
        const items = await query<any>(
          `SELECT * FROM food_items WHERE meal_id = ? ORDER BY id ASC`,
          [m.id]
        );
        return { ...m, items };
      })
    );

    return NextResponse.json({ dietPlan, meals: mealsWithFood });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

