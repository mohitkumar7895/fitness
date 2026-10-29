'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Dumbbell, Plus, Trash2, CheckCircle2 } from 'lucide-react';

function CoachWorkoutPlansInner() {
  const searchParams = useSearchParams();
  const { showToast } = useNotification();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: 'Custom Hypertrophy Mesocycle',
    customer_id: searchParams.get('client') || '',
    goal: 'Hypertrophy & Symmetry',
    duration_weeks: '8',
    level: 'Intermediate',
    description: '4-day upper/lower split focusing on mechanical tension and compound overload.',
  });

  const [exercisesList, setExercisesList] = useState<any[]>([
    { exercise_id: 'ex_01', day_of_week: 'Monday', sets: 4, reps: '6-8', rest_seconds: 120, weight_kg: 90, notes: 'Full depth' },
    { exercise_id: 'ex_03', day_of_week: 'Tuesday', sets: 4, reps: '8-10', rest_seconds: 90, weight_kg: 30, notes: 'Control eccentric' },
  ]);

  const loadData = async () => {
    try {
      const res = await fetch('/api/coach/workout-plans');
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

  const addExerciseRow = () => {
    setExercisesList((prev) => [
      ...prev,
      { exercise_id: data?.exercises?.[0]?.id || 'ex_01', day_of_week: 'Monday', sets: 3, reps: '10-12', rest_seconds: 60, weight_kg: 20, notes: '' },
    ]);
  };

  const removeExerciseRow = (index: number) => {
    setExercisesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.customer_id) {
      showToast({ type: 'error', title: 'Missing Info', message: 'Title and athlete selection required.' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/coach/workout-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          exercises: exercisesList,
        }),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Plan Assigned',
          message: 'Workout blueprint has been dispatched to athlete portal.',
        });
        setShowModal(false);
        loadData();
      } else {
        showToast({ type: 'error', title: 'Save Failed', message: 'Could not create plan.' });
      }
    } catch {
      showToast({ type: 'error', title: 'Network Error', message: 'Could not reach server.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading Workout Builder...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="lime">Prescription Engine</Badge>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white font-heading mt-2">
            PRESCRIBED WORKOUT PLANS
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Build and assign periodized mesocycles, exercise parameters, and load progressions.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create New Plan
        </Button>
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.plans && data.plans.length > 0 ? (
          data.plans.map((p: any) => (
            <div
              key={p.id}
              className="p-6 rounded-3xl bg-[#141418] border border-white/10 space-y-4 hover:border-white/20 transition-all shadow-xl"
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
                  {p.level}
                </Badge>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {p.description}
              </p>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                <span>Duration: <strong className="text-white">{p.duration_weeks} Weeks</strong></span>
                <span>Goal: <strong className="text-[#c6ff3b]">{p.goal}</strong></span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-12 text-center rounded-3xl bg-[#141418] border border-white/10 text-zinc-400">
            No custom workout plans created yet. Click &quot;Create New Plan&quot; to build your first mesocycle.
          </div>
        )}
      </div>

      {/* Create Workout Plan Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create &amp; Prescribe Workout Plan"
        maxWidth="4xl"
      >
        <form onSubmit={handleCreatePlan} className="space-y-6 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Goal"
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
            />
            <Input
              label="Duration (Weeks)"
              type="number"
              value={form.duration_weeks}
              onChange={(e) => setForm({ ...form, duration_weeks: e.target.value })}
            />
            <Select
              label="Experience Level"
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              options={[
                { value: 'Beginner', label: 'Beginner' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Advanced Athlete', label: 'Advanced Athlete' },
              ]}
            />
          </div>

          <Textarea
            label="Plan Overview &amp; Instructions"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {/* Exercise Builder Section */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-white tracking-wider">
                Workout Exercise Matrix:
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExerciseRow}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Movement
              </Button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {exercisesList.map((row, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/5 grid grid-cols-12 gap-2 items-center text-xs">
                  <div className="col-span-4">
                    <select
                      value={row.exercise_id}
                      onChange={(e) => {
                        const val = e.target.value;
                        setExercisesList((prev) => prev.map((item, i) => i === idx ? { ...item, exercise_id: val } : item));
                      }}
                      className="w-full bg-[#18181b] border border-white/10 p-2 rounded-lg text-white text-xs"
                    >
                      {(data?.exercises || []).map((ex: any) => (
                        <option key={ex.id} value={ex.id}>{ex.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <select
                      value={row.day_of_week}
                      onChange={(e) => {
                        const val = e.target.value;
                        setExercisesList((prev) => prev.map((item, i) => i === idx ? { ...item, day_of_week: val } : item));
                      }}
                      className="w-full bg-[#18181b] border border-white/10 p-2 rounded-lg text-white text-xs"
                    >
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-1">
                    <input
                      type="number"
                      placeholder="Sets"
                      value={row.sets}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setExercisesList((prev) => prev.map((item, i) => i === idx ? { ...item, sets: val } : item));
                      }}
                      className="w-full bg-[#18181b] border border-white/10 p-2 rounded-lg text-white text-xs text-center"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Reps (e.g. 8-10)"
                      value={row.reps}
                      onChange={(e) => {
                        const val = e.target.value;
                        setExercisesList((prev) => prev.map((item, i) => i === idx ? { ...item, reps: val } : item));
                      }}
                      className="w-full bg-[#18181b] border border-white/10 p-2 rounded-lg text-white text-xs text-center"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Load kg"
                      value={row.weight_kg}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setExercisesList((prev) => prev.map((item, i) => i === idx ? { ...item, weight_kg: val } : item));
                      }}
                      className="w-full bg-[#18181b] border border-white/10 p-2 rounded-lg text-white text-xs text-center"
                    />
                  </div>

                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeExerciseRow(idx)}
                      className="text-zinc-500 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <Button type="button" variant="ghost" size="md" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={saving}>
              Save &amp; Assign Blueprint
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function CoachWorkoutPlansPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-zinc-400">
          <p className="text-xs uppercase tracking-widest font-bold">Loading Workout Protocol Builder...</p>
        </div>
      }
    >
      <CoachWorkoutPlansInner />
    </React.Suspense>
  );
}
