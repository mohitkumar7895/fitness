import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IMAGES } from '@/lib/images';
import { Activity, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Olympic Strength & Powerlifting Platform',
  description: 'Competition Eleiko barbells, calibrated steel plates, and velocity-based power training.',
};

export default function StrengthTrainingPage() {
  return (
    <div className="bg-[#080808] text-white min-h-screen">
      <section className="relative py-28 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={IMAGES.programs.strengthTraining}
            alt="Olympic Barbell Powerlifter"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.25] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/75 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <Badge variant="orange">
            Eleiko Certified Training Center
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight font-heading leading-tight">
            RAW ATHLETIC POWER & <br />
            <span className="text-gradient-orange">STRENGTH ARCHITECTURE</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto">
            Build unyielding compound strength. Squat, bench, deadlift, and clean on official competition platforms with precision velocity trackers.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link href="/register?goal=strength-training">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Join Strength Division
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-3">
            <h3 className="text-xl font-bold font-heading">Eleiko IPF Spec Equipment</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Sweden-forged competition barbells, calibrated steel discs, and heavy-duty 3x3 power cages with safety strapping.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-[#141418] border border-[#ff5a1f]/30 space-y-3">
            <h3 className="text-xl font-bold font-heading">Velocity-Based Training (VBT)</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Real-time linear transducers track bar speed in meters per second to regulate fatigue and maximize neural drive.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-3">
            <h3 className="text-xl font-bold font-heading">Joint & Kinetic Chain Care</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Reverse hypers, belt squat machines, and glute-ham developers (GHD) to decompress spines and fortify connective tissue.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

