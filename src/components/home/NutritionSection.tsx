'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IMAGES } from '@/lib/images';
import { Apple, Utensils, Activity, ArrowRight, ShieldCheck } from 'lucide-react';

export function NutritionSection() {
  const nutritionPoints = [
    {
      title: 'Precision Macro Partitioning',
      desc: 'Carbohydrate and protein cycles calibrated to your specific metabolic rate and training volume.',
      icon: <Utensils className="w-5 h-5 text-[#ff5a1f]" />,
    },
    {
      title: 'Real-Food Athletic Recipes',
      desc: 'Chef-crafted meal blueprints rich in bioavailable amino acids, essential fats, and micronutrients.',
      icon: <Apple className="w-5 h-5 text-[#c6ff3b]" />,
    },
    {
      title: 'Clinical Blood & Bio-Scans',
      desc: 'Regular Dexa scans and biomarker analysis to ensure hormonal vitality and sustainable fat oxidation.',
      icon: <Activity className="w-5 h-5 text-[#ff5a1f]" />,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#080808] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <Badge variant="orange">
              Holistic Fuel & Performance
            </Badge>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-heading leading-tight">
              SCIENTIFIC NUTRITION, <br />
              <span className="text-gradient-orange">NOT STARVATION</span>.
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Exercise triggers the adaptation signal; nutrients build the reality. Our Clinical Sports Dietitians eliminate crash dieting in favor of sustainable, performance-enhancing fuel protocols that keep your energy sharp.
            </p>

            <div className="space-y-4 pt-2">
              {nutritionPoints.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#121215] border border-white/5 hover:border-white/15 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-heading">
                      {item.title}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link href="/nutrition">
                <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Nutrition Protocols
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Gourmet Meal Photography Montage */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <Image
                    src={IMAGES.nutrition.salmonSalad}
                    alt="Wild Salmon & Superfood Bowl"
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="text-[10px] uppercase font-bold text-[#c6ff3b]">
                      Omega-3 Rich
                    </span>
                    <p className="text-xs font-bold text-white">Wild Salmon Super-Bowl</p>
                  </div>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                  <Image
                    src={IMAGES.nutrition.proteinShake}
                    alt="Nutrient Dense Shake"
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                  <Image
                    src={IMAGES.nutrition.berriesOats}
                    alt="Superberries & Oats"
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                </div>

                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <Image
                    src={IMAGES.nutrition.steakMeal}
                    alt="High Protein Lean Grass-Fed Steak"
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="text-[10px] uppercase font-bold text-[#ff5a1f]">
                      Muscle Synthesis
                    </span>
                    <p className="text-xs font-bold text-white">Grass-Fed Tenderloin & Greens</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

