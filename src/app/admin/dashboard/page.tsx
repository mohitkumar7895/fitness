'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Users,
  CreditCard,
  UserCheck,
  MessageSquare,
  DollarSign,
  Calendar,
  ArrowRight,
  Plus,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading Central Intelligence...</div>;
  }

  const m = data?.metrics || {};

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#18181f] via-[#121215] to-[#18181f] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <Badge variant="orange" className="text-[10px]">
            Master Administration CMS
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-heading">
            OPERATIONAL COMMAND &amp; CMS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Real-time telemetry across active memberships, club revenue, coach schedules, and website CMS assets.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/admin/programs">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Add Program
            </Button>
          </Link>
          <Link href="/admin/banners">
            <Button variant="secondary" size="sm">
              Homepage Builder
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 space-y-1">
          <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Total Members</span>
          <p className="text-2xl sm:text-3xl font-black text-white font-heading">{m.totalCustomers}</p>
          <span className="text-[9px] text-zinc-400 block">Registered users</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Active Passes</span>
          <p className="text-2xl sm:text-3xl font-black text-[#c6ff3b] font-heading">{m.activeMembers}</p>
          <span className="text-[9px] text-emerald-400 block">Current memberships</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Master Coaches</span>
          <p className="text-2xl sm:text-3xl font-black text-white font-heading">{m.totalCoaches}</p>
          <span className="text-[9px] text-zinc-400 block">On active duty</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Club Revenue</span>
          <p className="text-2xl sm:text-3xl font-black text-[#ff5a1f] font-heading">{formatCurrency(m.totalRevenue)}</p>
          <span className="text-[9px] text-zinc-400 block">Collected to date</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">New Leads</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 font-heading">{m.pendingEnquiries}</p>
          <span className="text-[9px] text-zinc-400 block">Awaiting response</span>
        </Card>

        <Card className="p-4 space-y-1">
          <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Sessions</span>
          <p className="text-2xl sm:text-3xl font-black text-white font-heading">{m.upcomingBookings}</p>
          <span className="text-[9px] text-zinc-400 block">Upcoming 1-on-1s</span>
        </Card>
      </div>

      {/* Revenue Analytics Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#ff5a1f] tracking-wider block">
              Financial Performance
            </span>
            <h3 className="text-xl font-bold uppercase text-white font-heading mt-0.5">
              Monthly Revenue Growth
            </h3>
          </div>
          <Badge variant="lime">2026 Season Trajectory</Badge>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.monthlyRevenue || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="revenue" fill="#ff5a1f" radius={[6, 6, 0, 0]} name="Gross Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Split Grid: Recent Leads & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Recent Leads */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                Inbound Pipeline
              </span>
              <h3 className="text-lg font-bold uppercase text-white font-heading mt-0.5">
                Recent Consultation Leads
              </h3>
            </div>
            <Link href="/admin/enquiries">
              <Button variant="ghost" size="sm" className="text-xs text-[#ff5a1f]">
                All Leads &rarr;
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentEnquiries && data.recentEnquiries.length > 0 ? (
              data.recentEnquiries.map((enq: any) => (
                <div
                  key={enq.id}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white font-heading">{enq.name}</h4>
                      <Badge variant="orange" className="text-[9px] px-1.5 py-0.5">
                        {enq.status}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-zinc-400 block">{enq.email} • {enq.phone || 'No phone'}</span>
                    <span className="text-[10px] text-zinc-500 italic truncate block max-w-xs">{enq.message}</span>
                  </div>

                  <Link href="/admin/enquiries">
                    <button className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-white cursor-pointer">
                      Action
                    </button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 py-6 text-center">No leads pending.</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#c6ff3b] tracking-wider block">
                Razorpay Ledger
              </span>
              <h3 className="text-lg font-bold uppercase text-white font-heading mt-0.5">
                Recent Transactions
              </h3>
            </div>
            <Link href="/admin/payments">
              <Button variant="ghost" size="sm" className="text-xs text-[#c6ff3b]">
                Full Ledger &rarr;
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentPayments && data.recentPayments.length > 0 ? (
              data.recentPayments.map((pay: any) => (
                <div
                  key={pay.id}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{pay.user_name}</p>
                    <span className="text-[10px] text-zinc-500">{pay.invoice_number || 'INV-DIRECT'} • {formatDate(pay.created_at)}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-white font-heading block">{formatCurrency(pay.amount)}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">{pay.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 py-6 text-center">No transactions recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

