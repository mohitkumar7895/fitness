'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { calculateBMI, getBMICategory, formatCurrency } from '@/lib/utils';
import {
  Dumbbell,
  Apple,
  TrendingUp,
  Calendar,
  Activity,
  UserCheck,
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [workout, setWorkout] = useState<any>(null);
  const [diet, setDiet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, wRes, dRes] = await Promise.all([
          fetch('/api/customer/profile'),
          fetch('/api/customer/workouts'),
          fetch('/api/customer/diet'),
        ]);

        if (pRes.ok) {
          const pData = await pRes.json();
          setProfile(pData.profile);
        }
        if (wRes.ok) {
          const wData = await wRes.json();
          setWorkout(wData);
        }
        if (dRes.ok) {
          const dData = await dRes.json();
          setDiet(dData);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const bmi = profile?.height && profile?.current_weight
    ? calculateBMI(profile.current_weight, profile.height)
    : 22.4;

  const bmiCat = getBMICategory(bmi);

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#18181c] via-[#121215] to-[#18181c] border border-white/10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff5a1f]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="orange" className="text-[10px]">
                <Flame className="w-3.5 h-3.5 fill-[#ff5a1f]" /> Member Command Center
              </Badge>
              {profile?.membership_status === 'ACTIVE' && (
                <Badge variant="lime" className="text-[10px]">
                  {profile?.plan_name || 'Active Membership'}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-heading">
              WELCOME BACK, {user?.name?.split(' ')[0] || 'ATHLETE'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Consistency creates destiny. Today is a high-yield training window. Review your assigned regimen below.
            </p>
          </div>

          {/* Assigned Coach Pill */}
          {profile?.coach_name && (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/15 overflow-hidden relative">
                {profile.coach_avatar ? (
                  <img src={profile.coach_avatar} alt={profile.coach_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-white">C</div>
                )}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#ff5a1f] tracking-wider block">
                  Assigned Coach
                </span>
                <p className="text-sm font-bold text-white font-heading">
                  {profile.coach_name}
                </p>
                <p className="text-[11px] text-zinc-400">
                  {profile.coach_title || 'Master Trainer'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Current Weight
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white font-heading">
              {profile?.current_weight || 82}
            </span>
            <span className="text-xs text-zinc-500 font-bold">KG</span>
          </div>
          <span className="text-[10px] text-emerald-400 block pt-1">
            Target: {profile?.target_weight || 75} KG
          </span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Body Mass Index (BMI)
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white font-heading">
              {bmi}
            </span>
          </div>
          <span className={`text-[10px] font-bold block pt-1 ${bmiCat.color}`}>
            {bmiCat.label}
          </span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Daily Calorie Target
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-[#ff5a1f] font-heading">
              {diet?.dietPlan?.daily_calories || 2400}
            </span>
            <span className="text-xs text-zinc-500 font-bold">KCAL</span>
          </div>
          <span className="text-[10px] text-zinc-400 block pt-1">
            Protein: {diet?.dietPlan?.target_protein || 180}g
          </span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Primary Target
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-[#c6ff3b] font-heading truncate">
              {profile?.fitness_goal || 'Recomposition'}
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 block pt-1">
            {profile?.training_mode || 'Hybrid In-Club'}
          </span>
        </Card>
      </div>

      {/* Main Grid: Workout & Diet Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Workout Blueprint */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-[#141418] border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#ff5a1f] tracking-widest block">
                  Prescribed Workout Plan
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-heading mt-0.5">
                  {workout?.workoutPlan?.title || 'Elite Upper/Lower Hypertrophy'}
                </h2>
              </div>
              <Link href="/my-workouts">
                <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Full Split
                </Button>
              </Link>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              {workout?.workoutPlan?.description || 'Engineered around progressive mechanical tension and compound overload.'}
            </p>

            {/* Exercise preview items */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold text-zinc-300 block">
                Session Exercises:
              </span>
              {workout?.exercises && workout.exercises.length > 0 ? (
                <div className="space-y-2">
                  {workout.exercises.slice(0, 4).map((ex: any, idx: number) => (
                    <div
                      key={ex.id || idx}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#ff5a1f]/10 text-[#ff5a1f] flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{ex.exercise_name}</p>
                          <span className="text-[10px] text-zinc-400">
                            {ex.day_of_week} • {ex.target_muscle}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#c6ff3b]">
                          {ex.sets} sets &times; {ex.reps}
                        </span>
                        {ex.weight_kg && (
                          <span className="text-[10px] text-zinc-400 block">
                            @{ex.weight_kg}kg
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/5 text-center text-xs text-zinc-400">
                  Your coach is currently tailoring your custom mesocycle split.
                </div>
              )}
            </div>

            <div className="pt-2">
              <Link href="/my-workouts" className="block w-full">
                <Button variant="primary" size="md" className="w-full">
                  Open Workout Session Tracker
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Nutrition Blueprint & Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-[#141418] border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#c6ff3b] tracking-widest block">
                  Diet Protocol
                </span>
                <h3 className="text-xl font-bold uppercase text-white font-heading mt-0.5">
                  {diet?.dietPlan?.title || 'Metabolic Recomp Diet'}
                </h3>
              </div>
              <Link href="/my-diet">
                <Button variant="outline" size="sm">
                  View Meals
                </Button>
              </Link>
            </div>

            {/* Macro bars */}
            <div className="p-4 rounded-2xl bg-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Target Calories</span>
                <span className="font-bold text-white">
                  {diet?.dietPlan?.daily_calories || 2400} kcal
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/10">
                <div className="p-2 rounded-xl bg-black/40">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Protein</span>
                  <span className="text-sm font-bold text-[#c6ff3b]">
                    {diet?.dietPlan?.target_protein || 180}g
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-black/40">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Carbs</span>
                  <span className="text-sm font-bold text-white">
                    {diet?.dietPlan?.target_carbs || 240}g
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-black/40">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Fats</span>
                  <span className="text-sm font-bold text-[#ff5a1f]">
                    {diet?.dietPlan?.target_fat || 65}g
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions List */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-xs uppercase font-bold text-zinc-400 block">
                Quick Actions:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/progress">
                  <Button variant="secondary" size="sm" className="w-full text-xs">
                    Log Weight
                  </Button>
                </Link>
                <Link href="/appointments">
                  <Button variant="secondary" size="sm" className="w-full text-xs">
                    Book Session
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

