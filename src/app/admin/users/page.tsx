'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Key,
  User,
  Flame,
} from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';

export default function AdminUsersPage() {
  const { showNotification } = useNotification();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'COACH',
    phone: '',
    is_active: true,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to load user accounts' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error fetching users' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'COACH',
      phone: '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (u: any) => {
    setEditingUser(u);
    setFormData({
      name: u.name || '',
      email: u.email || '',
      password: '',
      role: u.role || 'COACH',
      phone: u.phone || '',
      is_active: u.is_active === 1 || u.is_active === true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showNotification({ type: 'error', message: 'Name and email are required' });
      return;
    }
    if (!editingUser && !formData.password) {
      showNotification({ type: 'error', message: 'Initial password is required' });
      return;
    }

    try {
      setSaving(true);
      const method = editingUser ? 'PUT' : 'POST';
      const payload = editingUser ? { ...formData, id: editingUser.id } : formData;

      const res = await fetch('/api/admin/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification({
          type: 'success',
          message: editingUser ? 'User profile updated!' : 'New user account created!',
        });
        setIsModalOpen(false);
        fetchUsers();
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to save user' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Error saving user' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user account "${name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showNotification({ type: 'success', message: 'User account removed.' });
        fetchUsers();
      } else {
        showNotification({ type: 'error', message: data.error || 'Delete failed' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error deleting user' });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return <span className="text-[10px] font-black text-[#ff5a1f] bg-[#ff5a1f]/10 px-2 py-0.5 rounded-full border border-[#ff5a1f]/20 uppercase">SUPERADMIN</span>;
      case 'ADMIN':
        return <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 uppercase">ADMIN</span>;
      case 'COACH':
        return <span className="text-[10px] font-bold text-[#c6ff3b] bg-[#c6ff3b]/10 px-2 py-0.5 rounded-full border border-[#c6ff3b]/20 uppercase">COACH</span>;
      default:
        return <span className="text-[10px] font-bold text-zinc-300 bg-white/5 px-2 py-0.5 rounded-full uppercase">MEMBER</span>;
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search));
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff5a1f] uppercase tracking-widest mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Administration & Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            User Roles & Staff Permissions
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Create club managers, master coaches, and administrators with role-based access control.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Button variant="primary" onClick={openCreateModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Create Staff / User</span>
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0e0e12] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff5a1f]"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-[#0e0e12] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-[#ff5a1f]"
        >
          <option value="ALL">All Roles</option>
          <option value="SUPERADMIN">Superadmin</option>
          <option value="ADMIN">Admin</option>
          <option value="COACH">Coach</option>
          <option value="CUSTOMER">Customer / Member</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0e0e12] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#ff5a1f] mb-3" />
            <p className="text-xs uppercase tracking-wider font-bold">Querying User Accounts...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <User className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
            <p className="text-sm font-semibold text-zinc-400">No users found matching query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role Access</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[11px] text-zinc-500 flex items-center gap-2">
                        <span>{u.email}</span>
                        {u.phone && <span>• {u.phone}</span>}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getRoleBadge(u.role)}
                    </td>

                    <td className="py-3.5 px-4">
                      {u.is_active === 1 || u.is_active === true ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                          <XCircle className="w-3 h-3" /> Suspended
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-500 text-[11px]">
                      {u.created_at ? formatDate(u.created_at) : '--'}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[#ff5a1f] hover:text-white text-zinc-400 transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500 hover:text-white text-zinc-400 transition-colors"
                        title="Delete User"
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
          title={editingUser ? `Edit Account: ${editingUser.name}` : 'Create Staff / User'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Role Privilege *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                >
                  <option value="COACH">Coach</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPERADMIN">Superadmin</option>
                  <option value="CUSTOMER">Customer / Member</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Mobile Phone</label>
                <input
                  type="text"
                  placeholder="+91..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">
                {editingUser ? 'Reset Password (Leave blank to keep current)' : 'Account Password *'}
              </label>
              <input
                type="password"
                required={!editingUser}
                placeholder={editingUser ? '••••••••' : 'Enter strong password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            {editingUser && (
              <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded bg-black border-white/20 text-[#ff5a1f] focus:ring-0"
                />
                <span>Account Is Active & Can Sign In</span>
              </label>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Saving...' : editingUser ? 'Save Changes' : 'Create User'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

