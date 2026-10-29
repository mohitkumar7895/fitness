import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { queryOne } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { Star, ShieldCheck, Award, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trainer = await queryOne<any>(
    `SELECT u.name, cp.title 
     FROM coach_profiles cp 
     JOIN users u ON cp.user_id = u.id 
     WHERE cp.id = ?`,
    [id]
  );
  if (!trainer) return { title: 'Coach Not Found' };
  return {
    title: `${trainer.name} - ${trainer.title} | FitLife Wellness`,
  };
}

export default async function TrainerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trainer = await queryOne<any>(
    `SELECT cp.*, u.name, u.avatar, u.email 
     FROM coach_profiles cp 
     JOIN users u ON cp.user_id = u.id 
     WHERE cp.id = ?`,
    [id]
  );

  if (!trainer) {
    notFound();
  }

  const certs = trainer.certifications
    ? trainer.certifications.split(',').map((c: string) => c.trim())
    : [];

  const specs = trainer.specializations
    ? trainer.specializations.split(',').map((s: string) => s.trim())
    : [];

  return (
    <div className="bg-[#080808] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Portrait & Quick Stats */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src={trainer.avatar}
                alt={trainer.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            <div className="p-6 rounded-2xl bg-[#141418] border border-white/10 grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-2xl font-black text-white font-heading">
                  {trainer.experience_years}+
                </span>
                <p className="text-[10px] text-zinc-400 uppercase font-semibold mt-0.5">Years Exp</p>
              </div>
              <div className="border-x border-white/10">
                <span className="text-2xl font-black text-amber-400 font-heading">
                  {trainer.rating}
                </span>
                <p className="text-[10px] text-zinc-400 uppercase font-semibold mt-0.5">Rating</p>
              </div>
              <div>
                <span className="text-2xl font-black text-[#c6ff3b] font-heading">
                  {trainer.review_count}+
                </span>
                <p className="text-[10px] text-zinc-400 uppercase font-semibold mt-0.5">Clients</p>
              </div>
            </div>
          </div>

          {/* Right Column: Bio, Credentials & Direct Booking */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <Badge variant="orange">{trainer.title}</Badge>
              <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight font-heading text-white">
                {trainer.name}
              </h1>
              <p className="text-sm font-semibold text-[#ff5a1f]">
                Rate: {formatCurrency(trainer.hourly_rate)} per private 60-min session
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold uppercase font-heading text-white">
                COACHING PHILOSOPHY & BACKGROUND
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                {trainer.bio}
              </p>
            </div>

            {/* Specializations */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase font-heading text-zinc-400 tracking-wider">
                CORE SPECIALIZATIONS
              </h3>
              <div className="flex flex-wrap gap-2">
                {specs.map((spec: string, i: number) => (
                  <Badge key={i} variant="zinc" className="px-3 py-1 text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase font-heading text-zinc-400 tracking-wider">
                ACCREDITATIONS & CERTIFICATIONS
              </h3>
              <div className="space-y-2">
                {certs.map((cert: string, i: number) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-[#c6ff3b] shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1c1c22] to-[#141418] border border-[#ff5a1f]/30 space-y-4 shadow-xl">
              <h3 className="text-lg font-bold text-white font-heading uppercase">
                TRAIN WITH {trainer.name.toUpperCase()}
              </h3>
              <p className="text-xs text-zinc-400">
                Book an introductory movement screen and personalized biomechanics session.
              </p>
              <Link href={`/register?coach=${trainer.id}`} className="block">
                <Button variant="primary" size="lg" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Book Session with {trainer.name.split(' ')[0]}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

