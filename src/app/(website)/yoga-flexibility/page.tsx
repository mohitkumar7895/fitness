import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IMAGES } from '@/lib/images';
import { HeartPulse, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Athletic Yoga, Mobility & Decompression',
  description: 'Joint restoration, myofascial release, and parasympathetic recovery for heavy lifters and desk athletes.',
};

export default function YogaFlexibilityPage() {
  return (
    <div className="bg-[#080808] text-white min-h-screen">
      <section className="relative py-28 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={IMAGES.programs.yogaFlexibility}
            alt="Athletic Yoga and Flexibility"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.25] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/75 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <Badge variant="lime">
            Mobility & Longevity
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight font-heading leading-tight">
            ATHLETIC MOBILITY & <br />
            <span className="text-gradient-lime">JOINT DECOMPRESSION</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto">
            Restore full range of motion. Release chronic spinal compression, expand hip capsules, and quiet the central nervous system.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link href="/register?goal=yoga-flexibility">
              <Button variant="lime" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Begin Mobility Flow
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-3">
            <h3 className="text-xl font-bold font-heading">Spinal Decompression</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Targeted traction flows, inversion stretches, and rotational thoracic opening to alleviate lower-back lumbar strain.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-[#141418] border border-[#c6ff3b]/30 space-y-3">
            <h3 className="text-xl font-bold font-heading">CARs & FRC Conditioning</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Controlled Articular Rotations and Functional Range Conditioning to convert passive flexibility into active, usable strength.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-3">
            <h3 className="text-xl font-bold font-heading">Vagal Tone & Parasympathetic Shift</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Box breathing protocols to immediately down-regulate systemic cortisol and accelerate deep recovery.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

