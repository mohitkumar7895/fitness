import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IMAGES } from '@/lib/images';
import { Apple, Utensils, Activity, ArrowRight, ShieldCheck, CheckCircle2, Flame, Sparkles, Scale, HeartPulse } from 'lucide-react';

export const metadata = {
  title: 'Clinical Sports Nutrition & Performance Fuel | FitLife Wellness',
  description: 'Evidence-based diet plans, macronutrient partitioning, and hormonal health optimization by registered sports dietitians.',
};

export default function NutritionPage() {
  const diets = [
    {
      title: 'Hypertrophy Mass Fuel',
      cal: '3,200 kcal',
      p: '210g',
      c: '380g',
      f: '80g',
      desc: 'Sustained energy surplus for dense muscular expansion without excessive adipose spillover.',
      img: IMAGES.nutrition.steakMeal,
      tag: 'Lean Bulking',
    },
    {
      title: 'Metabolic Shred & Satiety',
      cal: '2,100 kcal',
      p: '190g',
      c: '160g',
      f: '65g',
      desc: 'High-satiety volume eating loaded with bioavailable amino acids and fibrous cruciferous greens.',
      img: IMAGES.nutrition.salmonSalad,
      tag: 'Fat Oxidation',
    },
    {
      title: 'Carb-Cycling Recomposition',
      cal: '2,500 kcal',
      p: '195g',
      c: '250g',
      f: '70g',
      desc: 'High carb on heavy training days; high fats on active recovery days for continuous metabolic burn.',
      img: IMAGES.nutrition.hero,
      tag: 'Metabolic Flex',
    },
    {
      title: 'Plant-Powered Athleticism',
      cal: '2,600 kcal',
      p: '175g',
      c: '320g',
      f: '65g',
      desc: 'Complete plant protein profiles combining fermented pea, hemp, tempeh, and ancient grains.',
      img: IMAGES.nutrition.berriesOats,
      tag: '100% Plant Fuel',
    },
  ];

  const pillars = [
    {
      icon: <Utensils className="w-5 h-5 text-[#ff5a1f]" />,
      title: 'Protein & Leucine Pulses',
      desc: 'Four evenly spaced 35g-40g high-bioavailability protein feeds daily to maximize muscle protein synthesis and eliminate muscle breakdown.',
    },
    {
      icon: <Flame className="w-5 h-5 text-[#c6ff3b]" />,
      title: 'Strategic Glycogen Timing',
      desc: 'Concentrating clean complex carbohydrates before and immediately following training to fuel heavy lifts without spilling into adipose tissue.',
    },
    {
      icon: <HeartPulse className="w-5 h-5 text-[#ff5a1f]" />,
      title: 'Endocrine & Hormonal Health',
      desc: 'Calibrating anti-inflammatory Omega-3 fats and micronutrient co-factors to support thyroid function, testosterone production, and restorative sleep.',
    },
  ];

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#121215] to-[#080808]">
        <div className="absolute inset-0 z-0">
          <Image
            src={IMAGES.nutrition.hero}
            alt="Gourmet Healthy Meal Prep"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.25] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-transparent to-[#080808]/90" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <Badge variant="lime" className="px-4 py-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Registered Sports Dietitians &amp; Science
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight font-heading leading-tight">
            MACRO PRECISION, <br />
            <span className="text-gradient-orange">NOT STARVATION</span>.
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            You cannot out-train an inflammatory diet. At FitLife Wellness, our clinical nutritionists design delicious, whole-food dietary architectures that fuel sustained athletic energy, optimize hormones, and drive fat loss.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link href="/register?service=nutrition">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Get Your Custom Nutrition Plan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Nutritional Pillars */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#c6ff3b]">
            Biochemical Foundation
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase font-heading">
            THE 3 LAWS OF METABOLIC FUEL
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pil, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-3xl bg-[#141418] border border-white/10 space-y-3 hover:border-[#c6ff3b]/40 transition-colors shadow-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                {pil.icon}
              </div>
              <h3 className="text-lg font-bold font-heading text-white">{pil.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{pil.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sample Clinical Protocols with Food Photography */}
      <section className="py-12 sm:py-16 bg-[#0a0a0d] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="orange" className="text-[10px]">Individualized Blueprints</Badge>
            <h2 className="text-2xl sm:text-4xl font-black uppercase font-heading">
              SAMPLE CLINICAL PROTOCOLS
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Calibrated to bloodwork, basal metabolic rate, and personal culinary preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {diets.map((d, i) => (
              <div
                key={i}
                className="group rounded-3xl bg-[#141418] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#ff5a1f]/40 hover:-translate-y-1 transition-all duration-300 shadow-xl"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={d.img}
                      alt={d.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent opacity-85" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant="lime" className="text-[9px] bg-black/70 backdrop-blur-md">
                        {d.tag}
                      </Badge>
                      <Badge variant="orange" className="text-[9px] bg-black/70 backdrop-blur-md">
                        {d.cal}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold font-heading text-white group-hover:text-[#ff5a1f] transition-colors leading-snug">
                      {d.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                      {d.desc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-white/5 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Protein Target:</span>
                      <span className="font-bold text-[#c6ff3b]">{d.p}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Carbohydrates:</span>
                      <span className="font-bold text-white">{d.c}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Healthy Fats:</span>
                      <span className="font-bold text-white">{d.f}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Concierge Consultation CTA */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#18181c] via-[#121215] to-[#18181c] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-black uppercase text-[#c6ff3b] tracking-widest block">
              1-on-1 Dietitian Care
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase font-heading text-white">
              NEED A BESPOKE NUTRITION AUDIT?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Includes blood panel review, weekly grocery delivery checklists, and 24/7 WhatsApp restaurant menu guidance.
            </p>
          </div>
          <Link href="/register?service=nutrition">
            <Button variant="lime" size="lg" className="whitespace-nowrap" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Start Nutrition Assessment
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
