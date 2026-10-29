import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { queryOne, execute } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await queryOne<any>(
      `SELECT cp.*, u.name, u.email, u.phone, u.avatar,
              cch.title as coach_title, cu.name as coach_name, cu.avatar as coach_avatar,
              mp.name as plan_name, m.status as membership_status, m.end_date as membership_end_date
       FROM customer_profiles cp
       JOIN users u ON cp.user_id = u.id
       LEFT JOIN coach_profiles cch ON cp.assigned_coach_id = cch.id
       LEFT JOIN users cu ON cch.user_id = cu.id
       LEFT JOIN memberships m ON m.customer_id = cp.id AND m.status = 'ACTIVE'
       LEFT JOIN membership_plans mp ON m.plan_id = mp.id
       WHERE cp.user_id = ?`,
      [user.id]
    );

    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      phone,
      height,
      current_weight,
      target_weight,
      fitness_goal,
      food_preference,
      dietary_restrictions,
      injuries,
      notes,
    } = body;

    // Update user
    if (name || phone) {
      await execute('UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone) WHERE id = ?', [
        name,
        phone,
        user.id,
      ]);
    }

    // Update customer profile
    await execute(
      `UPDATE customer_profiles SET
        height = COALESCE(?, height),
        current_weight = COALESCE(?, current_weight),
        target_weight = COALESCE(?, target_weight),
        fitness_goal = COALESCE(?, fitness_goal),
        food_preference = COALESCE(?, food_preference),
        dietary_restrictions = COALESCE(?, dietary_restrictions),
        injuries = COALESCE(?, injuries),
        notes = COALESCE(?, notes)
       WHERE user_id = ?`,
      [
        height,
        current_weight,
        target_weight,
        fitness_goal,
        food_preference,
        dietary_restrictions,
        injuries,
        notes,
        user.id,
      ]
    );

    return NextResponse.json({ success: true, message: 'Profile updated successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

