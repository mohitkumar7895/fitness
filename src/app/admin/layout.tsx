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
  Layers,
  FileText,
  Sliders,
  Dumbbell,
  Users,
  CreditCard,
  Calendar,
  DollarSign,
  MessageSquare,
  Star,
  Image as ImageIcon,
  BookOpen,
  Settings,
  Globe,
  UserCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Apple,
} from 'lucide-react';

const ADMIN_NAV_GROUPS = [
  {
    title: 'Core Command',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Website & CMS',
    items: [
      { label: 'Pages & CMS', href: '/admin/pages', icon: FileText },
      { label: 'Homepage Builder', href: '/admin/banners', icon: Sliders },
      { label: 'SEO Management', href: '/admin/seo', icon: Globe },
      { label: 'General Settings', href: '/admin/settings', icon: Settings },
    ],
  },
  {
    title: 'Club Operations',
    items: [
      { label: 'Programs', href: '/admin/programs', icon: Layers },
      { label: 'Membership Plans', href: '/admin/memberships', icon: CreditCard },
      { label: 'Trainers & Coaches', href: '/admin/trainers', icon: UserCheck },
      { label: 'Customer Roster', href: '/admin/customers', icon: Users },
      { label: 'Bookings & Sessions', href: '/admin/bookings', icon: Calendar },
      { label: 'Payments & Revenue', href: '/admin/payments', icon: DollarSign },
    ],
  },
  {
    title: 'Training & Diet',
    items: [
      { label: 'Exercises Library', href: '/admin/workouts', icon: Dumbbell },
      { label: 'Diet Protocols', href: '/admin/diet-plans', icon: Apple },
    ],
  },
  {
    title: 'Marketing & Leads',
    items: [
      { label: 'Enquiries & Leads', href: '/admin/enquiries', icon: MessageSquare },
      { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
      { label: 'Media Gallery', href: '/admin/gallery', icon: ImageIcon },
      { label: 'Blog Posts', href: '/admin/blogs', icon: BookOpen },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'User Roles & Access', href: '/admin/users', icon: Shield },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <Flame className="w-8 h-8 text-[#ff5a1f] animate-pulse" />
          <p className="text-xs uppercase tracking-widest font-bold">Verifying Administrator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] flex text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-white/10 bg-[#0c0c0f] p-5 fixed inset-y-0 left-0 z-30 overflow-y-auto">
        <div className="space-y-6">
          {/* Logo */}
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-2">
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
                Central Admin CMS
              </span>
            </div>
          </Link>

          {/* Nav Group List */}
          <div className="space-y-6">
            {ADMIN_NAV_GROUPS.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <span className="px-3 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                  {group.title}
                </span>
                <div className="space-y-0.5 pt-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${isActive
                          ? 'bg-[#ff5a1f] text-white shadow-[0_0_15px_rgba(255,90,31,0.35)] font-bold'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info & Logout */}
        <div className="pt-6 border-t border-white/10 space-y-3 mt-6">
          <ThemeToggle variant="pill" className="w-full justify-center" />

          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Website</span>
          </Link>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#ff5a1f]/20 text-[#ff5a1f] flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {user?.name || 'Administrator'}
                </p>
                <span className="text-[10px] text-zinc-400 font-medium block">
                  {user?.role || 'SUPERADMIN'}
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
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Mobile Header Bar */}
        <header className="lg:hidden sticky top-0 z-20 bg-[#0c0c0f]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full overflow-hidden bg-white p-0.5">
              <Image src="/logo.png" alt="FitLife" width={28} height={28} className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="text-base font-black font-heading text-white">FitLife CMS</span>
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

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0c0c0f] border-b border-white/10 p-4 space-y-4 max-h-[80vh] overflow-y-auto">
            {ADMIN_NAV_GROUPS.map((g, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-zinc-500">{g.title}</span>
                <div className="space-y-1">
                  {g.items.map((i) => (
                    <Link
                      key={i.href}
                      href={i.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${pathname === i.href ? 'bg-[#ff5a1f] text-white' : 'text-zinc-400'
                        }`}
                    >
                      <i.icon className="w-4 h-4" />
                      <span>{i.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-white/10 flex justify-between text-xs">
              <Link href="/" className="text-zinc-400">Public Site</Link>
              <button onClick={() => logout()} className="text-rose-400 font-bold">Sign Out</button>
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

