'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'lime' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#080808] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider text-xs md:text-sm select-none';

    const variants = {
      primary:
        'bg-[#ff5a1f] text-white hover:bg-[#e04a14] hover:shadow-[0_0_25px_rgba(255,90,31,0.4)] focus:ring-[#ff5a1f] active:scale-[0.98]',
      secondary:
        'bg-[#18181b] text-white border border-white/10 hover:border-[#ff5a1f]/50 hover:bg-[#222226] focus:ring-zinc-600 active:scale-[0.98]',
      lime:
        'bg-[#c6ff3b] text-black font-bold hover:bg-[#b0eb28] hover:shadow-[0_0_25px_rgba(198,255,59,0.35)] focus:ring-[#c6ff3b] active:scale-[0.98]',
      outline:
        'border border-white/20 text-white hover:border-[#ff5a1f] hover:text-[#ff5a1f] bg-transparent focus:ring-[#ff5a1f] active:scale-[0.98]',
      ghost:
        'text-zinc-300 hover:text-white hover:bg-white/5 focus:ring-zinc-500 active:scale-[0.98]',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] focus:ring-rose-500 active:scale-[0.98]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
      md: 'px-5 py-2.5 text-xs md:text-sm rounded-xl gap-2',
      lg: 'px-7 py-3.5 text-sm md:text-base rounded-xl gap-2.5 font-bold',
      xl: 'px-9 py-4 text-base md:text-lg rounded-2xl gap-3 font-extrabold shadow-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

