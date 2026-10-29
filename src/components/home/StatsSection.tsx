'use client';

import React from 'react';
import { StatCounter } from '@/components/ui/StatCounter';

export function StatsSection() {
  return (
    <section className="relative z-20 py-8 sm:py-10 border-y border-white/10 bg-[#0d0d10]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="pt-4 md:pt-0 md:px-6">
            <StatCounter
              end={15000}
              suffix="+"
              label="Active Members"
              sublabel="Capped for zero wait time"
            />
          </div>
          <div className="pt-4 md:pt-0 md:px-6">
            <StatCounter
              end={25}
              suffix="+"
              label="Certified Coaches"
              sublabel="Olympic & CSCS certified"
            />
          </div>
          <div className="pt-4 md:pt-0 md:px-6">
            <StatCounter
              end={9400}
              suffix="+"
              label="Transformations"
              sublabel="Verified bio-scans"
            />
          </div>
          <div className="pt-4 md:pt-0 md:px-6">
            <StatCounter
              end={12}
              suffix=" Yrs"
              label="Elite Excellence"
              sublabel="Since 2014"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

