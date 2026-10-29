'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';
import { Users, Eye, Dumbbell, Apple, AlertTriangle } from 'lucide-react';

export default function CoachClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  useEffect(() => {
    async function loadClients() {
      try {
        const res = await fetch('/api/coach/clients');
        if (res.ok) {
          const json = await res.json();
          setClients(json.clients || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadClients();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading Athlete Roster...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <Badge variant="lime">Athlete Roster</Badge>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-heading mt-2">
          ASSIGNED ATHLETES &amp; CLIENTS
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review your client health disclosures, biometric trends, and active program assignments.
        </p>
      </div>

      <div className="rounded-3xl bg-[#141418] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-zinc-400 uppercase font-semibold">
              <tr>
                <th className="p-4">Athlete</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Goal</th>
                <th className="p-4">Current Wt</th>
                <th className="p-4">Target Wt</th>
                <th className="p-4">Membership</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {clients.length > 0 ? (
                clients.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-white text-xs">
                          {c.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <p className="font-bold text-white leading-tight">{c.name}</p>
                          <span className="text-[10px] text-zinc-400">{c.gender || 'Athlete'} • {c.city || 'Metro'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-white">{c.email}</p>
                      <span className="text-zinc-500 text-[10px]">{c.phone || 'No phone'}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant="orange" className="text-[10px]">
                        {c.fitness_goal || 'General Fitness'}
                      </Badge>
                    </td>
                    <td className="p-4 font-bold text-white">
                      {c.latest_weight || c.current_weight || '—'} kg
                    </td>
                    <td className="p-4 text-[#c6ff3b] font-bold">
                      {c.target_weight || '—'} kg
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-white">{c.plan_name || 'Active Pass'}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedClient(c)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
                        >
                          View Intake
                        </button>
                        <Link href={`/coach/workout-plans?client=${c.id}`}>
                          <button className="px-3 py-1.5 rounded-lg bg-[#ff5a1f]/20 hover:bg-[#ff5a1f] text-[#ff5a1f] hover:text-white transition-all text-xs font-semibold cursor-pointer">
                            Workout
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    No athletes currently assigned to your roster.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Detail Intake Modal */}
      {selectedClient && (
        <Modal
          isOpen={Boolean(selectedClient)}
          onClose={() => setSelectedClient(null)}
          title={`Intake Disclosure: ${selectedClient.name}`}
          maxWidth="2xl"
        >
          <div className="space-y-6 pt-2 text-xs text-zinc-300">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/5">
              <div>
                <span className="text-zinc-500 uppercase block font-semibold">Height</span>
                <span className="text-base font-bold text-white">{selectedClient.height || '—'} cm</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase block font-semibold">Current Wt</span>
                <span className="text-base font-bold text-white">{selectedClient.current_weight || '—'} kg</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase block font-semibold">Target Wt</span>
                <span className="text-base font-bold text-[#c6ff3b]">{selectedClient.target_weight || '—'} kg</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase block font-semibold">Experience</span>
                <span className="text-base font-bold text-white">{selectedClient.fitness_experience || '—'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-zinc-400 uppercase font-bold block">Diet &amp; Nutrition Preferences:</span>
              <p className="p-3 rounded-xl bg-white/5 text-white">
                Preference: <strong className="text-[#c6ff3b]">{selectedClient.food_preference || 'Balanced'}</strong>
                {selectedClient.dietary_restrictions && (
                  <span className="block mt-1 text-zinc-400">Allergies/Restrictions: {selectedClient.dietary_restrictions}</span>
                )}
              </p>
            </div>

            {selectedClient.injuries && (
              <div className="space-y-2">
                <span className="text-rose-400 uppercase font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Disclosed Injuries &amp; Restrictions:
                </span>
                <p className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200">
                  {selectedClient.injuries}
                </p>
              </div>
            )}

            {selectedClient.notes && (
              <div className="space-y-2">
                <span className="text-zinc-400 uppercase font-bold block">Additional Client Notes:</span>
                <p className="p-3 rounded-xl bg-white/5 text-zinc-300">
                  {selectedClient.notes}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <Link href={`/coach/workout-plans?client=${selectedClient.id}`}>
                <Button variant="primary" size="sm">Assign Workout Plan</Button>
              </Link>
              <Link href={`/coach/diet-plans?client=${selectedClient.id}`}>
                <Button variant="lime" size="sm">Assign Diet Protocol</Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

