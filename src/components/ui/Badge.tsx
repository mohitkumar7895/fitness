import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'orange' | 'lime' | 'zinc' | 'outline' | 'red';
}

export function Badge({
  className,
  children,
  variant = 'orange',
  ...props
}: BadgeProps) {
  const variants = {
    orange:
      'bg-[#ff5a1f]/10 text-[#ff5a1f] border border-[#ff5a1f]/30',
    lime:
      'bg-[#c6ff3b]/10 text-[#c6ff3b] border border-[#c6ff3b]/30',
    zinc:
      'bg-zinc-800 text-zinc-300 border border-zinc-700',
    outline:
      'bg-transparent text-white border border-white/20',
    red:
      'bg-rose-500/10 text-rose-400 border border-rose-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

