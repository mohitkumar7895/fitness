'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Flame, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export function CtaBanner() {
  return (
    <section className="py-12 sm:py-16 relative overflow-hidden bg-gradient-to-b from-[#0a0a0d] to-[#050505] border-t border-white/10">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#ff5a1f]/20 via-[#c6ff3b]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        <div className="inline-flex">
          <Badge variant="lime" className="px-4 py-1.5 font-bold">
            <Flame className="w-3.5 h-3.5 fill-[#c6ff3b]" />
            Your Next Chapter
          </Badge>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white font-heading leading-tight max-w-4xl mx-auto">
          YOUR WELLNESS JOURNEY <br />
          <span className="text-gradient-orange">STARTS TODAY</span>.
        </h2>

        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          Stop settling for average workouts and inconsistent guidance. Join FitLife Wellness and experience sustained vitality, strength, and health under the supervision of true masters.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('open-vip-modal'))}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#ff5a1f] to-[#ff7d47] text-white font-black text-base shadow-[0_10px_35px_rgba(255,90,31,0.5)] hover:scale-105 hover:shadow-[0_15px_45px_rgba(255,90,31,0.7)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 fill-white/80" />
            <span>Claim 1-Day Free VIP Pass</span>
          </button>
          <Link href="/register" className="w-full sm:w-auto">
            <Button variant="secondary" size="xl" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Start Transformation
            </Button>
          </Link>
        </div>

        <div className="pt-6 flex items-center justify-center gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#c6ff3b]" />
            <span>100% Satisfaction Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f]" />
            <span>Zero Long-Term Lock-in</span>
          </div>
        </div>
      </div>
    </section>
  );
}

