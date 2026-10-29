import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { query } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { Star, ShieldCheck, ArrowRight, Award } from 'lucide-react';

export const metadata = {
  title: 'Our Master Coaches & Specialists',
  description: 'Meet our Olympic certified coaches, exercise physiologists, and sports nutrition directors.',
};

export const revalidate = 60;

export default async function TrainersPage() {
  let trainers: any[] = [];
  try {
    trainers = await query(
      `SELECT cp.*, u.name, u.avatar, u.email 
       FROM coach_profiles cp 
       JOIN users u ON cp.user_id = u.id 
       WHERE u.is_active = 1 
       ORDER BY cp.display_order ASC`
    );
  } catch (error) {
    console.error('Error fetching coaches:', error);
  }

  if (!trainers || trainers.length === 0) {
    trainers = [
      {
        id: 'cch_01',
        name: 'Marcus Vance',
        title: 'Head of Strength & Biomechanics',
        experience_years: 12,
        specializations: 'Hypertrophy, Powerlifting, Biomechanics',
        hourly_rate: 3500,
        rating: 5.0,
        avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=85&w=800&auto=format&fit=crop',
      },
      {
        id: 'cch_02',
        name: 'Elena Rostova',
        title: 'Master Conditioning Specialist',
        experience_years: 9,
        specializations: 'Fat Loss, Metabolic Conditioning, HIIT',
        hourly_rate: 3000,
        rating: 4.9,
        avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=85&w=800&auto=format&fit=crop',
      },
      {
        id: 'cch_03',
        name: 'Kai Jensen',
        title: 'Hypertrophy & Physique Architect',
        experience_years: 8,
        specializations: 'Physique Architecture, Muscle Growth',
        hourly_rate: 2800,
        rating: 4.9,
        avatar: 'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?q=85&w=800&auto=format&fit=crop',
      },
      {
        id: 'cch_04',
        name: 'Dr. Maya Lin',
        title: 'Clinical Nutritionist & Mobility Coach',
        experience_years: 10,
        specializations: 'Sports Nutrition, Mobility, Recovery',
        hourly_rate: 3200,
        rating: 5.0,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=85&w=800&auto=format&fit=crop',
      },
    ];
  }

  return (
    <div className="bg-[#080808] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="lime">
            Olympic & CSCS Certified
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight font-heading">
            OUR MASTER <span className="text-gradient-orange">COACHES</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">
            Every coach at FitLife Wellness possesses a minimum of 7+ years high-performance coaching background. Hand-picked for biomechanical expertise and deep empathy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainers.map((tr) => (
            <div
              key={tr.id}
              className="group rounded-3xl bg-[#141418] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#ff5a1f]/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xl"
            >
              <div>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={tr.avatar}
                    alt={tr.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent opacity-90" />
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 border border-white/10 backdrop-blur-md text-xs font-bold text-white">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{tr.rating}</span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="zinc" className="text-[9px]">
                      {tr.experience_years}+ Yrs Experience
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-white font-heading group-hover:text-[#ff5a1f] transition-colors">
                    {tr.name}
                  </h3>
                  <p className="text-xs text-[#ff5a1f] font-semibold">
                    {tr.title}
                  </p>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed pt-1">
                    {tr.specializations}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase">Rate</span>
                    <p className="text-xs font-bold text-white">{formatCurrency(tr.hourly_rate)}</p>
                  </div>
                  <Link href={`/trainers/${tr.id}`}>
                    <Button variant="primary" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

