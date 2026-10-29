'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Star, ArrowRight } from 'lucide-react';
import { IMAGES } from '@/lib/images';

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company_or_goal: string;
  avatar?: string;
  rating: number;
  content: string;
  result_highlight?: string;
  before_weight?: number;
  after_weight?: number;
  before_image?: string;
  after_image?: string;
}

export function TransformationsSection({ testimonials = [] }: { testimonials: TestimonialItem[] }) {
  const fallbackTransformations: TestimonialItem[] = [
    {
      id: 'tstm_tr_1',
      name: 'Rohan Verma',
      role: 'Investment Banker',
      company_or_goal: '12-Week Body Recomposition',
      rating: 5,
      content: 'Dropping 12kg of visceral fat while increasing my barbell bench press by 25kg sounded impossible until I followed Coach Marcus Vance’s periodized split and meal plan.',
      result_highlight: '-12 kg Fat Loss in 12 Weeks',
      before_weight: 92,
      after_weight: 80,
      before_image: IMAGES.transformations.t1Before,
      after_image: IMAGES.transformations.t1After,
    },
    {
      id: 'tstm_tr_2',
      name: 'Pooja Kashyap',
      role: 'Creative Director',
      company_or_goal: 'Metabolic Conditioning',
      rating: 5,
      content: 'I had plateaued for three years on generic boutique fitness classes. Elena identified my hormonal fatigue, adjusted my caloric carbs, and my waist shrank 4 inches in 10 weeks.',
      result_highlight: '-4 Inches Waist & Visible Core',
      before_weight: 68,
      after_weight: 59,
      before_image: IMAGES.transformations.t2Before,
      after_image: IMAGES.transformations.t2After,
    },
    {
      id: 'tstm_tr_3',
      name: 'Karan Mehra',
      role: 'Tech Executive',
      company_or_goal: 'Physique Architecture',
      rating: 5,
      content: 'The biomechanics precision here prevents injuries completely. I train with 100% effort without chronic shoulder inflammation for the first time in my athletic life.',
      result_highlight: '+7.5 kg Lean Muscle Gained',
      before_weight: 74,
      after_weight: 81.5,
      before_image: IMAGES.transformations.t3Before,
      after_image: IMAGES.transformations.t3After,
    },
  ];

  const displayList =
    testimonials && testimonials.length > 0 ? testimonials.slice(0, 3) : fallbackTransformations;

  return (
    <section className="py-12 sm:py-16 bg-[#080808] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff5a1f] block mb-1.5">
              Verified Results &amp; Metamorphosis
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-heading">
              REAL TRANSFORMATIONS<span className="text-[#ff5a1f]">.</span>
            </h2>
          </div>
          <Link href="/transformations">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Journeys
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayList.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-[#141418] border border-white/10 overflow-hidden flex flex-col justify-between p-5 sm:p-6 hover:border-[#ff5a1f]/40 transition-all duration-300 shadow-xl space-y-6"
            >
              {/* Before & After Dual Comparison */}
              <div className="grid grid-cols-2 gap-1.5 relative rounded-2xl overflow-hidden aspect-[16/10] border border-white/10 bg-black">
                <div className="relative h-full">
                  <Image
                    src={item.before_image || IMAGES.transformations.t1Before}
                    alt={`${item.name} Before`}
                    fill
                    sizes="(max-width: 768px) 50vw, 200px"
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[9px] font-black uppercase text-zinc-300 border border-white/10">
                    Before {item.before_weight ? `(${item.before_weight}kg)` : ''}
                  </div>
                </div>

                <div className="relative h-full">
                  <Image
                    src={item.after_image || IMAGES.transformations.t1After}
                    alt={`${item.name} After`}
                    fill
                    sizes="(max-width: 768px) 50vw, 200px"
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#ff5a1f] text-[9px] font-black uppercase text-white shadow-lg">
                    After {item.after_weight ? `(${item.after_weight}kg)` : ''}
                  </div>
                </div>
              </div>

              {/* Story and Highlight */}
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="lime" className="text-[11px] font-black tracking-wide">
                      {item.result_highlight}
                    </Badge>
                    <div className="flex items-center gap-0.5">
                      {[...Array(item.rating || 5)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic line-clamp-3">
                    &ldquo;{item.content}&rdquo;
                  </p>
                </div>

                {/* Member profile footer */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white font-heading">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#ff5a1f] font-semibold">
                      {item.company_or_goal || item.role}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500">
                    Verified BioScan
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
