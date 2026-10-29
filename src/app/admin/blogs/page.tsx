'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  Clock,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';

export default function AdminBlogsPage() {
  const { showNotification } = useNotification();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    excerpt: '',
    content: '',
    featured_image: '',
    read_time: '6 min read',
    tags: 'Strength, Hypertrophy, Science',
    is_published: true,
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();
      if (res.ok) {
        setBlogs(data.blogs || []);
        setCategories(data.categories || []);
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to load blog posts' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error fetching blogs' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openCreateModal = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      category_id: categories.length > 0 ? categories[0].id : '',
      excerpt: '',
      content: '',
      featured_image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
      read_time: '5 min read',
      tags: 'Biomechanics, Workout, Performance',
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (blog: any) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      category_id: blog.category_id || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      featured_image: blog.featured_image || '',
      read_time: blog.read_time || '5 min read',
      tags: blog.tags || '',
      is_published: blog.is_published === 1 || blog.is_published === true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      showNotification({ type: 'error', message: 'Title and content are required' });
      return;
    }

    try {
      setSaving(true);
      const method = editingBlog ? 'PUT' : 'POST';
      const payload = editingBlog ? { ...formData, id: editingBlog.id } : formData;

      const res = await fetch('/api/admin/blogs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification({
          type: 'success',
          message: editingBlog ? 'Article successfully updated!' : 'New article published!',
        });
        setIsModalOpen(false);
        fetchBlogs();
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to save blog' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Error submitting blog post' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete article "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showNotification({ type: 'success', message: 'Article deleted.' });
        fetchBlogs();
      } else {
        showNotification({ type: 'error', message: data.error || 'Delete failed' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error deleting article' });
    }
  };

  const filtered = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    (b.category_name && b.category_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff5a1f] uppercase tracking-widest mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Marketing & Education</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Strength & Science Journal (CMS)
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Publish research-backed articles, training biomechanics breakdowns, and nutritional science guides.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBlogs}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Button variant="primary" onClick={openCreateModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Filter articles by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[#0e0e12] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff5a1f]"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center text-zinc-400 bg-[#0e0e12] rounded-2xl border border-white/10">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#ff5a1f] mb-3" />
          <p className="text-xs uppercase tracking-wider font-bold">Querying Blog CMS Database...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-zinc-500 bg-[#0e0e12] rounded-2xl border border-white/10">
          <BookOpen className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
          <p className="text-sm font-semibold text-zinc-400">No blog posts found.</p>
          <Button variant="primary" onClick={openCreateModal} className="mt-4">
            Write First Article
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((blog) => (
            <div
              key={blog.id}
              className="rounded-2xl bg-[#0e0e12] border border-white/10 overflow-hidden hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] bg-black/40 overflow-hidden">
                <img
                  src={blog.featured_image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-[9px] font-black uppercase text-[#ff5a1f] px-2.5 py-1 rounded-full border border-white/10">
                  {blog.category_name || 'Journal'}
                </span>
                <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-[9px] font-bold text-zinc-300 px-2 py-1 rounded-md flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-[#c6ff3b]" />
                  {blog.read_time}
                </span>
              </div>

              <div className="p-5 space-y-3 flex-1">
                <h3 className="font-bold text-base text-white line-clamp-2">{blog.title}</h3>
                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                <div className="text-[11px] text-zinc-500 pt-2 border-t border-white/5 flex items-center justify-between">
                  <span>By {blog.author_name || 'FitLife Staff'}</span>
                  <span>{formatDate(blog.created_at)}</span>
                </div>
              </div>

              <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                <div>
                  {blog.is_published ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      <XCircle className="w-3 h-3" /> Draft
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="View Article"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => openEditModal(blog)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-[#ff5a1f] hover:text-white text-zinc-400 transition-colors"
                    title="Edit Article"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(blog.id, blog.title)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500 hover:text-white text-zinc-400 transition-colors"
                    title="Delete Article"
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
          title={editingBlog ? `Edit: ${editingBlog.title}` : 'Draft New Article'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Article Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Progressive Overload Biomechanics: The Hypertrophy Blueprint"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Read Time</label>
                <input
                  type="text"
                  placeholder="e.g. 7 min read"
                  value={formData.read_time}
                  onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Hypertrophy, Form, Science"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Featured Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Article Abstract / Excerpt</label>
              <textarea
                rows={2}
                placeholder="Short teaser that appears in feeds and Google search snippets..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Full Article Content (Markdown / HTML) *</label>
              <textarea
                rows={8}
                required
                placeholder="Write the full comprehensive guide here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded bg-black border-white/20 text-[#ff5a1f] focus:ring-0"
              />
              <span>Publish Live to Journal Immediately</span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Publishing...' : editingBlog ? 'Save Changes' : 'Publish Article'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

