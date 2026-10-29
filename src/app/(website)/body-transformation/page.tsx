import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IMAGES } from '@/lib/images';
import { Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: '90-Day Total Body Recomposition',
  description: 'Simultaneously build muscle and burn fat through hybrid conditioning and nutrient timing.',
};

export default function BodyTransformationPage() {
  return (
    <div className="bg-[#080808] text-white min-h-screen">
      <section className="relative py-28 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={IMAGES.programs.bodyTransformation}
            alt="Dynamic Transformation Training"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.25] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/75 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <Badge variant="lime">
            Total Recomposition
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight font-heading leading-tight">
            90-DAY TOTAL BODY <br />
            <span className="text-gradient-orange">TRANSFORMATION</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto">
            Drop fat and add muscle in the same 12-week block. A comprehensive aesthetic and lifestyle reset with 100% coach accountability.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link href="/register?goal=body-transformation">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Apply For Transformation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black uppercase font-heading">
            THE 3 PHASES OF TRANSFORMATION
          </h2>
          <p className="text-sm text-zinc-400">
            A methodical evolution that guarantees permanent habits and dramatic aesthetic results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#141418] border border-white/10 space-y-3">
            <span className="text-xs font-bold text-[#ff5a1f] uppercase tracking-wider block">Weeks 1-4</span>
            <h3 className="text-xl font-bold text-white font-heading">Phase 1: Foundation & Priming</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Restore movement mechanics, calibrate baseline calorie burns, eliminate gut inflammation, and establish unstoppable routine consistency.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141418] border border-[#ff5a1f]/30 space-y-3 shadow-xl">
            <span className="text-xs font-bold text-[#c6ff3b] uppercase tracking-wider block">Weeks 5-8</span>
            <h3 className="text-xl font-bold text-white font-heading">Phase 2: Metabolic Acceleration</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Introduce carbohydrate cycling and density supersets. Adipose fat drops rapidly while muscle fullness and vascularity become apparent.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141418] border border-white/10 space-y-3">
            <span className="text-xs font-bold text-[#ff5a1f] uppercase tracking-wider block">Weeks 9-12</span>
            <h3 className="text-xl font-bold text-white font-heading">Phase 3: Peak Conditioning</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Fine-tune stubborn fat zones, maximize abdominal definition, and transition into a sustainable maintenance blueprint for life.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

