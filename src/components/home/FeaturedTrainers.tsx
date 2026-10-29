'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Star, ShieldCheck, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import { IMAGES } from '@/lib/images';
import { SITE_CONFIG } from '@/lib/constants';

export interface TrainerItem {
  id: string;
  user_id?: string;
  name: string;
  title: string;
  bio?: string;
  experience_years?: number;
  certifications?: string;
  specializations?: string;
  hourly_rate?: number;
  rating?: number;
  review_count?: number;
  avatar?: string;
}

export interface FeaturedTrainersProps {
  trainers?: TrainerItem[];
}

export const FeaturedTrainers: React.FC<FeaturedTrainersProps> = ({ trainers = [] }) => {
  // Sole Master Coach of FitLife Wellness
  const headCoach: TrainerItem = trainers.length > 0 ? trainers[0] : {
    id: 'cch_001',
    name: 'Marcus Vance',
    title: 'Head of Strength & Biomechanics',
    bio: 'Former Olympic weightlifting coach with 12+ years of experience transforming elite athletes and executives. Every member receives direct biomechanical movement audits, personalized periodized programming, and continuous real-time guidance.',
    experience_years: 12,
    certifications: 'CSCS (NSCA), USAW Level 2, Precision Nutrition L2',
    specializations: 'Hypertrophy, Powerlifting, Biomechanical Rehab, Peak Conditioning',
    hourly_rate: 85,
    rating: 5.0,
    review_count: 210,
    avatar: IMAGES.trainers.marcus,
  };

  const coachWaUrl = `https://wa.me/${(SITE_CONFIG.whatsapp || '919876543210').replace(/\D/g, '')}?text=${encodeURIComponent(
    'Hi Coach Marcus! I would like to consult with you directly regarding 1-on-1 personal coaching and transformation at FitLife.'
  )}`;

  return (
    <section className="py-14 sm:py-20 bg-[#0a0a0d] relative overflow-hidden border-t border-white/5">
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-[#ff5a1f]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex">
            <Badge variant="lime" className="px-3.5 py-1 text-xs font-bold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Dedicated 1-on-1 Mentorship</span>
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-heading">
            MEET YOUR <span className="text-gradient-orange">HEAD COACH</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            At FitLife Wellness, you never get passed to inexperienced floor assistants. You work directly with our Master Coach for your entire transformation.
          </p>
        </div>

        {/* Master Coach Highlight Card */}
        <div className="rounded-3xl bg-[#141418] border border-white/10 overflow-hidden shadow-2xl hover:border-[#ff5a1f]/35 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Coach Portrait Column */}
            <div className="lg:col-span-5 relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-[520px] overflow-hidden bg-black/60">
              <Image
                src={headCoach.avatar || IMAGES.trainers.marcus}
                alt={headCoach.name}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-top hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-[#141418]/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#141418]/20 lg:to-[#141418]" />

              {/* Floating Verified Experience Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 border border-white/15 backdrop-blur-md text-xs font-bold text-white shadow-lg">
                <ShieldCheck className="w-4 h-4 text-[#c6ff3b]" />
                <span>12+ Years Coaching</span>
              </div>

              {/* Rating Badge */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 border border-white/15 backdrop-blur-md text-xs font-black text-white shadow-lg">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>5.0 Rating</span>
                <span className="text-zinc-400 font-normal">(210+ Transformations)</span>
              </div>
            </div>

            {/* Coach Narrative & Credential Column */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex">
                  <span className="text-xs font-mono font-black uppercase text-[#ff5a1f] tracking-widest">
                    Head Coach &amp; Master Trainer
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-heading">
                  {headCoach.name}
                </h3>
                <p className="text-sm font-semibold text-[#c6ff3b]">
                  {headCoach.title} • {headCoach.certifications || 'CSCS (NSCA), USAW L2'}
                </p>
              </div>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                {headCoach.bio ||
                  'Specializing in biomechanical precision, safe progressive overload, and personalized nutrition. Every client receives a customized intake, 1-on-1 form audits, and direct WhatsApp accountability so you never feel stuck or confused.'}
              </p>

              {/* Pillars of Coaching */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-[#ff5a1f] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                      Biomechanical Form Audits
                    </h5>
                    <p className="text-[11px] text-zinc-400 leading-snug">
                      Zero guesswork. Every lift calibrated for joint safety.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-[#c6ff3b] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                      Custom Nutrition &amp; Macros
                    </h5>
                    <p className="text-[11px] text-zinc-400 leading-snug">
                      Daily calorie &amp; protein targets matched to your lifestyle.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-[#ff5a1f] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                      Direct WhatsApp Support
                    </h5>
                    <p className="text-[11px] text-zinc-400 leading-snug">
                      Continuous 1-on-1 answers to your training questions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-[#c6ff3b] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                      Weekly Progress Scans
                    </h5>
                    <p className="text-[11px] text-zinc-400 leading-snug">
                      InBody body fat &amp; muscle mass tracking every 14 days.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 border-t border-white/10">
                <Link href={`/register?coach=${headCoach.id}`} className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto justify-center shadow-[0_10px_25px_rgba(255,90,31,0.35)]"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Start With Coach Marcus
                  </Button>
                </Link>

                <a
                  href={coachWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black tracking-wide flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(37,211,102,0.35)] transition-transform hover:scale-105 cursor-pointer"
                  aria-label="Direct WhatsApp message to Coach Marcus"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>

                <Link href="/trainers" className="w-full sm:w-auto">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                    Full Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
