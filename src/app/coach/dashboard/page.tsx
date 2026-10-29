'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import {
  Users,
  Dumbbell,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Star,
} from 'lucide-react';

export default function CoachDashboardPage() {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await fetch('/api/coach/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
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

  const handleCompleteSession = async (id: string) => {
    try {
      const res = await fetch('/api/coach/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'COMPLETED' }),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Session Marked Completed',
          message: 'Client session credit updated.',
        });
        loadData();
      }
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Could not update session.' });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading Master Coach Command...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#18181f] via-[#121215] to-[#18181f] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <Badge variant="lime" className="text-[10px]">
            Master Trainer Portal
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-heading">
            COACH {user?.name?.toUpperCase() || 'DASHBOARD'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            {data?.coach?.title || 'Senior Biomechanics & Strength Specialist'} • Manage your assigned athletes, prescribe custom mesocycles, and audit progress.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/coach/workout-plans">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Create Workout
            </Button>
          </Link>
          <Link href="/coach/diet-plans">
            <Button variant="secondary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Assign Diet
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Assigned Athletes
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white font-heading">
              {data?.totalClients || 0}
            </span>
            <span className="text-xs text-zinc-500 font-semibold">Active Members</span>
          </div>
        </Card>

        <Card className="p-6 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Active Workout Plans
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#ff5a1f] font-heading">
              {data?.activeWorkoutPlans || 0}
            </span>
            <span className="text-xs text-zinc-500 font-semibold">Custom Protocols</span>
          </div>
        </Card>

        <Card className="p-6 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Coach Reputation Rating
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#c6ff3b] font-heading flex items-center gap-1">
              <Star className="w-6 h-6 fill-[#c6ff3b]" />
              {data?.coach?.rating || 4.95}
            </span>
            <span className="text-xs text-zinc-500 font-semibold">Verified</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Upcoming Sessions & Assigned Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#c6ff3b] tracking-wider block">
                  Calendar Schedule
                </span>
                <h3 className="text-xl font-bold uppercase text-white font-heading mt-0.5">
                  Upcoming 1-on-1 Sessions
                </h3>
              </div>
              <Link href="/coach/appointments">
                <Button variant="outline" size="sm">
                  View Full Schedule
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {data?.sessions && data.sessions.length > 0 ? (
                data.sessions.map((s: any) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="orange" className="text-[10px]">
                          {s.type}
                        </Badge>
                        <span className="text-xs text-zinc-400">
                          {formatDate(s.scheduled_at)}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white font-heading">
                        {s.title}
                      </h4>
                      <p className="text-xs text-zinc-300">
                        Athlete: <strong className="text-white">{s.customer_name}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCompleteSession(s.id)}
                        className="text-xs text-emerald-400 hover:text-white"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Complete
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500 py-6 text-center">
                  No upcoming sessions booked for this week.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Assigned Clients Quick Roster */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#ff5a1f] tracking-wider block">
                  Athlete Management
                </span>
                <h3 className="text-xl font-bold uppercase text-white font-heading mt-0.5">
                  Assigned Athletes
                </h3>
              </div>
              <Link href="/coach/clients">
                <Button variant="outline" size="sm">
                  All Clients
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {data?.clients && data.clients.length > 0 ? (
                data.clients.map((c: any) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-white text-xs">
                        {c.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-heading">
                          {c.name}
                        </h4>
                        <span className="text-[11px] text-zinc-400 block">
                          Goal: {c.fitness_goal || 'General Fitness'}
                        </span>
                      </div>
                    </div>

                    <Link href={`/coach/workout-plans?client=${c.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs text-[#c6ff3b]">
                        Split &rarr;
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500 py-6 text-center">
                  No athletes currently assigned.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

