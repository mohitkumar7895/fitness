'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';
import { Check, Flame, Sparkles, ArrowRight } from 'lucide-react';

export interface MembershipPlanItem {
  id: string;
  name: string;
  slug: string;
  tag?: string;
  duration_months: number;
  price: number;
  original_price?: number;
  billing_period: string;
  features: string;
  is_popular: boolean;
}

export function MembershipSection({ plans = [] }: { plans: MembershipPlanItem[] }) {
  const displayPlans = plans.length > 0 ? plans : [
    {
      id: 'plan_01',
      name: 'Monthly Kickstart',
      slug: 'monthly-kickstart',
      tag: 'FLEXIBLE',
      duration_months: 1,
      price: 4999,
      original_price: 6499,
      billing_period: 'monthly',
      features: 'Full Club Floor Access, InBody Composition Bio-Scan, Steam & Infrared Sauna, Locker & Towel Service',
      is_popular: false,
    },
    {
      id: 'plan_02',
      name: 'Quarterly Transformer',
      slug: 'quarterly-transformer',
      tag: 'MOST POPULAR',
      duration_months: 3,
      price: 12999,
      original_price: 16999,
      billing_period: 'quarterly',
      features: 'Full Club & Free Weights Floor, 3x 1-on-1 Master Coach Sessions, Clinical Macro Partition Diet Plan, Unlimited Cold Plunge & Recovery',
      is_popular: true,
    },
    {
      id: 'plan_03',
      name: 'Half-Yearly Elite Athlete',
      slug: 'half-yearly-elite',
      tag: 'DEDICATED',
      duration_months: 6,
      price: 22999,
      original_price: 29999,
      billing_period: 'half-yearly',
      features: 'Priority Booking For All Master Coaches, Complete Bi-Weekly Dexa Scans, In-House Nutritionist Consultations, Guest Passes (2 per month)',
      is_popular: false,
    },
    {
      id: 'plan_04',
      name: 'Annual Black Card VIP',
      slug: 'annual-black-card',
      tag: 'ALL-INCLUSIVE',
      duration_months: 12,
      price: 39999,
      original_price: 54999,
      billing_period: 'yearly',
      features: 'Full 365-Day Uncapped Access, 12 Dedicated 1-on-1 Coaching Sessions, Unlimited Private Cryo & Plunge Suites, Personalized Nutrition Delivery Concierge, VIP Global Reciprocal Privileges',
      is_popular: false,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#0a0a0d] relative overflow-hidden border-t border-white/5">
      {/* Background glow */}
      <div className="absolute top-1/3 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#c6ff3b]/5 rounded-full blur-[120px] sm:blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-3">
          <Badge variant="orange" className="px-4 py-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Capped Sanctuary Memberships
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-heading">
            INVEST IN YOUR <span className="text-gradient-orange">PHYSIQUE</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            No overcrowded floors. No broken cables. Select your commitment tier and unlock unprecedented athletic infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {displayPlans.map((pl) => {
            const featureList = pl.features
              ? (pl.features.includes('\n') ? pl.features.split('\n') : pl.features.split(','))
                  .map((f: string) => f.trim())
                  .filter(Boolean)
              : [];
            const isPop = Boolean(pl.is_popular);

            return (
              <div
                key={pl.id}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                  isPop
                    ? 'bg-gradient-to-b from-[#1c1c22] to-[#121215] border-2 border-[#ff5a1f] shadow-[0_0_40px_rgba(255,90,31,0.25)] lg:-translate-y-2'
                    : 'bg-[#141418] border border-white/10 hover:border-white/25 hover:-translate-y-1'
                }`}
              >
                {/* Popular Pill */}
                {isPop && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#ff5a1f] text-white text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-white" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-400">
                      {pl.tag || 'Membership Tier'}
                    </span>
                    <h3 className="text-xl font-bold text-white font-heading mt-1">
                      {pl.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                      Billed {pl.billing_period} ({pl.duration_months} mo)
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl sm:text-4xl font-black text-white font-heading">
                        {formatCurrency(pl.price)}
                      </span>
                    </div>
                    {pl.original_price && pl.original_price > pl.price && (
                      <p className="text-xs text-zinc-500 line-through mt-0.5">
                        Regular: {formatCurrency(pl.original_price)}
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2.5 pt-4 border-t border-white/5">
                    {featureList.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                        <Check className="w-4 h-4 text-[#c6ff3b] shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="pt-6 mt-6 border-t border-white/10">
                  <Link href={`/register?plan=${pl.slug}`}>
                    <Button
                      variant={isPop ? 'primary' : 'outline'}
                      size="md"
                      className="w-full justify-center text-xs font-bold"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Join This Tier
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* VIP Membership Concierge Callout */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#18181c] via-[#121215] to-[#18181c] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-[10px] font-black uppercase text-[#c6ff3b] tracking-widest block">
              Concierge Guidance
            </span>
            <h4 className="text-xl sm:text-2xl font-black uppercase font-heading text-white">
              NEED HELP CHOOSING OR WANT A PRIVATE CLUB TOUR?
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Experience the recovery plunge suites and competition floor before deciding. Speak with our Membership Director.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Book Club Tour
            </Link>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp?.replace(/\D/g, '')}?text=${encodeURIComponent(
                'Hi FitLife Wellness, I have a few questions regarding your membership tiers and facilities.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
