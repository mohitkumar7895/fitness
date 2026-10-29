'use client';

import React, { useEffect, useState } from 'react';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit2, Trash2, Eye, EyeOff, Layers } from 'lucide-react';

export default function AdminProgramsPage() {
  const { showToast } = useNotification();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    category_id: '',
    coach_id: '',
    duration_weeks: '8',
    level: 'Intermediate',
    price: '9999',
    original_price: '14999',
    features: 'Custom Split, Macro Blueprint, Weekly Audits',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop',
    excerpt: '',
    description: '',
    is_featured: true,
    is_published: true,
  });

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/programs');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setEditId(null);
    setForm({
      title: '',
      category_id: data?.categories?.[0]?.id || '',
      coach_id: data?.coaches?.[0]?.id || '',
      duration_weeks: '8',
      level: 'All Levels',
      price: '12999',
      original_price: '17999',
      features: 'Periodized Split, Biomechanics Form Check, Nutrition Blueprint',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
      excerpt: '',
      description: '',
      is_featured: true,
      is_published: true,
    });
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({
      title: p.title,
      category_id: p.category_id || '',
      coach_id: p.coach_id || '',
      duration_weeks: String(p.duration_weeks),
      level: p.level,
      price: String(p.price),
      original_price: p.original_price ? String(p.original_price) : '',
      features: p.features || '',
      image: p.image || '',
      excerpt: p.excerpt || '',
      description: p.description || '',
      is_featured: Boolean(p.is_featured),
      is_published: Boolean(p.is_published),
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price) {
      showToast({ type: 'error', title: 'Missing Info', message: 'Title and price are required.' });
      return;
    }

    setSaving(true);
    try {
      const method = editId ? 'PUT' : 'POST';
      const body = editId ? { ...form, id: editId } : form;

      const res = await fetch('/api/admin/programs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: editId ? 'Program Updated' : 'Program Created',
          message: 'Changes are now live on the public website.',
        });
        setShowModal(false);
        loadData();
      } else {
        showToast({ type: 'error', title: 'Save Failed', message: 'Could not save program.' });
      }
    } catch {
      showToast({ type: 'error', title: 'Network Error', message: 'Could not reach server.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    try {
      const res = await fetch(`/api/admin/programs?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast({ type: 'success', title: 'Program Deleted', message: 'Removed from public catalogue.' });
        loadData();
      }
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Could not delete.' });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading Programs CMS...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="orange">Programs CMS</Badge>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white font-heading mt-2">
            PROGRAM MANAGEMENT
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Create, price, and update training methodologies shown on the public website.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Program
        </Button>
      </div>

      {/* Programs Table */}
      <div className="rounded-3xl bg-[#141418] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-zinc-400 uppercase font-semibold">
              <tr>
                <th className="p-4">Program</th>
                <th className="p-4">Category</th>
                <th className="p-4">Coach</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {data?.programs && data.programs.length > 0 ? (
                data.programs.map((p: any) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-xl overflow-hidden relative shrink-0">
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-white leading-tight">{p.title}</p>
                          <span className="text-[10px] text-zinc-500 font-mono">/{p.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-300">{p.category_name || 'General'}</td>
                    <td className="p-4 text-zinc-300">{p.coach_name || 'Staff Specialist'}</td>
                    <td className="p-4 font-bold text-white">{p.duration_weeks} Weeks</td>
                    <td className="p-4 font-black text-[#ff5a1f] text-sm">{formatCurrency(p.price)}</td>
                    <td className="p-4">
                      <Badge variant={p.is_published ? 'lime' : 'zinc'} className="text-[9px]">
                        {p.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white cursor-pointer"
                          title="Edit Program"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                          title="Delete Program"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    No programs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editId ? 'Edit Program' : 'Create New Program'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <Input
            label="Program Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              options={(data?.categories || []).map((cat: any) => ({
                value: cat.id,
                label: cat.name,
              }))}
            />

            <Select
              label="Assigned Lead Coach"
              value={form.coach_id}
              onChange={(e) => setForm({ ...form, coach_id: e.target.value })}
              options={(data?.coaches || []).map((c: any) => ({
                value: c.id,
                label: c.name,
              }))}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <Input
              label="Original Price"
              type="number"
              value={form.original_price}
              onChange={(e) => setForm({ ...form, original_price: e.target.value })}
            />
            <Input
              label="Duration (Wks)"
              type="number"
              value={form.duration_weeks}
              onChange={(e) => setForm({ ...form, duration_weeks: e.target.value })}
            />
            <Input
              label="Level"
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
            />
          </div>

          <Input
            label="Banner / Thumbnail Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />

          <Input
            label="Features (Comma separated)"
            value={form.features}
            onChange={(e) => setForm({ ...form, features: e.target.value })}
          />

          <Textarea
            label="Short Excerpt (Card Summary)"
            rows={2}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />

          <Textarea
            label="Full Detailed Description & Curriculum"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="rounded accent-[#ff5a1f]"
              />
              Show in Homepage Featured
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                className="rounded accent-[#c6ff3b]"
              />
              Publish to Website
            </label>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <Button type="button" variant="ghost" size="md" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={saving}>
              Save Program
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

