import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { queryOne } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';
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
              <div className="flex items-center gap-3 pt-2">
                <Link href={`/register?coach=${trainer.id}`} className="flex-1">
                  <Button variant="primary" size="lg" className="w-full justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Book Intro Session
                  </Button>
                </Link>
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp?.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hi FitLife Wellness! I'd like to book an introductory coaching session with Coach ${trainer.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center transition-transform hover:scale-105 shadow-md shrink-0"
                  aria-label="Direct WhatsApp Consultation"
                >
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

