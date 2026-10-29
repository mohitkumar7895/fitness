import React from 'react';
import { query } from '@/lib/db';
import { HeroSection } from '@/components/home/HeroSection';
import { GoalsSection } from '@/components/home/GoalsSection';
import { FeaturedPrograms } from '@/components/home/FeaturedPrograms';
import { AboutSection } from '@/components/home/AboutSection';
import { FeaturedTrainers } from '@/components/home/FeaturedTrainers';
import { TransformationsSection } from '@/components/home/TransformationsSection';
import { MembershipSection } from '@/components/home/MembershipSection';
import { NutritionSection } from '@/components/home/NutritionSection';
import { GallerySection } from '@/components/home/GallerySection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FAQSection } from '@/components/home/FAQSection';
import { LatestBlogSection } from '@/components/home/LatestBlogSection';
import { CtaBanner } from '@/components/home/CtaBanner';

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  // Fetch real data from MySQL
  let programs: any[] = [];
  let trainers: any[] = [];
  let plans: any[] = [];
  let testimonials: any[] = [];
  let gallery: any[] = [];
  let faqs: any[] = [];
  let blogs: any[] = [];
  let goals: any[] = [];

  try {
    programs = await query(
      `SELECT * FROM programs WHERE is_published = 1 ORDER BY display_order ASC, created_at DESC LIMIT 6`
    );

    trainers = await query(
      `SELECT cp.*, u.name, u.avatar 
       FROM coach_profiles cp 
       JOIN users u ON cp.user_id = u.id 
       WHERE cp.is_featured = 1 
       ORDER BY cp.display_order ASC LIMIT 4`
    );

    plans = await query(
      `SELECT * FROM membership_plans WHERE is_published = 1 ORDER BY display_order ASC`
    );

    testimonials = await query(
      `SELECT * FROM testimonials WHERE is_approved = 1 AND is_featured = 1 ORDER BY display_order ASC LIMIT 6`
    );

    gallery = await query(
      `SELECT * FROM gallery WHERE is_featured = 1 ORDER BY display_order ASC LIMIT 8`
    );

    faqs = await query(
      `SELECT * FROM faqs WHERE is_published = 1 ORDER BY display_order ASC LIMIT 6`
    );

    blogs = await query(
      `SELECT b.*, bc.name as category_name 
       FROM blogs b 
       LEFT JOIN blog_categories bc ON b.category_id = bc.id 
       WHERE b.is_published = 1 
       ORDER BY b.published_at DESC LIMIT 3`
    );

    goals = await query(
      `SELECT * FROM fitness_goals ORDER BY display_order ASC`
    );
  } catch (error) {
    console.error('Error fetching homepage data:', error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#080808]">
      <HeroSection />
      <GoalsSection goals={goals} />
      <FeaturedPrograms programs={programs} />
      <AboutSection />
      <FeaturedTrainers trainers={trainers} />
      <TransformationsSection testimonials={testimonials} />
      <MembershipSection plans={plans} />
      <NutritionSection />
      <GallerySection items={gallery} />
      <TestimonialsSection testimonials={testimonials} />
      <FAQSection faqs={faqs} />
      <LatestBlogSection blogs={blogs} />
      <CtaBanner />
    </div>
  );
}

