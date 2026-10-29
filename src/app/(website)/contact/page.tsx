'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { SITE_CONFIG } from '@/lib/constants';
import { useNotification } from '@/context/NotificationContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  CheckCircle2,
  Send,
} from 'lucide-react';

export default function ContactPage() {
  const { showToast } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Enquiry',
    fitness_goal: 'Fat Loss & Recomposition',
    preferred_time: 'Morning (07:00 AM - 11:00 AM)',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'CONTACT_PAGE',
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        showToast({
          type: 'success',
          title: 'Consultation Request Sent',
          message: 'Our Master Coach concierge will connect with you via WhatsApp/call within 2 hours.',
        });
      } else {
        showToast({
          type: 'error',
          title: 'Submission Failed',
          message: 'Please verify your details and try again.',
        });
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Network Error',
        message: 'Unable to reach the server. Please call or WhatsApp us directly.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="lime">
            VIP Concierge & Enquiries
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight font-heading">
            CONNECT WITH <span className="text-gradient-orange">FITLIFE</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">
            Book a private sanctuary tour, reserve a master biomechanical assessment, or enquire regarding corporate memberships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Info Cards & WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-6 shadow-xl">
              <h3 className="text-xl font-bold uppercase font-heading text-white">
                SANCTUARY DETAILS
              </h3>

              <div className="space-y-4 text-sm text-zinc-300">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#ff5a1f] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Location</span>
                    <span className="text-xs text-zinc-400">{SITE_CONFIG.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <Phone className="w-5 h-5 text-[#ff5a1f] shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Phone</span>
                    <span className="text-xs text-zinc-400">{SITE_CONFIG.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <Mail className="w-5 h-5 text-[#ff5a1f] shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Concierge Email</span>
                    <span className="text-xs text-zinc-400">{SITE_CONFIG.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-[#c6ff3b] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Club Hours</span>
                    <span className="text-xs text-zinc-400">{SITE_CONFIG.workingHours}</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-4 border-t border-white/10">
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp.replace('+', '')}?text=Hello%20FitLife%2C%20I%20would%20like%20to%20schedule%20a%20private%20tour.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all text-xs font-bold uppercase tracking-wider"
                >
                  <MessageSquare className="w-4 h-4" />
                  Instant WhatsApp Concierge
                </a>
              </div>
            </div>

            {/* Google Maps Visual Frame */}
            <div className="rounded-3xl overflow-hidden border border-white/10 aspect-video relative bg-[#121215]">
              <iframe
                title="FitLife Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14008.11487834578!2d77.0864!3d28.4682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18e244837517%3A0x6a1656b85093f18e!2sGolf%20Course%20Road!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 filter invert contrast-125 opacity-80"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column: Contact & Lead Form */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-8 md:p-10 rounded-3xl bg-[#141418] border border-white/10 space-y-6 shadow-2xl">
              <div>
                <h3 className="text-2xl font-bold uppercase font-heading text-white">
                  REQUEST A CONSULTATION
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Complete the form below to receive a bespoke callback and trial credentials.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white font-heading">
                    We Have Received Your Request
                  </h4>
                  <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                    Our Master Coach concierge has been notified. You will receive a personal message or call within 2 hours.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: 'General Enquiry',
                        fitness_goal: 'Fat Loss & Recomposition',
                        preferred_time: 'Morning (07:00 AM - 11:00 AM)',
                        message: '',
                      });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      required
                      placeholder="e.g. Liam Sterling"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      required
                      placeholder="liam@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Mobile / WhatsApp Number"
                      required
                      placeholder="+91 98765 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <Select
                      label="Primary Fitness Ambition"
                      value={formData.fitness_goal}
                      onChange={(e) => setFormData({ ...formData, fitness_goal: e.target.value })}
                      options={[
                        { value: 'Fat Loss & Recomposition', label: 'Fat Loss & Recomposition' },
                        { value: 'Hypertrophy & Muscle Building', label: 'Hypertrophy & Muscle Building' },
                        { value: '1-on-1 Personal Coaching', label: '1-on-1 Personal Coaching' },
                        { value: 'Strength & Olympic Lifting', label: 'Strength & Olympic Lifting' },
                        { value: 'Joint Mobility & Longevity', label: 'Joint Mobility & Longevity' },
                      ]}
                    />
                  </div>

                  <Select
                    label="Preferred Consultation Time"
                    value={formData.preferred_time}
                    onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                    options={[
                      { value: 'Morning (07:00 AM - 11:00 AM)', label: 'Morning (07:00 AM - 11:00 AM)' },
                      { value: 'Afternoon (12:00 PM - 04:00 PM)', label: 'Afternoon (12:00 PM - 04:00 PM)' },
                      { value: 'Evening (05:00 PM - 09:00 PM)', label: 'Evening (05:00 PM - 09:00 PM)' },
                    ]}
                  />

                  <Textarea
                    label="Message / Health Goals"
                    required
                    rows={4}
                    placeholder="Tell us about your previous fitness experience, current weight, or any injuries..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={loading}
                    className="w-full"
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Submit Consultation Request
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

