'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Check,
  Star,
  RefreshCw,
  Sparkles,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';

export default function AdminMembershipsPage() {
  const { showNotification } = useNotification();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    duration_months: 1,
    price: '',
    original_price: '',
    billing_period: 'monthly',
    features: '',
    is_popular: false,
    is_published: true,
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/memberships');
      const data = await res.json();
      if (res.ok) {
        setPlans(data.plans || []);
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to load membership plans' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error fetching plans' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      tag: 'BEST VALUE',
      duration_months: 1,
      price: '',
      original_price: '',
      billing_period: 'monthly',
      features: 'Full Club & Equipment Access\nBiometric Assessment & Goal Review\nAccess to Recovery Suite & Sauna\nMobile App Workout & Nutrition Log',
      is_popular: false,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name || '',
      tag: plan.tag || '',
      duration_months: plan.duration_months || 1,
      price: String(plan.price || ''),
      original_price: plan.original_price ? String(plan.original_price) : '',
      billing_period: plan.billing_period || 'monthly',
      features: plan.features || '',
      is_popular: plan.is_popular === 1 || plan.is_popular === true,
      is_published: plan.is_published === 1 || plan.is_published === true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      showNotification({ type: 'error', message: 'Name and price are required.' });
      return;
    }

    try {
      setSaving(true);
      const method = editingPlan ? 'PUT' : 'POST';
      const payload = editingPlan ? { ...formData, id: editingPlan.id } : formData;

      const res = await fetch('/api/admin/memberships', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification({
          type: 'success',
          message: editingPlan ? 'Plan successfully updated!' : 'Membership plan created!',
        });
        setIsModalOpen(false);
        fetchPlans();
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to save plan' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Error submitting membership plan' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete membership plan "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/memberships?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showNotification({ type: 'success', message: 'Membership plan deleted.' });
        fetchPlans();
      } else {
        showNotification({ type: 'error', message: data.error || 'Delete failed' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error deleting plan' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff5a1f] uppercase tracking-widest mb-1">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Club Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Membership Plans & Pricing Tiers
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Configure club subscription tiers, pricing, billing cadences, and exclusive member privileges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPlans}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Button variant="primary" onClick={openCreateModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Membership Plan</span>
          </Button>
        </div>
      </div>

      {/* Grid of Plans */}
      {loading ? (
        <div className="p-12 text-center text-zinc-400 bg-[#0e0e12] rounded-2xl border border-white/10">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#ff5a1f] mb-3" />
          <p className="text-xs uppercase tracking-wider font-bold">Loading Membership Plans...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="p-12 text-center text-zinc-500 bg-[#0e0e12] rounded-2xl border border-white/10">
          <CreditCard className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
          <p className="text-sm font-semibold text-zinc-400">No membership tiers configured yet.</p>
          <Button variant="primary" onClick={openCreateModal} className="mt-4">
            Create First Tier
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const featureList = plan.features ? plan.features.split('\n').filter(Boolean) : [];
            const isPopular = plan.is_popular === 1 || plan.is_popular === true;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 ${
                  isPopular
                    ? 'bg-gradient-to-b from-[#181820] to-[#0c0c10] border-2 border-[#ff5a1f] shadow-[0_0_30px_rgba(255,90,31,0.15)]'
                    : 'bg-[#0e0e12] border border-white/10 hover:border-white/20'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ff5a1f] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{plan.tag || 'Most Popular'}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-black text-white font-heading">{plan.name}</h3>
                      <p className="text-xs text-zinc-400 capitalize">{plan.billing_period} Commitment ({plan.duration_months} mo)</p>
                    </div>
                    {plan.is_published ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Live
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        Draft
                      </span>
                    )}
                  </div>

                  <div className="pt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white font-heading">
                        {formatCurrency(plan.price)}
                      </span>
                      <span className="text-xs text-zinc-400">/{plan.billing_period}</span>
                    </div>
                    {plan.original_price && plan.original_price > plan.price && (
                      <span className="text-xs text-zinc-500 line-through">
                        {formatCurrency(plan.original_price)}
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                      Included Privileges:
                    </span>
                    <ul className="space-y-2">
                      {featureList.map((f: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-[#c6ff3b] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between">
                  <button
                    onClick={() => openEditModal(plan)}
                    className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#ff5a1f]" />
                    <span>Edit Plan</span>
                  </button>

                  <button
                    onClick={() => handleDeletePlan(plan.id, plan.name)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 transition-colors"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Plan Create/Edit Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingPlan ? `Edit Plan: ${editingPlan.name}` : 'Create New Membership Plan'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Plan Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Onyx Tier"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Highlight Tag (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. BEST VALUE, MOST POPULAR"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Price (INR) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 4999"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Original Price (Strikeout)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 6999"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Duration (Months) *</label>
                <input
                  type="number"
                  min="1"
                  max="36"
                  required
                  value={formData.duration_months}
                  onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Billing Cadence</label>
              <select
                value={formData.billing_period}
                onChange={(e) => setFormData({ ...formData, billing_period: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half-yearly">Half-Yearly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Features List (One feature per line)</label>
              <textarea
                rows={5}
                placeholder="Full Gym & Club Floor Access&#10;Sauna & Cold Plunge&#10;Complimentary Fitness Assessment"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_popular}
                  onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                  className="rounded bg-black border-white/20 text-[#ff5a1f] focus:ring-0"
                />
                <span>Highlight as Popular / Best Value</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="rounded bg-black border-white/20 text-[#ff5a1f] focus:ring-0"
                />
                <span>Publish on Website Immediately</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Saving...' : editingPlan ? 'Save Changes' : 'Create Plan'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

