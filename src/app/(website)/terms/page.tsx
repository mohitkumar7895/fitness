import React from 'react';
import { Badge } from '@/components/ui/Badge';

export const metadata = {
  title: 'Terms & Conditions | FitLife Wellness',
  description: 'Sanctuary rules, membership terms, personal coaching policies, and cancellation privileges.',
};

export default function TermsPage() {
  return (
    <div className="bg-[#080808] text-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Badge variant="lime">Member Agreement</Badge>
          <h1 className="text-3xl sm:text-4xl font-black uppercase font-heading text-white mt-2">
            TERMS &amp; CONDITIONS
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Effective October 2026</p>
        </div>

        <div className="prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed space-y-6">
          <h3 className="text-lg font-bold text-white font-heading">1. Membership &amp; Club Etiquette</h3>
          <p>
            FitLife Wellness is dedicated to maintaining an orderly, luxury training environment. Members must re-rack dumbbells and barbells after use and respect designated private coaching bays when in session.
          </p>

          <h3 className="text-lg font-bold text-white font-heading">2. Session Rescheduling &amp; Cancellations</h3>
          <p>
            Private 1-on-1 coaching sessions may be rescheduled up to 12 hours prior to scheduled appointment times without penalty. Late cancellations or no-shows forfeit the allotted session credit.
          </p>

          <h3 className="text-lg font-bold text-white font-heading">3. Freeze Privileges</h3>
          <p>
            Members holding Quarterly, Half-Yearly, or Annual Black Card contracts may pause their memberships in accordance with plan tier allowances by notifying the concierge team in advance.
          </p>
        </div>
      </div>
    </div>
  );
}

