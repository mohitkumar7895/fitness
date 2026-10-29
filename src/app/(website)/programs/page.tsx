import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { query } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Clock, BarChart3, CheckCircle2, ArrowRight, Sparkles, Shield, Flame, Activity } from 'lucide-react';
import { IMAGES } from '@/lib/images';

export const metadata = {
  title: 'Signature Training Blueprints | FitLife Wellness',
  description: 'Explore scientifically engineered protocols for hypertrophy, rapid fat loss, athletic power, and longevity.',
};

export const revalidate = 60;

export default async function ProgramsPage() {
  let programs: any[] = [];
  try {
    programs = await query(
      `SELECT p.*, pc.name as category_name 
       FROM programs p 
       LEFT JOIN program_categories pc ON p.category_id = pc.id 
       WHERE p.is_published = 1 
       ORDER BY p.display_order ASC, p.created_at DESC`
    );
  } catch (error) {
    console.error('Error fetching programs:', error);
  }

  // Fallback if empty
  if (!programs || programs.length === 0) {
    programs = [
      {
        id: 'prg_fb_1',
        title: 'Metabolic Shred & Athletic Conditioning',
        slug: 'metabolic-shred-athletic-conditioning',
        category_name: 'Fat Loss & Conditioning',
        excerpt: 'High-intensity metabolic resistance circuits designed for rapid adipose tissue oxidation while sparing lean muscle.',
        duration_weeks: 12,
        level: 'Intermediate',
        features: '5-Day Periodized Split, Heart-Rate Zone Conditioning, Clinical Macro Calculator, Weekly Form Audits',
        image: IMAGES.programs.weightLoss,
      },
      {
        id: 'prg_fb_2',
        title: 'Hypertrophy Architecture & Biomechanics',
        slug: 'hypertrophy-architecture-biomechanics',
        category_name: 'Physique Architecture',
        excerpt: 'Pure evidence-based muscle building focusing on mechanical tension, lengthened-position overload, and progressive volume.',
        duration_weeks: 16,
        level: 'Advanced',
        features: 'Upper/Lower Split, Arm Specialization Blocks, Intra-Workout Carbs Strategy, Dexa Scans',
        image: IMAGES.programs.muscleBuilding,
      },
      {
        id: 'prg_fb_3',
        title: '1-on-1 Bespoke Executive Transformation',
        slug: 'bespoke-executive-transformation',
        category_name: 'Elite Coaching',
        excerpt: 'Comprehensive concierge transformation combining dedicated master personal coaching, clinical nutrition, and private suites.',
        duration_weeks: 24,
        level: 'All Levels',
        features: 'Dedicated Master Coach, Private Recovery Plunge, Daily Diet Concierge, VIP Global Passes',
        image: IMAGES.programs.personalTraining,
      },
      {
        id: 'prg_fb_4',
        title: 'Olympic Strength & Explosive Power',
        slug: 'strength-training',
        category_name: 'Athletic Strength',
        excerpt: 'Develop raw compound power, bar speed velocity, and joint resilience on certified Eleiko platforms.',
        duration_weeks: 14,
        level: 'Intermediate - Advanced',
        features: 'Linear Velocity Transducer Tracking, Heavy Compound Focus, Connective Tissue Deloads',
        image: IMAGES.programs.strengthTraining,
      },
      {
        id: 'prg_fb_5',
        title: 'Athletic Mobility & Spinal Decompression',
        slug: 'yoga-flexibility',
        category_name: 'Mobility & Longevity',
        excerpt: 'Restore full range of motion, alleviate lumbar stress, and enhance vagal parasympathetic recovery.',
        duration_weeks: 8,
        level: 'All Levels',
        features: 'Functional Range Conditioning, Deep Myofascial Release, Vagal Breathing Sequences',
        image: IMAGES.programs.yogaFlexibility,
      },
      {
        id: 'prg_fb_6',
        title: 'Total Body Recomposition Matrix',
        slug: 'body-transformation',
        category_name: 'Metabolic Rebuild',
        excerpt: 'Drop stubborn fat and add lean muscle simultaneously through nutrient partitioning and high-density supersets.',
        duration_weeks: 12,
        level: 'All Levels',
        features: 'Carbohydrate Cycling Blueprints, Weekly Biometric Audits, 24/7 Coach Concierge',
        image: IMAGES.programs.bodyTransformation,
      },
    ];
  }

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 border-b border-white/10 overflow-hidden bg-gradient-to-b from-[#121215] to-[#080808]">
        <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-[#ff5a1f]/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <Badge variant="lime" className="px-4 py-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Precision Training Methodologies
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white font-heading">
            SIGNATURE <span className="text-gradient-orange">PROGRAMS</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Every protocol is scientifically structured around mechanical tension, progressive overload, and clinical nutrition. Select the blueprint matching your physical ambition.
          </p>

          {/* Quick Pillars Ribbon */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#c6ff3b]" />
              <span>Full Periodized Split</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#c6ff3b]" />
              <span>Tailored Nutrition Blueprint</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#c6ff3b]" />
              <span>Interactive App Tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid Section */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {programs.map((p) => {
            const features = p.features
              ? (p.features.includes('\n') ? p.features.split('\n') : p.features.split(','))
                  .map((f: string) => f.trim())
                  .filter(Boolean)
              : [];

            return (
              <div
                key={p.id}
                className="group rounded-3xl bg-[#141418] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#ff5a1f]/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xl"
              >
                <div>
                  {/* Image with Dark Vignette */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/60">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.4] group-hover:brightness-[0.55]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent opacity-90" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge variant="orange" className="bg-black/80 backdrop-blur-md text-[10px]">
                        {p.level}
                      </Badge>
                      {p.category_name && (
                        <Badge variant="lime" className="bg-black/80 backdrop-blur-md text-[10px]">
                          {p.category_name}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#ff5a1f]" />
                        {p.duration_weeks} Weeks
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-[#c6ff3b]" />
                        Structured Split
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white font-heading group-hover:text-[#ff5a1f] transition-colors leading-snug">
                      {p.title}
                    </h3>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                      {p.excerpt}
                    </p>

                    {features.length > 0 && (
                      <ul className="space-y-1.5 pt-3 border-t border-white/5">
                        {features.slice(0, 4).map((feat: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#c6ff3b] shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Card Action without Pricing */}
                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#c6ff3b]" />
                      Full Blueprint
                    </span>

                    <Link href={`/programs/${p.slug}`}>
                      <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Explore Protocol
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Blueprint Assurance Callout */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#18181c] via-[#121215] to-[#18181c] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl mt-12">
          <div className="space-y-2 text-center md:text-left">
            <Badge variant="lime" className="text-[10px]">Guaranteed Standard</Badge>
            <h3 className="text-xl sm:text-2xl font-bold uppercase font-heading text-white">
              NEED HELP SELECTING YOUR PROTOCOL?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Complete our 2-minute biometric assessment and our Master Coach concierge will match the ideal split to your kinetic profile.
            </p>
          </div>
          <Link href="/register">
            <Button variant="primary" size="lg" className="whitespace-nowrap" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Take Free Assessment
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
