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

export interface FAQSectionProps {
  faqs?: FAQItem[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs = [] }) => {
  const fallbackFaqs: FAQItem[] = [
    {
      id: 'faq_fb_1',
      question: 'How is FitLife Wellness different from conventional gyms?',
      answer:
        'FitLife Wellness maintains a strict member capacity ceiling so you never queue for prime stations, Eleiko competition platforms, or private bays. Every membership includes personalized clinical nutrition auditing, bi-weekly InBody bio-impedance scans, and direct access to Olympic and CSCS certified coaching staff.',
    },
    {
      id: 'faq_fb_2',
      question: 'Can beginners join, or is the club strictly for advanced athletes?',
      answer:
        'Over 60% of our members began with zero prior strength training experience. Our comprehensive 4-step biometric intake and onboarding process establishes safe, individualized movement patterns, eliminating intimidation while accelerating your progress safely.',
    },
    {
      id: 'faq_fb_3',
      question: 'What is included in private coaching & nutrition plans?',
      answer:
        'Private coaching includes biomechanical movement monitoring, customized periodized workout cycles, 24/7 nutrition messaging support with our clinical dietitians, and unlimited access to the infrared sauna and cold plunge recovery suites.',
    },
    {
      id: 'faq_fb_4',
      question: 'Can I pause or freeze my membership when traveling?',
      answer:
        'Yes. All Quarterly, Half-Yearly, and Annual memberships feature complimentary travel pause allowances ranging from 14 to 60 days per year, manageable directly from your member dashboard.',
    },
  ];

  // Strictly limit to exactly 4 high-impact FAQs
  const displayFaqs = (faqs && faqs.length > 0 ? faqs : fallbackFaqs).slice(0, 4);
  const [openId, setOpenId] = useState<string | null>(displayFaqs[0]?.id || 'faq_fb_1');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-14 sm:py-20 bg-[#0a0a0d] relative overflow-hidden border-t border-white/5">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#ff5a1f]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-12 space-y-3">
          <div className="inline-flex">
            <Badge variant="lime" className="px-3.5 py-1 text-xs font-bold flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Transparent Answers</span>
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-heading">
            FREQUENTLY ASKED <span className="text-gradient-orange">QUESTIONS</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            Everything you need to know about our memberships, private coaching protocols, and wellness amenities.
          </p>
        </div>

        <div className="space-y-3.5">
          {displayFaqs.map((faq, idx) => {
            const currentId = faq.id || `faq_${idx}`;
            const isOpen = openId === currentId;
            const numberFormatted = `0${idx + 1}`;

            return (
              <div
                key={currentId}
                className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                  isOpen
                    ? 'bg-[#141418] border-[#ff5a1f]/45 shadow-[0_10px_30px_rgba(255,90,31,0.12)]'
                    : 'bg-[#141418]/70 hover:bg-[#141418] border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(currentId)}
                  aria-expanded={isOpen}
                  className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 flex-1">
                    <span
                      className={`text-xs sm:text-sm font-mono font-black px-2.5 py-1 rounded-lg transition-colors ${
                        isOpen
                          ? 'bg-[#ff5a1f] text-white'
                          : 'bg-white/5 text-zinc-400 border border-white/10'
                      }`}
                    >
                      {numberFormatted}
                    </span>
                    <span className="text-sm sm:text-base lg:text-lg font-bold text-white font-heading leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'rotate-180 bg-[#ff5a1f] text-white border-transparent'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
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
                      transition={{ duration: 0.24, ease: 'easeInOut' }}
                    >
                      <div className="px-4 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5 pt-3 sm:pt-4 pl-12 sm:pl-16">
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
            <Link
              href="/contact"
              className="text-[#ff5a1f] font-bold hover:underline inline-flex items-center gap-1 ml-1"
            >
              <span>Speak with our Concierge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};
