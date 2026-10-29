'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { User, ShieldCheck, Save, Activity, Apple, Lock } from 'lucide-react';

export default function MyProfilePage() {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    height: '',
    current_weight: '',
    target_weight: '',
    fitness_goal: '',
    food_preference: '',
    dietary_restrictions: '',
    injuries: '',
    notes: '',
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/customer/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            const p = data.profile;
            setFormData({
              name: p.name || '',
              phone: p.phone || '',
              city: p.city || '',
              height: p.height ? String(p.height) : '',
              current_weight: p.current_weight ? String(p.current_weight) : '',
              target_weight: p.target_weight ? String(p.target_weight) : '',
              fitness_goal: p.fitness_goal || '',
              food_preference: p.food_preference || '',
              dietary_restrictions: p.dietary_restrictions || '',
              injuries: p.injuries || '',
              notes: p.notes || '',
            });
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your biometric parameters and contact info have been saved.',
        });
      } else {
        showToast({
          type: 'error',
          title: 'Update Failed',
          message: 'Could not update profile details.',
        });
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Could not connect to database.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Loading Athlete Profile...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Badge variant="orange">Athlete Account</Badge>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-heading mt-2">
          MY PROFILE &amp; BIOMETRICS
        </h1>
        <p className="text-xs text-zinc-400">
          Keep your metrics updated so your coach can refine your weekly progressive volume and calories.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Details */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <User className="w-5 h-5 text-[#ff5a1f]" />
            <h2 className="text-lg font-bold uppercase font-heading text-white">
              Personal Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Contact / WhatsApp"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <Input
            label="Home City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>

        {/* Biometrics */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Activity className="w-5 h-5 text-[#c6ff3b]" />
            <h2 className="text-lg font-bold uppercase font-heading text-white">
              Biometrics &amp; Targets
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Height (cm)"
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            />
            <Input
              label="Current Weight (kg)"
              type="number"
              value={formData.current_weight}
              onChange={(e) => setFormData({ ...formData, current_weight: e.target.value })}
            />
            <Input
              label="Target Goal Weight (kg)"
              type="number"
              value={formData.target_weight}
              onChange={(e) => setFormData({ ...formData, target_weight: e.target.value })}
            />
          </div>

          <Select
            label="Primary Goal"
            value={formData.fitness_goal}
            onChange={(e) => setFormData({ ...formData, fitness_goal: e.target.value })}
            options={[
              { value: 'Weight Loss & Shred', label: 'Weight Loss & Shred' },
              { value: 'Hypertrophy & Muscle Building', label: 'Hypertrophy & Muscle Building' },
              { value: 'Body Transformation', label: 'Body Transformation (Recomp)' },
              { value: 'Strength & Powerlifting', label: 'Strength & Powerlifting' },
              { value: 'Mobility & Longevity', label: 'Mobility & Longevity' },
            ]}
          />
        </div>

        {/* Health & Clinical Nutrition */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141418] border border-white/10 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Apple className="w-5 h-5 text-[#ff5a1f]" />
            <h2 className="text-lg font-bold uppercase font-heading text-white">
              Health, Injuries &amp; Nutrition Preferences
            </h2>
          </div>

          <Select
            label="Food Preference"
            value={formData.food_preference}
            onChange={(e) => setFormData({ ...formData, food_preference: e.target.value })}
            options={[
              { value: 'High Protein Non-Veg', label: 'High Protein Non-Veg' },
              { value: 'Vegetarian with Dairy & Whey', label: 'Vegetarian with Dairy & Whey' },
              { value: '100% Plant-Based Vegan', label: '100% Plant-Based Vegan' },
              { value: 'Keto / Low Carb', label: 'Keto / Low Carbohydrate' },
              { value: 'Pescatarian', label: 'Pescatarian' },
            ]}
          />

          <Input
            label="Dietary Restrictions / Allergies"
            value={formData.dietary_restrictions}
            onChange={(e) => setFormData({ ...formData, dietary_restrictions: e.target.value })}
          />

          <Textarea
            label="Injuries or Joint Restrictions"
            rows={3}
            value={formData.injuries}
            onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={saving}
          rightIcon={<Save className="w-4 h-4" />}
        >
          Save Profile Updates
        </Button>
      </form>
    </div>
  );
}

