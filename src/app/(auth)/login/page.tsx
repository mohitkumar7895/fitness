'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Flame, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useNotification();
  const router = useRouter();

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    const loginEmail = customEmail || email;
    const loginPass = customPass || password;

    if (!loginEmail || !loginPass) {
      showToast({ type: 'error', title: 'Missing Credentials', message: 'Please enter both email and password.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        login(data.user);
        showToast({
          type: 'success',
          title: `Welcome Back, ${data.user.name.split(' ')[0]}`,
          message: 'Authentication verified. Redirecting to your dashboard...',
        });

        if (data.user.role === 'ADMIN' || data.user.role === 'SUPERADMIN') {
          router.push('/admin/dashboard');
        } else if (data.user.role === 'COACH') {
          router.push('/coach/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        showToast({
          type: 'error',
          title: 'Sign In Failed',
          message: data.error || 'Invalid credentials provided.',
        });
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Could not reach server. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    handleLogin(undefined, roleEmail, rolePass);
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Floating Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#ff5a1f]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Brand Header */}
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
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
            MEMBER SIGN IN
          </h2>
          <p className="text-xs text-zinc-400">
            Access your personalized workout programs, diet protocols, and coach schedules.
          </p>
        </div>

        {/* Demo Credentials Quick Switcher */}
        <div className="p-4 rounded-2xl bg-[#141418] border border-white/10 space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#c6ff3b] block">
            Instant Demo Sign In:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@fitlifewellness.com', 'admin123')}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#ff5a1f]/20 border border-white/10 text-[11px] font-bold text-white hover:text-[#ff5a1f] transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Shield className="w-3 h-3 text-[#ff5a1f]" /> Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('marcus@fitlifewellness.com', 'coach123')}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#c6ff3b]/20 border border-white/10 text-[11px] font-bold text-white hover:text-[#c6ff3b] transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <UserCheck className="w-3 h-3 text-[#c6ff3b]" /> Coach
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('alex@example.com', 'customer123')}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] font-bold text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3 text-white" /> Member
            </button>
          </div>
        </div>

        {/* Sign In Form */}
        <div className="p-5 sm:p-8 rounded-3xl bg-[#141418] border border-white/10 shadow-2xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="name@fitlifewellness.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Password <span className="text-[#ff5a1f]">*</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#ff5a1f] hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#121215] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Sanctuary
            </Button>
          </form>

          <div className="text-center text-xs text-zinc-400 pt-2 border-t border-white/5">
            Not a registered member yet?{' '}
            <Link href="/register" className="text-[#c6ff3b] font-bold hover:underline">
              Start Assessment &amp; Join
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

