'use client';

import React, { useId } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'pill' | 'segmented';
}

export function ThemeToggle({
  className = '',
  variant = 'icon',
}: ThemeToggleProps) {
  const { theme, setTheme, isDark } = useTheme();
  const id = useId();

  // Full segmented pill with labels (for mobile drawer, footer, settings)
  if (variant === 'pill' || variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-full border transition-all duration-300 ${
          isDark
            ? 'bg-[#151518] border-white/10 shadow-inner'
            : 'bg-zinc-100 border-zinc-200 shadow-inner'
        } ${className}`}
        role="group"
        aria-label="Theme mode switcher"
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            !isDark
              ? 'text-zinc-900 font-extrabold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          aria-pressed={!isDark}
        >
          {!isDark && (
            <motion.div
              layoutId={`theme-slider-pill-${id}`}
              className="absolute inset-0 bg-white rounded-full shadow-md border border-zinc-200"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500 fill-amber-500' : 'text-zinc-400'}`} />
            <span>Light</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            isDark
              ? 'text-white font-extrabold'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
          aria-pressed={isDark}
        >
          {isDark && (
            <motion.div
              layoutId={`theme-slider-pill-${id}`}
              className="absolute inset-0 bg-gradient-to-r from-[#ff5a1f] to-[#e04a14] rounded-full shadow-[0_0_15px_rgba(255,90,31,0.4)]"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-white fill-white' : 'text-zinc-500'}`} />
            <span>Dark</span>
          </span>
        </button>
      </div>
    );
  }

  // Sleek dual-icon mini switcher for Navbar & headers
  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-full border transition-all duration-300 ${
        isDark
          ? 'bg-black/60 border-white/15 backdrop-blur-md'
          : 'bg-zinc-100 border-zinc-300 shadow-sm backdrop-blur-md'
      } ${className}`}
      role="group"
      aria-label="Theme mode switcher"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        title="Switch to Light Theme"
        aria-label="Light Theme"
        className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
          !isDark
            ? 'text-amber-500'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        {!isDark && (
          <motion.div
            layoutId={`theme-mini-slider-${id}`}
            className="absolute inset-0 bg-white rounded-full shadow-md border border-zinc-200"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
        <Sun className={`relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 ${!isDark ? 'text-amber-500 fill-amber-500' : ''}`} />
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        title="Switch to Dark Theme"
        aria-label="Dark Theme"
        className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
          isDark
            ? 'text-white'
            : 'text-zinc-500 hover:text-zinc-800'
        }`}
      >
        {isDark && (
          <motion.div
            layoutId={`theme-mini-slider-${id}`}
            className="absolute inset-0 bg-[#ff5a1f] rounded-full shadow-[0_0_12px_rgba(255,90,31,0.5)]"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
        <Moon className={`relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDark ? 'text-white fill-white' : ''}`} />
      </button>
    </div>
  );
}
