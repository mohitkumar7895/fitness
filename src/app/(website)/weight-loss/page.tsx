import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IMAGES } from '@/lib/images';
import { Flame, CheckCircle2, ArrowRight, Activity, Clock, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Rapid Fat Loss & Metabolic Conditioning',
  description: 'Evidence-based fat reduction protocol without muscle loss. High-octane thermogenesis and personalized nutrition.',
};

export default function WeightLossPage() {
  const steps = [
    { title: 'DEXA Body Composition Scan', desc: 'Precise baseline calculation of visceral fat, subcutaneous fat, and basal metabolic rate (BMR).' },
    { title: 'Thermogenic Resistance Training', desc: 'Heavy compound movements combined with short-interval density work to maximize EPOC (excess post-exercise oxygen consumption).' },
    { title: 'Metabolic Deficit Calibration', desc: 'No starvation. Calorie deficits mapped with high-protein intake to preserve 100% of lean muscle tissue.' },
    { title: 'Bi-Weekly Hormonal & Body Scans', desc: 'Continuous feedback to break through metabolic plateaus before they can stall your progress.' },
  ];

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      {/* Hero */}
      <section className="relative py-28 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={IMAGES.programs.weightLoss}
            alt="Female Athletic Cardio & Fat Loss Training"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.25] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/75 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <Badge variant="orange">
            Flagship Metabolic Architecture
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight font-heading leading-tight">
            RAPID FAT SHRED & <br />
            <span className="text-gradient-orange">METABOLIC REBUILD</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto">
            Drop stubborn fat while preserving athletic power and tone. Engineered with sports science, not reckless restriction.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link href="/register?goal=weight-loss">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Start Fat Loss Assessment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff5a1f]">
              Why Most Diets Fail
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase font-heading">
              CRASH DIETING DESTROYS MUSCLE & DOWNREGULATES THYROID.
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              When you drastically slash calories without structured heavy resistance training, your body sheds valuable skeletal muscle. This slows your resting metabolism, leaving you weaker and prone to rebound weight gain.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              The FitLife Fat Loss protocol forces your biology to tap into adipose fat stores while safeguarding metabolic rate through strategic carbohydrate cycling and targeted recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((st, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#141418] border border-white/5 space-y-2">
                <span className="text-2xl font-black text-[#ff5a1f] font-heading">
                  0{i + 1}
                </span>
                <h4 className="text-sm font-bold text-white font-heading">{st.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Callout */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#1c1c22] via-[#141418] to-[#1c1c22] border border-[#ff5a1f]/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black uppercase font-heading">
              READY TO SHRED 10-15 KG SAFELY?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Includes comprehensive meal blueprints, coach check-ins, and heart-rate zone metrics.
            </p>
          </div>
          <Link href="/register?goal=weight-loss">
            <Button variant="primary" size="lg" className="whitespace-nowrap">
              Begin Assessment
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

