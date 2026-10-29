'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  RefreshCw,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Eye,
  Edit2,
} from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';

export default function AdminBookingsPage() {
  const { showNotification } = useNotification();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [status, setStatus] = useState('CONFIRMED');
  const [location, setLocation] = useState('MAIN_GYM');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/bookings');
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to load bookings' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error fetching bookings' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openEditModal = (b: any) => {
    setSelectedBooking(b);
    setStatus(b.status || 'CONFIRMED');
    setLocation(b.location || 'MAIN_GYM');
    setNotes(b.notes || '');
  };

  const handleUpdate = async () => {
    if (!selectedBooking) return;
    try {
      setSaving(true);
      const res = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedBooking.id,
          status,
          location,
          notes,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification({ type: 'success', message: 'Session updated successfully!' });
        setSelectedBooking(null);
        fetchBookings();
      } else {
        showNotification({ type: 'error', message: data.error || 'Update failed' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Error updating booking' });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'CONFIRMED':
        return <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">CONFIRMED</span>;
      case 'COMPLETED':
        return <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">COMPLETED</span>;
      case 'CANCELLED':
        return <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">CANCELLED</span>;
      default:
        return <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">{st}</span>;
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      (b.title && b.title.toLowerCase().includes(search.toLowerCase())) ||
      (b.customer_name && b.customer_name.toLowerCase().includes(search.toLowerCase())) ||
      (b.coach_name && b.coach_name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff5a1f] uppercase tracking-widest mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Club Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Training Sessions & Bookings Schedule
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Club-wide schedule of private 1-on-1 coaching sessions, consultations, and assessments.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0e0e12] border border-white/5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Total Bookings</span>
          <p className="text-2xl font-black text-white mt-1">{bookings.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0e0e12] border border-white/5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Confirmed Upcoming</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {bookings.filter((b) => b.status === 'CONFIRMED').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0e0e12] border border-white/5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Completed Sessions</span>
          <p className="text-2xl font-black text-blue-400 mt-1">
            {bookings.filter((b) => b.status === 'COMPLETED').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0e0e12] border border-white/5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Cancelled</span>
          <p className="text-2xl font-black text-rose-400 mt-1">
            {bookings.filter((b) => b.status === 'CANCELLED').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by session title, member, or coach..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0e0e12] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff5a1f]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#0e0e12] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-[#ff5a1f]"
        >
          <option value="ALL">All Statuses</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0e0e12] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#ff5a1f] mb-3" />
            <p className="text-xs uppercase tracking-wider font-bold">Querying Appointments...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <Calendar className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
            <p className="text-sm font-semibold text-zinc-400">No session bookings found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Session Title</th>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Coach</th>
                  <th className="py-3 px-4">Schedule Time</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {b.title}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-zinc-200">{b.customer_name}</div>
                      <div className="text-[11px] text-zinc-500">{b.customer_phone || b.customer_email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {b.coach_name ? (
                        <div className="flex items-center gap-1.5 text-zinc-300">
                          <UserCheck className="w-3.5 h-3.5 text-[#ff5a1f]" />
                          <span>{b.coach_name}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-500">Open Session</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-zinc-200">
                        <Clock className="w-3.5 h-3.5 text-[#c6ff3b]" />
                        <span>{formatDate(b.scheduled_at)}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">{b.duration_minutes} min duration</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
                        <MapPin className="w-3 h-3 text-[#ff5a1f]" />
                        {b.location || 'Club Floor'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(b.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openEditModal(b)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[#ff5a1f] hover:text-white text-zinc-400 transition-colors inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Edit Session: ${selectedBooking.title}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-300">
              <p><strong className="text-white">Member:</strong> {selectedBooking.customer_name}</p>
              <p><strong className="text-white">Coach:</strong> {selectedBooking.coach_name || 'Unassigned'}</p>
              <p><strong className="text-white">Time:</strong> {formatDate(selectedBooking.scheduled_at)}</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              >
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase">Club Training Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase">Coaching Notes / Instructions</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button variant="ghost" onClick={() => setSelectedBooking(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdate} disabled={saving}>
                {saving ? 'Updating...' : 'Save Session'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

