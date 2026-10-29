import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IMAGES } from '@/lib/images';
import { ShieldCheck, Award, Zap, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About Our Sanctuary & Philosophy',
  description: 'Discover FitLife Wellness: an international-standard high-performance athletic institute and luxury wellness sanctuary.',
};

export default function AboutPage() {
  const milestones = [
    { year: '2014', title: 'The Genesis', desc: 'Founded by Olympic coaches with a singular goal: build a sanctuary devoid of commercial shortcuts.' },
    { year: '2018', title: 'Arsenal & Eleiko Suite', desc: 'Introduced custom biomechanical equipment suites and private coaching bays.' },
    { year: '2022', title: 'Sports Medicine & Cryo', desc: 'Integrated contrast therapy, DEXA body composition scanning, and in-house sports nutritionists.' },
    { year: '2026', title: 'The FitLife Standard', desc: 'Over 9,400 life-changing transformations with capped memberships maintaining zero floor congestion.' },
  ];

  return (
    <div className="bg-[#080808] text-white">
      {/* Hero Header */}
      <section className="relative py-20 sm:py-28 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={IMAGES.hero.gymAtmosphere}
            alt="FitLife Sanctuary Atmosphere"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.22] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <Badge variant="lime">
            Founded 2014 • The FitLife Standard
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight font-heading leading-tight">
            ENGINEERED FOR THE <br />
            <span className="text-gradient-orange">UNCOMPROMISING</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            We exist for those who expect more from their training. A synthesis of sports biomechanics, luxury design, and elite mentorship.
          </p>
        </div>
      </section>

      {/* Philosophy & Manifesto */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#c6ff3b]">
              Our Manifesto
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-heading">
              DISCIPLINE OVER SHORTCUTS. <br />
              <span className="text-[#ff5a1f]">SCIENCE OVER GIMMICKS.</span>
            </h2>
            <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
              The modern fitness market is saturated with 30-day crash diets, overcrowded commercial gym franchises, and superficial influencers. At FitLife Wellness, we reject all of it.
            </p>
            <p className="text-zinc-400 leading-relaxed text-sm">
              We treat fitness as an architectural science: every training phase is calibrated around biomechanical tension, muscle fiber recruitment, and nervous system recovery. When you walk through our doors, your transformation is inevitable.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-[#121215] border border-white/5 space-y-1">
                <span className="text-2xl font-black text-white font-heading">100%</span>
                <p className="text-xs text-zinc-400 font-semibold uppercase">Certified Master Coaches</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#121215] border border-white/5 space-y-1">
                <span className="text-2xl font-black text-[#c6ff3b] font-heading">&lt; 300</span>
                <p className="text-xs text-zinc-400 font-semibold uppercase">Capped Member Floor Cap</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src={IMAGES.hero.femaleAthlete}
              alt="Elite Coaching in Action"
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                &ldquo;Your environment dictates your output. We created the ideal environment.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-[#0a0a0d] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5a1f]">
              Evolution of Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase font-heading">
              A DECADE OF ELEVATING PERFORMANCE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {milestones.map((m, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#141418] border border-white/10 space-y-3 relative group hover:border-[#ff5a1f]/40 transition-colors">
                <span className="text-3xl font-black text-[#ff5a1f] font-heading block">
                  {m.year}
                </span>
                <h3 className="text-lg font-bold text-white font-heading">
                  {m.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center space-y-5">
        <h2 className="text-3xl sm:text-4xl font-black uppercase font-heading">
          EXPERIENCE THE FITLIFE DIFFERENCE
        </h2>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          Schedule a private VIP tour and consultation with our Head of Strength.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/register">
            <Button variant="primary" size="lg">Join Today</Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondary" size="lg">Contact Concierge</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

