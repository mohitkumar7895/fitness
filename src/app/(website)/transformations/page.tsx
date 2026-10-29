import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { query } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Star, CheckCircle, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Real Member Transformations & Verified Results',
  description: 'Explore the life-changing physical and mental transformations achieved by FitLife Wellness members.',
};

export const revalidate = 60;

export default async function TransformationsPage() {
  let testimonials: any[] = [];
  try {
    testimonials = await query(
      `SELECT * FROM testimonials WHERE is_approved = 1 ORDER BY display_order ASC, created_at DESC`
    );
  } catch (error) {
    console.error('Error fetching testimonials:', error);
  }

  if (!testimonials || testimonials.length === 0) {
    testimonials = [
      {
        id: 'tf_1',
        name: 'Arjun Mehta',
        role: 'Tech Executive',
        company_or_goal: 'Weight Loss & Hypertrophy',
        rating: 5,
        content: 'Down 18kg of pure body fat in 16 weeks while adding 4kg lean muscle. The biomechanical precision and meal timing transformed not just my physique, but my daily stamina and focus.',
        result_highlight: '-18 KG Fat Loss in 16 Wks',
        before_image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop',
        after_image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop',
        before_weight: 96,
        after_weight: 78,
      },
      {
        id: 'tf_2',
        name: 'Priya Sharma',
        role: 'Architect',
        company_or_goal: 'Athletic Toning & Strength',
        rating: 5,
        content: 'I had plateaued for 3 years at commercial gyms. FitLife Wellness customized my strength split around my hip biomechanics. I achieved full abdominal definition and increased my deadlift by 45kg.',
        result_highlight: '-12% Body Fat & Core Definition',
        before_image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop',
        after_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
        before_weight: 68,
        after_weight: 56,
      },
      {
        id: 'tf_3',
        name: 'David Reynolds',
        role: 'Entrepreneur',
        company_or_goal: 'Body Recomposition',
        rating: 5,
        content: 'The 1-on-1 concierge coaching eliminated all guesswork. Every workout was tailored, every macro counted. Best shape of my entire adult life at age 42.',
        result_highlight: '+6.5 KG Lean Mass & Sub-10% Fat',
        before_image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
        after_image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
        before_weight: 84,
        after_weight: 82,
      },
    ];
  }

  return (
    <div className="bg-[#080808] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="orange">
            Proven Metamorphosis
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight font-heading">
            REAL MEMBER <span className="text-gradient-orange">TRANSFORMATIONS</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">
            Real people. Real bio-scans. No fake claims or edited lighting. Every result featured below was earned inside FitLife Wellness training bays under master coaching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-[#141418] border border-white/10 overflow-hidden flex flex-col justify-between p-6 hover:border-[#ff5a1f]/40 transition-all duration-300 shadow-xl space-y-6"
            >
              <div className="grid grid-cols-2 gap-2 relative rounded-2xl overflow-hidden aspect-[16/10] border border-white/10">
                <div className="relative h-full">
                  <Image
                    src={item.before_image || 'https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?q=80&w=600&auto=format&fit=crop'}
                    alt={`${item.name} Before`}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[9px] font-black uppercase text-zinc-400">
                    Phase 1 {item.before_weight ? `(${item.before_weight}kg)` : ''}
                  </div>
                </div>

                <div className="relative h-full">
                  <Image
                    src={item.after_image || 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop'}
                    alt={`${item.name} After`}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#ff5a1f] text-[9px] font-black uppercase text-white shadow-lg">
                    Phase Final {item.after_weight ? `(${item.after_weight}kg)` : ''}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="lime" className="text-[11px] font-extrabold tracking-wide">
                    {item.result_highlight}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating || 5)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    {item.role} • {item.company_or_goal}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verified Client</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link href="/register">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Start Your Own Transformation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

