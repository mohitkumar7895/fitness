import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IMAGES } from '@/lib/images';
import { Dumbbell, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Hypertrophy & Elite Muscle Building',
  description: 'Maximize myofibrillar hypertrophy through mechanical tension, progressive overload, and high-protein nutrient timing.',
};

export default function MuscleBuildingPage() {
  const pillars = [
    { title: 'Mechanical Tension Focus', desc: 'Lifting heavy in the 6-10 rep bracket with 2-3 reps in reserve (RIR) to recruit high-threshold motor units.' },
    { title: 'Full Sarcomere Stretch', desc: 'Prioritizing movements that place maximal eccentric load on the lengthened muscle position.' },
    { title: 'Progressive Overload Tracking', desc: 'Systematic tracking of tonnage and volume across 12-week mesocycles with planned deloads.' },
    { title: 'Caloric Surplus & Leucine Pulses', desc: 'Targeted +300-500 kcal surplus with 4 evenly spaced 35g protein feedings to trigger peak muscle protein synthesis.' },
  ];

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      <section className="relative py-28 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={IMAGES.programs.muscleBuilding}
            alt="Male Bodybuilder Heavy Lifting"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.25] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/75 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <Badge variant="orange">
            Hypertrophy Science
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight font-heading leading-tight">
            HYPERTROPHY ELITE & <br />
            <span className="text-gradient-orange">PHYSIQUE ARCHITECTURE</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto">
            Pack on dense, aesthetic muscle mass with zero wasted sets. Engineered for serious lifters seeking maximum muscular fullness.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link href="/register?goal=muscle-building">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Build Your Split
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#c6ff3b]">
              Biomechanically Sound
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase font-heading">
              NO JUNK VOLUME. NO EGO LIFTING. PURE MECHANICAL TENSION.
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Standard gym routines wear out your joints before your muscles can grow. We match exercise resistance curves to human muscular strength curves—ensuring maximum tension where the muscle is strongest.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((pil, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#141418] border border-white/5 space-y-2">
                <span className="text-2xl font-black text-[#c6ff3b] font-heading">
                  0{idx + 1}
                </span>
                <h4 className="text-sm font-bold text-white font-heading">{pil.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{pil.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#1c1c22] via-[#141418] to-[#1c1c22] border border-[#c6ff3b]/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black uppercase font-heading">
              READY TO ADD 5-8 KG OF LEAN MUSCLE?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              Complete with workout app tracking, form video critiques, and weekly macronutrient adjustments.
            </p>
          </div>
          <Link href="/register?goal=muscle-building">
            <Button variant="lime" size="lg" className="whitespace-nowrap">
              Start Hypertrophy Protocol
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

