import bcrypt from 'bcryptjs';
import pool, { execute, queryOne } from './db';
import { IMAGES } from './images';

async function seed() {
  console.log('--- Commencing Database Seeding for FitLife FITNESS ---');

  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
  const hashedPasswordCoach = await bcrypt.hash('coach123', 10);
  const hashedPasswordUser = await bcrypt.hash('customer123', 10);

  // 1. Users & Profiles
  console.log('Seeding Users & Profiles...');

  // Super Admin
  const adminId = 'usr_admin_001';
  await execute(
    `INSERT INTO users (id, name, email, password, role, avatar, phone, is_active)
     VALUES (?, ?, ?, ?, 'SUPERADMIN', ?, ?, 1)
     ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password)`,
    [
      adminId,
      'Victor Vance',
      'admin@fitlifewellness.com',
      hashedPasswordAdmin,
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
      '+91 98765 00001',
    ]
  );

  // Coaches
  const coaches = [
    {
      userId: 'usr_coach_001',
      profileId: 'cch_001',
      name: 'Marcus Vance',
      email: 'marcus@fitlifewellness.com',
      avatar: IMAGES.trainers.marcus,
      phone: '+91 98765 11001',
      title: 'Head of Strength & Biomechanics',
      bio: 'Former Olympic weightlifting coach with 12+ years of experience transforming elite athletes and executives.',
      exp: 12,
      certs: 'CSCS (NSCA), USAW Level 2, Precision Nutrition L2',
      specs: 'Hypertrophy, Powerlifting, Biomechanical Rehab, Peak Athletic Conditioning',
      rate: 85,
      rating: 4.98,
      reviews: 210,
    },
    {
      userId: 'usr_coach_002',
      profileId: 'cch_002',
      name: 'Elena Rostova',
      email: 'elena@fitlifewellness.com',
      avatar: IMAGES.trainers.elena,
      phone: '+91 98765 11002',
      title: 'Senior High-Performance & Conditioning Coach',
      bio: 'Master trainer specializing in body recomposition, metabolic conditioning, and female athletic longevity.',
      exp: 9,
      certs: 'NASM Master Trainer, EXOS Performance Specialist, Kettlebell Master',
      specs: 'Female Body Sculpting, HIIT & VO2 Max, Core Stability, Metabolic Shred',
      rate: 75,
      rating: 4.96,
      reviews: 185,
    },
    {
      userId: 'usr_coach_003',
      profileId: 'cch_003',
      name: 'Kai Jensen',
      email: 'kai@fitlifewellness.com',
      avatar: IMAGES.trainers.kai,
      phone: '+91 98765 11003',
      title: 'Hypertrophy & Physique Architecture Specialist',
      bio: 'Bodybuilding champion and sports scientist focused on maximum muscle development and posture optimization.',
      exp: 8,
      certs: 'ISSA Master Trainer, PN Nutrition Specialist, FMS Level 2',
      specs: 'Hypertrophy Science, Muscle Symmetry, Contest Prep, Bulking Mechanics',
      rate: 70,
      rating: 4.94,
      reviews: 140,
    },
    {
      userId: 'usr_coach_004',
      profileId: 'cch_004',
      name: 'Sarah Jenkins',
      email: 'sarah@fitlifewellness.com',
      avatar: IMAGES.trainers.sarah,
      phone: '+91 98765 11004',
      title: 'Holistic Transformation & Nutrition Director',
      bio: 'Clinical sports dietitian and functional movement coach with over 1,000 successful weight loss transformations.',
      exp: 10,
      certs: 'Registered Dietitian (RD), ACE Certified Personal Trainer, Yoga Alliance RYT-500',
      specs: 'Rapid Fat Loss, Hormonal Health, Mindful Nutrition, Mobility & Flexibility',
      rate: 70,
      rating: 4.97,
      reviews: 195,
    },
  ];

  for (const c of coaches) {
    await execute(
      `INSERT INTO users (id, name, email, password, role, avatar, phone, is_active)
       VALUES (?, ?, ?, ?, 'COACH', ?, ?, 1)
       ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password), avatar=VALUES(avatar)`,
      [c.userId, c.name, c.email, hashedPasswordCoach, c.avatar, c.phone]
    );

    await execute(
      `INSERT INTO coach_profiles (id, user_id, title, bio, experience_years, certifications, specializations, hourly_rate, rating, review_count, is_available, is_featured, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 0)
       ON DUPLICATE KEY UPDATE title=VALUES(title), bio=VALUES(bio), rating=VALUES(rating)`,
      [c.profileId, c.userId, c.title, c.bio, c.exp, c.certs, c.specs, c.rate, c.rating, c.reviews]
    );
  }

  // Customers
  const customerId = 'usr_cust_001';
  const custProfileId = 'cust_prof_001';
  await execute(
    `INSERT INTO users (id, name, email, password, role, avatar, phone, is_active)
     VALUES (?, ?, ?, ?, 'CUSTOMER', ?, ?, 1)
     ON DUPLICATE KEY UPDATE name=VALUES(name)`,
    [
      customerId,
      'Alex Mercer',
      'alex@example.com',
      hashedPasswordUser,
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=600&auto=format&fit=crop',
      '+91 98765 22001',
    ]
  );

  await execute(
    `INSERT INTO customer_profiles (id, user_id, date_of_birth, gender, city, height, current_weight, target_weight, fitness_experience, activity_level, fitness_goal, workout_preference, preferred_days, preferred_time, food_preference, assigned_coach_id)
     VALUES (?, ?, '1995-06-15', 'Male', 'Metro City', 182, 84, 76, 'Intermediate', 'Very Active', 'Body Recomposition & Fat Loss', 'Strength & HIIT', 'Mon, Wed, Fri, Sat', 'Morning (07:00 AM)', 'High Protein Non-Veg', 'cch_001')
     ON DUPLICATE KEY UPDATE height=VALUES(height), current_weight=VALUES(current_weight)`,
    [custProfileId, customerId]
  );

  // 2. Fitness Goals
  console.log('Seeding Fitness Goals...');
  const goals = [
    { id: 'fg_01', name: 'Weight Loss & Shred', slug: 'weight-loss', desc: 'Shed stubborn fat, boost metabolism, and reveal lean muscular definition.', icon: 'Flame', img: IMAGES.programs.weightLoss },
    { id: 'fg_02', name: 'Hypertrophy & Muscle Building', slug: 'muscle-building', desc: 'Pack on dense lean muscle mass with progressive overload and nutrient timing.', icon: 'Dumbbell', img: IMAGES.programs.muscleBuilding },
    { id: 'fg_03', name: 'Total Body Transformation', slug: 'body-transformation', desc: 'Complete lifestyle, aesthetic, and physical reboot in 12 structured weeks.', icon: 'Zap', img: IMAGES.programs.bodyTransformation },
    { id: 'fg_04', name: 'VIP 1-on-1 Personal Coaching', slug: 'personal-training', desc: 'Bespoke direct coaching with Master Trainers, custom biomechanics, and accountability.', icon: 'UserCheck', img: IMAGES.programs.personalTraining },
    { id: 'fg_05', name: 'Athletic Strength & Power', slug: 'strength-training', desc: 'Develop explosive athletic power, kinetic chain resilience, and raw strength.', icon: 'Activity', img: IMAGES.programs.strengthTraining },
    { id: 'fg_06', name: 'Mobility, Core & Longevity', slug: 'yoga-flexibility', desc: 'Decompress joints, restore movement patterns, and build indestructible core stability.', icon: 'HeartPulse', img: IMAGES.programs.yogaFlexibility },
  ];

  for (const g of goals) {
    await execute(
      `INSERT INTO fitness_goals (id, name, slug, description, icon, image, display_order)
       VALUES (?, ?, ?, ?, ?, ?, 0)
       ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), image=VALUES(image)`,
      [g.id, g.name, g.slug, g.desc, g.icon, g.img]
    );
  }

  // 3. Program Categories & Programs
  console.log('Seeding Programs...');
  const cat01 = 'pcat_01';
  const cat02 = 'pcat_02';
  const cat03 = 'pcat_03';

  await execute(`INSERT INTO program_categories (id, name, slug, description) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name)`, [cat01, 'Physique Architecture', 'physique-architecture', 'Targeted muscle sculpting and aesthetic body composition programs']);
  await execute(`INSERT INTO program_categories (id, name, slug, description) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name)`, [cat02, 'Fat Loss & Conditioning', 'fat-loss-conditioning', 'High-octane metabolic burn and athletic cardiovascular endurance']);
  await execute(`INSERT INTO program_categories (id, name, slug, description) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name)`, [cat03, 'Elite Coaching', 'elite-coaching', 'Dedicated bespoke programming with 1-on-1 monitoring']);

  const programs = [
    {
      id: 'prg_001',
      title: 'Hypertrophy Elite: Maximum Mass',
      slug: 'hypertrophy-elite',
      catId: cat01,
      coachId: 'cch_001',
      excerpt: 'The definitive 12-week muscle building protocol engineered around progressive overload and biomechanical precision.',
      desc: 'Hypertrophy Elite is designed for intermediate to advanced lifters looking to shatter plateaus and build substantial lean muscle mass. Using proven periodization, mechanical tension, and metabolic stress, every workout targets optimal motor unit recruitment.',
      weeks: 12,
      level: 'Intermediate - Advanced',
      price: 14999,
      origPrice: 19999,
      features: 'Periodized 5-day split, Biomechanics form checks, Complete macro blueprint, Weekly progress audit, App tracking access',
      image: IMAGES.programs.muscleBuilding,
    },
    {
      id: 'prg_002',
      title: 'Rapid Metabolic Fat Shred',
      slug: 'rapid-fat-shred',
      catId: cat02,
      coachId: 'cch_004',
      excerpt: 'Scientifically calibrated fat loss without muscle sacrifice. Accelerate thermogenesis and caloric burn.',
      desc: 'Our flagship weight-loss architecture combining high-intensity resistance training with tailored nutrient deficits. Experience dramatic reductions in body fat while keeping energy levels soaring throughout the day.',
      weeks: 8,
      level: 'All Fitness Levels',
      price: 11999,
      origPrice: 15999,
      features: 'Full metabolic nutrition plan, HIIT and steady-state cardio matrix, Heart-rate zone coaching, Weekly body composition scans',
      image: IMAGES.programs.weightLoss,
    },
    {
      id: 'prg_003',
      title: '90-Day Total Body Recomposition',
      slug: 'total-body-recomposition',
      catId: cat01,
      coachId: 'cch_002',
      excerpt: 'Simultaneously drop body fat and sculpt dense, athletic muscle through advanced nutrient timing and hybrid training.',
      desc: 'Body recomposition is the holy grail of fitness. We leverage calorie cycling, compound movement mastery, and targeted recovery protocols so you transform your physique from head to toe.',
      weeks: 12,
      level: 'Intermediate',
      price: 17999,
      origPrice: 24999,
      features: 'Macro-cycling nutrition guides, Hybrid strength + conditioning, Daily coach chat support, Full mobility and recovery module',
      image: IMAGES.programs.bodyTransformation,
    },
    {
      id: 'prg_004',
      title: 'Private Executive Personal Coaching',
      slug: 'private-executive-coaching',
      catId: cat03,
      coachId: 'cch_001',
      excerpt: 'The pinnacle 1-on-1 experience. Custom tailored fitness, nutrition concierge, and direct Master Trainer mentorship.',
      desc: 'Designed for busy entrepreneurs, executives, and athletes who demand zero guesswork and immaculate results. Includes private training bays, priority scheduling, and 24/7 concierge nutrition support.',
      weeks: 16,
      level: 'VIP Custom',
      price: 29999,
      origPrice: 39999,
      features: 'Dedicated Master Coach, Private suite training, Complete meal delivery planning, Bloodwork & hormone review, 24/7 direct coach access',
      image: IMAGES.programs.personalTraining,
    },
    {
      id: 'prg_005',
      title: 'High-Performance Athletic Strength',
      slug: 'athletic-strength-conditioning',
      catId: cat02,
      coachId: 'cch_002',
      excerpt: 'Build unstoppable power, sprint velocity, vertical force, and bulletproof joint resilience.',
      desc: 'Bridge the gap between gym aesthetics and real-world athletic performance. Master Olympic lifting fundamentals, plyometrics, and rotational power transfers.',
      weeks: 10,
      level: 'Intermediate - Advanced',
      price: 13499,
      origPrice: 18999,
      features: 'Velocity-based training metrics, Olympic lifting technique breakdowns, ACL & shoulder resilience protocols, Speed & agility drills',
      image: IMAGES.programs.strengthTraining,
    },
    {
      id: 'prg_006',
      title: 'Dynamic Mobility, Core & Longevity',
      slug: 'mobility-core-longevity',
      catId: cat03,
      coachId: 'cch_004',
      excerpt: 'Restore full joint range of motion, eradicate chronic stiffness, and construct an unbreakable core foundation.',
      desc: 'Eliminate lower back tightness, expand thoracic extension, and enhance hip fluidity. A vital companion program for heavy lifters or desk-bound professionals.',
      weeks: 6,
      level: 'All Fitness Levels',
      price: 8999,
      origPrice: 11999,
      features: 'Daily 20-min flow routines, Myofascial release guide, Anti-rotational core matrix, Breathwork and parasympathetic recovery',
      image: IMAGES.programs.yogaFlexibility,
    },
  ];

  for (const p of programs) {
    await execute(
      `INSERT INTO programs (id, title, slug, category_id, coach_id, excerpt, description, duration_weeks, level, price, original_price, features, image, is_featured, is_published, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 0)
       ON DUPLICATE KEY UPDATE title=VALUES(title), price=VALUES(price), features=VALUES(features), image=VALUES(image)`,
      [p.id, p.title, p.slug, p.catId, p.coachId, p.excerpt, p.desc, p.weeks, p.level, p.price, p.origPrice, p.features, p.image]
    );
  }

  // 4. Membership Plans
  console.log('Seeding Membership Plans...');
  const plans = [
    {
      id: 'plan_01',
      name: 'Monthly Kickstart',
      slug: 'monthly-kickstart',
      tag: 'Flexible Access',
      months: 1,
      price: 3999,
      origPrice: 4999,
      billing: 'monthly',
      features: 'Full club access 05:00 - 23:00, Free body composition scan, Group fitness classes included, Locker & steam lounge, Mobile app workout tracking',
      isPopular: false,
    },
    {
      id: 'plan_02',
      name: 'Quarterly Transformer',
      slug: 'quarterly-transformer',
      tag: 'Most Popular',
      months: 3,
      price: 9999,
      origPrice: 13999,
      billing: 'quarterly',
      features: 'All Monthly features included, 2 Free 1-on-1 personal coaching sessions, Customized nutritionist diet consultation, Priority booking for recovery suites, 10% discount on health bar',
      isPopular: true,
    },
    {
      id: 'plan_03',
      name: 'Half-Yearly Elite Athlete',
      slug: 'half-yearly-elite',
      tag: 'Best Value',
      months: 6,
      price: 17999,
      origPrice: 24999,
      billing: 'half-yearly',
      features: 'Unlimited all-access multi-zone pass, 6 Private coaching sessions, Bi-weekly body composition & VO2 audit, Dedicated athlete locker, Free guest passes (2 per month)',
      isPopular: false,
    },
    {
      id: 'plan_04',
      name: 'Annual Black Card VIP',
      slug: 'annual-black-card',
      tag: 'Luxury All-Inclusive',
      months: 12,
      price: 29999,
      origPrice: 44999,
      billing: 'annually',
      features: 'Unlimited VIP suite access, 12 Dedicated 1-on-1 coaching sessions, Comprehensive quarterly blood panel consultation, Complimentary daily protein shake, Unlimited infrared sauna & cryo recovery, Concierge laundry service',
      isPopular: false,
    },
  ];

  for (const pl of plans) {
    await execute(
      `INSERT INTO membership_plans (id, name, slug, tag, duration_months, price, original_price, billing_period, features, is_popular, is_published, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)
       ON DUPLICATE KEY UPDATE price=VALUES(price), features=VALUES(features)`,
      [pl.id, pl.name, pl.slug, pl.tag, pl.months, pl.price, pl.origPrice, pl.billing, pl.features, pl.isPopular ? 1 : 0]
    );
  }

  // Active membership for Alex Mercer
  await execute(
    `INSERT INTO memberships (id, customer_id, plan_id, start_date, end_date, status, auto_renew)
     VALUES ('mem_001', ?, 'plan_02', NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY), 'ACTIVE', 1)
     ON DUPLICATE KEY UPDATE status='ACTIVE'`,
    [custProfileId]
  );

  // 5. Exercises
  console.log('Seeding Exercises...');
  const exercises = [
    { id: 'ex_01', name: 'Barbell Back Squat', slug: 'barbell-back-squat', cat: 'Strength', muscle: 'Quadriceps, Glutes, Core', equip: 'Barbell & Squat Rack', diff: 'Intermediate', inst: 'Unrack barbell across upper traps. Inhale deeply, brace abdominal wall, hinge hips backward while bending knees until hip crease is below knee level. Drive through midfoot to return upright.' },
    { id: 'ex_02', name: 'Romanian Deadlift (RDL)', slug: 'romanian-deadlift', cat: 'Strength', muscle: 'Hamstrings, Gluteus Maximus, Lower Back', equip: 'Barbell', diff: 'Intermediate', inst: 'Hold barbell at hip level with shoulder-width grip. Soften knees, push hips backward maintaining neutral spine. Lower bar along shins until hamstrings are fully loaded, then thrust hips forward to lock out.' },
    { id: 'ex_03', name: 'Incline Dumbbell Chest Press', slug: 'incline-dumbbell-press', cat: 'Hypertrophy', muscle: 'Upper Pectoralis, Anterior Deltoids, Triceps', equip: 'Dumbbells & 30-degree Bench', diff: 'Intermediate', inst: 'Lie on 30-degree incline bench with dumbbells at upper chest level. Drive weights overhead without slamming bells together, focusing on clavicular pec contraction. Lower under 3-second control.' },
    { id: 'ex_04', name: 'Overhead Barbell Military Press', slug: 'barbell-overhead-press', cat: 'Strength', muscle: 'Deltoids, Upper Chest, Triceps, Serratus', equip: 'Barbell', diff: 'Intermediate', inst: 'Grip bar just outside shoulders at collarbone level. Squeeze glutes and quads. Press vertically in a straight path, pulling head slightly through window at lockout.' },
    { id: 'ex_05', name: 'Neutral Grip Lat Pulldown', slug: 'neutral-lat-pulldown', cat: 'Hypertrophy', muscle: 'Latissimus Dorsi, Teres Major, Biceps', equip: 'Cable Pulldown Machine', diff: 'Beginner', inst: 'Secure thighs firmly under pads. Grasp neutral bar attachment. Depress scapulae down and drive elbows towards hip pockets, squeezing lats at bottom.' },
    { id: 'ex_06', name: 'Bulgarian Split Squat', slug: 'bulgarian-split-squat', cat: 'Strength', muscle: 'Quadriceps, Glute Medius, Adductors', equip: 'Dumbbells & Bench', diff: 'Advanced', inst: 'Place rear foot elevated on bench behind you. Lower rear knee towards floor in controlled descent until front femur is parallel. Drive up cleanly through front heel.' },
    { id: 'ex_07', name: 'Cable Lateral Raise', slug: 'cable-lateral-raise', cat: 'Hypertrophy', muscle: 'Lateral Deltoids', equip: 'Cable Tower', diff: 'Beginner', inst: 'Set cable pulley at wrist height. Grasp handle across torso, raise arm laterally up to 80-90 degrees with pinky slightly elevated for maximum side delt isolation.' },
    { id: 'ex_08', name: 'Barbell Bicep Curl', slug: 'barbell-bicep-curl', cat: 'Hypertrophy', muscle: 'Biceps Brachii, Brachialis', equip: 'Barbell or EZ-Bar', diff: 'Beginner', inst: 'Stand tall with supinated grip shoulder-width apart. Curl barbell towards chest while keeping elbows pinned to ribs. Lower down with a full extension stretch.' },
    { id: 'ex_09', name: 'Rope Tricep Cable Extension', slug: 'cable-tricep-extension', cat: 'Hypertrophy', muscle: 'Triceps Brachii (All Heads)', equip: 'High Cable Pulley & Rope', diff: 'Beginner', inst: 'Hinge slightly forward at hips. Extend elbows fully downwards and spread rope ends apart at full lockout to engage lateral tricep head.' },
    { id: 'ex_10', name: 'Hanging Leg & Knee Raise', slug: 'hanging-leg-raise', cat: 'Core', muscle: 'Rectus Abdominis, Hip Flexors, Obliques', equip: 'Pull-up Bar', diff: 'Intermediate', inst: 'Hang freely from pull-up bar with active shoulder engagement. Without swinging, tilt pelvis and curl knees up to chest level. Lower slowly under active abdominal tension.' },
  ];

  for (const e of exercises) {
    await execute(
      `INSERT INTO exercises (id, name, slug, category, target_muscle, equipment, instructions, difficulty)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), instructions=VALUES(instructions)`,
      [e.id, e.name, e.slug, e.cat, e.muscle, e.equip, e.inst, e.diff]
    );
  }

  // 6. Workout Plan for Customer
  console.log('Seeding Sample Workout Plan...');
  const wpId = 'wp_cust_01';
  await execute(
    `INSERT INTO workout_plans (id, coach_id, customer_id, title, description, goal, duration_weeks, level, is_template, is_active)
     VALUES (?, 'cch_001', ?, 'Elite 4-Day Upper / Lower Hypertrophy Split', 'Focused on progressive strength development and lean muscular fullness.', 'Body Recomposition', 8, 'Intermediate', 0, 1)
     ON DUPLICATE KEY UPDATE title=VALUES(title)`,
    [wpId, custProfileId]
  );

  const workoutItems = [
    { exId: 'ex_01', day: 'Monday', sets: 4, reps: '6-8', rest: 120, wt: 100, ord: 1, notes: 'Focus on explosive drive out of the hole' },
    { exId: 'ex_02', day: 'Monday', sets: 3, reps: '8-10', rest: 90, wt: 90, ord: 2, notes: 'Deep stretch on hamstrings' },
    { exId: 'ex_06', day: 'Monday', sets: 3, reps: '10-12', rest: 60, wt: 22, ord: 3, notes: 'Unilateral quad burn' },
    { exId: 'ex_03', day: 'Tuesday', sets: 4, reps: '8-10', rest: 90, wt: 32, ord: 1, notes: 'Control negative 3 seconds' },
    { exId: 'ex_05', day: 'Tuesday', sets: 4, reps: '10-12', rest: 75, wt: 65, ord: 2, notes: 'Squeeze lats hard at bottom' },
    { exId: 'ex_04', day: 'Tuesday', sets: 3, reps: '8-10', rest: 90, wt: 50, ord: 3, notes: 'Keep core tight, no hyperextension' },
    { exId: 'ex_07', day: 'Tuesday', sets: 4, reps: '12-15', rest: 45, wt: 12, ord: 4, notes: 'Continuous tension' },
    { exId: 'ex_08', day: 'Thursday', sets: 3, reps: '10-12', rest: 60, wt: 35, ord: 1, notes: 'Bicep peak contraction' },
    { exId: 'ex_09', day: 'Thursday', sets: 3, reps: '12-15', rest: 60, wt: 40, ord: 2, notes: 'Spread rope at finish' },
    { exId: 'ex_10', day: 'Friday', sets: 4, reps: '12-15', rest: 60, wt: 0, ord: 1, notes: 'Full pelvic roll-up' },
  ];

  await execute(`DELETE FROM workout_exercises WHERE workout_plan_id = ?`, [wpId]);
  for (let i = 0; i < workoutItems.length; i++) {
    const wi = workoutItems[i];
    await execute(
      `INSERT INTO workout_exercises (id, workout_plan_id, exercise_id, day_of_week, sets, reps, rest_seconds, weight_kg, order_index, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [`we_${i + 1}`, wpId, wi.exId, wi.day, wi.sets, wi.reps, wi.rest, wi.wt, wi.ord, wi.notes]
    );
  }

  // 7. Diet Plans
  console.log('Seeding Diet Plans & Meals...');
  const dpId = 'dp_cust_01';
  await execute(
    `INSERT INTO diet_plans (id, coach_id, customer_id, title, description, daily_calories, target_protein, target_carbs, target_fat, is_template, is_active)
     VALUES (?, 'cch_004', ?, 'High-Protein Metabolic Recomp Blueprint', 'Calibrated for Alex Mercer: 2,400 kcal nutrient-dense meal plan with 180g protein.', 2400, 180, 240, 65, 0, 1)
     ON DUPLICATE KEY UPDATE title=VALUES(title), daily_calories=VALUES(daily_calories)`,
    [dpId, custProfileId]
  );

  const mealsData = [
    {
      id: 'meal_01',
      type: 'Breakfast',
      time: '07:30 AM',
      inst: 'Consume 30 minutes after hydration. Pair with 500ml lemon water.',
      items: [
        { name: 'Cage-Free Eggs (3 whole + 2 whites)', portion: '5 eggs', cal: 320, p: 32, c: 2, f: 18 },
        { name: 'Rolled Oats with Cinnamon & Chia', portion: '80g dry', cal: 310, p: 10, c: 54, f: 6 },
        { name: 'Fresh Blueberries', portion: '1 cup', cal: 85, p: 1, c: 21, f: 0.5 },
      ],
    },
    {
      id: 'meal_02',
      type: 'Lunch',
      time: '01:00 PM',
      inst: 'Main refuel meal. Slow-burning complex carbs for sustained afternoon focus.',
      items: [
        { name: 'Grilled Herb Chicken Breast', portion: '200g', cal: 330, p: 48, c: 0, f: 7 },
        { name: 'Steamed Jasmine Rice or Quinoa', portion: '180g cooked', cal: 240, p: 5, c: 52, f: 1 },
        { name: 'Sautéed Asparagus & Bell Peppers', portion: '150g', cal: 70, p: 3, c: 10, f: 2 },
        { name: 'Extra Virgin Olive Oil drizzle', portion: '1 tbsp', cal: 120, p: 0, c: 0, f: 14 },
      ],
    },
    {
      id: 'meal_03',
      type: 'Pre-Workout Snack',
      time: '04:30 PM',
      inst: 'Take 45-60 minutes before lifting session for instant glycogen availability.',
      items: [
        { name: 'FitLife Pure Whey Isolate', portion: '1 scoop (30g)', cal: 120, p: 26, c: 2, f: 1 },
        { name: 'Banana with Natural Almond Butter', portion: '1 medium + 1 tbsp', cal: 200, p: 4, c: 30, f: 9 },
      ],
    },
    {
      id: 'meal_04',
      type: 'Dinner',
      time: '08:30 PM',
      inst: 'Restorative evening meal rich in Omega-3 fatty acids and zinc for overnight recovery.',
      items: [
        { name: 'Pan-Seared Wild Salmon Fillet', portion: '200g', cal: 410, p: 40, c: 0, f: 24 },
        { name: 'Roasted Sweet Potato Wedges', portion: '160g', cal: 145, p: 3, c: 34, f: 0.2 },
        { name: 'Mixed Organic Green Salad with Lemon', portion: '200g', cal: 50, p: 2, c: 8, f: 1 },
      ],
    },
  ];

  await execute(`DELETE FROM meals WHERE diet_plan_id = ?`, [dpId]);
  for (const m of mealsData) {
    await execute(
      `INSERT INTO meals (id, diet_plan_id, day_of_week, meal_type, time_of_day, instructions)
       VALUES (?, ?, 'All Days', ?, ?, ?)`,
      [m.id, dpId, m.type, m.time, m.inst]
    );

    for (let j = 0; j < m.items.length; j++) {
      const it = m.items[j];
      await execute(
        `INSERT INTO food_items (\`id\`, \`meal_id\`, \`name\`, \`portion\`, \`calories\`, \`protein\`, \`carbs\`, \`fat\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [`fi_${m.id}_${j + 1}`, m.id, it.name, it.portion, it.cal, it.p, it.c, it.f]
      );
    }
  }

  // 8. Progress Records & Measurements
  console.log('Seeding Customer Progress History...');
  const progressLogs = [
    { date: '2026-08-01', wt: 88.5, fat: 22.4, chest: 104, waist: 92, arms: 37, hips: 102 },
    { date: '2026-08-15', wt: 87.2, fat: 21.0, chest: 104, waist: 90, arms: 37.2, hips: 101 },
    { date: '2026-09-01', wt: 86.0, fat: 19.8, chest: 105, waist: 88, arms: 37.5, hips: 100 },
    { date: '2026-09-15', wt: 85.1, fat: 18.6, chest: 105.5, waist: 86.5, arms: 38, hips: 99 },
    { date: '2026-10-01', wt: 84.4, fat: 17.5, chest: 106, waist: 85, arms: 38.3, hips: 98.5 },
    { date: '2026-10-15', wt: 84.0, fat: 16.8, chest: 106.5, waist: 84, arms: 38.8, hips: 98 },
  ];

  await execute(`DELETE FROM progress_records WHERE customer_id = ?`, [custProfileId]);
  for (let k = 0; k < progressLogs.length; k++) {
    const pl = progressLogs[k];
    await execute(
      `INSERT INTO progress_records (id, customer_id, recorded_date, weight, body_fat, chest, waist, hips, arms, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [`prg_rec_${k + 1}`, custProfileId, pl.date, pl.wt, pl.fat, pl.chest, pl.waist, pl.hips, pl.arms, 'Steady fat loss and visible vascularity progress. Strength maintained on all compound lifts.']
    );

    const bmi = Number((pl.wt / (1.82 * 1.82)).toFixed(1));
    await execute(
      `INSERT INTO body_measurements (id, customer_id, recorded_date, height, weight, bmi, bmr, body_fat_percentage, muscle_mass)
       VALUES (?, ?, ?, 182, ?, ?, 1850, ?, ?)
       ON DUPLICATE KEY UPDATE weight=VALUES(weight)`,
      [`bm_${k + 1}`, custProfileId, pl.date, pl.wt, bmi, pl.fat, pl.wt * (1 - pl.fat / 100)]
    );
  }

  // 9. Testimonials & Transformations
  console.log('Seeding Testimonials & Transformations...');
  const testimonials = [
    {
      id: 'tstm_01',
      name: 'Rohan Deshmukh',
      role: 'Tech Founder & Marathoner',
      goal: 'Fat Loss & Core Power',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
      rating: 5,
      content: 'FitLife transformed how I look, feel, and perform in business. Marcus completely re-engineered my deadlift biomechanics and diet. I dropped 14 kg in 12 weeks while increasing my energy for 14-hour workdays.',
      res: '-14 kg in 12 weeks',
      beforeWt: 96,
      afterWt: 82,
      beforeImg: IMAGES.transformations.t1Before,
      afterImg: IMAGES.transformations.t1After,
    },
    {
      id: 'tstm_02',
      name: 'Dr. Priya Nambiar',
      role: 'Surgeon & Cross-Trainer',
      goal: 'Postural Rehabilitation & Lean Mass',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
      rating: 5,
      content: 'Standing in the operating room for 8 hours was destroying my lower back. Coach Elena created a postural and strength regimen that eliminated my sciatica within 6 weeks and sculpted 5 kg of lean muscle.',
      res: 'Sciatica Cured & +5kg Lean Muscle',
      beforeWt: 68,
      afterWt: 63,
      beforeImg: IMAGES.transformations.t2Before,
      afterImg: IMAGES.transformations.t2After,
    },
    {
      id: 'tstm_03',
      name: 'Vikram Sethi',
      role: 'Private Equity Director',
      goal: 'Hypertrophy & Longevity',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
      rating: 5,
      content: 'The Black Card VIP experience is second to none in Asia. Private coaching suites, precision cryo therapy, and zero waiting for world-class equipment. I added 6 cm to my chest circumference in 4 months.',
      res: '+6.5 kg Pure Muscle Mass',
      beforeWt: 74,
      afterWt: 80.5,
      beforeImg: IMAGES.transformations.t3Before,
      afterImg: IMAGES.transformations.t3After,
    },
    {
      id: 'tstm_04',
      name: 'Natasha Kapoor',
      role: 'Architect & Mother of Two',
      goal: 'Postpartum Athletic Rebound',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
      rating: 5,
      content: 'Sarah Jenkins is a miracle worker. She tailored a post-pregnancy core restoration program that restored my abdominal wall integrity and helped me get back into the best shape of my life.',
      res: '-18 kg in 16 weeks',
      beforeWt: 78,
      afterWt: 60,
      beforeImg: IMAGES.transformations.t2Before,
      afterImg: IMAGES.transformations.t2After,
    },
    {
      id: 'tstm_05',
      name: 'Arjun Mehta',
      role: 'National Badminton Player',
      goal: 'Rotational Power & Sprint Velocity',
      avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
      rating: 5,
      content: 'The velocity-based training systems at FitLife gave me a decisive edge on court. My vertical jump increased by 4.5 inches in 8 weeks, and my recovery turnaround between tournament matches dropped in half.',
      res: '+4.5 inch Vertical Jump',
      beforeWt: 75,
      afterWt: 76.5,
      beforeImg: IMAGES.transformations.t1Before,
      afterImg: IMAGES.transformations.t1After,
    },
    {
      id: 'tstm_06',
      name: 'Siddharth Rao',
      role: 'Corporate VP',
      goal: 'Metabolic Health & Stress Reduction',
      avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600&auto=format&fit=crop',
      rating: 5,
      content: 'My HbA1c dropped from 6.8 to 5.4 in 90 days. The integrated nutrition tracking and daily WhatsApp encouragement from my coach held me truly accountable.',
      res: 'HbA1c Normalized (6.8 -> 5.4)',
      beforeWt: 92,
      afterWt: 81,
      beforeImg: IMAGES.transformations.t3Before,
      afterImg: IMAGES.transformations.t3After,
    },
  ];

  for (const t of testimonials) {
    await execute(
      `INSERT INTO testimonials (id, name, role, company_or_goal, avatar, rating, content, result_highlight, before_weight, after_weight, before_image, after_image, is_approved, is_featured, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 0)
       ON DUPLICATE KEY UPDATE content=VALUES(content), result_highlight=VALUES(result_highlight)`,
      [t.id, t.name, t.role, t.goal, t.avatar, t.rating, t.content, t.res, t.beforeWt, t.afterWt, t.beforeImg, t.afterImg]
    );
  }

  // 10. Gallery Items
  console.log('Seeding Gallery...');
  for (let idx = 0; idx < IMAGES.gallery.length; idx++) {
    const item = IMAGES.gallery[idx];
    await execute(
      `INSERT INTO gallery (id, title, category, media_url, media_type, caption, is_featured, display_order)
       VALUES (?, ?, ?, ?, 'IMAGE', ?, 1, ?)
       ON DUPLICATE KEY UPDATE media_url=VALUES(media_url)`,
      [`gal_${idx + 1}`, item.title, item.category, item.media_url, `Exclusive state-of-the-art facilities at FitLife`, idx]
    );
  }

  // 11. Blogs & Categories
  console.log('Seeding Blogs & Articles...');
  const bcat1 = 'bcat_01';
  const bcat2 = 'bcat_02';
  const bcat3 = 'bcat_03';

  await execute(`INSERT INTO blog_categories (id, name, slug, description) VALUES (?, 'Strength & Science', 'strength-science', 'Evidence-based biomechanics, progressive overload, and hypertrophy protocols.') ON DUPLICATE KEY UPDATE name=VALUES(name)`, [bcat1]);
  await execute(`INSERT INTO blog_categories (id, name, slug, description) VALUES (?, 'Nutrition & Fuel', 'nutrition-fuel', 'Clinical diets, macronutrient partitioning, and hydration science.') ON DUPLICATE KEY UPDATE name=VALUES(name)`, [bcat2]);
  await execute(`INSERT INTO blog_categories (id, name, slug, description) VALUES (?, 'Recovery & Longevity', 'recovery-longevity', 'Sleep hygiene, joint resilience, and nervous system replenishment.') ON DUPLICATE KEY UPDATE name=VALUES(name)`, [bcat3]);

  const blogs = [
    {
      id: 'blog_01',
      title: 'The Biomechanics of Maximum Hypertrophy: Beyond Junk Volume',
      slug: 'biomechanics-of-maximum-hypertrophy',
      catId: bcat1,
      authorId: adminId,
      image: IMAGES.blog.hypertrophy,
      readTime: '6 min read',
      excerpt: 'Why performing 25 sets per workout is holding back your gains. Learn how mechanical tension and full sarcomere stretch drive true hypertrophy.',
      content: `The modern fitness landscape is plagued by the illusion of "more is always better." Lifters spend hours grinding through 30 haphazard sets, generating systemic central nervous system fatigue rather than targeted mechanical tension.

### 1. Mechanical Tension: The Primary Hypertrophic Stimulus
Research from leading sports science institutes proves that mechanical tension—specifically placing individual muscle fibers under heavy loading through their lengthened range of motion—is the irreplaceable driver of myofibrillar protein synthesis.

### 2. The Danger of "Junk Volume"
Any set that is performed more than 4 reps in reserve (RIR) fails to recruit high-threshold motor units. Worse, doing more than 8-10 high-quality working sets per muscle group per session triggers excessive muscle damage without proportional signaling.

### 3. Practical Implementation
- Select 2-3 exercises per movement pattern where you can stabilize without extraneous torso swinging.
- Standardize your cadence: 3 seconds eccentric, 1 second pause at lengthened stretch, explosive concentric.
- Track every kilogram lifted. Progressive overload across 8-12 weeks will always outperform endless pump workouts.`,
    },
    {
      id: 'blog_02',
      title: 'Nutrient Timing Demystified: Anabolic Window vs Daily Protein Distribution',
      slug: 'nutrient-timing-demystified',
      catId: bcat2,
      authorId: 'usr_coach_004',
      image: IMAGES.blog.nutritionTiming,
      readTime: '5 min read',
      excerpt: 'Is the 30-minute post-workout shake a myth? What really matters when partitioning carbohydrates and amino acids for peak body composition.',
      content: `For decades, gym lore insisted that unless you chugged a protein shake within 30 minutes of dropping your last dumbbell, your muscle tissue would rapidly catabolize. Today's metabolic science reveals a vastly more nuanced and sustainable picture.

### The Leucine Threshold
Muscle protein synthesis (MPS) is triggered when intramuscular concentrations of the essential amino acid leucine cross a specific threshold (~2.5g to 3g per meal). Spreading your daily intake into 4-5 evenly distributed feedings delivers superior MPS peaks compared to consuming 100g in a single sitting.

### The True "Anabolic Opportunity"
While the immediate 30-minute panic is unfounded, the heightened insulin sensitivity of trained skeletal muscle persists for 2-4 hours post-exercise. Consuming a 3:1 or 2:1 ratio of rapidly digestible carbohydrates to protein during this window replenishes liver and muscle glycogen, suppresses cortisol, and stimulates recovery.`,
    },
    {
      id: 'blog_03',
      title: 'Overcoming the Fat Loss Plateau: Metabolic Adaptation Explained',
      slug: 'overcoming-fat-loss-plateau',
      catId: bcat2,
      authorId: 'usr_coach_002',
      image: IMAGES.blog.fatLossPlateau,
      readTime: '7 min read',
      excerpt: 'When scale weight refuses to budge despite a strict deficit, your body is protecting its energy balance. Here is the clinical playbook to reignite fat oxidation.',
      content: `Every dedicated dieter eventually hits the dreaded wall: the scale halts for two consecutive weeks despite rigorous adherence. Understanding adaptive thermogenesis is key to breaking through without starving yourself.

### Understanding NEAT (Non-Exercise Activity Thermogenesis)
When calories drop, your subconscious nervous system throttles back spontaneous movement: you fidget less, blink slower, and take fewer subconscious steps. NEAT can plummet by 300-600 kcal daily without you realizing it.

### Strategic Diet Breaks & Refeeds
A 48-72 hour eucaloric refeed high in complex carbohydrates restores circulating leptin levels, reduces ghrelin, and signals to the thyroid that starvation is not imminent. At FitLife, our clients routinely break 4-week plateaus by eating more food for a controlled 3-day phase.`,
    },
    {
      id: 'blog_04',
      title: 'Deep Sleep & Somatotropin: The Forgotten Steroid of Natural Athletes',
      slug: 'deep-sleep-and-recovery',
      catId: bcat3,
      authorId: 'usr_coach_001',
      image: IMAGES.blog.recoverySleep,
      readTime: '6 min read',
      excerpt: '90% of your natural growth hormone and testosterone release occurs during Slow-Wave Stage 3 sleep. How to optimize your nocturnal biology.',
      content: `You don't grow in the gym; you break down muscle fibers. True growth happens while you are unconscious. Chronic sleep debt elevates cortisol, suppresses insulin sensitivity, and increases the likelihood of connective tissue injury by over 60%.

### Sleep Architecture Optimization Protocols
- Maintain absolute darkness in the bedroom (use blackout curtains or a contour eye mask).
- Ambient temperature set strictly between 18°C - 20°C (64°F - 68°F).
- Zero blue light 60 minutes before bed; swap phone scrolling for non-stimulating reading or breathwork.
- Supplement with magnesium bisglycinate and L-theanine 45 minutes prior to sleep.`,
    },
    {
      id: 'blog_05',
      title: 'Mindset & The Architecture of Discipline: Why Motivation is a Traitor',
      slug: 'architecture-of-discipline',
      catId: bcat1,
      authorId: adminId,
      image: IMAGES.blog.mindsetDiscipline,
      readTime: '4 min read',
      excerpt: 'Motivation is a fleeting dopamine high. Unstoppable athletes build environmental systems and non-negotiable rituals that withstand fatigue.',
      content: `Motivation will abandon you on a freezing Monday morning at 5:30 AM. It will vanish after a grueling 12-hour day in court or boardroom meetings. Relying on emotion to dictate physical execution guarantees inconsistency.

### Removing Friction
Lay out your workout apparel the night before. Pre-book your training calendar with the same gravity as an executive board meeting. When training is an automated ritual rather than a daily choice, adherence reaches 98%.`,
    },
    {
      id: 'blog_06',
      title: 'The Evidence-Based Supplement Stack: What Actually Works',
      slug: 'evidence-based-supplement-stack',
      catId: bcat2,
      authorId: 'usr_coach_003',
      image: IMAGES.blog.supplementsGuide,
      readTime: '5 min read',
      excerpt: 'Cut through marketing hype. The 4 gold-standard supplements backed by hundreds of peer-reviewed randomized controlled trials.',
      content: `The multi-billion dollar supplement industry thrives on shiny packaging and unverified promises. However, a select handful of compounds possess undeniable clinical efficacy:

1. **Creatine Monohydrate**: 5 grams daily indefinitely. Increases intramuscular phosphocreatine stores, elevating power output and cognitive clarity.
2. **High-Grade Whey Isolate**: Rapidly bioavailable amino acid donor to hit daily protein targets conveniently.
3. **Omega-3 Triglyceride Fish Oil**: 2g EPA/DHA daily to mitigate systemic joint inflammation and support cardiovascular elasticity.
4. **Vitamin D3 + K2**: Crucial steroid hormone precursor for immune modulation and bone mineralization.`,
    },
  ];

  for (const b of blogs) {
    await execute(
      `INSERT INTO blogs (id, title, slug, excerpt, content, featured_image, author_id, category_id, tags, read_time, is_published, meta_title, meta_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Workout, Science, Nutrition', ?, 1, ?, ?)
       ON DUPLICATE KEY UPDATE content=VALUES(content), featured_image=VALUES(featured_image)`,
      [b.id, b.title, b.slug, b.excerpt, b.content, b.image, b.authorId, b.catId, b.readTime, b.title, b.excerpt]
    );
  }

  // 12. FAQs
  console.log('Seeding FAQs...');
  const faqs = [
    {
      id: 'faq_01',
      q: 'What makes FitLife different from a standard commercial gym?',
      a: 'FitLife is engineered as an ultra-premium athletic institute and wellness sanctuary. We strictly cap total active memberships to prevent overcrowding, feature Olympic-caliber biomechanically calibrated equipment (Eleiko, Arsenal Strength, Prime Fitness), employ certified master coaches exclusively, and provide private recovery suites with infrared sauna, cold plunge, and sports dietitian guidance.',
      cat: 'MEMBERSHIP',
    },
    {
      id: 'faq_02',
      q: 'Can beginners join, or is FitLife only for advanced lifters?',
      a: 'Every member starts somewhere. Over 40% of our members began with zero prior gym experience. Every new membership includes a comprehensive 90-minute biomechanical movement screen, posture evaluation, and 1-on-1 personal coaching session to ensure you master exercise technique safely and confidently.',
      cat: 'GENERAL',
    },
    {
      id: 'faq_03',
      q: 'How does personal coaching assignment work?',
      a: 'During your onboarding assessment, we evaluate your specific fitness goals, medical history, lifestyle schedule, and personality. We then match you with the specialist best suited for your objective—whether that is rapid fat loss with Coach Sarah or strength and hypertrophy with Coach Marcus.',
      cat: 'TRAINING',
    },
    {
      id: 'faq_04',
      q: 'Are nutrition and meal plans included with memberships?',
      a: 'Quarterly, Half-Yearly, and Black Card VIP memberships include structured macronutrient consultations and personalized meal blueprints. We also offer dedicated Clinical Sports Dietitian packages that include weekly grocery guidance and direct restaurant menu navigation.',
      cat: 'NUTRITION',
    },
    {
      id: 'faq_05',
      q: 'What are the operating hours and peak times?',
      a: 'The club is open 7 days a week from 05:00 AM to 11:00 PM. Because our membership is strictly capped, our floor maintains optimal flow and zero wait times for equipment, even during traditional peak hours (07:00-09:00 AM and 06:00-08:30 PM).',
      cat: 'GENERAL',
    },
    {
      id: 'faq_06',
      q: 'Can I freeze or pause my membership if I travel?',
      a: 'Yes. Quarterly plans may be frozen for up to 14 days, Half-Yearly for up to 30 days, and Black Card VIP members enjoy up to 60 days of flexible freeze privileges per year without penalty.',
      cat: 'MEMBERSHIP',
    },
  ];

  for (const f of faqs) {
    await execute(
      `INSERT INTO faqs (id, question, answer, category, is_published, display_order)
       VALUES (?, ?, ?, ?, 1, 0)
       ON DUPLICATE KEY UPDATE question=VALUES(question), answer=VALUES(answer)`,
      [f.id, f.q, f.a, f.cat]
    );
  }

  // 13. Site Settings & SEO Settings
  console.log('Seeding Site Settings & CMS Pages...');
  const defaultSettings = [
    { key: 'site_name', value: 'FitLife Wellness', group: 'BRANDING' },
    { key: 'site_tagline', value: 'PREMIUM FITNESS, ELEVATED PERFORMANCE & NUTRITION', group: 'BRANDING' },
    { key: 'site_phone', value: '+91 98765 43210', group: 'CONTACT' },
    { key: 'site_whatsapp', value: '+919876543210', group: 'CONTACT' },
    { key: 'site_email', value: 'concierge@fitlifewellness.com', group: 'CONTACT' },
    { key: 'site_address', value: 'Skyline Boulevard, Penthouse Level, Sector 5, Downtown Metro', group: 'CONTACT' },
    { key: 'site_currency', value: 'INR', group: 'PAYMENT' },
    { key: 'hero_announcement', value: 'EXCLUSIVE FLASH OFFER: Join this week and receive 2 complimentary 1-on-1 Master Trainer sessions & body scans.', group: 'HOMEPAGE' },
  ];

  for (const s of defaultSettings) {
    await execute(
      `INSERT INTO site_settings (id, setting_key, setting_value, setting_group)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)`,
      [`set_${s.key}`, s.key, s.value, s.group]
    );
  }

  // Sample Appointments & Bookings
  await execute(
    `INSERT INTO bookings (id, customer_id, coach_id, program_id, title, scheduled_at, duration_minutes, type, status, location, notes)
     VALUES ('bk_001', ?, 'cch_001', 'prg_001', 'Master Biomechanics & Squat Depth Audit', DATE_ADD(NOW(), INTERVAL 2 DAY), 60, 'PERSONAL_TRAINING', 'CONFIRMED', 'Olympic Bay 1', 'Focus on hip mobility and bar path tracking.')
     ON DUPLICATE KEY UPDATE status='CONFIRMED'`,
    [custProfileId]
  );

  // Sample Payment
  await execute(
    `INSERT INTO payments (id, user_id, membership_id, razorpay_order_id, razorpay_payment_id, amount, currency, status, payment_method, invoice_number)
     VALUES ('pay_001', ?, 'mem_001', 'order_demo_1001', 'pay_demo_9921', 9999, 'INR', 'SUCCESS', 'UPI / Card', 'INV-2026-001')
     ON DUPLICATE KEY UPDATE status='SUCCESS'`,
    [customerId]
  );

  console.log('--- Database Seeding Completed Successfully! ---');
}

seed()
  .then(() => {
    console.log('Seeding exited cleanly.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed with error:', err);
    process.exit(1);
  });

