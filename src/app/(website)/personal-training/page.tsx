import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IMAGES } from '@/lib/images';
import { UserCheck, Star, Shield, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'VIP 1-on-1 Personal Training & Biomechanics',
  description: 'Private training suites and direct coaching with Olympic and Master trainers.',
};

export default function PersonalTrainingPage() {
  return (
    <div className="bg-[#080808] text-white min-h-screen">
      <section className="relative py-28 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={IMAGES.programs.personalTraining}
            alt="VIP 1-on-1 Personal Coaching"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.25] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/75 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <Badge variant="orange">
            The Executive Standard
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight font-heading leading-tight">
            BESPOKE 1-ON-1 <br />
            <span className="text-gradient-orange">PERSONAL COACHING</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto">
            Zero guesswork. Absolute privacy. A dedicated Master Coach orchestrating every rep, macro, and recovery protocol for you.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link href="/register?service=personal-training">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Book Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ff5a1f]/10 border border-[#ff5a1f]/30 flex items-center justify-center text-[#ff5a1f]">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading">Private Training Suites</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Train in designated private coaching bays equipped with full Eleiko platforms, Arsenal towers, and isolated acoustics.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#c6ff3b]/10 border border-[#c6ff3b]/30 flex items-center justify-center text-[#c6ff3b]">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading">Vetted Master Coaches</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Minimum 7+ years high-performance coaching background with CSCS, EXOS, or Olympic credentials. No rookie trainers.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ff5a1f]/10 border border-[#ff5a1f]/30 flex items-center justify-center text-[#ff5a1f]">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading">24/7 Direct Concierge</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Direct coach access via private WhatsApp channel for restaurant menu choices, travel workout tweaks, and accountability.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

