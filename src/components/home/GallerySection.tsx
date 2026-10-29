'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight } from 'lucide-react';
import { IMAGES } from '@/lib/images';

export interface GalleryItem {
  id?: string;
  title: string;
  category: string;
  media_url: string;
  caption?: string;
}

export function GallerySection({ items = [] }: { items?: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const sourceItems: GalleryItem[] =
    items && items.length > 0 ? items : IMAGES.gallery;

  const categories = ['ALL', 'FACILITY', 'EQUIPMENT', 'TRAINING', 'RECOVERY'];

  const filteredItems =
    activeCategory === 'ALL'
      ? sourceItems
      : sourceItems.filter((it) => it.category.toUpperCase() === activeCategory);

  return (
    <section className="py-12 sm:py-16 bg-[#0a0a0d] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <Badge variant="lime" className="mb-2">
              Sanctuary Architecture
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-heading">
              THE WORKOUT <span className="text-gradient-orange">GALLERY</span>
            </h2>
          </div>
          <Link href="/gallery">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Full Photo Archive
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#ff5a1f] text-white shadow-[0_0_15px_rgba(255,90,31,0.4)]'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredItems.slice(0, 8).map((media, idx) => (
            <div
              key={media.id || idx}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-lg cursor-pointer bg-black"
            >
              <Image
                src={media.media_url}
                alt={media.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-[9px] uppercase font-black text-[#c6ff3b] tracking-widest">
                  {media.category}
                </span>
                <p className="text-xs font-bold text-white font-heading mt-0.5">
                  {media.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
