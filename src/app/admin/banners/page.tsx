'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  Flame,
  Layout,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { useNotification } from '@/context/NotificationContext';
import { Button } from '@/components/ui/Button';

interface PageSection {
  id: string;
  page_slug: string;
  section_key: string;
  heading: string;
  subheading: string;
  badge?: string;
  primary_cta_text?: string;
  primary_cta_link?: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;
  is_enabled: boolean | number;
  display_order: number;
}

export default function AdminHomepageBuilderPage() {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings
  const [heroHeading, setHeroHeading] = useState('BUILD YOUR STRONGER SELF.');
  const [heroSubheading, setHeroSubheading] = useState('The standard for modern luxury fitness. Bespoke hypertrophy programming, precision clinical nutrition, and elite coach-led body transformations.');
  const [announcementText, setAnnouncementText] = useState('EXCLUSIVE: 50% Off First Month Elite Coaching Pass • Limited to 20 Athletes');
  const [announcementLink, setAnnouncementLink] = useState('/membership');
  const [heroCtaPrimary, setHeroCtaPrimary] = useState('Explore Programs');
  const [heroCtaSecondary, setHeroCtaSecondary] = useState('Start Your Transformation');

  // Dynamic sections
  const [sections, setSections] = useState<PageSection[]>([
    { id: 'sec_hero', page_slug: 'home', section_key: 'hero', heading: 'BUILD YOUR STRONGER SELF.', subheading: 'Elite hypertrophy and body transformation club.', badge: 'ELITE ATHLETICS', is_enabled: 1, display_order: 1 },
    { id: 'sec_stats', page_slug: 'home', section_key: 'stats', heading: 'Verified Performance Statistics', subheading: 'Our metrics speak louder than words.', badge: 'BY THE NUMBERS', is_enabled: 1, display_order: 2 },
    { id: 'sec_goals', page_slug: 'home', section_key: 'goals', heading: 'Choose Your Athletic Trajectory', subheading: 'Targeted protocols engineered for specific physiological adaptations.', badge: 'SPECIALIZED TRACKS', is_enabled: 1, display_order: 3 },
    { id: 'sec_programs', page_slug: 'home', section_key: 'programs', heading: 'Signature Training Programs', subheading: 'Evidence-based biomechanics combined with periodized intensity.', badge: 'FEATURED PROTOCOLS', is_enabled: 1, display_order: 4 },
    { id: 'sec_about', page_slug: 'home', section_key: 'about', heading: 'Redefining High-Performance Living', subheading: 'Where luxury craftsmanship meets uncompromising athletic dedication.', badge: 'OUR PHILOSOPHY', is_enabled: 1, display_order: 5 },
    { id: 'sec_trainers', page_slug: 'home', section_key: 'trainers', heading: 'World-Class Coaching Staff', subheading: 'Work directly with Olympians, bio-mechanists, and elite strength champions.', badge: 'MASTER COACHES', is_enabled: 1, display_order: 6 },
    { id: 'sec_transformations', page_slug: 'home', section_key: 'transformations', heading: 'Documented Transformations', subheading: 'Real members. Real body composition shifts. Zero compromises.', badge: 'PROVEN RESULTS', is_enabled: 1, display_order: 7 },
    { id: 'sec_memberships', page_slug: 'home', section_key: 'memberships', heading: 'Exclusive Membership Privileges', subheading: 'Select the tier that aligns with your ambition.', badge: 'TIERED ACCESS', is_enabled: 1, display_order: 8 },
    { id: 'sec_nutrition', page_slug: 'home', section_key: 'nutrition', heading: 'Precision Clinical Nutrition', subheading: 'Fuel the engine. Custom macro-partitioned diets and clinical nutrient timing.', badge: 'METABOLIC SCIENCE', is_enabled: 1, display_order: 9 },
    { id: 'sec_gallery', page_slug: 'home', section_key: 'gallery', heading: 'The Club Experience', subheading: 'Tour the pinnacle of fitness infrastructure and recovery amenities.', badge: 'FACILITY TOUR', is_enabled: 1, display_order: 10 },
    { id: 'sec_testimonials', page_slug: 'home', section_key: 'testimonials', heading: 'Voices of the FitLife Community', subheading: 'Read unvarnished feedback from high-performing executives and athletes.', badge: 'MEMBER REVIEWS', is_enabled: 1, display_order: 11 },
    { id: 'sec_faq', page_slug: 'home', section_key: 'faq', heading: 'Frequently Asked Questions', subheading: 'Everything you need to know about our standards and methodology.', badge: 'TRANSPARENCY', is_enabled: 1, display_order: 12 },
    { id: 'sec_blog', page_slug: 'home', section_key: 'blog', heading: 'Strength & Science Journal', subheading: 'Cutting-edge biomechanics and nutrition dispatches from our head coaches.', badge: 'LATEST INSIGHTS', is_enabled: 1, display_order: 13 },
    { id: 'sec_cta', page_slug: 'home', section_key: 'cta', heading: 'YOUR TRANSFORMATION STARTS TODAY', subheading: 'Join the most elite athletic collective in the world.', badge: 'JOIN THE CLUB', is_enabled: 1, display_order: 14 },
  ]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (res.ok) {
        if (data.settings) {
          if (data.settings.hero_heading) setHeroHeading(data.settings.hero_heading);
          if (data.settings.hero_subheading) setHeroSubheading(data.settings.hero_subheading);
          if (data.settings.announcement_text) setAnnouncementText(data.settings.announcement_text);
          if (data.settings.announcement_link) setAnnouncementLink(data.settings.announcement_link);
        }
        if (data.sections && data.sections.length > 0) {
          // Merge or replace
          setSections(data.sections);
        }
      }
    } catch {
      showNotification({ type: 'error', message: 'Failed to load builder settings' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const toggleSection = (index: number) => {
    const updated = [...sections];
    const current = updated[index].is_enabled;
    updated[index].is_enabled = current === 1 || current === true ? 0 : 1;
    setSections(updated);
  };

  const handleSectionTextChange = (index: number, field: 'heading' | 'subheading' | 'badge', val: string) => {
    const updated = [...sections];
    updated[index][field] = val;
    setSections(updated);
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const payload = {
        settings: {
          hero_heading: heroHeading,
          hero_subheading: heroSubheading,
          announcement_text: announcementText,
          announcement_link: announcementLink,
          hero_cta_primary: heroCtaPrimary,
          hero_cta_secondary: heroCtaSecondary,
        },
        sections: sections.map((s, idx) => ({
          ...s,
          display_order: idx + 1,
        })),
      };

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification({ type: 'success', message: 'Homepage builder changes saved live!' });
      } else {
        showNotification({ type: 'error', message: data.error || 'Failed to save settings' });
      }
    } catch {
      showNotification({ type: 'error', message: 'Error saving settings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff5a1f] uppercase tracking-widest mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Website CMS & Customizer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Homepage Builder & Section Manager
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Control the visual flow, live announcement bar, hero typography, and visibility of all 14 homepage sections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview Live</span>
          </Link>

          <Button
            variant="primary"
            onClick={handleSaveAll}
            disabled={saving || loading}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Publish Live Updates'}</span>
          </Button>
        </div>
      </div>

      {/* Announcement Bar & Hero Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Announcement Bar */}
        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#ff5a1f]">
            <Sparkles className="w-4 h-4" />
            <span>Top Announcement Banner</span>
          </div>
          <p className="text-xs text-zinc-400">
            Visible on the very top of all public pages to drive high-urgency conversions.
          </p>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-300 uppercase">Announcement Text</label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-300 uppercase">Target Link URL</label>
              <input
                type="text"
                value={announcementLink}
                onChange={(e) => setAnnouncementLink(e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>
          </div>
        </div>

        {/* Hero Section Headlines */}
        <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#c6ff3b]">
            <Flame className="w-4 h-4" />
            <span>Hero Screen Headlines</span>
          </div>
          <p className="text-xs text-zinc-400">
            The prime visual hook that visitors see when landing on the website.
          </p>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-300 uppercase">Hero Headline (H1)</label>
              <input
                type="text"
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-300 uppercase">Hero Subheadline</label>
              <textarea
                rows={2}
                value={heroSubheading}
                onChange={(e) => setHeroSubheading(e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section List & Visibility Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#ff5a1f]" />
            <h2 className="text-base font-black text-white uppercase tracking-wider font-heading">
              Homepage Content Modules ({sections.length} Sections)
            </h2>
          </div>
          <span className="text-xs text-zinc-400">
            Toggle visibility and customize section copy
          </span>
        </div>

        <div className="space-y-3">
          {sections.map((section, idx) => {
            const isEnabled = section.is_enabled === 1 || section.is_enabled === true;

            return (
              <div
                key={section.id || idx}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isEnabled
                    ? 'bg-[#0e0e12] border-white/10'
                    : 'bg-[#09090c] border-white/5 opacity-60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left info & order */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs text-zinc-400">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-white">
                          {section.section_key.toUpperCase()}
                        </span>
                        {section.badge && (
                          <span className="text-[9px] font-bold text-[#ff5a1f] bg-[#ff5a1f]/10 px-2 py-0.5 rounded-full border border-[#ff5a1f]/20 uppercase">
                            {section.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        Key: {section.section_key}
                      </span>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Section Heading"
                      value={section.heading}
                      onChange={(e) => handleSectionTextChange(idx, 'heading', e.target.value)}
                      className="bg-[#080808] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5a1f]"
                    />
                    <input
                      type="text"
                      placeholder="Section Subtitle / Description"
                      value={section.subheading || ''}
                      onChange={(e) => handleSectionTextChange(idx, 'subheading', e.target.value)}
                      className="bg-[#080808] border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-400 focus:outline-none focus:border-[#ff5a1f]"
                    />
                  </div>

                  {/* Toggle button */}
                  <button
                    type="button"
                    onClick={() => toggleSection(idx)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      isEnabled
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-white/5 text-zinc-500 border border-white/10 hover:text-white'
                    }`}
                  >
                    {isEnabled ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

