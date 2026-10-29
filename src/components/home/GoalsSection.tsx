'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { ArrowUpRight, Flame, Dumbbell, Zap, UserCheck, Activity, HeartPulse } from 'lucide-react';

interface GoalItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
}

const iconMap: Record<string, React.ReactNode> = {
  Flame: <Flame className="w-5 h-5 text-[#ff5a1f]" />,
  Dumbbell: <Dumbbell className="w-5 h-5 text-[#c6ff3b]" />,
  Zap: <Zap className="w-5 h-5 text-[#ff5a1f]" />,
  UserCheck: <UserCheck className="w-5 h-5 text-[#c6ff3b]" />,
  Activity: <Activity className="w-5 h-5 text-[#ff5a1f]" />,
  HeartPulse: <HeartPulse className="w-5 h-5 text-[#c6ff3b]" />,
};

export function GoalsSection({ goals = [] }: { goals?: GoalItem[] }) {
  const displayGoals: GoalItem[] = goals.length > 0 ? goals : [
    {
      id: 'fg_01',
      name: 'Weight Loss & Shred',
      slug: 'weight-loss',
      description: 'Torch stubborn body fat and reveal lean athletic muscularity with targeted metabolic conditioning.',
      icon: 'Flame',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=85&w=900&auto=format&fit=crop',
    },
    {
      id: 'fg_02',
      name: 'Muscle Building & Hypertrophy',
      slug: 'muscle-building',
      description: 'Pack on dense lean muscle through biomechanical tension, progressive overload, and nutrient timing.',
      icon: 'Dumbbell',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=85&w=900&auto=format&fit=crop',
    },
    {
      id: 'fg_03',
      name: 'Total Body Transformation',
      slug: 'body-transformation',
      description: 'Complete aesthetic and metabolic overhaul with tailored nutrition and 100% accountability.',
      icon: 'Zap',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=85&w=900&auto=format&fit=crop',
    },
    {
      id: 'fg_04',
      name: 'VIP Personal Coaching',
      slug: 'personal-training',
      description: '1-on-1 bespoke training with dedicated Olympic & CSCS Master Coaches in private training bays.',
      icon: 'UserCheck',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=85&w=900&auto=format&fit=crop',
    },
    {
      id: 'fg_05',
      name: 'Strength & Conditioning',
      slug: 'strength-training',
      description: 'Develop raw compound power, kinetic chain resilience, and sprint velocity on Eleiko platforms.',
      icon: 'Activity',
      image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=85&w=900&auto=format&fit=crop',
    },
    {
      id: 'fg_06',
      name: 'Mobility & Longevity',
      slug: 'yoga-flexibility',
      description: 'Decompress joints, restore movement patterns, and build core stability for lifelong vitality.',
      icon: 'HeartPulse',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=85&w=900&auto=format&fit=crop',
    },
  ];

  return (
    <section className="py-12 sm:py-16 relative overflow-hidden bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#c6ff3b] block mb-1.5">
              Bespoke Pathways
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-heading">
              CHOOSE YOUR <span className="text-gradient-orange">GOAL</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
            Whether your mission is rapid fat shredding or elite athletic power, our calibrated protocols remove every ounce of guesswork.
          </p>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {displayGoals.map((g) => (
            <Link key={g.id} href={`/${g.slug}`} className="group block h-full">
              <Card className="relative overflow-hidden h-[340px] sm:h-[360px] flex flex-col justify-end p-6 sm:p-7 border border-white/10 rounded-3xl hover:border-[#ff5a1f]/80 hover:shadow-[0_20px_45px_-12px_rgba(255,90,31,0.35)] transition-all duration-500 cursor-pointer">
                {/* Background Image - HARD, CRISP & VIVID */}
                <Image
                  src={g.image}
                  alt={g.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  className="object-cover object-center brightness-[0.85] contrast-[1.12] saturate-[1.15] group-hover:brightness-[0.98] group-hover:contrast-[1.18] group-hover:saturate-[1.25] group-hover:scale-105 transition-all duration-700"
                />

                {/* Subtle vignette that ONLY shades the bottom text area (leaves athlete clearly visible) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 via-45% to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 space-y-2.5">
                  <div className="w-11 h-11 rounded-2xl bg-black/60 border border-white/20 backdrop-blur-md flex items-center justify-center group-hover:border-[#ff5a1f]/70 group-hover:bg-[#ff5a1f]/25 transition-all duration-300 shadow-lg">
                    {iconMap[g.icon] || <Flame className="w-5 h-5 text-[#ff5a1f]" />}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#ff5a1f] transition-colors font-heading leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] keep-white">
                      {g.name}
                    </h3>
                    <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-[#ff5a1f] group-hover:border-transparent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0 shadow-md">
                      <ArrowUpRight className="w-4.5 h-4.5" />
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-200 line-clamp-2 leading-relaxed font-normal drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] keep-white-muted">
                    {g.description}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

