import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { query } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { Clock, ArrowRight } from 'lucide-react';
import { IMAGES } from '@/lib/images';

export const metadata = {
  title: 'The Athletic Journal | Exercise Science & Nutrition',
  description: 'Evidence-based articles on hypertrophy mechanics, sports nutrition, sleep recovery, and athletic mindset.',
};

export const revalidate = 60;

export default async function BlogListingPage() {
  let blogs: any[] = [];
  let categories: any[] = [];

  try {
    blogs = await query(
      `SELECT b.*, bc.name as category_name 
       FROM blogs b 
       LEFT JOIN blog_categories bc ON b.category_id = bc.id 
       WHERE b.is_published = 1 
       ORDER BY b.published_at DESC`
    );

    categories = await query(`SELECT * FROM blog_categories`);
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }

  if (!blogs || blogs.length === 0) {
    blogs = [
      {
        id: 'blg_fb_1',
        title: 'Progressive Overload Biomechanics: The Scientific Hypertrophy Blueprint',
        slug: 'progressive-overload-biomechanics',
        excerpt: 'Why mechanical tension and muscle fiber recruitment trump arbitrary volume when constructing elite drug-free muscularity.',
        featured_image: IMAGES.blog.hypertrophy,
        read_time: '7 min read',
        category_name: 'Strength & Science',
      },
      {
        id: 'blg_fb_2',
        title: 'Precision Nutrient Timing & Macro Partitioning for Athletic Fat Shred',
        slug: 'nutrient-timing-metabolic-partitioning',
        excerpt: 'How carbohydrate placement around training triggers maximum glycogen resynthesis without halting visceral fat oxidation.',
        featured_image: IMAGES.blog.nutritionTiming,
        read_time: '5 min read',
        category_name: 'Nutrition & Fuel',
      },
      {
        id: 'blg_fb_3',
        title: 'Circadian Biology, Deep Slow-Wave Sleep & Central Nervous System Recovery',
        slug: 'circadian-biology-recovery-sleep',
        excerpt: 'Optimizing endocrine hormone production and growth hormone release during the critical restorative sleep cycles.',
        featured_image: IMAGES.blog.recoverySleep,
        read_time: '6 min read',
        category_name: 'Recovery & Longevity',
      },
    ];
  }

  return (
    <div className="bg-[#080808] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="orange">
            The Athletic Journal
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight font-heading">
            EVIDENCE-BASED <span className="text-gradient-orange">INSIGHTS</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">
            Cut through marketing noise with clinical sports science, hypertrophy mechanics, and metabolic conditioning protocols written by master trainers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col">
              <div className="rounded-3xl bg-[#141418] border border-white/10 overflow-hidden flex-1 flex flex-col justify-between hover:border-[#ff5a1f]/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xl">
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent opacity-80" />
                    <div className="absolute top-4 left-4">
                      <Badge variant="orange" className="text-[10px] bg-black/70 backdrop-blur-md">
                        {post.category_name || 'Sports Science'}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                      <Clock className="w-3.5 h-3.5 text-[#c6ff3b]" />
                      <span>{post.read_time}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-heading group-hover:text-[#ff5a1f] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-3 border-t border-white/5 flex items-center text-xs font-bold text-[#ff5a1f] group-hover:translate-x-1 transition-transform">
                    <span>Read Full Article</span> &rarr;
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

