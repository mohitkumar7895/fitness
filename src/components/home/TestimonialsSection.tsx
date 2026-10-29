'use client';

import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { Star, Quote } from 'lucide-react';
import { TestimonialItem } from './TransformationsSection';

export function TestimonialsSection({ testimonials = [] }: { testimonials: TestimonialItem[] }) {
  const fallbackTestimonials: TestimonialItem[] = [
    {
      id: 'tstm_fb_1',
      name: 'Vikram Malhotra',
      role: 'Private Equity Director',
      company_or_goal: 'Hypertrophy & Posture',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      rating: 5,
      content: 'FitLife Wellness is the only facility that respects an executive schedule. Zero waiting for squat racks, elite coaching cues, and clinical nutrition that completely eliminated my 3 PM cognitive slumps.',
      result_highlight: '+6 kg Lean Mass, Zero Joint Pain',
    },
    {
      id: 'tstm_fb_2',
      name: 'Ananya Singhania',
      role: 'Tech Founder & Marathoner',
      company_or_goal: 'Endurance & Core Power',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      rating: 5,
      content: 'Coach Elena redesigned my entire posterior chain mechanics. I shaved 18 minutes off my marathon personal record while gaining visible upper-body definition. The cold plunge suites are unmatched.',
      result_highlight: '-18 min Marathon PR',
    },
    {
      id: 'tstm_fb_3',
      name: 'Rohan Mehra',
      role: 'Consultant & Triathlete',
      company_or_goal: 'Metabolic Shred',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      rating: 5,
      content: 'The level of professionalism here is what you expect from an Olympic training center. The trainers dont count reps on their phones; they monitor bar velocity and adjust volume in real time.',
      result_highlight: '11% Body Fat Achieved',
    },
  ];

  const displayList =
    testimonials && testimonials.length > 3
      ? testimonials.slice(3, 6)
      : testimonials && testimonials.length > 0
      ? testimonials.slice(0, 3)
      : fallbackTestimonials;

  return (
    <section className="py-12 sm:py-16 bg-[#080808] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-3">
          <Badge variant="orange">
            What Members Say
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-heading">
            VOICES OF <span className="text-gradient-orange">ACHIEVEMENT</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Real experiences from high-performing professionals, entrepreneurs, and athletes who call FitLife Wellness their training sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {displayList.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-[#121215] border border-white/10 p-6 sm:p-7 flex flex-col justify-between hover:border-[#ff5a1f]/40 transition-all duration-300 shadow-xl space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating || 5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#ff5a1f]/30" />
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed italic">
                  &ldquo;{item.content}&rdquo;
                </p>

                {item.result_highlight && (
                  <Badge variant="lime" className="text-[10px] font-bold">
                    {item.result_highlight}
                  </Badge>
                )}
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/15 overflow-hidden relative shrink-0">
                  {item.avatar ? (
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-white">
                      {item.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">
                    {item.name}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {item.role || item.company_or_goal}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
