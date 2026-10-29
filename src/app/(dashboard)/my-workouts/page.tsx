'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Dumbbell, Clock, Flame, CheckCircle, Circle, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MyWorkoutsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const res = await fetch('/api/customer/workouts');
        if (res.ok) {
          const json = await res.json();
          setData(json);
          // Auto select first day present
          if (json.exercises && json.exercises.length > 0) {
            setSelectedDay(json.exercises[0].day_of_week);
          }
        }
      } catch (err) {
        console.error('Error fetching workouts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWorkouts();
  }, []);

  const toggleComplete = (id: string) => {
    setCompleted((prev) => {
      const nextState = !prev[id];
      if (nextState) {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.8 },
        });
      }
      return { ...prev, [id]: nextState };
    });
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading Prescribed Workouts...</div>;
  }

  const days = Array.from(new Set(data?.exercises?.map((e: any) => e.day_of_week) || [])) as string[];
  const currentExercises = data?.exercises?.filter((e: any) => e.day_of_week === selectedDay) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="orange">Weekly Split</Badge>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white font-heading mt-2">
            {data?.workoutPlan?.title || 'My Assigned Workout Plan'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Supervised by {data?.workoutPlan?.coach_name || 'Master Coach'} • {data?.workoutPlan?.duration_weeks || 8} Weeks Mesocycle
          </p>
        </div>
      </div>

      {/* Days Tabs */}
      {days.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedDay === day
                  ? 'bg-[#ff5a1f] text-white shadow-[0_0_15px_rgba(255,90,31,0.4)]'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      )}

      {/* Exercises List for Selected Day */}
      <div className="space-y-4">
        {currentExercises.length > 0 ? (
          currentExercises.map((ex: any, idx: number) => {
            const isDone = completed[ex.id];

            return (
              <div
                key={ex.id}
                className={`p-6 rounded-3xl transition-all duration-300 border ${
                  isDone
                    ? 'bg-[#121215]/60 border-emerald-500/30 opacity-75'
                    : 'bg-[#141418] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Checkbox & Name */}
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleComplete(ex.id)}
                      className="mt-1 text-zinc-500 hover:text-[#c6ff3b] transition-colors cursor-pointer"
                    >
                      {isDone ? (
                        <CheckCircle className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-zinc-500">#{idx + 1}</span>
                        <h3 className={`text-lg font-bold font-heading text-white ${isDone ? 'line-through text-zinc-400' : ''}`}>
                          {ex.exercise_name}
                        </h3>
                        <Badge variant="zinc" className="text-[10px]">
                          {ex.target_muscle}
                        </Badge>
                      </div>

                      <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed">
                        {ex.instructions}
                      </p>

                      {ex.notes && (
                        <p className="text-xs text-[#ff5a1f] mt-1 font-semibold">
                          Coach Note: {ex.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Sets, Reps, Rest, Weight */}
                  <div className="flex items-center gap-6 text-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                    <div className="px-3">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 block">Sets</span>
                      <span className="text-xl font-black text-white font-heading">{ex.sets}</span>
                    </div>

                    <div className="px-3 border-x border-white/10">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 block">Reps</span>
                      <span className="text-xl font-black text-[#c6ff3b] font-heading">{ex.reps}</span>
                    </div>

                    <div className="px-3 border-r border-white/10">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 block">Rest</span>
                      <span className="text-sm font-bold text-zinc-300">{ex.rest_seconds}s</span>
                    </div>

                    {ex.weight_kg && (
                      <div className="px-3">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 block">Load</span>
                        <span className="text-xl font-black text-[#ff5a1f] font-heading">{ex.weight_kg}kg</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-3xl bg-[#141418] border border-white/10 text-zinc-400">
            No exercises scheduled for {selectedDay}. Rest and recover!
          </div>
        )}
      </div>
    </div>
  );
}

