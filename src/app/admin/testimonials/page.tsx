'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export default function AdminTestimonialsPage() {
  const { showNotification } = useNotification();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: 'Member',
    company_or_goal: 'Body Transformation',
    content: '',
    result_highlight: '-10 kg in 12 weeks',
    before_weight: '',
    after_weight: '',
    before_image: '',
    after_image: '',
    rating: 5,
    is_approved: true,
    is_featured: true,
  });

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      if (res.ok) {
        setTestimonials(data.testimonials || []);
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to load testimonials' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error fetching testimonials' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      role: 'Member',
      company_or_goal: 'Physique Recomposition',
      content: '',
      result_highlight: '-8 kg fat loss, +3 kg lean muscle',
      before_weight: '84',
      after_weight: '76',
      before_image: '',
      after_image: '',
      rating: 5,
      is_approved: true,
      is_featured: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      role: item.role || 'Member',
      company_or_goal: item.company_or_goal || '',
      content: item.content || '',
      result_highlight: item.result_highlight || '',
      before_weight: item.before_weight ? String(item.before_weight) : '',
      after_weight: item.after_weight ? String(item.after_weight) : '',
      before_image: item.before_image || '',
      after_image: item.after_image || '',
      rating: item.rating || 5,
      is_approved: item.is_approved === 1 || item.is_approved === true,
      is_featured: item.is_featured === 1 || item.is_featured === true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.content) {
      showNotification({ type: 'error', message: 'Name and testimonial quote are required.' });
      return;
    }

    try {
      setSaving(true);
      const method = editingItem ? 'PUT' : 'POST';
      const payload = editingItem ? { ...formData, id: editingItem.id } : formData;

      const res = await fetch('/api/admin/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification({
          type: 'success',
          message: editingItem ? 'Testimonial updated!' : 'Transformation story published!',
        });
        setIsModalOpen(false);
        fetchTestimonials();
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to save testimonial' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Error submitting testimonial' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete story for "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showNotification({ type: 'success', message: 'Record deleted.' });
        fetchTestimonials();
      } else {
        showNotification({ type: 'error', message: data.error || 'Delete failed' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error deleting record' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff5a1f] uppercase tracking-widest mb-1">
            <Star className="w-3.5 h-3.5" />
            <span>Marketing & Social Proof</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Client Transformations & Testimonials
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Showcase verified client before-and-after results, biometric transformations, and club reviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTestimonials}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Button variant="primary" onClick={openCreateModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Transformation Story</span>
          </Button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center text-zinc-400 bg-[#0e0e12] rounded-2xl border border-white/10">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#ff5a1f] mb-3" />
          <p className="text-xs uppercase tracking-wider font-bold">Querying Transformations...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="p-12 text-center text-zinc-500 bg-[#0e0e12] rounded-2xl border border-white/10">
          <Star className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
          <p className="text-sm font-semibold text-zinc-400">No client stories recorded yet.</p>
          <Button variant="primary" onClick={openCreateModal} className="mt-4">
            Add First Transformation
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#0e0e12] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all"
            >
              {/* Before & After Images Preview if present */}
              {(item.before_image || item.after_image) && (
                <div className="grid grid-cols-2 gap-0.5 bg-black/40 h-44 relative">
                  <div className="relative h-full overflow-hidden">
                    {item.before_image ? (
                      <img src={item.before_image} alt="Before" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600 bg-white/5">Before N/A</div>
                    )}
                    <span className="absolute bottom-2 left-2 bg-black/80 text-[9px] font-black uppercase text-zinc-300 px-2 py-0.5 rounded">
                      Before
                    </span>
                  </div>
                  <div className="relative h-full overflow-hidden">
                    {item.after_image ? (
                      <img src={item.after_image} alt="After" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600 bg-white/5">After N/A</div>
                    )}
                    <span className="absolute bottom-2 right-2 bg-[#ff5a1f] text-[9px] font-black uppercase text-white px-2 py-0.5 rounded">
                      After
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5 space-y-4 flex-1">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">{item.name}</h3>
                    <p className="text-xs text-[#ff5a1f] font-semibold">{item.company_or_goal || item.role}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-xs font-bold text-white">{item.rating || 5}.0</span>
                  </div>
                </div>

                {/* Metric pill */}
                {item.result_highlight && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c6ff3b]/10 border border-[#c6ff3b]/20 text-[#c6ff3b] text-xs font-bold">
                    <TrendingDown className="w-3 h-3" />
                    <span>{item.result_highlight}</span>
                  </div>
                )}

                {/* Quote */}
                <p className="text-xs text-zinc-300 italic line-clamp-3 leading-relaxed">
                  "{item.content}"
                </p>

                {/* Weights */}
                {(item.before_weight || item.after_weight) && (
                  <div className="flex items-center gap-3 text-xs text-zinc-400 pt-2 border-t border-white/5">
                    <span>{item.before_weight} kg</span>
                    <ArrowRight className="w-3 h-3 text-[#ff5a1f]" />
                    <span className="text-white font-bold">{item.after_weight} kg</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.is_approved ? (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Approved
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                  {item.is_featured && (
                    <span className="text-[10px] font-bold text-[#ff5a1f] bg-[#ff5a1f]/10 px-2 py-0.5 rounded-full border border-[#ff5a1f]/20">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-[#ff5a1f] hover:text-white text-zinc-400 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500 hover:text-white text-zinc-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
          title={editingItem ? `Edit Story: ${editingItem.name}` : 'Add Transformation Story'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Member Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Goal Track / Tag</label>
                <input
                  type="text"
                  placeholder="e.g. 12-Week Fat Shred"
                  value={formData.company_or_goal}
                  onChange={(e) => setFormData({ ...formData, company_or_goal: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Result Highlight Banner</label>
              <input
                type="text"
                placeholder="e.g. -14 kg fat loss & 10% body fat reduction"
                value={formData.result_highlight}
                onChange={(e) => setFormData({ ...formData, result_highlight: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Before Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 92"
                  value={formData.before_weight}
                  onChange={(e) => setFormData({ ...formData, before_weight: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">After Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 78"
                  value={formData.after_weight}
                  onChange={(e) => setFormData({ ...formData, after_weight: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Rating (1-5)</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Before Photo URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.before_image}
                  onChange={(e) => setFormData({ ...formData, before_image: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">After Photo URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.after_image}
                  onChange={(e) => setFormData({ ...formData, after_image: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Testimonial Quote *</label>
              <textarea
                rows={3}
                required
                placeholder="In their own words: their journey, struggles, coaching experience, and athletic results..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_approved}
                  onChange={(e) => setFormData({ ...formData, is_approved: e.target.checked })}
                  className="rounded bg-black border-white/20 text-[#ff5a1f] focus:ring-0"
                />
                <span>Approved for Public Display</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded bg-black border-white/20 text-[#ff5a1f] focus:ring-0"
                />
                <span>Feature on Homepage Spotlight</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Publish Story'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

