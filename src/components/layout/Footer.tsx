'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SITE_CONFIG, FOOTER_LINKS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import {
  Flame,
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Newsletter Subscriber',
          email,
          subject: 'Newsletter Subscription',
          message: 'User opted in for FitLife VIP updates and athletic journals.',
          source: 'FOOTER_NEWSLETTER',
        }),
      });
      setSubscribed(true);
      setEmail('');
    } catch {
      // Fallback optimistic
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#050505] text-white border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ff5a1f]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-white p-0.5 shadow-[0_0_20px_rgba(198,255,59,0.35)] flex items-center justify-center shrink-0">
                <Image
                  src="/logo.png"
                  alt="FitLife Wellness"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white font-heading leading-tight">
                  FitLife<span className="text-[#c6ff3b]">.</span>
                </span>
                <span className="text-[10px] font-extrabold tracking-[0.2em] text-emerald-400 uppercase -mt-0.5">
                  WELLNESS
                </span>
              </div>
            </Link>

            <p className="text-xs italic text-[#c6ff3b] font-medium">
              &ldquo;Healthier Today, Brighter Tomorrow&rdquo;
            </p>

            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              International-grade wellness sanctuary, bespoke 1-on-1 personal coaching, sports biomechanics, and clinical nutrition tailored for sustainable health.
            </p>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#ff5a1f] shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#ff5a1f] shrink-0" />
                <span>{SITE_CONFIG.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#ff5a1f] shrink-0" />
                <span>{SITE_CONFIG.email}</span>
              </div>
            </div>

            {/* WhatsApp Concierge direct button */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp.replace('+', '')}?text=Hello%20FitLife%2C%20I%20would%20like%20to%20enquire%20about%20memberships%20and%20personal%20coaching.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-bold uppercase tracking-wider transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                Chat with VIP Concierge
              </a>
            </div>
          </div>

          {/* Programs Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5a1f]">
              Featured Programs
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.programs.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#c6ff3b]">
              Experience & Club
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              The Athletic Journal
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Curated biomechanics insights, hypertrophy science, and invitations to exclusive member seminars.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You are subscribed to FitLife Insights.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-[#ff5a1f]"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={loading}
                  className="w-full"
                >
                  Subscribe
                </Button>
              </form>
            )}

            <div className="pt-2 flex items-center gap-3">
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#ff5a1f] hover:border-[#ff5a1f]/40 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={SITE_CONFIG.social.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#ff5a1f] hover:border-[#ff5a1f]/40 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href={SITE_CONFIG.social.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-[#ff5a1f] hover:border-[#ff5a1f]/40 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-4">
            <p>
              © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <ThemeToggle variant="pill" />
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/faq" className="hover:text-zinc-300 transition-colors">
              FAQ
            </Link>
            <Link href="/admin/dashboard" className="text-zinc-600 hover:text-zinc-400 transition-colors">
              CMS Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
