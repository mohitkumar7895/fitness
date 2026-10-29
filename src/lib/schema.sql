-- MySQL Schema for Premium Fitness & Wellness Platform

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('SUPERADMIN', 'ADMIN', 'COACH', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
  avatar TEXT,
  phone VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS coach_profiles (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  title VARCHAR(100) DEFAULT 'Master Trainer & Specialist',
  bio TEXT,
  experience_years INT DEFAULT 5,
  certifications TEXT,
  specializations TEXT,
  hourly_rate FLOAT DEFAULT 65,
  rating FLOAT DEFAULT 4.95,
  review_count INT DEFAULT 140,
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  instagram VARCHAR(255),
  linkedin VARCHAR(255),
  cover_image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS customer_profiles (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL UNIQUE,
  date_of_birth DATE,
  gender VARCHAR(50),
  city VARCHAR(100),
  height FLOAT,
  current_weight FLOAT,
  target_weight FLOAT,
  fitness_experience VARCHAR(100),
  activity_level VARCHAR(100),
  fitness_goal VARCHAR(100),
  workout_preference VARCHAR(100),
  preferred_days VARCHAR(100),
  preferred_time VARCHAR(100),
  food_preference VARCHAR(100),
  dietary_restrictions TEXT,
  medical_conditions TEXT,
  injuries TEXT,
  notes TEXT,
  training_mode VARCHAR(50) DEFAULT 'BOTH',
  assigned_coach_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_coach_id) REFERENCES coach_profiles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS fitness_goals (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(100),
  image TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS program_categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS programs (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  category_id VARCHAR(36),
  coach_id VARCHAR(36),
  excerpt TEXT,
  description LONGTEXT,
  duration_weeks INT DEFAULT 8,
  level VARCHAR(100) DEFAULT 'All Levels',
  price FLOAT DEFAULT 99,
  original_price FLOAT,
  features TEXT,
  image TEXT,
  banner_image TEXT,
  is_featured BOOLEAN DEFAULT TRUE,
  is_published BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES program_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (coach_id) REFERENCES coach_profiles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS membership_plans (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  tag VARCHAR(100),
  duration_months INT DEFAULT 1,
  price FLOAT NOT NULL,
  original_price FLOAT,
  billing_period VARCHAR(50) DEFAULT 'monthly',
  features TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS memberships (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL,
  plan_id VARCHAR(36) NOT NULL,
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED') DEFAULT 'ACTIVE',
  auto_renew BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES membership_plans(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL,
  coach_id VARCHAR(36),
  program_id VARCHAR(36),
  title VARCHAR(255) NOT NULL,
  scheduled_at DATETIME NOT NULL,
  duration_minutes INT DEFAULT 60,
  type ENUM('PERSONAL_TRAINING', 'CONSULTATION', 'ASSESSMENT', 'GROUP_CLASS') DEFAULT 'PERSONAL_TRAINING',
  status ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED') DEFAULT 'CONFIRMED',
  meeting_link VARCHAR(255),
  location VARCHAR(255) DEFAULT 'Main Fitness Studio',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (coach_id) REFERENCES coach_profiles(id) ON DELETE SET NULL,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  membership_id VARCHAR(36),
  booking_id VARCHAR(36),
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  amount FLOAT NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') DEFAULT 'SUCCESS',
  payment_method VARCHAR(50) DEFAULT 'CARD',
  invoice_number VARCHAR(100) UNIQUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (membership_id) REFERENCES memberships(id) ON DELETE SET NULL,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS workout_plans (
  id VARCHAR(36) PRIMARY KEY,
  coach_id VARCHAR(36),
  customer_id VARCHAR(36),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  goal VARCHAR(100),
  duration_weeks INT DEFAULT 4,
  level VARCHAR(100) DEFAULT 'Intermediate',
  is_template BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (coach_id) REFERENCES coach_profiles(id) ON DELETE SET NULL,
  FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS exercises (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100) DEFAULT 'Strength',
  target_muscle VARCHAR(100) NOT NULL,
  equipment VARCHAR(100) DEFAULT 'Barbell',
  instructions TEXT,
  video_url TEXT,
  image_url TEXT,
  difficulty VARCHAR(50) DEFAULT 'Intermediate',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS workout_exercises (
  id VARCHAR(36) PRIMARY KEY,
  workout_plan_id VARCHAR(36) NOT NULL,
  exercise_id VARCHAR(36) NOT NULL,
  day_of_week VARCHAR(50) DEFAULT 'Monday',
  sets INT DEFAULT 4,
  reps VARCHAR(50) DEFAULT '10-12',
  rest_seconds INT DEFAULT 60,
  weight_kg FLOAT DEFAULT 20,
  order_index INT DEFAULT 0,
  notes TEXT,
  FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS diet_plans (
  id VARCHAR(36) PRIMARY KEY,
  coach_id VARCHAR(36),
  customer_id VARCHAR(36),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  daily_calories INT DEFAULT 2200,
  target_protein INT DEFAULT 160,
  target_carbs INT DEFAULT 220,
  target_fat INT DEFAULT 65,
  is_template BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (coach_id) REFERENCES coach_profiles(id) ON DELETE SET NULL,
  FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS meals (
  id VARCHAR(36) PRIMARY KEY,
  diet_plan_id VARCHAR(36) NOT NULL,
  day_of_week VARCHAR(50) DEFAULT 'All Days',
  meal_type VARCHAR(50) DEFAULT 'Breakfast',
  time_of_day VARCHAR(50) DEFAULT '08:00 AM',
  instructions TEXT,
  FOREIGN KEY (diet_plan_id) REFERENCES diet_plans(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS food_items (
  `id` VARCHAR(36) PRIMARY KEY,
  `meal_id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `portion` VARCHAR(100) DEFAULT '1 serving',
  `calories` INT DEFAULT 300,
  `protein` FLOAT DEFAULT 25,
  `carbs` FLOAT DEFAULT 30,
  `fat` FLOAT DEFAULT 10,
  `notes` TEXT,
  FOREIGN KEY (`meal_id`) REFERENCES meals(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS progress_records (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL,
  recorded_date DATE NOT NULL,
  weight FLOAT NOT NULL,
  body_fat FLOAT,
  chest FLOAT,
  waist FLOAT,
  hips FLOAT,
  arms FLOAT,
  thighs FLOAT,
  photo_front TEXT,
  photo_side TEXT,
  photo_back TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS body_measurements (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL,
  recorded_date DATE NOT NULL,
  height FLOAT NOT NULL,
  weight FLOAT NOT NULL,
  bmi FLOAT NOT NULL,
  bmr FLOAT,
  body_fat_percentage FLOAT,
  muscle_mass FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS fitness_assessments (
  id VARCHAR(36) PRIMARY KEY,
  customer_id VARCHAR(36) NOT NULL,
  assessment_date DATE NOT NULL,
  resting_heart_rate INT,
  blood_pressure VARCHAR(50),
  body_fat_percentage FLOAT,
  posture_notes TEXT,
  fitness_score INT DEFAULT 85,
  coach_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) DEFAULT 'Athlete & Member',
  company_or_goal VARCHAR(100) DEFAULT 'Fat Loss & Endurance',
  avatar TEXT,
  rating INT DEFAULT 5,
  content TEXT NOT NULL,
  result_highlight VARCHAR(255) DEFAULT '-14 kg in 12 weeks',
  before_weight FLOAT,
  after_weight FLOAT,
  before_image TEXT,
  after_image TEXT,
  is_approved BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gallery (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'GYM',
  media_url TEXT NOT NULL,
  media_type ENUM('IMAGE', 'VIDEO', 'DOCUMENT') DEFAULT 'IMAGE',
  caption TEXT,
  is_featured BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blogs (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content LONGTEXT NOT NULL,
  featured_image TEXT NOT NULL,
  author_id VARCHAR(36),
  category_id VARCHAR(36),
  tags VARCHAR(255) DEFAULT 'Workout, Nutrition, Mindset',
  views INT DEFAULT 0,
  read_time VARCHAR(50) DEFAULT '5 min read',
  is_published BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pages (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  meta_title VARCHAR(255),
  meta_description TEXT,
  og_image TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS page_sections (
  id VARCHAR(36) PRIMARY KEY,
  page_slug VARCHAR(255) NOT NULL,
  section_key VARCHAR(100) NOT NULL,
  heading TEXT NOT NULL,
  subheading TEXT,
  content LONGTEXT,
  badge VARCHAR(100),
  primary_cta_text VARCHAR(100),
  primary_cta_link VARCHAR(255),
  secondary_cta_text VARCHAR(100),
  secondary_cta_link VARCHAR(255),
  image TEXT,
  extra_data LONGTEXT,
  is_enabled BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_page_section (page_slug, section_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS media (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  public_id VARCHAR(255),
  file_type VARCHAR(100) DEFAULT 'image/jpeg',
  file_size INT DEFAULT 0,
  alt_text VARCHAR(255),
  folder VARCHAR(100) DEFAULT 'general',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS faqs (
  id VARCHAR(36) PRIMARY KEY,
  question TEXT NOT NULL,
  answer LONGTEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'GENERAL',
  is_published BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enquiries (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  fitness_goal VARCHAR(100),
  preferred_time VARCHAR(100),
  source VARCHAR(50) DEFAULT 'CONTACT_FORM',
  status ENUM('NEW', 'CONTACTED', 'CONVERTED', 'CLOSED') DEFAULT 'NEW',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'SYSTEM',
  link VARCHAR(255),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_settings (
  id VARCHAR(36) PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value LONGTEXT NOT NULL,
  setting_group VARCHAR(100) DEFAULT 'GENERAL',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS seo_settings (
  id VARCHAR(36) PRIMARY KEY,
  page_path VARCHAR(255) NOT NULL UNIQUE,
  meta_title VARCHAR(255) NOT NULL,
  meta_description TEXT NOT NULL,
  canonical_url VARCHAR(255),
  og_title VARCHAR(255),
  og_description TEXT,
  og_image TEXT,
  keywords TEXT,
  structured_data LONGTEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS activity_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  action VARCHAR(255) NOT NULL,
  entity VARCHAR(100) NOT NULL,
  entity_id VARCHAR(36),
  details TEXT,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
