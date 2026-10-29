'use client';

import React, { useEffect, useState } from 'react';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Calendar, User, Phone, Mail, CheckCircle2, XCircle } from 'lucide-react';

export default function CoachAppointmentsPage() {
  const { showToast } = useNotification();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const res = await fetch('/api/coach/appointments');
      if (res.ok) {
        const json = await res.json();
        setAppointments(json.appointments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/coach/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: `Session ${status}`,
          message: `Appointment record updated to ${status}.`,
        });
        loadAppointments();
      }
    } catch {
      showToast({ type: 'error', title: 'Error', message: 'Could not update session.' });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading Coach Calendar...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <Badge variant="lime">Schedule Management</Badge>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-heading mt-2">
          SESSION APPOINTMENTS &amp; CALENDAR
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review your 1-on-1 private bay bookings, client consultation requests, and movement screens.
        </p>
      </div>

      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((apt) => (
            <div
              key={apt.id}
              className="p-6 rounded-3xl bg-[#141418] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/20 transition-all shadow-xl"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      apt.status === 'COMPLETED'
                        ? 'lime'
                        : apt.status === 'CANCELLED'
                        ? 'red'
                        : 'orange'
                    }
                    className="text-[10px]"
                  >
                    {apt.status}
                  </Badge>
                  <span className="text-xs text-zinc-400">{apt.type}</span>
                </div>

                <h3 className="text-lg font-bold font-heading text-white">
                  {apt.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300">
                  <span className="flex items-center gap-1.5 text-white font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-[#ff5a1f]" />
                    {formatDate(apt.scheduled_at)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#c6ff3b]" />
                    Athlete: <strong className="text-white ml-1">{apt.customer_name}</strong>
                  </span>
                  {apt.customer_phone && (
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Phone className="w-3 h-3 text-zinc-500" />
                      {apt.customer_phone}
                    </span>
                  )}
                </div>

                {apt.notes && (
                  <p className="text-xs text-zinc-400 italic pt-1">
                    Athlete Notes: &ldquo;{apt.notes}&rdquo;
                  </p>
                )}
              </div>

              {/* Status Actions */}
              <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
                {apt.status !== 'COMPLETED' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => updateStatus(apt.id, 'COMPLETED')}
                    className="text-xs text-emerald-400 hover:text-white"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Done
                  </Button>
                )}

                {apt.status !== 'CANCELLED' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateStatus(apt.id, 'CANCELLED')}
                    className="text-xs text-rose-400 hover:text-white hover:bg-rose-500/10"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center rounded-3xl bg-[#141418] border border-white/10 text-zinc-400">
            No session bookings found in your schedule.
          </div>
        )}
      </div>
    </div>
  );
}

