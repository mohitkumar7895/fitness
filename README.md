# FitLife Wellness — Premium Fitness, Body Transformation & Club Management Platform

> **A luxury international fitness, personal coaching, clinical nutrition, and club management system built with Next.js (App Router), TypeScript, Tailwind CSS, and pure MySQL connection pooling (Zero Prisma).**

---

## 🌟 Executive Summary

**FitLife Wellness** is engineered as an elite fitness club brand. It bridges high-converting editorial web design with a comprehensive, role-based operations engine:
- **22 Public Pages** with cinematic athletics photography, custom typography, and dynamic CMS sections.
- **Biometric Assessment & Registration Engine** collecting 18+ parameters (BMI/BMR calculation, fitness experience, dietary preferences, schedule preferences).
- **Customer Portal**: Workouts dashboard, interactive sets/reps logger, macro breakdown, Recharts bio-tracking graphs, appointment booking, and membership management.
- **Coach Command Center**: Client roster, workout split builder, macro & diet protocol assigner, session calendar.
- **Administrator CMS**: 18 specialized modules spanning program management, membership tiers, homepage builder, leads pipeline, payments ledger, SEO management, exercises library, and user access.

---

## ⚡ Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, Lucide React Icons, Framer Motion, Recharts
- **Backend**: Next.js Route Handlers (`/api/*`), Node.js
- **Database**: Native **MySQL / MariaDB** via `mysql2/promise` connection pooling with parameterized SQL (Clean SQL driver architecture, **no Prisma overhead**)
- **Security**: bcryptjs password hashing, JWT secure sessions via HTTP cookies
- **Integrations**: Razorpay payment structure, WhatsApp direct click-to-chat concierge, Unsplash HD athletic photography

---

## 🔑 Default Test Accounts & Credentials

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Super Administrator** | Master Admin | `admin@fitlifewellness.com` | `admin123` |
| **Master Coach (Strength)** | Marcus Vance | `marcus@fitlifewellness.com` | `coach123` |
| **Master Coach (Hypertrophy)** | Elena Rostova | `elena@fitlifewellness.com` | `coach123` |
| **Master Coach (Fat Loss)** | Liam Sterling | `liam@fitlifewellness.com` | `coach123` |
| **Clinical Nutritionist** | Dr. Maya Lin | `maya@fitlifewellness.com` | `coach123` |
| **Club Member** | Alex Mercer | `alex@example.com` | `customer123` |

> *Quick Login*: The login screen (`/login`) includes instant one-click login buttons for Administrator, Coach, and Member roles for immediate testing.

---

## 📁 Project Architecture & Directory Layout

