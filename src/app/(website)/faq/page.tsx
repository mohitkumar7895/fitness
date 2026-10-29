import React from 'react';
import { query } from '@/lib/db';
import { FAQSection } from '@/components/home/FAQSection';

export const metadata = {
  title: 'Frequently Asked Questions | FitLife Wellness',
  description: 'Common questions regarding our memberships, personal coaching, nutrition support, and facility etiquette.',
};

export const revalidate = 60;

export default async function FAQPage() {
  let faqs: any[] = [];
  try {
    faqs = await query(
      `SELECT * FROM faqs WHERE is_published = 1 ORDER BY display_order ASC`
    );
  } catch (error) {
    console.error('Error fetching FAQs:', error);
  }

  return (
    <div className="bg-[#080808] text-white min-h-screen py-12">
      <FAQSection faqs={faqs} />
    </div>
  );
}

