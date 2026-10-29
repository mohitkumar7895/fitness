'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  Send,
  Eye,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';

export default function AdminEnquiriesPage() {
  const { showNotification } = useNotification();
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('NEW');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/enquiries');
      const data = await res.json();
      if (res.ok) {
        setEnquiries(data.enquiries || []);
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to load enquiries' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error fetching enquiries' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const openEnquiry = (enq: any) => {
    setSelectedEnquiry(enq);
    setNewStatus(enq.status || 'NEW');
    setNotes(enq.notes || '');
  };

  const handleUpdate = async () => {
    if (!selectedEnquiry) return;
    try {
      setSaving(true);
      const res = await fetch('/api/admin/enquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedEnquiry.id,
          status: newStatus,
          notes: notes,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification({ type: 'success', message: 'Lead status and notes saved!' });
        setSelectedEnquiry(null);
        fetchEnquiries();
      } else {
        showNotification({ type: 'error', message: data.error || 'Update failed' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Error saving enquiry updates' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete enquiry from "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/enquiries?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showNotification({ type: 'success', message: 'Enquiry removed.' });
        fetchEnquiries();
      } else {
        showNotification({ type: 'error', message: data.error || 'Delete failed' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Error deleting enquiry' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">NEW LEAD</span>;
      case 'CONTACTED':
        return <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">CONTACTED</span>;
      case 'CONVERTED':
        return <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">CONVERTED</span>;
      case 'CLOSED':
        return <span className="text-[10px] font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">CLOSED</span>;
      default:
        return <span className="text-[10px] font-bold text-zinc-400">{status}</span>;
    }
  };

  const filtered = enquiries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      (e.phone && e.phone.includes(search)) ||
      (e.fitness_goal && e.fitness_goal.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff5a1f] uppercase tracking-widest mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Marketing & Leads</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Club Inquiries & Prospect Pipeline
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage incoming contact requests, private consultation forms, and conversion statuses.
          </p>
        </div>

        <button
          onClick={fetchEnquiries}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0e0e12] border border-white/5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Total Leads</span>
          <p className="text-2xl font-black text-white mt-1">{enquiries.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0e0e12] border border-white/5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">New Inquiries</span>
          <p className="text-2xl font-black text-amber-400 mt-1">
            {enquiries.filter((e) => e.status === 'NEW').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0e0e12] border border-white/5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">In Discussion</span>
          <p className="text-2xl font-black text-blue-400 mt-1">
            {enquiries.filter((e) => e.status === 'CONTACTED').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0e0e12] border border-white/5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Converted Members</span>
          <p className="text-2xl font-black text-[#c6ff3b] mt-1">
            {enquiries.filter((e) => e.status === 'CONVERTED').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search leads by name, email, phone, or goal..."
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
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CONVERTED">Converted</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0e0e12] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#ff5a1f] mb-3" />
            <p className="text-xs uppercase tracking-wider font-bold">Retrieving Leads...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <MessageSquare className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
            <p className="text-sm font-semibold text-zinc-400">No enquiries matching your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Prospect</th>
                  <th className="py-3 px-4">Goal / Subject</th>
                  <th className="py-3 px-4">Message Snippet</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4">Received</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {filtered.map((enq) => (
                  <tr key={enq.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{enq.name}</div>
                      <div className="text-[11px] text-zinc-500 flex items-center gap-2">
                        <span>{enq.email}</span>
                        {enq.phone && <span>• {enq.phone}</span>}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#ff5a1f] block">
                        {enq.fitness_goal || enq.subject || 'General Inquiry'}
                      </span>
                      {enq.preferred_time && (
                        <span className="text-[10px] text-zinc-500">Time: {enq.preferred_time}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400 max-w-xs truncate">
                      {enq.message}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(enq.status)}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-500 text-[11px]">
                      {enq.created_at ? formatDate(enq.created_at) : '--'}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEnquiry(enq)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[#ff5a1f] hover:text-white text-zinc-400 transition-colors inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </button>

                      <button
                        onClick={() => handleDelete(enq.id, enq.name)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500 hover:text-white text-zinc-400 transition-colors"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
      {selectedEnquiry && (
        <Modal
          isOpen={!!selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          title={`Lead Review: ${selectedEnquiry.name}`}
          size="lg"
        >
          <div className="space-y-5">
            {/* Prospect Card */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-white">{selectedEnquiry.name}</span>
                {getStatusBadge(selectedEnquiry.status)}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedEnquiry.email}</span>
                {selectedEnquiry.phone && (
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {selectedEnquiry.phone}</span>
                )}
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {formatDate(selectedEnquiry.created_at)}</span>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Prospect Message</span>
              <div className="p-4 rounded-xl bg-[#080808] border border-white/10 text-xs text-zinc-300 leading-relaxed">
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Quick WhatsApp Action if phone available */}
            {selectedEnquiry.phone && (
              <a
                href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedEnquiry.name}, thank you for reaching out to FitLife Wellness!`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Launch WhatsApp Chat with Prospect</span>
              </a>
            )}

            {/* Status Change & Internal Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase">Pipeline Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                >
                  <option value="NEW">NEW - Unread Lead</option>
                  <option value="CONTACTED">CONTACTED - Discussion Underway</option>
                  <option value="CONVERTED">CONVERTED - Signed Up as Member</option>
                  <option value="CLOSED">CLOSED - Ineligible / Not Interested</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase">Internal Staff Notes</label>
                <textarea
                  rows={2}
                  placeholder="Record call outcome, membership interested in, follow-up date..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button variant="ghost" onClick={() => setSelectedEnquiry(null)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleUpdate} disabled={saving}>
                {saving ? 'Updating...' : 'Save Pipeline Changes'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

