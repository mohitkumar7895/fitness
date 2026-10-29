'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, MOBILE_NAV_LINKS } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') return '/admin/dashboard';
    if (user.role === 'COACH') return '/coach/dashboard';
    return '/dashboard';
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080808]/92 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 flex-nowrap w-full">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-white p-0.5 shadow-[0_0_20px_rgba(198,255,59,0.35)] group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="FitLife Wellness"
                width={40}
                height={40}
                className="w-full h-full object-contain rounded-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading leading-tight brand-title-text">
                FitLife<span className="text-[#c6ff3b]">.</span>
              </span>
              <span className="text-[8.5px] font-extrabold tracking-[0.22em] text-emerald-400 uppercase -mt-0.5">
                WELLNESS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Clean, No Wrapping) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
            {NAV_LINKS.map((link) => {
              if (link.children) {
                const isChildActive = link.children.some((c) => pathname === c.href);
                const isOpen = openDropdown === link.label;

                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : link.label)}
                      className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full text-[11px] xl:text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        isOpen || isChildActive
                          ? 'text-[#ff5a1f] bg-[#ff5a1f]/10'
                          : 'text-zinc-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#ff5a1f]' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 w-64 rounded-2xl bg-[#141418]/95 border border-white/10 p-2 shadow-2xl backdrop-blur-xl flex flex-col gap-1 z-50 mt-1"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpenDropdown(null)}
                              className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                                pathname === child.href
                                  ? 'bg-[#ff5a1f]/15 text-[#ff5a1f] font-bold'
                                  : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 xl:px-3 py-1.5 rounded-full text-[11px] xl:text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-[#ff5a1f] bg-[#ff5a1f]/10 font-bold'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-3">
                <Link href={getDashboardLink()}>
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#ff5a1f]/40 transition-all cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-[#ff5a1f]/20 text-[#ff5a1f] flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-white truncate max-w-[100px]">
                      {user.name.split(' ')[0]}
                    </span>
                  </div>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  title="Logout"
                  className="px-2.5 rounded-full"
                >
                  <LogOut className="w-4 h-4 text-zinc-400 hover:text-rose-400" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event('open-vip-modal'))}
                  className="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#ff5a1f] to-[#ff7d47] text-white hover:brightness-110 shadow-[0_2px_12px_rgba(255,90,31,0.35)] transition-all cursor-pointer hidden xl:inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Free Pass</span>
                </button>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm" className="rounded-full">
                    Join Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button & Mini Theme Switcher */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <ThemeToggle />
            {user && (
              <Link href={getDashboardLink()}>
                <div className="w-8 h-8 rounded-full bg-[#ff5a1f]/20 text-[#ff5a1f] flex items-center justify-center font-bold text-xs border border-[#ff5a1f]/40">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 text-zinc-200 hover:text-white border border-white/10 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Complete Navigation) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0c0c0f]/98 border-b border-white/10 backdrop-blur-2xl overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="flex flex-col space-y-1">
                {MOBILE_NAV_LINKS.map((link) => (
                  <div key={link.label} className="border-b border-white/5 pb-2">
                    <Link
                      href={link.href}
                      className="block py-2 text-sm font-bold uppercase tracking-wider text-zinc-200 hover:text-[#ff5a1f]"
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="pl-3 mt-1 space-y-1 border-l border-white/10">
                        {link.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className="block py-1.5 text-xs text-zinc-400 hover:text-white"
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Theme Switcher in Mobile Drawer */}
              <div className="pt-2">
                <ThemeToggle variant="pill" className="w-full justify-center" />
              </div>

              {/* Mobile Auth actions */}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
                {user ? (
                  <>
                    <Link href={getDashboardLink()} className="w-full">
                      <Button variant="secondary" size="md" className="w-full">
                        Go To {user.role} Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => logout()}
                      className="w-full text-rose-400"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        window.dispatchEvent(new Event('open-vip-modal'));
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-[#ff5a1f] to-[#ff7d47] text-white font-black text-sm shadow-lg cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Claim 1-Day Free VIP Pass</span>
                    </button>
                    <Link href="/register" className="w-full">
                      <Button variant="primary" size="md" className="w-full">
                        Join FitLife Today
                      </Button>
                    </Link>
                    <Link href="/login" className="w-full">
                      <Button variant="secondary" size="md" className="w-full">
                        Member Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
