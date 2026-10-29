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
  const { theme, setTheme, toggleTheme, isDark } = useTheme();
  const id = useId();

  // Full segmented pill with labels (for mobile drawer, footer, settings)
  if (variant === 'pill' || variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-full border transition-all duration-300 ${
          isDark
            ? 'bg-[#151518] border-white/15 shadow-inner'
            : 'bg-slate-200/80 border-slate-300 shadow-inner'
        } ${className}`}
        role="group"
        aria-label="Theme mode switcher"
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            !isDark
              ? 'text-slate-900 font-extrabold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          aria-pressed={!isDark}
        >
          {!isDark && (
            <motion.div
              layoutId={`theme-slider-pill-${id}`}
              className="absolute inset-0 bg-white rounded-full shadow-md border border-slate-300"
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
              : 'text-slate-600 hover:text-slate-900'
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
            <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-white fill-white' : 'text-slate-600'}`} />
            <span>Dark</span>
          </span>
        </button>
      </div>
    );
  }

  // Ultra-responsive dual capsule toggle for Navbar
  return (
    <div
      onClick={(e) => {
        // If clicking the container background, toggle smoothly
        if (e.target === e.currentTarget) {
          toggleTheme();
        }
      }}
      className={`relative inline-flex items-center p-1 rounded-full border transition-all duration-300 cursor-pointer select-none ${
        isDark
          ? 'bg-black/75 border-white/20 hover:border-white/35 backdrop-blur-xl shadow-lg'
          : 'bg-white border-slate-300 hover:border-slate-400 shadow-md backdrop-blur-xl'
      } ${className}`}
      role="group"
      aria-label="Theme mode switcher"
    >
      {/* Light Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setTheme('light');
        }}
        aria-label="Light Theme"
        className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
          !isDark
            ? 'text-amber-500'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        {!isDark && (
          <motion.div
            layoutId={`theme-mini-slider-${id}`}
            className="absolute inset-0 bg-slate-100 rounded-full shadow-sm border border-slate-200"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
        <Sun className={`relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${!isDark ? 'text-amber-500 fill-amber-500 rotate-0 scale-110' : '-rotate-90'}`} />
      </button>

      {/* Dark Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setTheme('dark');
        }}
        aria-label="Dark Theme"
        className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
          isDark
            ? 'text-white'
            : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        {isDark && (
          <motion.div
            layoutId={`theme-mini-slider-${id}`}
            className="absolute inset-0 bg-gradient-to-r from-[#ff5a1f] to-[#e04a14] rounded-full shadow-[0_0_12px_rgba(255,90,31,0.5)]"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
        <Moon className={`relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${isDark ? 'text-white fill-white rotate-0 scale-110' : 'rotate-45'}`} />
      </button>
    </div>
  );
}
