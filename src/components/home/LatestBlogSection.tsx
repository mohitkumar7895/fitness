'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Clock, ArrowRight } from 'lucide-react';
import { IMAGES } from '@/lib/images';

export interface BlogItem {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  read_time: string;
  category_name?: string;
  published_at?: string;
}

export function LatestBlogSection({ blogs = [] }: { blogs?: BlogItem[] }) {
  const fallbackBlogs: BlogItem[] = [
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

  const displayBlogs = blogs && blogs.length > 0 ? blogs.slice(0, 3) : fallbackBlogs;

  return (
    <section className="py-12 sm:py-16 bg-[#080808] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff5a1f] block mb-2">
              The Athletic Journal
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-heading">
              LATEST <span className="text-gradient-orange">INSIGHTS</span>
            </h2>
          </div>
          <Link href="/blog">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Read All Articles
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {displayBlogs.map((post, idx) => (
            <Link key={post.id || idx} href={`/blog/${post.slug}`} className="group flex flex-col">
              <div className="rounded-3xl bg-[#141418] border border-white/10 overflow-hidden flex-1 flex flex-col justify-between hover:border-[#ff5a1f]/40 hover:-translate-y-1.5 transition-all duration-300 shadow-xl">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-transparent opacity-85" />
                  <div className="absolute top-3.5 left-3.5">
                    <Badge variant="orange" className="text-[10px] bg-black/80 backdrop-blur-md">
                      {post.category_name || 'Fitness Science'}
                    </Badge>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                      <Clock className="w-3.5 h-3.5 text-[#c6ff3b]" />
                      <span>{post.read_time}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white font-heading group-hover:text-[#ff5a1f] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center text-xs font-bold text-[#ff5a1f] group-hover:translate-x-1 transition-transform">
                    <span>Read Full Guide</span> &rarr;
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
