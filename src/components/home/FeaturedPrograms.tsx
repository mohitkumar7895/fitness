'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { Clock, BarChart3, CheckCircle2, ArrowRight } from 'lucide-react';
import { IMAGES } from '@/lib/images';

export interface ProgramItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  duration_weeks: number;
  level: string;
  price: number;
  original_price?: number;
  features?: string;
  image: string;
}

export function FeaturedPrograms({ programs = [] }: { programs?: ProgramItem[] }) {
  const displayPrograms: ProgramItem[] = programs && programs.length > 0 ? programs : [
    {
      id: 'prg_fb_1',
      title: 'Metabolic Shred & Conditioning',
      slug: 'metabolic-shred-athletic-conditioning',
      excerpt: 'High-intensity metabolic resistance circuits designed for rapid adipose tissue oxidation while sparing lean muscle.',
      duration_weeks: 12,
      level: 'Intermediate',
      price: 14999,
      original_price: 19999,
      features: '5-Day Periodized Split, Zone 2 Cardio Protocol, Clinical Macro Calculator, Weekly Form Audits',
      image: IMAGES.programs.weightLoss,
    },
    {
      id: 'prg_fb_2',
      title: 'Hypertrophy Architecture & Biomechanics',
      slug: 'hypertrophy-architecture-biomechanics',
      excerpt: 'Pure evidence-based muscle building focusing on mechanical tension, lengthened-position overload, and progressive volume.',
      duration_weeks: 16,
      level: 'Advanced',
      price: 18999,
      original_price: 24999,
      features: 'Upper/Lower Split, Arm Specialization Blocks, Intra-Workout Carbs Strategy, Dexa Scans',
      image: IMAGES.programs.muscleBuilding,
    },
    {
      id: 'prg_fb_3',
      title: '1-on-1 Bespoke Executive Transformation',
      slug: 'bespoke-executive-transformation',
      excerpt: 'Comprehensive concierge transformation combining dedicated master personal coaching, clinical nutrition, and private suites.',
      duration_weeks: 24,
      level: 'All Levels',
      price: 34999,
      original_price: 45000,
      features: 'Dedicated Master Coach, Private Recovery Plunge, Daily Diet Concierge, VIP Global Passes',
      image: IMAGES.programs.personalTraining,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#0a0a0d] relative overflow-hidden border-t border-white/5">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-[#ff5a1f]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff5a1f] block mb-1.5">
              Signature Methodologies
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-heading">
              FEATURED <span className="text-gradient-orange">PROGRAMS</span>
            </h2>
          </div>
          <Link href="/programs">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Programs
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayPrograms.slice(0, 3).map((p) => {
            const featuresList = p.features
              ? (p.features.includes('\n') ? p.features.split('\n') : p.features.split(','))
                  .map((f: string) => f.trim())
                  .filter(Boolean)
                  .slice(0, 4)
              : [];

            return (
              <div
                key={p.id}
                className="group rounded-3xl bg-[#141418] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#ff5a1f]/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xl"
              >
                {/* Program Header Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent opacity-90" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="orange" className="text-[10px] bg-black/80 backdrop-blur-md">
                      {p.level}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#ff5a1f]" />
                        {p.duration_weeks} Weeks
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-[#c6ff3b]" />
                        Structured Split
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-[#ff5a1f] transition-colors font-heading leading-snug">
                      {p.title}
                    </h3>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                      {p.excerpt}
                    </p>

                    {/* Features checklist */}
                    {featuresList.length > 0 && (
                      <ul className="space-y-1.5 pt-2 border-t border-white/5">
                        {featuresList.map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#c6ff3b] shrink-0" />
                            <span className="truncate">{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Action Without Pricing */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#c6ff3b]" />
                      Full Protocol
                    </span>

                    <Link href={`/programs/${p.slug}`}>
                      <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Explore Blueprint
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
