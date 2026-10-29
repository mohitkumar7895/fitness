'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  category?: string;
}

export function FAQSection({ faqs = [] }: { faqs?: FAQItem[] }) {
  const fallbackFaqs: FAQItem[] = [
    {
      id: 'faq_fb_1',
      question: 'How is FitLife Wellness different from a typical high-end commercial gym?',
      answer: 'FitLife Wellness is capped at a strict maximum member density, guaranteeing you never queue for prime stations, Eleiko competition platforms, or private bays. Every membership includes personalized clinical nutrition auditing, bi-weekly InBody bio-impedance scans, and direct access to Olympic and CSCS certified coaching staff.',
    },
    {
      id: 'faq_fb_2',
      question: 'Can beginners join, or is the club strictly for elite athletes?',
      answer: 'Over 60% of our members began with zero prior strength training experience. Our 4-step biometric intake and onboarding process establishes safe, individualized movement patterns, eliminating intimidation while fast-tracking rapid physiological adaptations safely.',
    },
    {
      id: 'faq_fb_3',
      question: 'What is included in the private 1-on-1 coaching packages?',
      answer: 'Private coaching includes biomechanical bar-velocity monitoring, customized periodized workout mesocycles, 24/7 nutrition messaging support with our clinical dietitians, and unlimited access to the infrared sauna and cold plunge recovery suites.',
    },
    {
      id: 'faq_fb_4',
      question: 'Can I pause or transfer my membership if I travel frequently?',
      answer: 'Yes. All Quarterly, Half-Yearly, and Annual Onyx memberships feature complimentary travel pause allowances ranging from 14 to 60 days per year, manageable directly from your member dashboard.',
    },
    {
      id: 'faq_fb_5',
      question: 'Do you offer trial sessions or private facility tours?',
      answer: 'Yes. You can schedule a private 45-minute club walkthrough and biometric assessment consultation with a Master Coach before selecting your membership tier.',
    },
  ];

  const displayFaqs = faqs && faqs.length > 0 ? faqs : fallbackFaqs;
  const [openId, setOpenId] = useState<string | null>(displayFaqs[0]?.id || 'faq_fb_1');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-12 sm:py-16 bg-[#0a0a0d] relative overflow-hidden border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-10 space-y-3">
          <Badge variant="lime">
            <HelpCircle className="w-3.5 h-3.5" />
            Transparent Answers
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-heading">
            FREQUENTLY ASKED <span className="text-gradient-orange">QUESTIONS</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Everything you need to know about our club memberships, private coaching protocols, and wellness amenities.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {displayFaqs.map((faq, idx) => {
            const currentId = faq.id || `faq_${idx}`;
            const isOpen = openId === currentId;

            return (
              <div
                key={currentId}
                className="rounded-2xl bg-[#141418] border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(currentId)}
                  className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm sm:text-base lg:text-lg font-bold text-white font-heading">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#ff5a1f] text-white border-transparent' : 'text-zinc-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div className="px-4 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5 pt-3 sm:pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-10 sm:mt-12 text-center">
          <p className="text-xs sm:text-sm text-zinc-400">
            Have a question that is not listed here?{' '}
            <Link href="/contact" className="text-[#ff5a1f] font-semibold hover:underline inline-flex items-center gap-1">
              Speak with our Concierge <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
