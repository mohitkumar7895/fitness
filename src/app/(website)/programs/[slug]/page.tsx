import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { queryOne } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import {
  Clock,
  BarChart3,
  CheckCircle2,
  Shield,
  ArrowRight,
  Flame,
  User,
  Star,
} from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = await queryOne<any>(
    'SELECT title, excerpt FROM programs WHERE slug = ?',
    [slug]
  );
  if (!program) return { title: 'Program Not Found' };
  return {
    title: `${program.title} | FitLife Programs`,
    description: program.excerpt,
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = await queryOne<any>(
    `SELECT p.*, pc.name as category_name, cp.title as coach_title, u.name as coach_name, u.avatar as coach_avatar, cp.rating as coach_rating
     FROM programs p
     LEFT JOIN program_categories pc ON p.category_id = pc.id
     LEFT JOIN coach_profiles cp ON p.coach_id = cp.id
     LEFT JOIN users u ON cp.user_id = u.id
     WHERE p.slug = ?`,
    [slug]
  );

  if (!program) {
    notFound();
  }

  const features = program.features
    ? (program.features.includes('\n') ? program.features.split('\n') : program.features.split(','))
        .map((f: string) => f.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      {/* Hero Header */}
      <section className="relative py-24 sm:py-32 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={program.banner_image || program.image}
            alt={program.title}
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.25] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/75 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="orange">{program.level}</Badge>
              {program.category_name && (
                <Badge variant="lime">{program.category_name}</Badge>
              )}
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight font-heading leading-tight">
              {program.title}
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
              {program.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 pt-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ff5a1f]" />
                <span className="font-semibold text-white">{program.duration_weeks} Weeks Duration</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#c6ff3b]" />
                <span className="font-semibold text-white">Full Biomechanics Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Details */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold uppercase font-heading text-white">
                PROTOCOL OVERVIEW & SCIENCE
              </h2>
              <div className="text-zinc-300 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line">
                {program.description}
              </div>
            </div>

            {/* What is Included */}
            <div className="space-y-6 pt-8 border-t border-white/10">
              <h2 className="text-2xl sm:text-3xl font-bold uppercase font-heading text-white">
                WHAT&apos;S INCLUDED IN THIS BLUEPRINT
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feat: string, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-[#141418] border border-white/5 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#c6ff3b] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-zinc-200">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Master Coach */}
            {program.coach_name && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff5a1f]">
                  Supervised By
                </span>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden relative border border-white/15 shrink-0">
                    <Image
                      src={program.coach_avatar || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=300&auto=format&fit=crop'}
                      alt={program.coach_name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-heading">
                      {program.coach_name}
                    </h3>
                    <p className="text-xs text-[#c6ff3b] font-semibold">
                      {program.coach_title}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="font-bold text-white">{program.coach_rating || 4.9}</span>
                      <span className="text-zinc-500">• Master Coach</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Enrollment Sticky Box */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="rounded-3xl bg-[#141418] border-2 border-[#ff5a1f]/40 p-6 sm:p-8 space-y-6 shadow-2xl">
              <div>
                <Badge variant="lime" className="text-xs font-bold uppercase tracking-wider mb-2">
                  Comprehensive Blueprint Access
                </Badge>
                <h3 className="text-2xl font-black text-white font-heading mt-1">
                  Guided Transformation Split
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  100% personalized protocol with master coach supervision &amp; biometric audits.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-zinc-300">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Access Period:</span>
                  <span className="font-bold text-white">Full Lifetime Blueprint</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Diet Integration:</span>
                  <span className="font-bold text-[#c6ff3b]">Included</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Mobile Portal:</span>
                  <span className="font-bold text-white">Interactive App</span>
                </div>
              </div>

              <Link href={`/register?program=${program.slug}`} className="block w-full">
                <Button variant="primary" size="lg" className="w-full">
                  Enroll in Protocol
                </Button>
              </Link>

              <div className="text-center">
                <span className="text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  100% Satisfaction & Form Review Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