```
fitness/
├── src/
│   ├── app/
│   │   ├── (website)/                # 22 Public Pages
│   │   │   ├── page.tsx              # Dynamic Homepage with 14 Sections
│   │   │   ├── about/page.tsx        # Brand Heritage & Philosophy
│   │   │   ├── programs/             # Program Catalog & [slug] dynamic page
│   │   │   ├── weight-loss/page.tsx  # Metabolic Conditioning track
│   │   │   ├── muscle-building/      # Hypertrophy track
│   │   │   ├── body-transformation/  # 12-24 Week Recomposition
│   │   │   ├── personal-training/    # 1-on-1 Private Coaching
│   │   │   ├── group-fitness/        # Functional group training
│   │   │   ├── strength-training/    # Powerlifting & Strength
│   │   │   ├── yoga-flexibility/     # Mobility & active recovery
│   │   │   ├── nutrition/page.tsx    # Clinical Macro Partitioning
│   │   │   ├── trainers/             # Master Coaches list & [id] profile
│   │   │   ├── membership/page.tsx   # Tiered Membership Plans
│   │   │   ├── transformations/      # Before & After Results Gallery
│   │   │   ├── gallery/page.tsx      # Club Media & Facility Tour
│   │   │   ├── blog/                 # Strength & Science Journal & [slug]
│   │   │   ├── contact/page.tsx      # Contact Concierge with live lead capture
│   │   │   ├── faq/page.tsx          # Dynamic Frequently Asked Questions
│   │   │   ├── privacy-policy/       # Biometric Data & Privacy Policy
│   │   │   └── terms/page.tsx        # Club Regulations & Terms
│   │   ├── (auth)/                   # Authentication Flows
│   │   │   ├── login/page.tsx        # Login with role quick-access buttons
│   │   │   ├── register/page.tsx     # 4-step Biometric Assessment Wizard
│   │   │   └── forgot-password/      # Self-service recovery
│   │   ├── (dashboard)/              # Customer / Member Portal
│   │   │   ├── layout.tsx            # Member Sidebar & App Bar
│   │   │   ├── dashboard/page.tsx    # Member Overview & BMI/BMR Card
│   │   │   ├── my-profile/page.tsx   # Biometrics, Goal & Health preferences
│   │   │   ├── my-workouts/page.tsx  # Split tabs, exercises, reps/sets check
│   │   │   ├── my-diet/page.tsx      # Calorie target & meal schedule
│   │   │   ├── progress/page.tsx     # Weight & Body fat Recharts analytics
│   │   │   ├── dashboard/membership/ # Active pass status, perks, renewals
│   │   │   └── appointments/page.tsx # Session booking & calendar
│   │   ├── coach/                    # Coach Command Center
│   │   │   ├── layout.tsx            # Coach navigation
│   │   │   ├── dashboard/page.tsx    # Active trainees & schedule overview
│   │   │   ├── clients/page.tsx      # Trainee roster & biometric intake viewer
│   │   │   ├── workout-plans/        # Workout protocol builder & assignment
│   │   │   ├── diet-plans/page.tsx   # Macro partitioning & meal planner
│   │   │   └── appointments/page.tsx # Session confirmations & calendar
│   │   ├── admin/                    # Central Administrator CMS
│   │   │   ├── layout.tsx            # Admin navigation (18 sections)
│   │   │   ├── dashboard/page.tsx    # Club KPIs, revenue, activity feeds
│   │   │   ├── pages/page.tsx        # Website Pages & Metadata registry
│   │   │   ├── banners/page.tsx      # Homepage Builder (14 section controls)
│   │   │   ├── seo/page.tsx          # SEO titles, descriptions, OG tags
│   │   │   ├── settings/page.tsx     # Club info, hours, Razorpay, WhatsApp
│   │   │   ├── programs/page.tsx     # Program CRUD & curriculum
│   │   │   ├── memberships/page.tsx  # Subscription tiers & pricing
│   │   │   ├── trainers/page.tsx     # Coach profiles & certifications
│   │   │   ├── customers/page.tsx    # Customer roster, coach reassignment
│   │   │   ├── bookings/page.tsx     # Session schedule & reschedule
│   │   │   ├── payments/page.tsx     # Payment transactions & revenue ledger
│   │   │   ├── workouts/page.tsx     # Movement library & exercise catalog
│   │   │   ├── diet-plans/page.tsx   # Nutrition protocols & meal templates
│   │   │   ├── enquiries/page.tsx    # Prospect pipeline & WhatsApp outreach
│   │   │   ├── testimonials/page.tsx # Transformation stories & proof
│   │   │   ├── gallery/page.tsx      # Media gallery manager
│   │   │   ├── blogs/page.tsx        # Journal article CMS
│   │   │   └── users/page.tsx        # User roles & access permissions
│   │   └── api/                      # 25+ Clean RESTful Route Handlers
│   ├── components/                   # Modular UI & Layout Components
│   │   ├── ui/                       # Buttons, Badges, Modals, Cards, Inputs
│   │   └── layout/                   # Navbar, Footer, AnnouncementBar
│   ├── context/                      # Global State Providers
│   │   ├── AuthContext.tsx           # Authentication session & user state
│   │   └── NotificationContext.tsx   # Animated toast notification queue
│   └── lib/                          # Core Utilities & Database
│       ├── db.ts                     # mysql2/promise Connection Pooling & queries
│       ├── auth.ts                   # JWT tokens & bcryptjs hashing
│       ├── schema.sql                # 32 relational SQL tables definition
│       ├── seed.ts                   # Initial seed data for club operations
│       ├── utils.ts                  # BMI, BMR, slugify, currency formatters
│       └── images.ts                 # Curated athletic photography library
```

---

## 🛠️ Installation & Setup Guide

### 1. Requirements
- Node.js 18+ (tested on Node v24)
- MySQL / MariaDB (e.g. XAMPP, Laragon, or standalone MySQL server)

### 2. Configure Environment (`.env`)
Create a `.env` file in the root directory:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=fitness

JWT_SECRET=fitlife_wellness_jwt_super_secret_key_2026

RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=rzp_secret_placeholder
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_placeholder

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Initialize MySQL Database
Create the database and execute `src/lib/schema.sql`:
```bash
# In MySQL terminal:
CREATE DATABASE fitness CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Or via command line (PowerShell):
Get-Content src/lib/schema.sql -Raw | & "C:\xampp\mysql\bin\mysql.exe" -u root fitness
```

### 4. Run Seed Script
Populate default coaches, programs, membership tiers, exercises, workout splits, diet plans, testimonials, and site settings:
```bash
npx tsx src/lib/seed.ts
```

### 5. Launch Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🎨 Design System

- **Primary Canvas**: `#080808` Deep Obsidian Black
- **Secondary Canvas**: `#0e0e12` / `#151515` Charcoal
- **Primary Energy Accent**: `#FF5A1F` Athletic Blaze Orange
- **Secondary Performance Accent**: `#C6FF3B` Neon Lime
- **Typography**: Space Grotesk / Sora (Headings), Inter / Manrope (Body)
- **Visuals**: Full-bleed athletic imagery, glassmorphic navigation, high-contrast badges, glowing focus rings, and custom scrollbars.

---

## 🔒 Security & Data Integrity

- Native MySQL connection pooling prevents connection leaks and handles high concurrency.
- Zero Prisma dependencies: Parameterized SQL statements eliminate SQL injection risks while giving full visibility into raw SQL executions.
- bcryptjs with 10 salt rounds for all stored passwords.
- Role-Based Access Control (RBAC) middleware protecting Admin, Coach, and Member routes.
- Secure, HTTP-only JWT cookies for authentication sessions.

---

*FitLife Wellness — Healthier Today, Brighter Tomorrow.*
#   f i t n e s s  
 