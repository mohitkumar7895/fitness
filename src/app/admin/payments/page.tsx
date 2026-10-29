'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download,
} from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminPaymentsPage() {
  const { showNotification } = useNotification();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/payments');
      const data = await res.json();
      if (res.ok) {
        setPayments(data.payments || []);
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to load payments' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error fetching payments' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalRevenue = payments
    .filter((p) => p.status === 'PAID')
    .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  const completedCount = payments.filter((p) => p.status === 'PAID').length;
  const pendingCount = payments.filter((p) => p.status === 'PENDING').length;
  const avgOrderValue = completedCount > 0 ? totalRevenue / completedCount : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20"><CheckCircle2 className="w-3 h-3" /> PAID</span>;
      case 'PENDING':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20"><Clock className="w-3 h-3" /> PENDING</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20"><AlertCircle className="w-3 h-3" /> {status}</span>;
    }
  };

  const filtered = payments.filter((p) => {
    const matchesSearch =
      (p.user_name && p.user_name.toLowerCase().includes(search.toLowerCase())) ||
      (p.user_email && p.user_email.toLowerCase().includes(search.toLowerCase())) ||
      (p.invoice_number && p.invoice_number.toLowerCase().includes(search.toLowerCase())) ||
      (p.razorpay_payment_id && p.razorpay_payment_id.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff5a1f] uppercase tracking-widest mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Club Operations & Finance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Payments Ledger & Revenue Stream
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Complete transaction ledger for memberships, private personal coaching bookings, and renewals.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0e0e12] border border-white/10">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Total Gross Revenue</span>
          <p className="text-2xl sm:text-3xl font-black text-white font-heading mt-1">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-[#0e0e12] border border-white/10">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Settled Transactions</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-heading mt-1">
            {completedCount}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-[#0e0e12] border border-white/10">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Pending Collections</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 font-heading mt-1">
            {pendingCount}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-[#0e0e12] border border-white/10">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Avg Order Value</span>
          <p className="text-2xl sm:text-3xl font-black text-[#c6ff3b] font-heading mt-1">
            {formatCurrency(avgOrderValue)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by invoice #, customer name, email, or Razorpay ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0e0e12] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff5a1f]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0e0e12] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-[#ff5a1f]"
          >
            <option value="ALL">All Payments</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0e0e12] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#ff5a1f] mb-3" />
            <p className="text-xs uppercase tracking-wider font-bold">Querying Ledger...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <CreditCard className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
            <p className="text-sm font-semibold text-zinc-400">No payment records matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Gateway Reference</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#ff5a1f]" />
                      <span>{p.invoice_number || p.id}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{p.user_name}</div>
                      <div className="text-[11px] text-zinc-500">{p.user_email}</div>
                    </td>

                    <td className="py-3.5 px-4 font-black font-heading text-sm text-white">
                      {formatCurrency(p.amount)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] text-zinc-400 block">
                        {p.razorpay_payment_id || 'RZP-DIRECT'}
                      </span>
                      <span className="text-[10px] text-zinc-600 uppercase">
                        {p.payment_method || 'CARD/UPI'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(p.status)}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                      {p.created_at ? formatDate(p.created_at) : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

