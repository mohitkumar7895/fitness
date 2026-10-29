import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IMAGES } from '@/lib/images';
import { Users, Flame, ArrowRight, Activity, Music } from 'lucide-react';

export const metadata = {
  title: 'Elite Group Fitness & Athletic Conditioning',
  description: 'High-energy, coach-led conditioning sessions with live biometric heart rate tracking.',
};

export default function GroupFitnessPage() {
  const classes = [
    { title: 'FitLife Shred Matrix', focus: 'HIIT & Functional Aerobics', duration: '50 Min', intensity: 'High' },
    { title: 'Kettlebell & Kinetic Flow', focus: 'Rotational Power & Core', duration: '45 Min', intensity: 'Moderate - High' },
    { title: 'Olympic Lifting Workshop', focus: 'Snatch & Clean Mastery', duration: '60 Min', intensity: 'Technical & Heavy' },
    { title: 'Metabolic Boxing Conditioning', focus: 'Striking & Footwork Endurance', duration: '50 Min', intensity: 'High' },
  ];

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      <section className="relative py-28 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={IMAGES.programs.groupFitness}
            alt="High-Intensity Group Fitness Studio"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.25] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/75 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <Badge variant="lime">
            Limited Class Capacities (Max 14)
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight font-heading leading-tight">
            ELITE GROUP <br />
            <span className="text-gradient-orange">CONDITIONING</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto">
            High energy. Zero chaos. Experience the electric collective intensity of group training with individual coaching precision.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link href="/register">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Claim Complimentary Trial Pass
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-black uppercase font-heading">
            CURATED STUDIO SESSIONS
          </h2>
          <p className="text-sm text-zinc-400">
            Every session is capped at 14 athletes so coaches can actively correct form and motivate individually.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {classes.map((cls, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#141418] border border-white/10 space-y-4 hover:border-[#ff5a1f]/40 transition-colors">
              <Badge variant="orange" className="text-[10px]">{cls.intensity}</Badge>
              <h3 className="text-lg font-bold font-heading text-white">{cls.title}</h3>
              <p className="text-xs text-zinc-400">{cls.focus}</p>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                <span>Duration</span>
                <span className="font-bold text-white">{cls.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

