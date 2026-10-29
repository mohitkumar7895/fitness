'use client';

import React, { useEffect, useState } from 'react';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Calendar, Plus, Clock, MapPin, User, CheckCircle2 } from 'lucide-react';

export default function AppointmentsPage() {
  const { showToast } = useNotification();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    coach_id: '',
    title: '1-on-1 Biomechanics & Squat Audit',
    scheduled_at: '',
    duration_minutes: '60',
    type: 'PERSONAL_TRAINING',
    notes: '',
  });

  const loadData = async () => {
    try {
      const res = await fetch('/api/customer/appointments');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.assignedCoachId) {
          setForm((prev) => ({ ...prev, coach_id: json.assignedCoachId }));
        } else if (json.coaches && json.coaches.length > 0) {
          setForm((prev) => ({ ...prev, coach_id: json.coaches[0].id }));
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

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.coach_id || !form.scheduled_at) {
      showToast({ type: 'error', title: 'Missing Information', message: 'Coach and time are required.' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/customer/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Session Confirmed',
          message: 'Your coaching appointment has been reserved.',
        });
        setShowModal(false);
        loadData();
      } else {
        showToast({ type: 'error', title: 'Booking Error', message: 'Could not reserve session.' });
      }
    } catch {
      showToast({ type: 'error', title: 'Connection Error', message: 'Could not reach server.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading Appointments...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="orange">Coaching Calendar</Badge>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white font-heading mt-2">
            APPOINTMENTS &amp; SESSIONS
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Reserve dedicated 1-on-1 private coaching bays with your assigned Master Trainer.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowModal(!showModal)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {showModal ? 'Close Form' : 'Book New Session'}
        </Button>
      </div>

      {/* Booking Form */}
      {showModal && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141418] border-2 border-[#ff5a1f]/40 space-y-6 shadow-2xl">
          <h3 className="text-lg font-bold uppercase font-heading text-white">
            Schedule Coaching Session
          </h3>

          <form onSubmit={handleBook} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Select Coach"
                value={form.coach_id}
                onChange={(e) => setForm({ ...form, coach_id: e.target.value })}
                options={(data?.coaches || []).map((c: any) => ({
                  value: c.id,
                  label: `${c.name} (${c.title})`,
                }))}
              />

              <Input
                label="Appointment Date & Time"
                type="datetime-local"
                required
                value={form.scheduled_at}
                onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Session Focus / Topic"
                required
                placeholder="e.g. Squat Depth & Hip Mobility"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <Select
                label="Session Type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                options={[
                  { value: 'PERSONAL_TRAINING', label: '1-on-1 Personal Training' },
                  { value: 'CONSULTATION', label: 'Diet & Bloodwork Consultation' },
                  { value: 'ASSESSMENT', label: 'Biomechanical Movement Screen' },
                ]}
              />
            </div>

            <Textarea
              label="Session Notes for Coach (Optional)"
              rows={2}
              placeholder="e.g. Lower back feels tight after Tuesday deadlifts..."
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
              Confirm Reservation
            </Button>
          </form>
        </div>
      )}

      {/* Appointments List */}
      <div className="space-y-4">
        {data?.appointments && data.appointments.length > 0 ? (
          data.appointments.map((apt: any) => (
            <div
              key={apt.id}
              className="p-6 rounded-3xl bg-[#141418] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition-all shadow-xl"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="lime" className="text-[10px]">
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
                    Coach {apt.coach_name || 'Assigned Specialist'}
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    {apt.location || 'Main Fitness Studio'}
                  </span>
                </div>

                {apt.notes && (
                  <p className="text-xs text-zinc-400 italic pt-1">
                    Notes: {apt.notes}
                  </p>
                )}
              </div>

              <div className="shrink-0 flex items-center gap-2 self-start md:self-auto">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Duration</span>
                  <span className="text-sm font-bold text-white">{apt.duration_minutes} min</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center rounded-3xl bg-[#141418] border border-white/10 text-zinc-400">
            No scheduled appointments found. Click &quot;Book New Session&quot; above to schedule.
          </div>
        )}
      </div>
    </div>
  );
}

