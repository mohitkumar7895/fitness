'use client';

import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  Flame,
  Activity,
  Layers,
  Video,
} from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export default function AdminWorkoutsPage() {
  const { showNotification } = useNotification();
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEx, setEditingEx] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Strength',
    target_muscle: 'Chest',
    equipment: 'Barbell',
    instructions: '',
    difficulty: 'Intermediate',
    video_url: '',
  });

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/exercises');
      const data = await res.json();
      if (res.ok) {
        setExercises(data.exercises || []);
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to load exercises' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error fetching exercises' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const openCreateModal = () => {
    setEditingEx(null);
    setFormData({
      name: '',
      category: 'Strength',
      target_muscle: 'Chest',
      equipment: 'Barbell',
      instructions: 'Maintain a stable 5-point contact on bench, retract scapula, lower with control to mid-sternum, and drive upward explosive.',
      difficulty: 'Intermediate',
      video_url: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ex: any) => {
    setEditingEx(ex);
    setFormData({
      name: ex.name || '',
      category: ex.category || 'Strength',
      target_muscle: ex.target_muscle || 'Chest',
      equipment: ex.equipment || 'Barbell',
      instructions: ex.instructions || '',
      difficulty: ex.difficulty || 'Intermediate',
      video_url: ex.video_url || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.target_muscle) {
      showNotification({ type: 'error', message: 'Name and target muscle required' });
      return;
    }

    try {
      setSaving(true);
      const method = editingEx ? 'PUT' : 'POST';
      const payload = editingEx ? { ...formData, id: editingEx.id } : formData;

      const res = await fetch('/api/admin/exercises', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification({
          type: 'success',
          message: editingEx ? 'Exercise updated!' : 'New exercise added to library!',
        });
        setIsModalOpen(false);
        fetchExercises();
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to save exercise' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Error submitting exercise' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete exercise "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/exercises?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showNotification({ type: 'success', message: 'Exercise deleted.' });
        fetchExercises();
      } else {
        showNotification({ type: 'error', message: data.error || 'Delete failed' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error deleting exercise' });
    }
  };

  const filtered = exercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.target_muscle.toLowerCase().includes(search.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || ex.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff5a1f] uppercase tracking-widest mb-1">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Training & Biomechanics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Exercise & Biomechanics Movement Library
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Standardized exercise library utilized by coaches to build high-performance workout splits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchExercises}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Button variant="primary" onClick={openCreateModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Movement</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0e0e12] border border-white/5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Total Movements</span>
          <p className="text-2xl font-black text-white mt-1">{exercises.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0e0e12] border border-white/5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Strength / Hypertrophy</span>
          <p className="text-2xl font-black text-[#ff5a1f] mt-1">
            {exercises.filter((e) => e.category === 'Strength' || e.category === 'Hypertrophy').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0e0e12] border border-white/5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Cardio & Metabolic</span>
          <p className="text-2xl font-black text-[#c6ff3b] mt-1">
            {exercises.filter((e) => e.category === 'Cardio').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0e0e12] border border-white/5">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Mobility & Core</span>
          <p className="text-2xl font-black text-white mt-1">
            {exercises.filter((e) => e.category === 'Mobility' || e.category === 'Core').length}
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search exercises by name, target muscle, or equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0e0e12] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff5a1f]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#0e0e12] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-[#ff5a1f]"
        >
          <option value="ALL">All Categories</option>
          <option value="Strength">Strength</option>
          <option value="Hypertrophy">Hypertrophy</option>
          <option value="Cardio">Cardio</option>
          <option value="Mobility">Mobility</option>
          <option value="Core">Core</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0e0e12] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#ff5a1f] mb-3" />
            <p className="text-xs uppercase tracking-wider font-bold">Loading Movement Catalog...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <Dumbbell className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
            <p className="text-sm font-semibold text-zinc-400">No exercises matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Exercise Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Target Muscle</th>
                  <th className="py-3 px-4">Equipment</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {filtered.map((ex) => (
                  <tr key={ex.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5 text-[#ff5a1f]" />
                      <span>{ex.name}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-bold text-zinc-300 uppercase">
                        {ex.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-[#c6ff3b] font-semibold">
                        {ex.target_muscle}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400">
                      {ex.equipment}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold text-zinc-300 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        {ex.difficulty}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(ex)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[#ff5a1f] hover:text-white text-zinc-400 transition-colors"
                        title="Edit Exercise"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(ex.id, ex.name)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500 hover:text-white text-zinc-400 transition-colors"
                        title="Delete Exercise"
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
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingEx ? `Edit: ${editingEx.name}` : 'Add Exercise Movement'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Movement Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Barbell Incline Bench Press"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                >
                  <option value="Strength">Strength</option>
                  <option value="Hypertrophy">Hypertrophy</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Mobility">Mobility</option>
                  <option value="Core">Core</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Target Muscle *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Upper Chest, Triceps"
                  value={formData.target_muscle}
                  onChange={(e) => setFormData({ ...formData, target_muscle: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Equipment</label>
                <input
                  type="text"
                  placeholder="e.g. Olympic Barbell, Incline Bench"
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Elite">Elite</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Video Demo URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Coaching Cues & Instructions</label>
              <textarea
                rows={4}
                placeholder="Detailed biomechanics setup, bar path, breathing cadence, and tempo..."
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Saving...' : editingEx ? 'Save Movement' : 'Add to Library'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

