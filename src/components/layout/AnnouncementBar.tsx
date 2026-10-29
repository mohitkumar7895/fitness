'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flame, X, ArrowRight } from 'lucide-react';

interface AnnouncementBarProps {
  text?: string;
  link?: string;
}

export function AnnouncementBar({
  text = 'EXCLUSIVE FOUNDING OFFER: Join this month and receive 2 complimentary 1-on-1 Master Trainer sessions & VO2 scans.',
  link = '/membership',
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative z-40 bg-gradient-to-r from-[#ff5a1f] via-[#e04a14] to-[#ff5a1f] text-white text-[11px] sm:text-xs font-semibold px-3 sm:px-4 py-2 sm:py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 text-center overflow-hidden">
          <Flame className="w-3.5 h-3.5 text-[#c6ff3b] shrink-0 animate-pulse hidden sm:inline-block" />
          <span className="tracking-wide truncate sm:whitespace-normal">{text}</span>
          {link && (
            <Link
              href={link}
              className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-[#c6ff3b] transition-colors ml-1 font-bold shrink-0"
            >
              Claim Pass <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        <button
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss banner"
          className="text-white/80 hover:text-white transition-colors p-1 shrink-0 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

