'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// High-impact, wide-angle uncropped fitness & gym photography
const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop',
    title: 'Strength & Hypertrophy',
    subtitle: 'Olympic-grade equipment and biomechanically perfected training.',
    position: 'center center',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1920&auto=format&fit=crop',
    title: 'Metabolic Conditioning',
    subtitle: 'High-intensity conditioning to torch fat and reveal lean athletic tone.',
    position: 'center 20%',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1920&auto=format&fit=crop',
    title: '1-on-1 Master Coaching',
    subtitle: 'Dedicated certified personal trainers guiding every single rep.',
    position: 'center 15%',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1920&auto=format&fit=crop',
    title: 'Luxury Wellness Sanctuary',
    subtitle: 'An uncrowded sanctuary engineered for remarkable physical transformation.',
    position: 'center center',
  },
];

const AUTOPLAY_MS = 5000;

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const { isDark } = useTheme();

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const activeSlide = SLIDES[current];

  return (
    <section
      className={`relative min-h-[75vh] sm:min-h-[80vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#080808]' : 'bg-[#f8fafc]'
        }`}
    >
      {/* Background Slideshow with Smooth Cross-fade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={activeSlide.image}
              alt={activeSlide.title}
              fill
              priority
              sizes="100vw"
              style={{ objectPosition: activeSlide.position }}
              className={`object-cover filter transition-all duration-700 ${isDark
                  ? 'brightness-[0.50] contrast-110'
                  : 'brightness-[0.90] contrast-105'
                }`}
            />

            {/* Seamless Natural Vignettes Matched to Active Theme */}
            {isDark ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/92 via-[#080808]/55 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/25" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-[#f8fafc]/95 via-[#f8fafc]/75 to-transparent sm:w-4/5 lg:w-3/5" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-transparent to-transparent" />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle Glow */}
      <div
        className={`absolute top-1/3 left-10 w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none z-1 ${isDark ? 'bg-[#ff5a1f]/15' : 'bg-[#ff5a1f]/10'
          }`}
      />

      {/* Hero Content (Minimal, Bold, Punchy) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-20">
        <div className="max-w-2xl space-y-6 text-left">
          {/* Small Clean Badge */}
          <div className="inline-flex">
            <Badge
              variant="lime"
              className="px-3.5 py-1 text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              FitLife Wellness Sanctuary
            </Badge>
          </div>

          {/* Large Bold Headline */}
          <h1
            className={`text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[1.0] font-heading transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#09090b]'
              }`}
          >
            BUILD YOUR <br />
            <span className="text-gradient-orange">STRONGER</span>{' '}
            <span>SELF</span>
            <span className="text-[#ff5a1f]">.</span>
          </h1>

          {/* Minimal 1-2 Line Subtext */}
          <p
            className={`text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed font-normal transition-colors duration-300 ${isDark ? 'text-zinc-300' : 'text-zinc-600'
              }`}
          >
            International-grade personal coaching, biomechanically perfected training, and customized sports nutrition.
          </p>

          {/* High-Converting Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Link href="/programs" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto justify-center shadow-[0_10px_30px_rgba(255,90,31,0.35)]"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Programs
              </Button>
            </Link>

            <Link href="/membership" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto justify-center"
              >
                View Memberships
              </Button>
            </Link>
          </div>
      </div>
    </div>

      {/* Sleek Minimal Slide Indicators (Bottom Left / Center) */ }
  <div className="absolute bottom-6 left-4 sm:left-8 lg:left-12 z-20 flex items-center gap-2">
    {SLIDES.map((s, idx) => (
      <button
        key={s.id}
        onClick={() => setCurrent(idx)}
        aria-label={`Slide ${idx + 1}`}
        className={`transition-all duration-300 rounded-full cursor-pointer ${current === idx
            ? 'w-8 h-2 bg-[#ff5a1f] shadow-[0_0_10px_rgba(255,90,31,0.6)]'
            : isDark
              ? 'w-2 h-2 bg-white/30 hover:bg-white/60'
              : 'w-2 h-2 bg-zinc-400/50 hover:bg-zinc-600'
          }`}
      />
    ))}
    <span
      className={`ml-3 text-[11px] font-mono font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-600'
        }`}
    >
      0{current + 1} / 0{SLIDES.length}
    </span>
  </div>

  {/* Hidden preloader for subsequent slide images */ }
  <div className="hidden pointer-events-none" aria-hidden="true">
    {SLIDES.map((slide, idx) =>
      idx !== current ? (
        <Image
          key={`preload-${slide.id}`}
          src={slide.image}
          alt=""
          width={16}
          height={16}
          priority={false}
        />
      ) : null
    )}
  </div>
    </section >
  );
}
