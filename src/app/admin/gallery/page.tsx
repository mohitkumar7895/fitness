'use client';

import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Filter,
} from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export default function AdminGalleryPage() {
  const { showNotification } = useNotification();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'FACILITY',
    media_url: '',
    caption: '',
  });

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/gallery');
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to load media' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error fetching gallery' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openCreateModal = () => {
    setFormData({
      title: '',
      category: 'FACILITY',
      media_url: '',
      caption: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.media_url) {
      showNotification({ type: 'error', message: 'Title and media URL are required.' });
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification({ type: 'success', message: 'Media asset uploaded to gallery!' });
        setIsModalOpen(false);
        fetchGallery();
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to add media' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Error adding gallery photo' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete media item "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showNotification({ type: 'success', message: 'Media item deleted.' });
        fetchGallery();
      } else {
        showNotification({ type: 'error', message: data.error || 'Delete failed' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error deleting media' });
    }
  };

  const filtered = items.filter((item) =>
    categoryFilter === 'ALL' ? true : item.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff5a1f] uppercase tracking-widest mb-1">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Marketing & Visual Assets</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Media Gallery & Facility Photography
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Curate high-resolution imagery showcasing the club gym floor, bio-recovery suite, and functional training areas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchGallery}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Button variant="primary" onClick={openCreateModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Media Asset</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['ALL', 'FACILITY', 'EQUIPMENT', 'RECOVERY', 'TRAINING'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
              categoryFilter === cat
                ? 'bg-[#ff5a1f] text-white shadow-md'
                : 'bg-[#0e0e12] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center text-zinc-400 bg-[#0e0e12] rounded-2xl border border-white/10">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#ff5a1f] mb-3" />
          <p className="text-xs uppercase tracking-wider font-bold">Querying Media Gallery...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-zinc-500 bg-[#0e0e12] rounded-2xl border border-white/10">
          <ImageIcon className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
          <p className="text-sm font-semibold text-zinc-400">No media items in this category.</p>
          <Button variant="primary" onClick={openCreateModal} className="mt-4">
            Upload Image
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-[#0e0e12] border border-white/10 overflow-hidden hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-black/40 overflow-hidden">
                <img
                  src={item.media_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-[9px] font-black uppercase text-zinc-200 px-2.5 py-1 rounded-full border border-white/10">
                  {item.category}
                </span>

                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/80 hover:bg-rose-600 text-zinc-400 hover:text-white transition-colors"
                  title="Delete Asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 space-y-1">
                <h3 className="font-bold text-sm text-white truncate">{item.title}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2">{item.caption || 'No caption provided'}</p>
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
          title="Add New Media Asset"
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Media Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Olympic Lifting Platform Area"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              >
                <option value="FACILITY">FACILITY</option>
                <option value="EQUIPMENT">EQUIPMENT</option>
                <option value="RECOVERY">RECOVERY</option>
                <option value="TRAINING">TRAINING</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Image Asset URL *</label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={formData.media_url}
                onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Caption / Description</label>
              <textarea
                rows={2}
                placeholder="Custom Eleiko competition bumper plates and calibrated power racks..."
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Adding...' : 'Add to Gallery'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

