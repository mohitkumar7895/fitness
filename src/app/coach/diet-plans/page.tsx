'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Apple, Plus } from 'lucide-react';

function CoachDietPlansInner() {
  const searchParams = useSearchParams();
  const { showToast } = useNotification();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: 'Precision Recomposition Diet Plan',
    customer_id: searchParams.get('client') || '',
    daily_calories: '2400',
    target_protein: '185',
    target_carbs: '230',
    target_fat: '65',
    description: 'High protein distribution across 4 daily meals to maximize muscle protein synthesis and recovery.',
  });

  const loadData = async () => {
    try {
      const res = await fetch('/api/coach/diet-plans');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (!form.customer_id && json.clients && json.clients.length > 0) {
          setForm((prev) => ({ ...prev, customer_id: json.clients[0].id }));
        }
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.customer_id) {
      showToast({ type: 'error', title: 'Missing Info', message: 'Title and client required.' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/coach/diet-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Diet Protocol Assigned',
          message: 'Target calories and macros dispatched to member portal.',
        });
        setShowModal(false);
        loadData();
      } else {
        showToast({ type: 'error', title: 'Error', message: 'Could not create diet plan.' });
      }
    } catch {
      showToast({ type: 'error', title: 'Connection Error', message: 'Could not reach server.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading Clinical Diet Engine...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="lime">Nutrient Architecture</Badge>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white font-heading mt-2">
            PRESCRIBED DIET PLANS
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Assign clinical caloric deficits, surpluses, and macronutrient targets to athletes.
          </p>
        </div>

        <Button
          variant="lime"
          size="md"
          onClick={() => setShowModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Assign Diet Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.plans && data.plans.length > 0 ? (
          data.plans.map((p: any) => (
            <div
              key={p.id}
              className="p-6 rounded-3xl bg-[#141418] border border-white/10 space-y-4 shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="orange" className="text-[10px]">
                    Athlete: {p.customer_name || 'Assigned Member'}
                  </Badge>
                  <h3 className="text-xl font-bold font-heading text-white mt-1">
                    {p.title}
                  </h3>
                </div>
                <Badge variant="zinc" className="text-[10px]">
                  {p.daily_calories} KCAL
                </Badge>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {p.description}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center text-xs">
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase block">Protein</span>
                  <span className="font-bold text-[#c6ff3b]">{p.target_protein}g</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase block">Carbs</span>
                  <span className="font-bold text-white">{p.target_carbs}g</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="text-[10px] text-zinc-500 uppercase block">Fats</span>
                  <span className="font-bold text-[#ff5a1f]">{p.target_fat}g</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-12 text-center rounded-3xl bg-[#141418] border border-white/10 text-zinc-400">
            No diet plans created yet. Click &quot;Assign Diet Plan&quot; to build a custom macro protocol.
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Assign Clinical Nutrition Protocol"
      >
        <form onSubmit={handleCreate} className="space-y-4 pt-2">
          <Input
            label="Plan Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <Select
            label="Assign to Athlete"
            value={form.customer_id}
            onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
            options={(data?.clients || []).map((c: any) => ({
              value: c.id,
              label: c.name,
            }))}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input
              label="Daily Calories"
              type="number"
              value={form.daily_calories}
              onChange={(e) => setForm({ ...form, daily_calories: e.target.value })}
            />
            <Input
              label="Protein (g)"
              type="number"
              value={form.target_protein}
              onChange={(e) => setForm({ ...form, target_protein: e.target.value })}
            />
            <Input
              label="Carbs (g)"
              type="number"
              value={form.target_carbs}
              onChange={(e) => setForm({ ...form, target_carbs: e.target.value })}
            />
            <Input
              label="Fat (g)"
              type="number"
              value={form.target_fat}
              onChange={(e) => setForm({ ...form, target_fat: e.target.value })}
            />
          </div>

          <Textarea
            label="Clinical Strategy Notes"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <Button type="button" variant="ghost" size="md" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="lime" size="md" isLoading={saving}>
              Confirm &amp; Assign Diet
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function CoachDietPlansPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-zinc-400">
          <p className="text-xs uppercase tracking-widest font-bold">Loading Diet Protocol Builder...</p>
        </div>
      }
    >
      <CoachDietPlansInner />
    </React.Suspense>
  );
}
