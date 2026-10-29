'use client';

import React, { useState, useEffect } from 'react';
import {
  Apple,
  Plus,
  Trash2,
  Search,
  RefreshCw,
  Flame,
  CheckCircle2,
  UserCheck,
  User,
  Scale,
} from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';

export default function AdminDietPlansPage() {
  const { showNotification } = useNotification();
  const [plans, setPlans] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    daily_calories: 2500,
    target_protein: 180,
    target_carbs: 220,
    target_fat: 65,
    coach_id: '',
    customer_id: '',
    is_template: true,
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/diet-plans');
      const data = await res.json();
      if (res.ok) {
        setPlans(data.plans || []);
        setCoaches(data.coaches || []);
        setCustomers(data.customers || []);
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to load diet protocols' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error fetching diet plans' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreateModal = () => {
    setFormData({
      title: '',
      description: 'High-protein metabolic partition protocol designed for lean mass accretion with zero fat spillover.',
      daily_calories: 2600,
      target_protein: 190,
      target_carbs: 240,
      target_fat: 65,
      coach_id: coaches.length > 0 ? coaches[0].id : '',
      customer_id: '',
      is_template: true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.daily_calories) {
      showNotification({ type: 'error', message: 'Title and daily calories required' });
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/admin/diet-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification({ type: 'success', message: 'Diet protocol created successfully!' });
        setIsModalOpen(false);
        fetchPlans();
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to create plan' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Error submitting diet plan' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete diet protocol "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/diet-plans?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showNotification({ type: 'success', message: 'Protocol deleted.' });
        fetchPlans();
      } else {
        showNotification({ type: 'error', message: data.error || 'Delete failed' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error deleting protocol' });
    }
  };

  const filtered = plans.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.customer_name && p.customer_name.toLowerCase().includes(search.toLowerCase())) ||
    (p.coach_name && p.coach_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff5a1f] uppercase tracking-widest mb-1">
            <Apple className="w-3.5 h-3.5" />
            <span>Nutrition & Clinical Fuel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Diet Protocols & Clinical Nutrition Plans
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Macro-partitioned nutrition protocols, caloric prescriptions, and meal plans assigned across members.
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
            <span>Build Diet Protocol</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Filter protocols by title, member, or coach..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#0e0e12] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff5a1f]"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center text-zinc-400 bg-[#0e0e12] rounded-2xl border border-white/10">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#ff5a1f] mb-3" />
          <p className="text-xs uppercase tracking-wider font-bold">Querying Nutrition Protocols...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-zinc-500 bg-[#0e0e12] rounded-2xl border border-white/10">
          <Apple className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
          <p className="text-sm font-semibold text-zinc-400">No diet plans recorded.</p>
          <Button variant="primary" onClick={openCreateModal} className="mt-4">
            Build First Protocol
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl bg-[#0e0e12] border border-white/10 p-6 flex flex-col justify-between hover:border-white/20 transition-all space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-base text-white">{plan.title}</h3>
                  {plan.is_template ? (
                    <span className="text-[10px] font-bold text-[#c6ff3b] bg-[#c6ff3b]/10 px-2.5 py-0.5 rounded-full border border-[#c6ff3b]/20 uppercase">
                      Template
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 uppercase">
                      Assigned
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2">{plan.description}</p>

                {/* Macro Target Strip */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="flex items-center gap-1.5 text-[#ff5a1f]">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{plan.daily_calories} kcal / day</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                    <div className="p-1.5 rounded-lg bg-white/5">
                      <span className="text-[9px] text-zinc-400 font-bold block uppercase">Protein</span>
                      <span className="font-bold text-[#c6ff3b]">{plan.target_protein}g</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/5">
                      <span className="text-[9px] text-zinc-400 font-bold block uppercase">Carbs</span>
                      <span className="font-bold text-amber-400">{plan.target_carbs}g</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/5">
                      <span className="text-[9px] text-zinc-400 font-bold block uppercase">Fats</span>
                      <span className="font-bold text-rose-400">{plan.target_fat}g</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-zinc-400">
                  {plan.coach_name && (
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3 h-3 text-[#ff5a1f]" />
                      <span>Coach: {plan.coach_name}</span>
                    </div>
                  )}
                  {plan.customer_name && (
                    <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                      <User className="w-3 h-3 text-[#c6ff3b]" />
                      <span>Member: {plan.customer_name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">{formatDate(plan.created_at)}</span>
                <button
                  onClick={() => handleDelete(plan.id, plan.title)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500 hover:text-white text-zinc-400 transition-colors"
                  title="Delete Protocol"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Build New Diet Protocol"
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Protocol Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rapid Hypertrophy Fuel Split"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Daily Calories *</label>
                <input
                  type="number"
                  required
                  value={formData.daily_calories}
                  onChange={(e) => setFormData({ ...formData, daily_calories: parseInt(e.target.value) || 2000 })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Protein (g)</label>
                <input
                  type="number"
                  value={formData.target_protein}
                  onChange={(e) => setFormData({ ...formData, target_protein: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Carbohydrates (g)</label>
                <input
                  type="number"
                  value={formData.target_carbs}
                  onChange={(e) => setFormData({ ...formData, target_carbs: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Fat (g)</label>
                <input
                  type="number"
                  value={formData.target_fat}
                  onChange={(e) => setFormData({ ...formData, target_fat: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Authoring Coach</label>
                <select
                  value={formData.coach_id}
                  onChange={(e) => setFormData({ ...formData, coach_id: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                >
                  <option value="">Club General Protocol</option>
                  {coaches.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Assign To Member (Optional)</label>
                <select
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                >
                  <option value="">Keep as Reusable Template</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Protocol Instructions & Strategy</label>
              <textarea
                rows={3}
                placeholder="Nutrient timing recommendations, intra-workout carbs, hydration rules..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Creating...' : 'Save Diet Protocol'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

