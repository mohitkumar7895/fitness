'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  Flame,
  LayoutDashboard,
  Users,
  Dumbbell,
  Apple,
  Calendar,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Award,
} from 'lucide-react';

const COACH_LINKS = [
  { label: 'Overview', href: '/coach/dashboard', icon: LayoutDashboard },
  { label: 'Assigned Clients', href: '/coach/clients', icon: Users },
  { label: 'Workout Plans', href: '/coach/workout-plans', icon: Dumbbell },
  { label: 'Diet Protocols', href: '/coach/diet-plans', icon: Apple },
  { label: 'Session Calendar', href: '/coach/appointments', icon: Calendar },
];

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <Flame className="w-8 h-8 text-[#ff5a1f] animate-pulse" />
          <p className="text-xs uppercase tracking-widest font-bold">Loading Coach Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] flex text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-white/10 bg-[#0d0d10] p-6 fixed inset-y-0 left-0 z-30">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-white p-0.5 shadow-md flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="FitLife Wellness"
                width={36}
                height={36}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white font-heading">
                FitLife<span className="text-[#c6ff3b]">.</span>
              </span>
              <span className="text-[8px] font-bold tracking-[0.2em] text-[#c6ff3b] uppercase -mt-0.5">
                Master Coach Portal
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {COACH_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#c6ff3b] text-black shadow-[0_0_15px_rgba(198,255,59,0.35)]'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <ThemeToggle variant="pill" className="w-full justify-center" />

          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </Link>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#c6ff3b]/20 text-[#c6ff3b] flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name?.charAt(0) || 'C'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {user?.name || 'Master Coach'}
                </p>
                <span className="text-[10px] text-zinc-400 font-medium block">
                  Coach Account
                </span>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="text-zinc-400 hover:text-rose-400 p-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile Header Bar */}
        <header className="lg:hidden sticky top-0 z-20 bg-[#0d0d10]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <Link href="/coach/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full overflow-hidden bg-white p-0.5">
              <Image src="/logo.png" alt="FitLife" width={28} height={28} className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="text-base font-black font-heading text-white">FitLife Coach</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl bg-white/5 text-zinc-300 hover:text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Slide-down Nav */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0d0d10] border-b border-white/10 p-4 space-y-2">
            {COACH_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                  pathname === link.href
                    ? 'bg-[#c6ff3b] text-black font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <Link href="/" className="text-xs text-zinc-400">Public Site</Link>
              <button onClick={() => logout()} className="text-xs text-rose-400 font-bold">
                Sign Out
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

