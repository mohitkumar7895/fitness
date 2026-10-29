import React from 'react';
import { query } from '@/lib/db';
import { GallerySection } from '@/components/home/GallerySection';

export const metadata = {
  title: 'Luxury Facility & Athletic Sanctuary Gallery',
  description: 'Explore the Olympic floor, private coaching suites, and cryo recovery lounges at FitLife Wellness.',
};

export const revalidate = 60;

export default async function GalleryPage() {
  let items: any[] = [];
  try {
    items = await query(`SELECT * FROM gallery ORDER BY display_order ASC, created_at DESC`);
  } catch (error) {
    console.error('Error fetching gallery:', error);
  }

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      <GallerySection items={items} />
    </div>
  );
}

