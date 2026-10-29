'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Flame, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4 relative">
      {/* Floating Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 shadow-md flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="FitLife Wellness"
                width={40}
                height={40}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-black text-white font-heading leading-tight">
                FitLife<span className="text-[#c6ff3b]">.</span>
              </span>
              <span className="text-[8px] font-extrabold tracking-[0.2em] text-emerald-400 uppercase -mt-0.5">
                WELLNESS
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold uppercase font-heading text-white">Reset Credentials</h1>
          <p className="text-xs text-zinc-400">
            Enter your email to receive recovery instructions.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#141418] border border-white/10 shadow-2xl">
          {sent ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#c6ff3b] mx-auto" />
              <h3 className="text-lg font-bold text-white font-heading">Check Your Inbox</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We have dispatched a secure password reset link to <strong className="text-white">{email}</strong>.
              </p>
              <Link href="/login" className="inline-block pt-2">
                <Button variant="secondary" size="md">Return to Login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                className="w-full"
              >
                Send Reset Link
              </Button>
              <div className="text-center pt-2">
                <Link href="/login" className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

