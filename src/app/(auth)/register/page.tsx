'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  Flame,
  User,
  Activity,
  Apple,
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

function RegisterAssessmentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { showToast } = useNotification();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Personal Details & Account
    name: '',
    email: '',
    password: '',
    phone: '',
    date_of_birth: '1996-05-12',
    gender: 'Male',
    city: 'Metro City',

    // Step 2: Fitness Biometrics
    height: '180',
    current_weight: '82',
    target_weight: '75',
    fitness_experience: 'Intermediate',
    activity_level: 'Moderately Active',
    fitness_goal: searchParams.get('goal') || 'Body Transformation',
    workout_preference: 'Strength & Conditioning',
    preferred_days: 'Mon, Wed, Fri, Sat',
    preferred_time: 'Morning (07:00 AM - 09:00 AM)',

    // Step 3: Health & Nutrition
    food_preference: 'High Protein Non-Veg',
    dietary_restrictions: '',
    medical_conditions: '',
    injuries: '',
    notes: '',

    // Step 4: Coaching & Plan
    training_mode: 'BOTH',
    preferred_trainer_id: searchParams.get('coach') || 'cch_001',
    membership_plan_slug: searchParams.get('plan') || 'quarterly-transformer',
  });

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        showToast({ type: 'error', title: 'Missing Fields', message: 'Name, email, and password are required.' });
        return;
      }
      if (formData.password.length < 6) {
        showToast({ type: 'error', title: 'Weak Password', message: 'Password must be at least 6 characters long.' });
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        login(data.user);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        showToast({
          type: 'success',
          title: 'Welcome to FitLife Wellness',
          message: 'Your biometric assessment has been submitted. Taking you to your dashboard...',
        });
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        showToast({
          type: 'error',
          title: 'Registration Failed',
          message: data.error || 'Please review your input.',
        });
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Could not connect to database. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* Background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#ff5a1f]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-white p-0.5 shadow-[0_0_20px_rgba(198,255,59,0.35)] flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="FitLife Wellness"
                width={44}
                height={44}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-black tracking-tight text-white font-heading leading-tight">
                FitLife<span className="text-[#c6ff3b]">.</span>
              </span>
              <span className="text-[9px] font-extrabold tracking-[0.2em] text-emerald-400 uppercase -mt-0.5">
                WELLNESS
              </span>
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
            MEMBER ONBOARDING &amp; BIOMETRIC SCREEN
          </h1>
          <p className="text-xs text-zinc-400">
            Step {step} of 4 • Precision intake ensures 100% personalized programming
          </p>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="flex items-center justify-between relative gap-2">
          {[
            { num: 1, label: 'Account', icon: User },
            { num: 2, label: 'Biometrics', icon: Activity },
            { num: 3, label: 'Nutrition', icon: Apple },
            { num: 4, label: 'Coaching', icon: Award },
          ].map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div key={s.num} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#c6ff3b] text-black shadow-[0_0_15px_rgba(198,255,59,0.4)]'
                      : isCurrent
                      ? 'bg-[#ff5a1f] text-white shadow-[0_0_15px_rgba(255,90,31,0.4)]'
                      : 'bg-[#18181b] text-zinc-500 border border-white/10'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider ${
                    isCurrent ? 'text-white' : 'text-zinc-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Wizard Form Card */}
        <div className="p-5 sm:p-8 md:p-10 rounded-3xl bg-[#141418] border border-white/10 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: PERSONAL DETAILS */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white font-heading uppercase">
                    Step 1: Personal Credentials
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Create your login profile and contact details.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    required
                    placeholder="Marcus Sterling"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    placeholder="marcus@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Secure Password"
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <Input
                    label="Mobile / WhatsApp"
                    required
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  />
                  <Select
                    label="Gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    options={[
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                      { value: 'Other', label: 'Prefer not to say' },
                    ]}
                  />
                  <Input
                    label="City"
                    placeholder="Metro City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: FITNESS & BIOMETRICS */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white font-heading uppercase">
                    Step 2: Biometrics &amp; Fitness History
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Used to calculate basal metabolic rate and training volume.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Height (cm)"
                    type="number"
                    placeholder="180"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                  <Input
                    label="Current Weight (kg)"
                    type="number"
                    placeholder="82"
                    value={formData.current_weight}
                    onChange={(e) => setFormData({ ...formData, current_weight: e.target.value })}
                  />
                  <Input
                    label="Target Weight (kg)"
                    type="number"
                    placeholder="75"
                    value={formData.target_weight}
                    onChange={(e) => setFormData({ ...formData, target_weight: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Fitness Experience"
                    value={formData.fitness_experience}
                    onChange={(e) => setFormData({ ...formData, fitness_experience: e.target.value })}
                    options={[
                      { value: 'Beginner', label: 'Beginner (< 1 year)' },
                      { value: 'Intermediate', label: 'Intermediate (1 - 3 years)' },
                      { value: 'Advanced', label: 'Advanced (3+ years serious lifting)' },
                    ]}
                  />
                  <Select
                    label="Daily Activity Level"
                    value={formData.activity_level}
                    onChange={(e) => setFormData({ ...formData, activity_level: e.target.value })}
                    options={[
                      { value: 'Sedentary', label: 'Sedentary (Desk job, minimal steps)' },
                      { value: 'Lightly Active', label: 'Lightly Active (5,000 - 8,000 steps)' },
                      { value: 'Moderately Active', label: 'Moderately Active (8,000 - 12,000 steps)' },
                      { value: 'Very Active', label: 'Very Active (Athlete or physical work)' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Primary Goal"
                    value={formData.fitness_goal}
                    onChange={(e) => setFormData({ ...formData, fitness_goal: e.target.value })}
                    options={[
                      { value: 'Weight Loss & Shred', label: 'Weight Loss & Shred' },
                      { value: 'Hypertrophy & Muscle Building', label: 'Hypertrophy & Muscle Building' },
                      { value: 'Body Transformation', label: 'Body Transformation (Recomp)' },
                      { value: 'Strength & Powerlifting', label: 'Strength & Powerlifting' },
                      { value: 'Mobility & Longevity', label: 'Mobility & Longevity' },
                    ]}
                  />
                  <Select
                    label="Preferred Training Days"
                    value={formData.preferred_days}
                    onChange={(e) => setFormData({ ...formData, preferred_days: e.target.value })}
                    options={[
                      { value: 'Mon, Wed, Fri', label: '3 Days (Mon, Wed, Fri)' },
                      { value: 'Mon, Wed, Fri, Sat', label: '4 Days (Upper / Lower)' },
                      { value: '5 Days Split', label: '5 Days (PPL + Upper/Lower)' },
                      { value: '6 Days Intense', label: '6 Days (Full Athlete Routine)' },
                    ]}
                  />
                </div>

                <Select
                  label="Preferred Workout Window"
                  value={formData.preferred_time}
                  onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                  options={[
                    { value: 'Early Morning (06:00 AM - 08:00 AM)', label: 'Early Morning (06:00 AM - 08:00 AM)' },
                    { value: 'Morning (08:00 AM - 11:00 AM)', label: 'Morning (08:00 AM - 11:00 AM)' },
                    { value: 'Afternoon (12:00 PM - 03:00 PM)', label: 'Afternoon (12:00 PM - 03:00 PM)' },
                    { value: 'Evening (05:00 PM - 08:30 PM)', label: 'Evening (05:00 PM - 08:30 PM)' },
                  ]}
                />
              </div>
            )}

            {/* STEP 3: NUTRITION & HEALTH */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white font-heading uppercase">
                    Step 3: Clinical Health &amp; Nutrition
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Restricted access. Strictly confidential between you and your dietitian.
                  </p>
                </div>

                <Select
                  label="Dietary & Protein Preference"
                  value={formData.food_preference}
                  onChange={(e) => setFormData({ ...formData, food_preference: e.target.value })}
                  options={[
                    { value: 'High Protein Non-Veg', label: 'High Protein Non-Veg (Poultry, Fish, Beef)' },
                    { value: 'Vegetarian with Dairy & Whey', label: 'Vegetarian with Dairy & Whey' },
                    { value: '100% Plant-Based Vegan', label: '100% Plant-Based Vegan' },
                    { value: 'Keto / Low Carb', label: 'Keto / Low Carbohydrate' },
                    { value: 'Pescatarian', label: 'Pescatarian' },
                  ]}
                />

                <Input
                  label="Dietary Allergies or Intolerances (Optional)"
                  placeholder="e.g. Gluten sensitive, lactose intolerant, nut allergy"
                  value={formData.dietary_restrictions}
                  onChange={(e) => setFormData({ ...formData, dietary_restrictions: e.target.value })}
                />

                <Textarea
                  label="Injuries, Surgeries, or Movement Limitations (Optional)"
                  rows={3}
                  placeholder="e.g. L4/L5 lumbar stiffness, previous ACL reconstruction, shoulder impingement..."
                  value={formData.injuries}
                  onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
                />

                <Textarea
                  label="Relevant Medical Notes or Medications (Optional)"
                  rows={2}
                  placeholder="e.g. Mild hypertension, asthma..."
                  value={formData.medical_conditions}
                  onChange={(e) => setFormData({ ...formData, medical_conditions: e.target.value })}
                />
              </div>
            )}

            {/* STEP 4: COACH & MEMBERSHIP SELECTION */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white font-heading uppercase">
                    Step 4: Coach &amp; Membership Selection
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Select your mentor and preferred club tier.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Preferred Master Trainer"
                    value={formData.preferred_trainer_id}
                    onChange={(e) => setFormData({ ...formData, preferred_trainer_id: e.target.value })}
                    options={[
                      { value: 'cch_001', label: 'Marcus Vance (Strength & Biomechanics)' },
                      { value: 'cch_002', label: 'Elena Rostova (Conditioning & Shred)' },
                      { value: 'cch_003', label: 'Kai Jensen (Hypertrophy & Bulking)' },
                      { value: 'cch_004', label: 'Sarah Jenkins (Nutrition & Fat Loss)' },
                    ]}
                  />

                  <Select
                    label="Training Mode"
                    value={formData.training_mode}
                    onChange={(e) => setFormData({ ...formData, training_mode: e.target.value })}
                    options={[
                      { value: 'BOTH', label: 'In-Club Sanctuary + App Tracking' },
                      { value: 'OFFLINE_ONLY', label: 'Exclusive On-Floor Club' },
                      { value: 'ONLINE_ONLY', label: 'Remote Online App Coaching' },
                    ]}
                  />
                </div>

                <Select
                  label="Initial Membership Commitment"
                  value={formData.membership_plan_slug}
                  onChange={(e) => setFormData({ ...formData, membership_plan_slug: e.target.value })}
                  options={[
                    { value: 'monthly-kickstart', label: 'Monthly Kickstart (₹3,999/mo)' },
                    { value: 'quarterly-transformer', label: 'Quarterly Transformer - Popular (₹9,999 / 3 mos)' },
                    { value: 'half-yearly-elite', label: 'Half-Yearly Elite (₹17,999 / 6 mos)' },
                    { value: 'annual-black-card', label: 'Annual Black Card VIP (₹29,999 / yr)' },
                  ]}
                />

                <div className="p-4 rounded-2xl bg-[#121215] border border-white/5 space-y-2 text-xs text-zinc-400">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#c6ff3b]" />
                    <span>Your Sanctuary Onboarding Guarantee</span>
                  </div>
                  <p>
                    Submitting this assessment immediately creates your active member profile, assigns your chosen Master Coach, and unlocks the complete FitLife workout and diet tracking portal.
                  </p>
                </div>
              </div>
            )}

            {/* Step Navigation Controls */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={prevStep}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Previous Step
                </Button>
              ) : (
                <Link href="/login" className="text-xs text-zinc-400 hover:text-white">
                  Already have an account? <span className="text-[#ff5a1f] underline">Sign in</span>
                </Link>
              )}

              {step < 4 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={nextStep}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="lime"
                  size="lg"
                  isLoading={loading}
                  rightIcon={<Sparkles className="w-4 h-4" />}
                >
                  Complete &amp; Enter Portal
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterAssessmentPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#080808] flex items-center justify-center text-zinc-400">
          <div className="flex flex-col items-center gap-3">
            <Flame className="w-8 h-8 text-[#ff5a1f] animate-pulse" />
            <p className="text-xs uppercase tracking-widest font-bold">Loading Biometric Portal...</p>
          </div>
        </div>
      }
    >
      <RegisterAssessmentInner />
    </React.Suspense>
  );
}
