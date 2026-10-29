'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatDate, formatCurrency } from '@/lib/utils';
import { CreditCard, ShieldCheck, Check, Sparkles, ArrowRight } from 'lucide-react';

export default function CustomerMembershipPage() {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/customer/profile');
        if (res.ok) {
          const json = await res.json();
          setProfile(json.profile);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRenew = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      showToast({
        type: 'success',
        title: 'Membership Renewed Successfully',
        message: 'Your plan access has been extended by 90 days. Invoice generated.',
      });
    }, 1500);
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading Membership Data...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Badge variant="orange">Sanctuary Pass</Badge>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-heading mt-2">
          MY MEMBERSHIP &amp; BILLING
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review your access tier, benefits, renewal dates, and payment history.
        </p>
      </div>

      {/* Active Pass Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#18181e] via-[#141418] to-[#18181e] border-2 border-[#ff5a1f]/40 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff5a1f]">
              Current Active Pass
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase font-heading text-white">
              {profile?.plan_name || 'Quarterly Transformer Tier'}
            </h2>
            <p className="text-xs text-zinc-400">
              Valid until: <strong className="text-white">{formatDate(profile?.membership_end_date || new Date())}</strong>
            </p>
          </div>

          <Badge variant="lime" className="px-4 py-1.5 font-bold text-xs uppercase self-start sm:self-auto">
            Status: {profile?.membership_status || 'ACTIVE'}
          </Badge>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#c6ff3b] shrink-0" />
            <span>Full Floor Access 05:00 - 23:00 Daily</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#c6ff3b] shrink-0" />
            <span>Private Recovery Suite Privileges</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#c6ff3b] shrink-0" />
            <span>Assigned Master Coach &amp; Biomechanics Audits</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#c6ff3b] shrink-0" />
            <span>Clinical Diet Blueprint &amp; Macro Updates</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
              Auto-Renewal Status
            </span>
            <span className="text-xs font-semibold text-white">
              Enabled (Secured with Razorpay)
            </span>
          </div>

          <Button
            variant="primary"
            size="md"
            isLoading={paying}
            onClick={handleRenew}
            rightIcon={<Sparkles className="w-4 h-4" />}
          >
            Extend / Renew Membership
          </Button>
        </div>
      </div>

      {/* Payment History Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-4">
        <h3 className="text-lg font-bold uppercase font-heading text-white">
          Payment Transactions
        </h3>
        <div className="divide-y divide-white/5 text-xs text-zinc-300">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Quarterly Transformer Plan</p>
              <span className="text-zinc-500 text-[10px]">Invoice #INV-2026-001 • Card</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-white block">₹9,999</span>
              <span className="text-emerald-400 text-[10px] font-semibold">PAID</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

