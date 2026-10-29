import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | FitLife Wellness',
  description: 'Our commitment to data privacy, biometric security, and health information confidentiality.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#080808] text-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Badge variant="lime">Data Confidentiality</Badge>
          <h1 className="text-3xl sm:text-4xl font-black uppercase font-heading text-white mt-2">
            PRIVACY POLICY
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Last updated: October 2026</p>
        </div>

        <div className="prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed space-y-6">
          <p>
            At FitLife Wellness, we respect your privacy and are committed to safeguarding the personal and sensitive health information you share with us.
          </p>

          <h3 className="text-lg font-bold text-white font-heading">1. Information We Collect</h3>
          <p>
            When you register, book coaching, or submit fitness assessment questionnaires, we collect details including your name, email, phone number, date of birth, biometric indicators (height, weight, body fat), exercise restrictions, and dietary preferences.
          </p>

          <h3 className="text-lg font-bold text-white font-heading">2. Protection of Health Data</h3>
          <p>
            Health records, injuries, and dietary notes are strictly restricted to your assigned Master Coach and clinical dietitian. We never sell, lease, or monetize your personal health data to third-party insurance or marketing entities.
          </p>

          <h3 className="text-lg font-bold text-white font-heading">3. Payment Security</h3>
          <p>
            All online transactions are encrypted via PCI-DSS compliant payment gateways (Razorpay). Your credit card credentials and banking tokens are never stored on our local database servers.
          </p>
        </div>
      </div>
    </div>
  );
}

