'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Apple, Utensils, Flame, Clock, CheckCircle2 } from 'lucide-react';

export default function MyDietPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDiet() {
      try {
        const res = await fetch('/api/customer/diet');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching diet:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDiet();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading Prescribed Diet Protocol...</div>;
  }

  const plan = data?.dietPlan;
  const meals = data?.meals || [];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <Badge variant="lime">Metabolic Fuel Plan</Badge>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-heading mt-2">
          {plan?.title || 'My Assigned Nutrition Blueprint'}
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Supervised by {plan?.coach_name || 'Clinical Dietitian'} • Tailored to your basal metabolic rate
        </p>
      </div>

      {/* Daily Macro Targets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Total Calories
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white font-heading">
              {plan?.daily_calories || 2400}
            </span>
            <span className="text-xs text-zinc-500 font-bold">KCAL</span>
          </div>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Protein Target
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-[#c6ff3b] font-heading">
              {plan?.target_protein || 180}
            </span>
            <span className="text-xs text-zinc-500 font-bold">GRAMS</span>
          </div>
          <span className="text-[10px] text-zinc-400 block pt-1">High Bioavailability</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Carbohydrates
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white font-heading">
              {plan?.target_carbs || 240}
            </span>
            <span className="text-xs text-zinc-500 font-bold">GRAMS</span>
          </div>
          <span className="text-[10px] text-zinc-400 block pt-1">Complex Glycogen</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Healthy Fats
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-[#ff5a1f] font-heading">
              {plan?.target_fat || 65}
            </span>
            <span className="text-xs text-zinc-500 font-bold">GRAMS</span>
          </div>
          <span className="text-[10px] text-zinc-400 block pt-1">Hormonal Support</span>
        </Card>
      </div>

      {/* Daily Meals Breakdown */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold uppercase font-heading text-white">
          DAILY MEAL STRUCTURE &amp; TIMING
        </h2>

        {meals.map((meal: any, idx: number) => (
          <div
            key={meal.id || idx}
            className="p-6 sm:p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-6 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ff5a1f]/10 text-[#ff5a1f] flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">
                    {meal.meal_type}
                  </h3>
                  <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#c6ff3b]" />
                    {meal.time_of_day}
                  </p>
                </div>
              </div>
            </div>

            {meal.instructions && (
              <p className="text-xs text-zinc-400 italic bg-white/5 p-3 rounded-xl">
                &ldquo;{meal.instructions}&rdquo;
              </p>
            )}

            {/* Food Items List */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-zinc-300 block">
                Prescribed Ingredients:
              </span>
              <div className="divide-y divide-white/5">
                {meal.items && meal.items.length > 0 ? (
                  meal.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="py-3 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#c6ff3b] shrink-0" />
                        <span className="font-semibold text-white">{item.name}</span>
                        <span className="text-zinc-500 font-mono">({item.portion})</span>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <span className="text-zinc-400">{item.calories} kcal</span>
                        <span className="font-bold text-[#c6ff3b]">{item.protein}g P</span>
                        <span className="text-zinc-400 hidden sm:inline">{item.carbs}g C</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 py-2">Whole food nutrition guidelines apply.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

