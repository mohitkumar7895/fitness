import { NextResponse } from 'next/server';
import { execute, queryOne } from '@/lib/db';
import { hashPassword, signToken, TOKEN_COOKIE_NAME } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      date_of_birth,
      gender,
      city,
      height,
      current_weight,
      target_weight,
      fitness_experience,
      activity_level,
      fitness_goal,
      workout_preference,
      preferred_days,
      preferred_time,
      food_preference,
      dietary_restrictions,
      medical_conditions,
      injuries,
      notes,
      training_mode,
      preferred_trainer_id,
      membership_plan_slug,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await queryOne('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    const userId = `usr_${Math.random().toString(36).substring(2, 11)}`;
    const custProfileId = `cp_${Math.random().toString(36).substring(2, 11)}`;
    const hashedPassword = await hashPassword(password);

    // 1. Insert into users
    await execute(
      `INSERT INTO users (id, name, email, password, role, phone, avatar, is_active)
       VALUES (?, ?, ?, ?, 'CUSTOMER', ?, ?, 1)`,
      [
        userId,
        name,
        email,
        hashedPassword,
        phone || null,
        `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop`,
      ]
    );

    // 2. Insert into customer_profiles
    const parsedHeight = height ? parseFloat(height) : null;
    const parsedWeight = current_weight ? parseFloat(current_weight) : null;
    const parsedTargetWeight = target_weight ? parseFloat(target_weight) : null;

    await execute(
      `INSERT INTO customer_profiles (
        id, user_id, date_of_birth, gender, city, height, current_weight, target_weight,
        fitness_experience, activity_level, fitness_goal, workout_preference, preferred_days,
        preferred_time, food_preference, dietary_restrictions, medical_conditions, injuries,
        notes, training_mode, assigned_coach_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        custProfileId,
        userId,
        date_of_birth || null,
        gender || null,
        city || null,
        parsedHeight,
        parsedWeight,
        parsedTargetWeight,
        fitness_experience || 'Beginner',
        activity_level || 'Moderate',
        fitness_goal || 'General Fitness',
        workout_preference || 'Strength & Conditioning',
        preferred_days || 'Mon, Wed, Fri',
        preferred_time || 'Morning',
        food_preference || 'Balanced',
        dietary_restrictions || null,
        medical_conditions || null,
        injuries || null,
        notes || null,
        training_mode || 'BOTH',
        preferred_trainer_id || 'cch_001',
      ]
    );

    // 3. Insert lead into enquiries table so Admin gets the inquiry immediately
    try {
      const enqId = `enq_${Math.random().toString(36).substring(2, 11)}`;
      await execute(
        `INSERT INTO enquiries (id, name, email, phone, subject, message, fitness_goal, preferred_time, source, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'MEMBER_REGISTRATION', 'NEW', NOW())`,
        [
          enqId,
          name,
          email,
          phone || null,
          `New Member Registration: ${fitness_goal || 'General Fitness'}`,
          notes || `New member registered. Goal: ${fitness_goal || 'General Fitness'}. Preferred workout time: ${preferred_time || 'Morning'}.`,
          fitness_goal || 'General Fitness',
          preferred_time || 'Morning',
        ]
      );
    } catch (enqErr) {
      console.error('Error recording lead enquiry on registration:', enqErr);
    }

    // 4. Initial body measurement if height and weight provided
    if (parsedHeight && parsedWeight) {
      const bmi = Number((parsedWeight / Math.pow(parsedHeight / 100, 2)).toFixed(1));
      await execute(
        `INSERT INTO body_measurements (id, customer_id, recorded_date, height, weight, bmi)
         VALUES (?, ?, CURDATE(), ?, ?, ?)`,
        [`bm_${Math.random().toString(36).substring(2, 9)}`, custProfileId, parsedHeight, parsedWeight, bmi]
      );

      await execute(
        `INSERT INTO progress_records (id, customer_id, recorded_date, weight, notes)
         VALUES (?, ?, CURDATE(), ?, ?)`,
        [`prg_${Math.random().toString(36).substring(2, 9)}`, custProfileId, parsedWeight, 'Initial onboarding baseline assessment.']
      );
    }

    // 4. If membership plan selected, create active or pending membership
    if (membership_plan_slug) {
      const plan = await queryOne<any>(
        'SELECT id, duration_months FROM membership_plans WHERE slug = ?',
        [membership_plan_slug]
      );
      if (plan) {
        await execute(
          `INSERT INTO memberships (id, customer_id, plan_id, start_date, end_date, status, auto_renew)
           VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? MONTH), 'ACTIVE', 1)`,
          [`mem_${Math.random().toString(36).substring(2, 9)}`, custProfileId, plan.id, plan.duration_months]
        );
      }
    }

    // 5. Welcome notification
    await execute(
      `INSERT INTO notifications (id, user_id, title, message, type, link)
       VALUES (?, ?, 'Welcome to FitLife Wellness', 'Your fitness assessment has been recorded. Your Master Coach will review your biometric profile.', 'SYSTEM', '/dashboard')`,
      [`notif_${Math.random().toString(36).substring(2, 9)}`, userId]
    );

    // 6. Generate JWT and set cookie
    const token = signToken({ id: userId, email, role: 'CUSTOMER' });
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    const waNumber = (process.env.WHATSAPP_NUMBER || '919876543210').replace(/\D/g, '');
    const waText = encodeURIComponent(
      `Hi Coach Marcus! My name is ${name.trim()}. I just joined FitLife Wellness with the goal: "${fitness_goal || 'General Fitness'}". I would like to discuss my workout & nutrition plan!`
    );
    const whatsappUrl = `https://wa.me/${waNumber}?text=${waText}`;

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        name,
        email,
        role: 'CUSTOMER',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop',
      },
      whatsappUrl,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

