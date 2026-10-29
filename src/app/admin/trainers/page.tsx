'use client';

import React, { useEffect, useState } from 'react';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, Edit2, Trash2, Star, ShieldCheck } from 'lucide-react';

export default function AdminTrainersPage() {
  const { showToast } = useNotification();
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    title: 'Master Strength Coach',
    bio: '',
    experience_years: '6',
    certifications: 'CSCS (NSCA), Precision Nutrition',
    specializations: 'Hypertrophy, Biomechanics',
    hourly_rate: '70',
    avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=400&auto=format&fit=crop',
    rating: '4.95',
  });

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/trainers');
      if (res.ok) {
        const json = await res.json();
        setTrainers(json.trainers || []);
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
    setEditUserId(null);
    setForm({
      name: '',
      email: '',
      phone: '',
      password: '',
      title: 'Master Strength Coach',
      bio: '',
      experience_years: '6',
      certifications: 'CSCS (NSCA), Precision Nutrition',
      specializations: 'Hypertrophy, Biomechanics',
      hourly_rate: '70',
      avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=400&auto=format&fit=crop',
      rating: '4.95',
    });
    setShowModal(true);
  };

  const openEdit = (tr: any) => {
    setEditId(tr.id);
    setEditUserId(tr.user_id);
    setForm({
      name: tr.name,
      email: tr.email,
      phone: tr.phone || '',
      password: '',
      title: tr.title,
      bio: tr.bio || '',
      experience_years: String(tr.experience_years),
      certifications: tr.certifications || '',
      specializations: tr.specializations || '',
      hourly_rate: String(tr.hourly_rate),
      avatar: tr.avatar || '',
      rating: String(tr.rating),
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || (!editId && !form.email)) {
      showToast({ type: 'error', title: 'Missing Info', message: 'Name and email are required.' });
      return;
    }

    setSaving(true);
    try {
      const method = editId ? 'PUT' : 'POST';
      const body = editId ? { ...form, id: editId, user_id: editUserId } : form;

      const res = await fetch('/api/admin/trainers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: editId ? 'Coach Profile Updated' : 'Coach Account Created',
          message: 'Profile is now synced across the platform.',
        });
        setShowModal(false);
        loadData();
      } else {
        showToast({ type: 'error', title: 'Failed to Save', message: 'Could not save trainer.' });
      }
    } catch {
      showToast({ type: 'error', title: 'Network Error', message: 'Could not connect.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this coach?')) return;
    try {
      const res = await fetch(`/api/admin/trainers?userId=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast({ type: 'success', title: 'Coach Removed', message: 'Account deactivated.' });
        loadData();
      }
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Could not remove coach.' });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading Coach Roster...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="lime">Staff Directory</Badge>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white font-heading mt-2">
            TRAINERS &amp; COACHES
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage certified master coaches, hourly rates, specializations, and booking access.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Master Coach
        </Button>
      </div>

      <div className="rounded-3xl bg-[#141418] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-zinc-400 uppercase font-semibold">
              <tr>
                <th className="p-4">Trainer</th>
                <th className="p-4">Title</th>
                <th className="p-4">Experience</th>
                <th className="p-4">Hourly Rate</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {trainers.map((tr) => (
                <tr key={tr.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden relative shrink-0">
                        <img src={tr.avatar} alt={tr.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-white">{tr.name}</p>
                        <span className="text-[10px] text-zinc-500">{tr.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#ff5a1f] font-semibold">{tr.title}</td>
                  <td className="p-4 font-bold text-white">{tr.experience_years} Years</td>
                  <td className="p-4 text-[#c6ff3b] font-black">${tr.hourly_rate}/hr</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 font-bold text-white">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {tr.rating}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(tr)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white cursor-pointer"
                        title="Edit Coach"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tr.user_id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                        title="Delete Coach"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editId ? 'Edit Coach Profile' : 'Add Master Coach'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Coach Full Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Official Email"
              type="email"
              required={!editId}
              disabled={Boolean(editId)}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Contact Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              label="Hourly Rate ($)"
              type="number"
              value={form.hourly_rate}
              onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
            />
            <Input
              label="Experience (Years)"
              type="number"
              value={form.experience_years}
              onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
            />
          </div>

          <Input
            label="Professional Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <Input
            label="Avatar Photo URL"
            value={form.avatar}
            onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          />

          <Input
            label="Certifications"
            value={form.certifications}
            onChange={(e) => setForm({ ...form, certifications: e.target.value })}
          />

          <Input
            label="Specializations"
            value={form.specializations}
            onChange={(e) => setForm({ ...form, specializations: e.target.value })}
          />

          <Textarea
            label="Biography &amp; Philosophy"
            rows={3}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <Button type="button" variant="ghost" size="md" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={saving}>
              Save Coach Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

