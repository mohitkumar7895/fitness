'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  Flame,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Phone,
  Mail,
  User,
  Lock,
  Clock,
  Target,
  MessageSquare,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SITE_CONFIG } from '@/lib/constants';

const GOAL_OPTIONS = [
  { id: 'Weight Loss & Shred', label: 'Weight Loss & Shred', icon: '🔥' },
  { id: 'Muscle Building & Strength', label: 'Muscle Building & Strength', icon: '💪' },
  { id: '1-on-1 Personal Coaching', label: '1-on-1 Personal Coaching', icon: '🎯' },
  { id: 'Athletic Conditioning & Stamina', label: 'Athletic Conditioning', icon: '⚡' },
  { id: 'General Fitness & Longevity', label: 'General Health & Longevity', icon: '🧘' },
];

const TIME_OPTIONS = [
  'Morning (06:00 AM – 10:00 AM)',
  'Afternoon (11:00 AM – 04:00 PM)',
  'Evening (05:00 PM – 10:00 PM)',
  'Flexible Schedule',
];

function RegisterAssessmentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { showToast } = useNotification();

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{
    name: string;
    whatsappUrl: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    fitness_goal: searchParams.get('goal') || 'Weight Loss & Shred',
    preferred_time: 'Morning (06:00 AM – 10:00 AM)',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email || !formData.password) {
      showToast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please provide your full name, phone/WhatsApp, email, and password.',
      });
      return;
    }

    if (formData.password.length < 6) {
      showToast({
        type: 'error',
        title: 'Weak Password',
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          // Safe defaults for customer profile
          fitness_experience: 'Intermediate',
          activity_level: 'Moderate',
          preferred_trainer_id: searchParams.get('coach') || 'cch_001',
          membership_plan_slug: searchParams.get('plan') || null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        login(data.user);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });

        const fallbackWa = `https://wa.me/${(SITE_CONFIG.whatsapp || '919876543210').replace(/\D/g, '')}?text=${encodeURIComponent(
          `Hi Coach Marcus! My name is ${formData.name}. I just joined FitLife with the goal: "${formData.fitness_goal}". I would like to begin my consultation!`
        )}`;

        setSuccessData({
          name: formData.name,
          whatsappUrl: data.whatsappUrl || fallbackWa,
        });

        showToast({
          type: 'success',
          title: 'Welcome to FitLife Wellness!',
          message: 'Your inquiry has been submitted to Head Coach Marcus.',
        });
      } else {
        showToast({
          type: 'error',
          title: 'Submission Issue',
          message: data.error || 'Please review your input and try again.',
        });
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to the server. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Success view once inquiry & registration are completed
  if (successData) {
    return (
      <div className="min-h-screen bg-[#080808] py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
        <div className="absolute top-5 right-5 z-20">
          <ThemeToggle />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#ff5a1f]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-lg w-full rounded-3xl bg-[#141418] border border-white/10 p-8 sm:p-10 shadow-2xl relative z-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#ff5a1f]/20 border border-[#ff5a1f]/40 text-[#ff5a1f] flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="lime" className="text-xs font-bold">
              Account Created &amp; Inquiry Sent
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-heading">
              WELCOME, <span className="text-gradient-orange">{successData.name.split(' ')[0]}</span>!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Your details and fitness goal have been directly sent to <strong>Head Coach Marcus Vance</strong>. You can chat with Coach Marcus right now on WhatsApp or explore your member dashboard.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <a
              href={successData.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-black tracking-wide flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(37,211,102,0.4)] transition-all hover:scale-105 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>Chat with Coach Marcus on WhatsApp</span>
            </a>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 px-6 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Go to Member Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#ff5a1f]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-xl mx-auto space-y-7 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 shadow-[0_0_20px_rgba(198,255,59,0.35)] flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="FitLife Wellness"
                width={40}
                height={40}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <span className="text-2xl font-black tracking-tight text-white font-heading">
              FitLife<span className="text-[#c6ff3b]">.</span>WELLNESS
            </span>
          </Link>

          <div className="pt-2">
            <Badge variant="lime" className="px-3.5 py-1 text-xs font-bold">
              Direct Access to Head Coach Marcus Vance
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-heading">
            START YOUR <span className="text-gradient-orange">TRANSFORMATION</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Fill this quick form to register and get your personalized training &amp; nutrition plan directly from our Master Coach.
          </p>
        </div>

        {/* Main High-Converting Form Card */}
        <div className="rounded-3xl bg-[#141418] border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#ff5a1f]" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vikram Malhotra"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff5a1f] focus:ring-1 focus:ring-[#ff5a1f] text-sm transition-all"
              />
            </div>

            {/* Mobile / WhatsApp & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Mobile / WhatsApp *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff5a1f] focus:ring-1 focus:ring-[#ff5a1f] text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#ff5a1f]" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="vikram@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff5a1f] focus:ring-1 focus:ring-[#ff5a1f] text-sm transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#ff5a1f]" />
                <span>Create Password *</span>
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff5a1f] focus:ring-1 focus:ring-[#ff5a1f] text-sm transition-all"
              />
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Used to log into your FitLife member dashboard anytime.
              </span>
            </div>

            {/* Primary Fitness Goal (What they want - "kya chiyyi unko samjhey") */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#c6ff3b]" />
                <span>What is Your Primary Goal? *</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GOAL_OPTIONS.map((g) => {
                  const isSelected = formData.fitness_goal === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, fitness_goal: g.id })}
                      className={`flex items-center gap-2 p-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#ff5a1f]/15 border-[#ff5a1f] text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-base">{g.icon}</span>
                      <span>{g.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Workout Timing */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#ff5a1f]" />
                <span>Preferred Workout Time</span>
              </label>
              <select
                value={formData.preferred_time}
                onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#18181c] border border-white/10 text-white text-sm focus:outline-none focus:border-[#ff5a1f] cursor-pointer"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t} className="bg-[#18181c] text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Any Question or Note for Coach Marcus ("long puchey bus ye sabh ho") */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#c6ff3b]" />
                <span>Any Questions or Specific Requirements? (Optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Ask about workout routines, past injuries, diet, or scheduling..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff5a1f] focus:ring-1 focus:ring-[#ff5a1f] text-sm resize-none transition-all"
              />
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full justify-center shadow-[0_10px_30px_rgba(255,90,31,0.45)] text-sm uppercase tracking-wider font-black py-4"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Join FitLife &amp; Get Custom Plan
              </Button>
            </div>

            {/* Trust Assurance */}
            <div className="pt-1 flex items-center justify-center gap-4 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c6ff3b]" />
                <span>100% Confidential</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#ff5a1f]" />
                <span>Coach Marcus Review</span>
              </span>
            </div>
          </form>

          {/* Already have an account? */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-xs text-zinc-400">
              Already have an account?{' '}
              <Link href="/login" className="text-[#ff5a1f] font-bold hover:underline">
                Sign in to Member Portal
              </Link>
            </p>
          </div>
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
            <p className="text-xs uppercase tracking-widest font-bold">Loading Registration Form...</p>
          </div>
        </div>
      }
    >
      <RegisterAssessmentInner />
    </React.Suspense>
  );
}
