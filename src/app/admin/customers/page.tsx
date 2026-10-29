'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  Shield,
  Activity,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Mail,
  Phone,
  Flame,
} from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';

export default function AdminCustomersPage() {
  const { showNotification } = useNotification();
  const [customers, setCustomers] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected customer for modal
  const [selectedCust, setSelectedCust] = useState<any>(null);
  const [reassignedCoachId, setReassignedCoachId] = useState('');
  const [isActiveStatus, setIsActiveStatus] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/customers');
      const data = await res.json();
      if (res.ok) {
        setCustomers(data.customers || []);
        setCoaches(data.coaches || []);
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to load customers' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error fetching customers' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openCustomerModal = (cust: any) => {
    setSelectedCust(cust);
    setReassignedCoachId(cust.assigned_coach_id || '');
    setIsActiveStatus(cust.is_active === 1 || cust.is_active === true);
  };

  const handleUpdateCustomer = async () => {
    if (!selectedCust) return;
    try {
      setSaving(true);
      const res = await fetch('/api/admin/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedCust.user_id,
          profile_id: selectedCust.profile_id,
          is_active: isActiveStatus,
          assigned_coach_id: reassignedCoachId || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification({ type: 'success', message: 'Customer record successfully updated.' });
        setSelectedCust(null);
        fetchCustomers();
      } else {
        showNotification({ type: 'error', message: data.error || 'Update failed' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Failed to update customer' });
    } finally {
      setSaving(false);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search));
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && (c.is_active === 1 || c.is_active === true)) ||
      (statusFilter === 'INACTIVE' && (c.is_active === 0 || c.is_active === false));
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff5a1f] uppercase tracking-widest mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Club Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Customer Roster & Biometrics
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage active gym members, biometric assessments, assigned coaches, and membership access.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0e0e12] border border-white/5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Total Members</span>
          <p className="text-2xl font-black text-white mt-1">{customers.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0e0e12] border border-white/5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Active Accounts</span>
          <p className="text-2xl font-black text-[#c6ff3b] mt-1">
            {customers.filter((c) => c.is_active === 1 || c.is_active === true).length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0e0e12] border border-white/5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">With Active Pass</span>
          <p className="text-2xl font-black text-[#ff5a1f] mt-1">
            {customers.filter((c) => c.membership_status === 'ACTIVE').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0e0e12] border border-white/5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Coaches Assigned</span>
          <p className="text-2xl font-black text-white mt-1">
            {customers.filter((c) => c.assigned_coach_name).length}
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search customer by name, email, or mobile..."
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
            <option value="ALL">All Accounts</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Deactivated Only</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0e0e12] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#ff5a1f] mb-3" />
            <p className="text-xs uppercase tracking-wider font-bold">Querying MySQL Customer Database...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <Users className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
            <p className="text-sm font-semibold text-zinc-400">No customer records matching your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Member Info</th>
                  <th className="py-3 px-4">Goal & Biometrics</th>
                  <th className="py-3 px-4">Membership Plan</th>
                  <th className="py-3 px-4">Assigned Coach</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {filteredCustomers.map((c) => (
                  <tr key={c.user_id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff5a1f] to-[#ff5a1f]/30 flex items-center justify-center font-bold text-white text-xs shrink-0">
                          {c.avatar ? (
                            <img src={c.avatar} alt={c.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            c.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-zinc-500 flex items-center gap-2">
                            <span>{c.email}</span>
                            {c.phone && <span>• {c.phone}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-white block">
                          {c.fitness_goal || 'General Fitness'}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {c.current_weight ? `${c.current_weight} kg` : '--'} → {c.target_weight ? `${c.target_weight} kg` : '--'} ({c.height ? `${c.height} cm` : '--'})
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {c.plan_name ? (
                        <div>
                          <span className="font-semibold text-[#ff5a1f] block">{c.plan_name}</span>
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                            Active
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-500 text-[11px]">No active pass</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {c.assigned_coach_name ? (
                        <div className="flex items-center gap-1.5 text-zinc-200">
                          <UserCheck className="w-3.5 h-3.5 text-[#c6ff3b]" />
                          <span className="font-medium">{c.assigned_coach_name}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-500 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {c.is_active === 1 || c.is_active === true ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                          <XCircle className="w-3 h-3" /> Suspended
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-500 text-[11px]">
                      {c.created_at ? formatDate(c.created_at) : 'N/A'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openCustomerModal(c)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[#ff5a1f] hover:text-white text-zinc-400 transition-colors inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Detail & Edit Modal */}
      {selectedCust && (
        <Modal
          isOpen={!!selectedCust}
          onClose={() => setSelectedCust(null)}
          title={`Member Profile: ${selectedCust.name}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Top Overview */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff5a1f] to-[#121212] flex items-center justify-center font-black text-xl text-white">
                {selectedCust.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{selectedCust.name}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {selectedCust.email}</span>
                  {selectedCust.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedCust.phone}</span>}
                </div>
              </div>
            </div>

            {/* Biometric Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] text-zinc-500 font-bold uppercase block">Height</span>
                <span className="text-sm font-bold text-white mt-0.5 block">{selectedCust.height ? `${selectedCust.height} cm` : 'Not recorded'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] text-zinc-500 font-bold uppercase block">Current Weight</span>
                <span className="text-sm font-bold text-white mt-0.5 block">{selectedCust.current_weight ? `${selectedCust.current_weight} kg` : 'Not recorded'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] text-zinc-500 font-bold uppercase block">Target Weight</span>
                <span className="text-sm font-bold text-[#c6ff3b] mt-0.5 block">{selectedCust.target_weight ? `${selectedCust.target_weight} kg` : 'Not recorded'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] text-zinc-500 font-bold uppercase block">Target Goal</span>
                <span className="text-sm font-bold text-[#ff5a1f] mt-0.5 block">{selectedCust.fitness_goal || 'General Health'}</span>
              </div>
            </div>

            {/* Reassign Coach */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Assigned Master Coach
              </label>
              <select
                value={reassignedCoachId}
                onChange={(e) => setReassignedCoachId(e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              >
                <option value="">No Coach Assigned</option>
                {coaches.map((coach) => (
                  <option key={coach.id} value={coach.id}>
                    {coach.name} (ID: {coach.id})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-zinc-500">
                Assigning a coach grants them full visibility to craft custom workout and nutrition protocols for this member.
              </p>
            </div>

            {/* Account Status Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <div>
                <p className="text-xs font-bold text-white">Account Active Status</p>
                <p className="text-[11px] text-zinc-400">Suspended accounts cannot log in to the member portal or book sessions.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsActiveStatus(!isActiveStatus)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isActiveStatus ? 'bg-[#c6ff3b]' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-[#080808] transition-transform ${
                    isActiveStatus ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button variant="ghost" onClick={() => setSelectedCust(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateCustomer} disabled={saving}>
                {saving ? 'Updating...' : 'Save Member Settings'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
