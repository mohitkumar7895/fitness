'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Share2,
} from 'lucide-react';
import Link from 'next/link';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export default function AdminSeoPage() {
  const { showNotification } = useNotification();
  const [seoList, setSeoList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeo, setEditingSeo] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    page_path: '',
    meta_title: '',
    meta_description: '',
    canonical_url: '',
    og_title: '',
    og_description: '',
    og_image: '',
    keywords: '',
  });

  const fetchSeo = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/seo');
      const data = await res.json();
      if (res.ok) {
        setSeoList(data.seoList || []);
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to load SEO configs' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error fetching SEO records' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeo();
  }, []);

  const openCreateModal = () => {
    setEditingSeo(null);
    setFormData({
      page_path: '',
      meta_title: '',
      meta_description: '',
      canonical_url: '',
      og_title: '',
      og_description: '',
      og_image: '',
      keywords: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingSeo(item);
    setFormData({
      page_path: item.page_path || '',
      meta_title: item.meta_title || '',
      meta_description: item.meta_description || '',
      canonical_url: item.canonical_url || '',
      og_title: item.og_title || '',
      og_description: item.og_description || '',
      og_image: item.og_image || '',
      keywords: item.keywords || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.page_path || !formData.meta_title) {
      showNotification({ type: 'error', message: 'Page path and meta title are required' });
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification({ type: 'success', message: 'SEO configuration saved!' });
        setIsModalOpen(false);
        fetchSeo();
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to save SEO' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Error submitting SEO record' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, path: string) => {
    if (!confirm(`Delete SEO configuration for path "${path}"?`)) return;

    try {
      const res = await fetch(`/api/admin/seo?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showNotification({ type: 'success', message: 'SEO configuration deleted.' });
        fetchSeo();
      } else {
        showNotification({ type: 'error', message: data.error || 'Delete failed' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error deleting SEO' });
    }
  };

  const filtered = seoList.filter((item) =>
    item.page_path.toLowerCase().includes(search.toLowerCase()) ||
    item.meta_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff5a1f] uppercase tracking-widest mb-1">
            <Globe className="w-3.5 h-3.5" />
            <span>Search Engine Optimization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            SEO & OpenGraph Meta Registry
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Optimize organic Google search rankings, OpenGraph social cards, and indexing keywords for all routes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSeo}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Button variant="primary" onClick={openCreateModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Route SEO</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Filter by route path or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#0e0e12] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff5a1f]"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0e0e12] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#ff5a1f] mb-3" />
            <p className="text-xs uppercase tracking-wider font-bold">Querying SEO Configuration...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <Globe className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
            <p className="text-sm font-semibold text-zinc-400">No SEO records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Route Path</th>
                  <th className="py-3 px-4">Meta Title (SERP)</th>
                  <th className="py-3 px-4">Meta Description Snippet</th>
                  <th className="py-3 px-4">Keywords</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#ff5a1f]">
                      {item.page_path}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">
                      {item.meta_title}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400 max-w-md truncate">
                      {item.meta_description}
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-zinc-500 max-w-xs truncate">
                      {item.keywords || '--'}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={item.page_path}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors inline-block"
                        title="Open Route"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[#ff5a1f] hover:text-white text-zinc-400 transition-colors"
                        title="Edit SEO"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id, item.page_path)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500 hover:text-white text-zinc-400 transition-colors"
                        title="Delete SEO"
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
          title={editingSeo ? `Edit SEO: ${editingSeo.page_path}` : 'Add Route SEO Settings'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Route Path *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /programs or /transformations"
                  value={formData.page_path}
                  onChange={(e) => setFormData({ ...formData, page_path: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Canonical URL</label>
                <input
                  type="url"
                  placeholder="e.g. https://fitlifewellness.com/programs"
                  value={formData.canonical_url}
                  onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Meta Title (SERP) *</label>
              <input
                type="text"
                required
                placeholder="e.g. Elite Training Programs | FitLife Wellness"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Meta Description</label>
              <textarea
                rows={2}
                placeholder="Compelling description for Google search snippets (approx 150-160 characters)..."
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Focus Keywords (Comma-separated)</label>
              <input
                type="text"
                placeholder="gym, personal trainer, bodybuilding, nutrition"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">OpenGraph Title</label>
                <input
                  type="text"
                  placeholder="Defaults to Meta Title"
                  value={formData.og_title}
                  onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">OpenGraph Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.og_image}
                  onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save SEO Configuration'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

