'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { SITE_CONFIG } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  MessageSquare,
  Sparkles,
  X,
  Phone,
  CheckCircle2,
  Calendar,
  Flame,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingLeadWidget() {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [whatsappRedirectUrl, setWhatsappRedirectUrl] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    fitness_goal: 'Weight Loss & Shred',
    preferred_time: 'Morning (07:00 AM - 11:00 AM)',
  });

  // Listen to global open event from any button on any page
  useEffect(() => {
    const handleOpen = () => {
      setSubmitted(false);
      setErrorMsg('');
      setModalOpen(true);
    };
    window.addEventListener('open-vip-modal', handleOpen);
    return () => window.removeEventListener('open-vip-modal', handleOpen);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMsg('Please provide your name and WhatsApp/mobile number.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subject: '1-Day Free VIP Guest Pass Request',
          message: `Visitor requested 1-Day Free Pass. Goal: ${formData.fitness_goal}. Preferred Time: ${formData.preferred_time}.`,
          source: 'VIP_TRIAL_MODAL',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setWhatsappRedirectUrl(data.whatsappUrl || `https://wa.me/${SITE_CONFIG.whatsapp?.replace(/\D/g, '')}`);
      } else {
        setErrorMsg(data.error || 'Failed to submit. Please contact us directly.');
      }
    } catch {
      setErrorMsg('Network issue. Please connect with us directly on WhatsApp or Call.');
    } finally {
      setLoading(false);
    }
  };

  const directWhatsappUrl = `https://wa.me/${(SITE_CONFIG.whatsapp || '919876543210').replace(
    /\D/g,
    ''
  )}?text=${encodeURIComponent(
    'Hi FitLife Wellness! I am interested in exploring membership, training programs, and booking a club tour.'
  )}`;

  return (
    <>
      {/* Floating Action Pill Bar (Bottom Right) */}
      <div className="fixed bottom-5 right-4 sm:right-6 z-40 flex items-center gap-2.5">
        {/* Call Concierge Pill (Desktop/Tablet) */}
        <a
          href={`tel:${SITE_CONFIG.phone || '+919876543210'}`}
          className="hidden md:flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#141418]/90 hover:bg-[#1f1f26] border border-white/10 text-xs font-bold text-zinc-200 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:border-white/20"
          title="Direct Call to Front Desk"
        >
          <Phone className="w-4 h-4 text-[#c6ff3b]" />
          <span>Call Desk</span>
        </a>

        {/* WhatsApp Direct Chat Pill */}
        <a
          href={directWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black tracking-wide shadow-[0_8px_25px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-105 cursor-pointer"
          title="Instant WhatsApp Chat"
        >
          <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        {/* Claim Free VIP Pass Pulsing Button */}
        <button
          onClick={() => {
            setSubmitted(false);
            setErrorMsg('');
            setModalOpen(true);
          }}
          className="relative group flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#ff5a1f] to-[#ff7d47] text-white text-xs sm:text-sm font-black tracking-wide shadow-[0_8px_30px_rgba(255,90,31,0.45)] hover:shadow-[0_12px_40px_rgba(255,90,31,0.65)] hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <span className="absolute -top-2.5 -right-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#c6ff3b] text-black shadow-md animate-bounce">
            FREE PASS
          </span>
          <Sparkles className="w-4 h-4 fill-white/80" />
          <span>Claim VIP Pass</span>
        </button>
      </div>

      {/* High-Converting VIP Guest Pass Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#121215] border border-white/15 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden z-10 text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-60 h-60 bg-[#ff5a1f]/15 rounded-full blur-3xl pointer-events-none" />

              {!submitted ? (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <Badge variant="lime" className="text-[10px] uppercase font-black tracking-widest">
                      <Sparkles className="w-3 h-3" />
                      100% Complimentary Guest Access
                    </Badge>
                    <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-heading leading-tight">
                      CLAIM YOUR <span className="text-gradient-orange">1-DAY VIP PASS</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Experience our Eleiko competition platforms, infrared sauna suites & private 1-on-1 coach assessment. Valued at ₹1,999 — <strong>FREE for first-time guests</strong>.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikram Malhotra"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff5a1f] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                          WhatsApp / Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff5a1f] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          placeholder="e.g. vikram@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff5a1f] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                          Primary Fitness Goal
                        </label>
                        <select
                          value={formData.fitness_goal}
                          onChange={(e) => setFormData({ ...formData, fitness_goal: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a20] border border-white/15 text-xs text-white focus:outline-none focus:border-[#ff5a1f] transition-colors"
                        >
                          <option value="Weight Loss & Shred">Weight Loss & Shred</option>
                          <option value="Muscle Building Elite">Muscle Building Elite</option>
                          <option value="Total Body Transformation">Total Body Transformation</option>
                          <option value="VIP Personal Coaching">VIP Personal Coaching</option>
                          <option value="Strength & Power">Strength & Power</option>
                          <option value="Mobility & Longevity">Mobility & Longevity</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                          Preferred Time Slot
                        </label>
                        <select
                          value={formData.preferred_time}
                          onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a20] border border-white/15 text-xs text-white focus:outline-none focus:border-[#ff5a1f] transition-colors"
                        >
                          <option value="Morning (07:00 AM - 11:00 AM)">Morning (07:00 AM - 11:00 AM)</option>
                          <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                          <option value="Evening (05:00 PM - 09:00 PM)">Evening (05:00 PM - 09:00 PM)</option>
                          <option value="Flexible">Any Time Today</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full justify-center text-sm font-black shadow-lg"
                        disabled={loading}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        {loading ? 'Reserving Your Pass...' : 'Claim 1-Day Free Pass'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-400 pt-1">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#c6ff3b]" />
                        Zero Obligation
                      </span>
                      <span>•</span>
                      <span>Instant SMS & WhatsApp Confirmation</span>
                    </div>
                  </form>
                </div>
              ) : (
                /* Success Screen with Immediate WhatsApp Connect */
                <div className="space-y-6 text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div className="space-y-2">
                    <Badge variant="lime" className="text-[10px] uppercase font-black">
                      Pass Reserved Successfully
                    </Badge>
                    <h3 className="text-2xl sm:text-3xl font-black uppercase font-heading text-white">
                      WELCOME TO <span className="text-gradient-orange">FITLIFE</span>!
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 max-w-sm mx-auto leading-relaxed">
                      Thank you, <strong>{formData.name}</strong>. Your 1-Day VIP Guest Pass has been booked for <strong>{formData.preferred_time}</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-left">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Pass Type:</span>
                      <span className="font-bold text-[#c6ff3b]">1-Day Full Club VIP Guest Pass</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Target Focus:</span>
                      <span className="font-bold text-white">{formData.fitness_goal}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Club Location:</span>
                      <span className="font-bold text-zinc-200">{SITE_CONFIG.address}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <a
                      href={whatsappRedirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-black tracking-wide shadow-[0_8px_30px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-[1.02]"
                    >
                      <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                      <span>Open WhatsApp to Confirm Time</span>
                    </a>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setModalOpen(false)}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      Done / Close Window
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
