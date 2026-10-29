import React from 'react';
import Link from 'next/link';
import { query } from '@/lib/db';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';
import { Check, Flame, Sparkles, Shield, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Club Memberships & VIP Black Card',
  description: 'Explore our capped sanctuary membership tiers. Monthly, quarterly, half-yearly, and luxury VIP access.',
};

export const revalidate = 60;

export default async function MembershipPage() {
  let plans: any[] = [];
  try {
    plans = await query(
      `SELECT * FROM membership_plans WHERE is_published = 1 ORDER BY display_order ASC`
    );
  } catch (error) {
    console.error('Error fetching membership plans:', error);
  }

  if (!plans || plans.length === 0) {
    plans = [
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
  }

  return (
    <div className="bg-[#080808] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="orange">
            <Sparkles className="w-3.5 h-3.5" />
            Capped Sanctuary Allocation
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight font-heading">
            INVEST IN YOUR <span className="text-gradient-orange">PHYSIQUE</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">
            Select the tier that aligns with your athletic timeline. Every membership includes access to our high-performance floor, steam suites, and locker concierge.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((pl) => {
            const features = pl.features
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
                    ? 'bg-gradient-to-b from-[#1c1c22] to-[#121215] border-2 border-[#ff5a1f] shadow-[0_0_40px_rgba(255,90,31,0.25)] lg:-translate-y-3'
                    : 'bg-[#141418] border border-white/10 hover:border-white/25 hover:-translate-y-1'
                }`}
              >
                {isPop && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#ff5a1f] text-black text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-black" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-zinc-400">
                      {pl.tag || 'Tier'}
                    </span>
                    <h3 className="text-xl font-bold text-white font-heading mt-1">
                      {pl.name}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                      Billed {pl.billing_period}
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl sm:text-4xl font-black text-white font-heading">
                        {formatCurrency(pl.price)}
                      </span>
                    </div>
                    {pl.original_price && (
                      <p className="text-xs text-zinc-500 line-through mt-0.5">
                        Regular: {formatCurrency(pl.original_price)}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-white/5">
                    {features.map((feat: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <Check className="w-4 h-4 text-[#c6ff3b] shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link href={`/register?plan=${pl.slug}`} className="w-full">
                    <Button
                      variant={isPop ? 'primary' : 'secondary'}
                      size="md"
                      className="w-full"
                    >
                      Select Plan
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="p-8 rounded-3xl bg-[#141418] border border-white/10 text-center max-w-3xl mx-auto space-y-3">
          <div className="flex justify-center text-[#c6ff3b]">
            <Shield className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold uppercase font-heading">
            Our 14-Day Performance Pledge
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl mx-auto">
            If in your first 14 days you do not feel our facility, coaches, and environment match the world-class standard promised, we will cheerfully refund 100% of your membership fee.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/contact">
              <Button variant="outline" size="sm" className="rounded-full">
                Schedule Private Club Tour
              </Button>
            </Link>
            <a
              href={`https://wa.me/${(SITE_CONFIG.whatsapp || '919876543210').replace(/\D/g, '')}?text=${encodeURIComponent(
                'Hi FitLife Wellness, I have a few questions about your membership tiers and club tour.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

