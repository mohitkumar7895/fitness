import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query, execute } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plans = await query<any>(
      `SELECT dp.*, 
              cu.name as coach_name,
              cust_u.name as customer_name
       FROM diet_plans dp
       LEFT JOIN coach_profiles cp ON dp.coach_id = cp.id
       LEFT JOIN users cu ON cp.user_id = cu.id
       LEFT JOIN customer_profiles cust ON dp.customer_id = cust.id
       LEFT JOIN users cust_u ON cust.user_id = cust_u.id
       ORDER BY dp.created_at DESC`
    );

    const coaches = await query<any>(
      `SELECT cp.id, u.name FROM coach_profiles cp JOIN users u ON cp.user_id = u.id WHERE u.is_active = 1`
    );

    const customers = await query<any>(
      `SELECT cp.id, u.name FROM customer_profiles cp JOIN users u ON cp.user_id = u.id WHERE u.is_active = 1`
    );

    return NextResponse.json({ plans, coaches, customers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, daily_calories, target_protein, target_carbs, target_fat, coach_id, customer_id, is_template } = body;

    if (!title || !daily_calories) {
      return NextResponse.json({ error: 'Title and daily calories required' }, { status: 400 });
    }

    const id = `dp_${Math.random().toString(36).substring(2, 9)}`;

    await execute(
      `INSERT INTO diet_plans (
        id, coach_id, customer_id, title, description, daily_calories,
        target_protein, target_carbs, target_fat, is_template, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        id,
        coach_id || null,
        customer_id || null,
        title,
        description || '',
        parseInt(daily_calories),
        target_protein ? parseInt(target_protein) : 150,
        target_carbs ? parseInt(target_carbs) : 200,
        target_fat ? parseInt(target_fat) : 60,
        is_template ? 1 : 0,
      ]
    );

    return NextResponse.json({ success: true, message: 'Diet protocol created.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Diet plan ID required' }, { status: 400 });
    }

    await execute('DELETE FROM diet_plans WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Diet plan deleted.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

