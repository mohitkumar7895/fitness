import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { queryOne } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { Clock, User, ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await queryOne<any>(
    'SELECT title, excerpt FROM blogs WHERE slug = ?',
    [slug]
  );
  if (!post) return { title: 'Article Not Found' };
  return {
    title: `${post.title} | FitLife Journal`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await queryOne<any>(
    `SELECT b.*, bc.name as category_name, u.name as author_name, u.avatar as author_avatar
     FROM blogs b
     LEFT JOIN blog_categories bc ON b.category_id = bc.id
     LEFT JOIN users u ON b.author_id = u.id
     WHERE b.slug = ?`,
    [slug]
  );

  if (!post) {
    notFound();
  }

  const tags = post.tags ? post.tags.split(',').map((t: string) => t.trim()) : [];

  return (
    <article className="bg-[#080808] text-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Articles
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <Badge variant="orange">{post.category_name || 'Sports Science'}</Badge>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-heading leading-tight text-white">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-zinc-400 border-y border-white/10 py-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#ff5a1f]" />
              <span className="font-semibold text-white">{post.author_name || 'FitLife Master Coach'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#c6ff3b]" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span>{post.read_time}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none text-zinc-300 text-base sm:text-lg leading-relaxed space-y-6 whitespace-pre-line font-normal">
          {post.content}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase font-bold text-zinc-500 mr-2">Tags:</span>
            {tags.map((t: string, idx: number) => (
              <Badge key={idx} variant="zinc" className="text-[10px]">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

