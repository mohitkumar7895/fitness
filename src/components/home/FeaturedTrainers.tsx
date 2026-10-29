'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { Star, ArrowRight } from 'lucide-react';
import { IMAGES } from '@/lib/images';

export interface TrainerItem {
  id: string;
  user_id: string;
  name: string;
  title: string;
  bio: string;
  experience_years: number;
  certifications: string;
  specializations: string;
  hourly_rate: number;
  rating: number;
  review_count: number;
  avatar: string;
}

export function FeaturedTrainers({ trainers = [] }: { trainers: TrainerItem[] }) {
  const displayTrainers = trainers.length > 0 ? trainers : [
    {
      id: 'cch_001',
      user_id: 'usr_coach_001',
      name: 'Marcus Vance',
      title: 'Head of Strength & Biomechanics',
      bio: 'Former national powerlifter and CSCS specialist with 12 years directing elite hypertrophy camps.',
      experience_years: 12,
      certifications: 'CSCS, USAW Level 2',
      specializations: 'Hypertrophy, Powerlifting, Biomechanics',
      hourly_rate: 3500,
      rating: 5.0,
      review_count: 48,
      avatar: IMAGES.trainers.marcus,
    },
    {
      id: 'cch_002',
      user_id: 'usr_coach_002',
      name: 'Elena Rostova',
      title: 'Master Conditioning Specialist',
      bio: 'Ex-Olympic track conditioning coach specializing in rapid metabolic fat oxidation and VO2 max development.',
      experience_years: 9,
      certifications: 'EXOS Performance, CPT',
      specializations: 'Fat Loss, Metabolic Conditioning, HIIT',
      hourly_rate: 3000,
      rating: 4.9,
      review_count: 62,
      avatar: IMAGES.trainers.elena,
    },
    {
      id: 'cch_003',
      user_id: 'usr_coach_003',
      name: 'Kai Jensen',
      title: 'Hypertrophy & Physique Architect',
      bio: 'Dedicated natural bodybuilding coach with a master degree in Exercise Science from Loughborough.',
      experience_years: 8,
      certifications: 'MSc Exercise Science, ISSN',
      specializations: 'Physique Architecture, Muscle Growth',
      hourly_rate: 2800,
      rating: 4.9,
      review_count: 39,
      avatar: IMAGES.trainers.kai,
    },
    {
      id: 'cch_004',
      user_id: 'usr_coach_004',
      name: 'Dr. Maya Lin',
      title: 'Clinical Nutritionist & Mobility Coach',
      bio: 'Doctor of Clinical Nutrition and certified yoga therapist integrating blood chemistry and fascial health.',
      experience_years: 10,
      certifications: 'PhD Nutrition, E-RYT 500',
      specializations: 'Sports Nutrition, Mobility, Recovery',
      hourly_rate: 3200,
      rating: 5.0,
      review_count: 55,
      avatar: IMAGES.trainers.maya,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#0a0a0d] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#c6ff3b] block mb-1.5">
              Olympic &amp; Master Coaches
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-heading">
              MEET THE <span className="text-gradient-orange">MASTERS</span>
            </h2>
          </div>
          <Link href="/trainers">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              All Certified Coaches
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTrainers.slice(0, 4).map((tr) => (
            <div
              key={tr.id}
              className="group rounded-3xl bg-[#141418] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#ff5a1f]/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xl"
            >
              {/* Trainer Portrait */}
              <div className="relative aspect-[3/4] overflow-hidden bg-black/40">
                <Image
                  src={tr.avatar}
                  alt={tr.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent opacity-90" />

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 border border-white/10 backdrop-blur-md text-xs font-bold text-white">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{tr.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="zinc" className="text-[9px] px-2 py-0.5">
                      {tr.experience_years}+ Yrs Exp
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-white font-heading group-hover:text-[#ff5a1f] transition-colors">
                    {tr.name}
                  </h3>
                  <p className="text-xs text-[#ff5a1f] font-semibold">
                    {tr.title}
                  </p>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed pt-1">
                    {tr.specializations}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Accepting Clients
                  </span>
                  <Link href={`/trainers/${tr.id}`}>
                    <span className="text-xs font-bold text-[#ff5a1f] hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                      Consult Coach &rarr;
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
