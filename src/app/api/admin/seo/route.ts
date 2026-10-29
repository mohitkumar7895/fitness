import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query, execute } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let seoList = await query<any>('SELECT * FROM seo_settings ORDER BY page_path ASC');

    // Auto-seed if empty
    if (seoList.length === 0) {
      const defaultSeo = [
        { page_path: '/', meta_title: 'FitLife Wellness | Elite Fitness Club & Coaching', meta_description: 'Welcome to FitLife Wellness. Experience luxury fitness, certified master personal trainers, evidence-based nutrition protocols, and transformative gym memberships.', keywords: 'fitness, luxury gym, personal training, weight loss, bodybuilding, nutrition' },
        { page_path: '/about', meta_title: 'About FitLife Wellness | Philosophy & Standards', meta_description: 'Discover the heritage, sports science methodology, and luxury training facility standards of FitLife Wellness.', keywords: 'about gym, elite coaches, athletic training, fitness heritage' },
        { page_path: '/programs', meta_title: 'Elite Training Programs | FitLife Wellness', meta_description: 'Comprehensive hypertrophy, fat loss, functional conditioning, and bespoke transformation programs.', keywords: 'gym programs, weight training, athletic conditioning, workout plans' },
        { page_path: '/membership', meta_title: 'Exclusive Membership Plans | FitLife Wellness', meta_description: 'Discover luxury club memberships with access to elite strength equipment, recovery lounges, and private coaching.', keywords: 'gym membership, luxury club, fitness pass, personal trainer access' },
        { page_path: '/trainers', meta_title: 'Master Trainers & Performance Coaches | FitLife', meta_description: 'Work with elite Olympians, strength coaches, and certified clinical nutritionists.', keywords: 'personal trainers, fitness coach, strength specialist' },
        { page_path: '/transformations', meta_title: 'Verified Member Transformations | FitLife Wellness', meta_description: 'Real client before-and-after results, biometric tracking, and verified transformation journeys.', keywords: 'weight loss results, body transformation, muscle gain proof' },
        { page_path: '/blog', meta_title: 'Strength & Science Journal | FitLife Wellness', meta_description: 'Evidence-based articles on biomechanics, metabolic nutrition, recovery protocols, and workout splits.', keywords: 'fitness blog, bodybuilding articles, nutrition tips' },
        { page_path: '/contact', meta_title: 'Contact Concierge & Club Desk | FitLife Wellness', meta_description: 'Inquire about memberships, book a private consultation, or visit our luxury fitness facility.', keywords: 'gym contact, club tour, training enquiry' },
      ];

      for (const item of defaultSeo) {
        const id = `seo_${Math.random().toString(36).substring(2, 9)}`;
        await execute(
          `INSERT INTO seo_settings (id, page_path, meta_title, meta_description, keywords, og_title, og_description)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [id, item.page_path, item.meta_title, item.meta_description, item.keywords, item.meta_title, item.meta_description]
        );
      }
      seoList = await query<any>('SELECT * FROM seo_settings ORDER BY page_path ASC');
    }

    return NextResponse.json({ seoList });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { page_path, meta_title, meta_description, canonical_url, og_title, og_description, og_image, keywords } = body;

    if (!page_path || !meta_title) {
      return NextResponse.json({ error: 'Page path and meta title required' }, { status: 400 });
    }

    const id = `seo_${Math.random().toString(36).substring(2, 9)}`;

    await execute(
      `INSERT INTO seo_settings (
        id, page_path, meta_title, meta_description, canonical_url, og_title, og_description, og_image, keywords
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        meta_title = VALUES(meta_title),
        meta_description = VALUES(meta_description),
        canonical_url = VALUES(canonical_url),
        og_title = VALUES(og_title),
        og_description = VALUES(og_description),
        og_image = VALUES(og_image),
        keywords = VALUES(keywords)`,
      [
        id,
        page_path,
        meta_title,
        meta_description || '',
        canonical_url || null,
        og_title || meta_title,
        og_description || meta_description || '',
        og_image || null,
        keywords || '',
      ]
    );

    return NextResponse.json({ success: true, message: 'SEO configuration saved.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'SEO record ID required' }, { status: 400 });
    }

    await execute('DELETE FROM seo_settings WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'SEO setting deleted.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

