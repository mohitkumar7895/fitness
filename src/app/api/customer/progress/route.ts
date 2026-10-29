import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query, queryOne, execute } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await queryOne<any>(
      'SELECT id, height, current_weight, target_weight FROM customer_profiles WHERE user_id = ?',
      [user.id]
    );

    if (!profile) {
      return NextResponse.json({ records: [], measurements: [] });
    }

    const records = await query<any>(
      'SELECT * FROM progress_records WHERE customer_id = ? ORDER BY recorded_date ASC',
      [profile.id]
    );

    const measurements = await query<any>(
      'SELECT * FROM body_measurements WHERE customer_id = ? ORDER BY recorded_date ASC',
      [profile.id]
    );

    return NextResponse.json({ profile, records, measurements });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await queryOne<any>(
      'SELECT id, height FROM customer_profiles WHERE user_id = ?',
      [user.id]
    );

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { weight, body_fat, chest, waist, hips, arms, notes } = body;

    if (!weight) {
      return NextResponse.json({ error: 'Weight is required' }, { status: 400 });
    }

    const parsedWeight = parseFloat(weight);
    const parsedFat = body_fat ? parseFloat(body_fat) : null;
    const parsedChest = chest ? parseFloat(chest) : null;
    const parsedWaist = waist ? parseFloat(waist) : null;
    const parsedHips = hips ? parseFloat(hips) : null;
    const parsedArms = arms ? parseFloat(arms) : null;

    const recordId = `prg_${Math.random().toString(36).substring(2, 9)}`;
    await execute(
      `INSERT INTO progress_records (id, customer_id, recorded_date, weight, body_fat, chest, waist, hips, arms, notes)
       VALUES (?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, ?)`,
      [recordId, profile.id, parsedWeight, parsedFat, parsedChest, parsedWaist, parsedHips, parsedArms, notes || null]
    );

    // Update current weight in customer profile
    await execute('UPDATE customer_profiles SET current_weight = ? WHERE id = ?', [
      parsedWeight,
      profile.id,
    ]);

    // Update body measurements table
    if (profile.height) {
      const heightM = profile.height / 100;
      const bmi = Number((parsedWeight / (heightM * heightM)).toFixed(1));
      await execute(
        `INSERT INTO body_measurements (id, customer_id, recorded_date, height, weight, bmi, body_fat_percentage)
         VALUES (?, ?, CURDATE(), ?, ?, ?, ?)`,
        [`bm_${Math.random().toString(36).substring(2, 9)}`, profile.id, profile.height, parsedWeight, bmi, parsedFat]
      );
    }

    return NextResponse.json({ success: true, message: 'Measurement recorded successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

