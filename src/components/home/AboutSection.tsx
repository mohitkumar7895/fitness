'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IMAGES } from '@/lib/images';
import { Award, Compass, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export function AboutSection() {
  const pillars = [
    {
      icon: <Award className="w-5 h-5 text-[#ff5a1f]" />,
      title: 'Olympic-Grade Biomechanics',
      desc: 'Arsenal Strength, Eleiko competition barbells, and custom-cabled towers engineered to eliminate joint shear stress.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#c6ff3b]" />,
      title: 'Strictly Capped Membership',
      desc: 'We limit total active registrations to preserve an uncrowded sanctuary with zero waiting for prime stations.',
    },
    {
      icon: <Zap className="w-5 h-5 text-[#ff5a1f]" />,
      title: 'Clinical Sports Nutrition',
      desc: 'In-house Registered Dietitians calibrate daily macronutrient targets, restaurant strategies, and blood panel audits.',
    },
    {
      icon: <Compass className="w-5 h-5 text-[#c6ff3b]" />,
      title: 'Private Recovery Suites',
      desc: 'Infrared saunas, 8°C cold contrast plunge pools, and pneumatic compression therapy to halve muscle recovery time.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#080808] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Imagery Montage */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src={IMAGES.hero.gymAtmosphere}
                alt="FitLife Luxury Wellness Sanctuary"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />
            </div>

            {/* Overlapping Secondary Image */}
            <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-6 w-52 sm:w-64 aspect-square rounded-2xl overflow-hidden border-2 border-[#ff5a1f]/30 shadow-2xl hidden sm:block">
              <Image
                src={IMAGES.programs.personalTraining}
                alt="1-on-1 Master Coaching"
                fill
                sizes="250px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] uppercase font-bold text-[#c6ff3b] tracking-wider block">
                  Private Coaching
                </span>
                <span className="text-xs font-bold text-white">
                  Individualized Biomechanics
                </span>
              </div>
            </div>
          </div>

          {/* Right Editorial Text */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex">
              <Badge variant="lime">
                The FitLife Philosophy
              </Badge>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-heading leading-tight">
              WHERE HUMAN POTENTIAL MEETS <br />
              <span className="text-gradient-orange">ARCHITECTURAL LUXURY</span>.
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              FitLife Wellness was conceived as an antidote to chaotic, overcrowded commercial fitness chains. We built an intentional sanctuary where science-backed athletic training, holistic recovery, and clinical wellness converge.
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
              {pillars.map((pil, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#121215] border border-white/5 space-y-2 hover:border-[#ff5a1f]/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    {pil.icon}
                  </div>
                  <h4 className="text-sm font-bold text-white font-heading">
                    {pil.title}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {pil.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link href="/about" className="w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full sm:w-auto justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Learn More About Us
                </Button>
              </Link>
              <Link href="/gallery" className="w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full sm:w-auto justify-center">
                  Explore Facility
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

