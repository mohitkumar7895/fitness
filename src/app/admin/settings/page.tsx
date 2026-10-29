'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  RefreshCw,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  Shield,
  CreditCard,
  MessageSquare,
} from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';

export default function AdminSettingsPage() {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [settings, setSettings] = useState({
    site_name: 'FitLife Wellness',
    tagline: 'Elite Hypertrophy & Body Transformation Club',
    contact_email: 'concierge@fitlifewellness.com',
    contact_phone: '+91 98765 43210',
    whatsapp_number: '+91 98765 43210',
    address: '88 Pinnacle Boulevard, Financial District, Mumbai 400051',
    operating_hours: 'Mon - Sun: 05:00 AM – 11:30 PM',
    currency: 'INR',
    currency_symbol: '₹',
    razorpay_key_id: 'rzp_live_fitlife_prod_key',
    google_maps_url: 'https://maps.google.com/?q=Mumbai+Financial+District',
    instagram_url: 'https://instagram.com/fitlifewellness',
    youtube_url: 'https://youtube.com/@fitlifewellness',
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (res.ok && data.settings) {
        setSettings((prev) => ({
          ...prev,
          ...data.settings,
        }));
      }
    } catch {
      showNotification({ type: 'error', message: 'Failed to load system settings' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification({ type: 'success', message: 'Global system configuration saved!' });
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to save settings' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Network error saving settings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff5a1f] uppercase tracking-widest mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            General Club Settings & Integrations
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Configure contact details, operating hours, payment keys, and physical club location metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchSettings}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Identity */}
        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#ff5a1f]">
            <Building className="w-4 h-4" />
            <span>Brand & Club Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Club Brand Name</label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => handleChange('site_name', e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>
          </div>
        </div>

        {/* Contact & Hours */}
        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#c6ff3b]">
            <Phone className="w-4 h-4" />
            <span>Communications & Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Concierge Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Front Desk Phone</label>
              <input
                type="text"
                value={settings.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Official WhatsApp (With Country Code)</label>
              <input
                type="text"
                value={settings.whatsapp_number}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Club Physical Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Operating Hours</label>
              <input
                type="text"
                value={settings.operating_hours}
                onChange={(e) => handleChange('operating_hours', e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>
          </div>
        </div>

        {/* Payments & Gateway */}
        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#ff5a1f]">
            <CreditCard className="w-4 h-4" />
            <span>Payments & Currency</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Currency Code</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Currency Symbol</label>
              <input
                type="text"
                value={settings.currency_symbol}
                onChange={(e) => handleChange('currency_symbol', e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Razorpay Key ID</label>
              <input
                type="text"
                value={settings.razorpay_key_id}
                onChange={(e) => handleChange('razorpay_key_id', e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-zinc-400">
            <MessageSquare className="w-4 h-4" />
            <span>Social Media Channels</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Instagram Handle / URL</label>
              <input
                type="url"
                value={settings.instagram_url}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">YouTube Channel URL</label>
              <input
                type="url"
                value={settings.youtube_url}
                onChange={(e) => handleChange('youtube_url', e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary" disabled={saving} className="px-8">
            {saving ? 'Saving...' : 'Save Global Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}

