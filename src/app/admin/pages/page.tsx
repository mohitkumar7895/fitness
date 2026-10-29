'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  XCircle,
  Globe,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';

export default function AdminPagesManager() {
  const { showNotification } = useNotification();
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    meta_title: '',
    meta_description: '',
    og_image: '',
    is_published: true,
  });

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/pages');
      const data = await res.json();
      if (res.ok) {
        setPages(data.pages || []);
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to load pages' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error fetching pages' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const openCreateModal = () => {
    setEditingPage(null);
    setFormData({
      title: '',
      slug: '',
      meta_title: '',
      meta_description: '',
      og_image: '',
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (page: any) => {
    setEditingPage(page);
    setFormData({
      title: page.title || '',
      slug: page.slug || '',
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      og_image: page.og_image || '',
      is_published: page.is_published === 1 || page.is_published === true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      showNotification({ type: 'error', message: 'Page title is required' });
      return;
    }

    try {
      setSaving(true);
      const method = editingPage ? 'PUT' : 'POST';
      const payload = editingPage ? { ...formData, id: editingPage.id } : formData;

      const res = await fetch('/api/admin/pages', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification({
          type: 'success',
          message: editingPage ? 'Page metadata updated!' : 'New page registered!',
        });
        setIsModalOpen(false);
        fetchPages();
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to save page' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Error submitting page data' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete page "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/pages?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showNotification({ type: 'success', message: 'Page record removed.' });
        fetchPages();
      } else {
        showNotification({ type: 'error', message: data.error || 'Delete failed' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error deleting page' });
    }
  };

  const filtered = pages.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff5a1f] uppercase tracking-widest mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Website & CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Pages & SEO Content Architecture
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage metadata, page titles, URL routing slugs, and search engine parameters for all website pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPages}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Button variant="primary" onClick={openCreateModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Create New Page</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Filter pages by title or URL slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#0e0e12] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff5a1f]"
        />
      </div>

      {/* Pages Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0e0e12] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#ff5a1f] mb-3" />
            <p className="text-xs uppercase tracking-wider font-bold">Querying Website Pages...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <FileText className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
            <p className="text-sm font-semibold text-zinc-400">No pages matching query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Page Title</th>
                  <th className="py-3 px-4">Route Path</th>
                  <th className="py-3 px-4">Meta Title</th>
                  <th className="py-3 px-4">Publish Status</th>
                  <th className="py-3 px-4">Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {filtered.map((page) => (
                  <tr key={page.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {page.title}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#ff5a1f]">
                      /{page.slug === 'home' ? '' : page.slug}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400 max-w-xs truncate">
                      {page.meta_title || '--'}
                    </td>

                    <td className="py-3.5 px-4">
                      {page.is_published ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                          <XCircle className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-500 text-[11px]">
                      {page.updated_at ? formatDate(page.updated_at) : '--'}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={page.slug === 'home' ? '/' : `/${page.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors inline-block"
                        title="View Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => openEditModal(page)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[#ff5a1f] hover:text-white text-zinc-400 transition-colors"
                        title="Edit Page SEO"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(page.id, page.title)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500 hover:text-white text-zinc-400 transition-colors"
                        title="Delete Page"
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
          title={editingPage ? `Edit Page: ${editingPage.title}` : 'Create New CMS Page'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Page Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterclass Workshops"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Route Slug *</label>
                <input
                  type="text"
                  placeholder="e.g. masterclass-workshops"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Meta Title (SEO)</label>
              <input
                type="text"
                placeholder="e.g. Masterclass Workshops | FitLife Wellness"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Meta Description</label>
              <textarea
                rows={3}
                placeholder="Provide a concise description for Google search snippets..."
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">OG / Social Preview Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.og_image}
                onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded bg-black border-white/20 text-[#ff5a1f] focus:ring-0"
              />
              <span>Set Page Status to Published</span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Saving...' : editingPage ? 'Save Changes' : 'Create Page'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

