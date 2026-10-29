import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { query } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { Star, ShieldCheck, ArrowRight, Award, CheckCircle2, MessageSquare, Flame } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { IMAGES } from '@/lib/images';

export const metadata = {
  title: 'Head Coach Marcus Vance | FitLife Wellness',
  description: 'Meet Head Coach Marcus Vance — Olympic & CSCS certified master coach leading 1-on-1 personal training and biometric transformations.',
};

export const revalidate = 60;

export default async function TrainersPage() {
  let coach: any = null;
  try {
    const rows = await query(
      `SELECT cp.*, u.name, u.avatar, u.email 
       FROM coach_profiles cp 
       JOIN users u ON cp.user_id = u.id 
       WHERE cp.id = 'cch_001' OR cp.is_featured = 1 
       LIMIT 1`
    );
    if (rows && rows.length > 0) {
      coach = rows[0];
    }
  } catch (error) {
    console.error('Error fetching head coach:', error);
  }

  if (!coach) {
    coach = {
      id: 'cch_001',
      name: 'Marcus Vance',
      title: 'Head of Strength & Biomechanics',
      experience_years: 12,
      certifications: 'CSCS (NSCA), USAW Level 2, Precision Nutrition L2',
      specializations: 'Hypertrophy, Powerlifting, Biomechanical Rehab, Peak Conditioning',
      hourly_rate: 85,
      rating: 5.0,
      avatar: IMAGES.trainers.marcus,
      bio: 'Former Olympic weightlifting coach with 12+ years of experience transforming elite athletes, business executives, and dedicated lifters. Every member works directly with Coach Marcus for custom periodization, real-time biomechanical analysis, and targeted nutrition.',
    };
  }

  const coachWaUrl = `https://wa.me/${(SITE_CONFIG.whatsapp || '919876543210').replace(/\D/g, '')}?text=${encodeURIComponent(
    'Hi Coach Marcus! I am looking to begin 1-on-1 personal coaching with you at FitLife Wellness. Let us discuss my fitness goals.'
  )}`;

  return (
    <div className="bg-[#080808] text-white min-h-screen py-14 sm:py-20 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#ff5a1f]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex">
            <Badge variant="lime" className="px-3.5 py-1 text-xs font-bold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Olympic &amp; CSCS Certified</span>
            </Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight font-heading">
            MEET THE <span className="text-gradient-orange">HEAD COACH</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">
            At FitLife Wellness, our members are guided exclusively by Master Coach Marcus Vance. No junior floor trainers — you receive dedicated 1-on-1 attention from a seasoned performance director.
          </p>
        </div>

        {/* Master Profile Card */}
        <div className="rounded-3xl bg-[#141418] border border-white/10 overflow-hidden shadow-2xl p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Coach Portrait */}
            <div className="lg:col-span-5 relative aspect-[4/5] rounded-2xl overflow-hidden bg-black/60 shadow-xl border border-white/10">
              <Image
                src={coach.avatar || IMAGES.trainers.marcus}
                alt={coach.name}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/80 border border-white/15 backdrop-blur-md text-xs font-bold text-white">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>5.0 (210+ Verified Reviews)</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#ff5a1f] text-white text-xs font-black uppercase">
                  12+ Yrs
                </div>
              </div>
            </div>

            {/* Coach Credentials & Bio */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-mono font-black uppercase text-[#c6ff3b] tracking-widest block mb-1">
                  Master Performance Director &amp; Founder
                </span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-heading">
                  {coach.name}
                </h2>
                <p className="text-sm font-semibold text-[#ff5a1f] mt-1">
                  {coach.title} • {coach.certifications || 'CSCS, USAW L2, PN2'}
                </p>
              </div>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                {coach.bio ||
                  'Over 12 years directing elite athletic camps, national powerlifters, and corporate executives. Coach Marcus combines evidence-based biomechanics, joint-friendly hypertrophy splits, and clinical nutrition calibration to guarantee sustainable progress without burnout.'}
              </p>

              {/* What You Receive */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase text-white tracking-wider">
                  What Working With Coach Marcus Includes:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-[#ff5a1f] shrink-0" />
                    <span>Personal Biomechanical Screening</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-[#c6ff3b] shrink-0" />
                    <span>Bespoke Periodized Mesocycles</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-[#ff5a1f] shrink-0" />
                    <span>Clinical Nutrition &amp; Macro Auditing</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-[#c6ff3b] shrink-0" />
                    <span>Daily WhatsApp Q&amp;A Accountability</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t border-white/10">
                <Link href={`/register?coach=${coach.id}`} className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto justify-center shadow-[0_10px_25px_rgba(255,90,31,0.35)]"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Register With Coach Marcus
                  </Button>
                </Link>

                <a
                  href={coachWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black tracking-wide flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-105 cursor-pointer"
                  aria-label="Direct WhatsApp message to Coach Marcus"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
