'use client';

import React, { useEffect, useState } from 'react';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import {
  TrendingUp,
  Plus,
  Scale,
  Activity,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function ProgressTrackingPage() {
  const { showToast } = useNotification();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    weight: '',
    body_fat: '',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    notes: '',
  });

  const loadData = async () => {
    try {
      const res = await fetch('/api/customer/progress');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.weight) {
      showToast({ type: 'error', title: 'Weight Required', message: 'Please enter today\'s body weight.' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/customer/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Measurement Logged',
          message: 'Your progress history and BMI have been recalculated.',
        });
        setShowModal(false);
        setForm({ weight: '', body_fat: '', chest: '', waist: '', hips: '', arms: '', notes: '' });
        loadData();
      } else {
        showToast({ type: 'error', title: 'Logging Failed', message: 'Could not record measurement.' });
      }
    } catch {
      showToast({ type: 'error', title: 'Connection Error', message: 'Could not reach server.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading Athlete Biometrics...</div>;
  }

  const chartData = (data?.records || []).map((r: any) => ({
    date: formatDate(r.recorded_date),
    weight: r.weight,
    bodyFat: r.body_fat,
  }));

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="orange">Biometric Audit</Badge>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white font-heading mt-2">
            PROGRESS &amp; BIO-TRACKING
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Empirical progress timeline tracking weight, body composition, and circumference metrics.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowModal(!showModal)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {showModal ? 'Close Form' : 'Log New Measurement'}
        </Button>
      </div>

      {/* Log Measurement Accordion / Form */}
      {showModal && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141418] border-2 border-[#ff5a1f]/40 space-y-6 shadow-2xl">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#ff5a1f]" />
            <h3 className="text-lg font-bold uppercase font-heading text-white">
              Log Today&apos;s Metrics
            </h3>
          </div>

          <form onSubmit={handleLogProgress} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Weight (kg)"
                type="number"
                step="0.1"
                required
                placeholder="e.g. 83.5"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
              />
              <Input
                label="Body Fat % (Optional)"
                type="number"
                step="0.1"
                placeholder="e.g. 16.5"
                value={form.body_fat}
                onChange={(e) => setForm({ ...form, body_fat: e.target.value })}
              />
              <Input
                label="Waist Circumference (cm)"
                type="number"
                step="0.5"
                placeholder="e.g. 84"
                value={form.waist}
                onChange={(e) => setForm({ ...form, waist: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Chest (cm)"
                type="number"
                step="0.5"
                placeholder="e.g. 105"
                value={form.chest}
                onChange={(e) => setForm({ ...form, chest: e.target.value })}
              />
              <Input
                label="Arms (cm)"
                type="number"
                step="0.5"
                placeholder="e.g. 38.5"
                value={form.arms}
                onChange={(e) => setForm({ ...form, arms: e.target.value })}
              />
              <Input
                label="Hips (cm)"
                type="number"
                step="0.5"
                placeholder="e.g. 98"
                value={form.hips}
                onChange={(e) => setForm({ ...form, hips: e.target.value })}
              />
            </div>

            <Textarea
              label="Session or Progress Notes"
              rows={2}
              placeholder="e.g. Feeling energized, waist tighter, bench press up 2.5kg..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <Button
              type="submit"
              variant="lime"
              size="lg"
              isLoading={saving}
              className="w-full sm:w-auto"
            >
              Save Biometric Record
            </Button>
          </form>
        </div>
      )}

      {/* Interactive Weight Trend Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#c6ff3b]" />
            <h3 className="text-lg font-bold uppercase font-heading text-white">
              Weight &amp; Composition Trajectory
            </h3>
          </div>
          <span className="text-xs text-zinc-400">Past Logged Milestones</span>
        </div>

        {chartData.length > 0 ? (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#ff5a1f"
                  strokeWidth={3}
                  dot={{ fill: '#ff5a1f', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Weight (kg)"
                />
                <Line
                  type="monotone"
                  dataKey="bodyFat"
                  stroke="#c6ff3b"
                  strokeWidth={2}
                  dot={{ fill: '#c6ff3b', r: 3 }}
                  name="Body Fat %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-zinc-500">
            Log your first metric above to activate the visual progression graph.
          </div>
        )}
      </div>

      {/* Historical Logs Table */}
      <div className="rounded-3xl bg-[#141418] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-base font-bold uppercase font-heading text-white">
            Historical Measurement Logs
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-zinc-400 uppercase font-semibold">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Weight (kg)</th>
                <th className="p-4">Body Fat %</th>
                <th className="p-4">Chest</th>
                <th className="p-4">Waist</th>
                <th className="p-4">Arms</th>
                <th className="p-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {data?.records && data.records.length > 0 ? (
                data.records.map((rec: any) => (
                  <tr key={rec.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white whitespace-nowrap">{formatDate(rec.recorded_date)}</td>
                    <td className="p-4 text-[#ff5a1f] font-bold">{rec.weight} kg</td>
                    <td className="p-4 text-[#c6ff3b]">{rec.body_fat ? `${rec.body_fat}%` : '—'}</td>
                    <td className="p-4">{rec.chest ? `${rec.chest} cm` : '—'}</td>
                    <td className="p-4">{rec.waist ? `${rec.waist} cm` : '—'}</td>
                    <td className="p-4">{rec.arms ? `${rec.arms} cm` : '—'}</td>
                    <td className="p-4 text-zinc-400 max-w-xs truncate">{rec.notes || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-zinc-500">
                    No progress entries recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

