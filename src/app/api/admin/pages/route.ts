import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query, execute } from '@/lib/db';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let pages = await query<any>('SELECT * FROM pages ORDER BY title ASC');

    // If empty, auto-seed default site pages
    if (pages.length === 0) {
      const defaultPages = [
        { title: 'Home', slug: 'home', meta_title: 'FitLife Wellness | Luxury Fitness & Performance', meta_description: 'Elite training facility, body transformation, and world-class athletic conditioning.' },
        { title: 'About Us', slug: 'about', meta_title: 'About FitLife Wellness | Philosophy & Heritage', meta_description: 'Discover the story, methodology, and philosophy behind FitLife.' },
        { title: 'Our Programs', slug: 'programs', meta_title: 'Training Programs | FitLife Wellness', meta_description: 'Explore scientific workout protocols tailored for hypertrophy, fat loss, and longevity.' },
        { title: 'Weight Loss Program', slug: 'weight-loss', meta_title: 'Weight Loss & Metabolic Conditioning | FitLife', meta_description: 'High-octane metabolic training designed for rapid fat loss and muscle retention.' },
        { title: 'Muscle Building Program', slug: 'muscle-building', meta_title: 'Hypertrophy & Muscle Building | FitLife', meta_description: 'Biomechanically sound hypertrophy protocols for elite muscle development.' },
        { title: 'Body Transformation', slug: 'body-transformation', meta_title: 'Complete Body Transformation | FitLife', meta_description: '12 to 24 week comprehensive body recomposition program with 1-on-1 coaching.' },
        { title: 'Personal Training', slug: 'personal-training', meta_title: '1-on-1 Private Coaching | FitLife Wellness', meta_description: 'Dedicated bespoke programming with elite certified personal coaches.' },
        { title: 'Group Fitness', slug: 'group-fitness', meta_title: 'Group Functional Training | FitLife Wellness', meta_description: 'High energy coach-led functional group classes in a luxury studio atmosphere.' },
        { title: 'Strength Training', slug: 'strength-training', meta_title: 'Strength & Powerlifting Protocols | FitLife', meta_description: 'Master compound movements and build raw uncompromised strength.' },
        { title: 'Yoga & Flexibility', slug: 'yoga-flexibility', meta_title: 'Mobility, Yoga & Recovery | FitLife Wellness', meta_description: 'Myofascial release, dynamic yoga flows, and active recovery.' },
        { title: 'Nutrition & Diet', slug: 'nutrition', meta_title: 'Clinical Nutrition & Diet Protocols | FitLife', meta_description: 'Custom macro partition plans, metabolic diets, and clinical meal plans.' },
        { title: 'Our Trainers', slug: 'trainers', meta_title: 'Master Coaches & Bio-Specialists | FitLife', meta_description: 'Meet our master trainers, strength coaches, and clinical nutritionists.' },
        { title: 'Membership Plans', slug: 'membership', meta_title: 'Tiered Membership Privileges | FitLife Wellness', meta_description: 'Unlock luxury gym access, private recovery lounges, and coaching tiers.' },
        { title: 'Transformations', slug: 'transformations', meta_title: 'Verified Client Transformations | FitLife', meta_description: 'Real measurable transformations from FitLife club members.' },
        { title: 'Fitness Gallery', slug: 'gallery', meta_title: 'Club & Facility Media Gallery | FitLife Wellness', meta_description: 'Tour our world-class gym floor, recovery suite, and private studios.' },
        { title: 'Fitness Blog', slug: 'blog', meta_title: 'Strength & Science Journal | FitLife Wellness', meta_description: 'Evidence-based articles on fitness, biomechanics, and nutrition.' },
        { title: 'Contact Us', slug: 'contact', meta_title: 'Contact Concierge & Enquiries | FitLife Wellness', meta_description: 'Reach our club desk, request a private tour, or consult our coaches.' },
        { title: 'Frequently Asked Questions', slug: 'faq', meta_title: 'FAQ & Support | FitLife Wellness', meta_description: 'Common questions regarding memberships, training, and club access.' },
        { title: 'Privacy Policy', slug: 'privacy-policy', meta_title: 'Privacy Policy | FitLife Wellness', meta_description: 'Data protection and biometric privacy commitment at FitLife.' },
        { title: 'Terms & Conditions', slug: 'terms', meta_title: 'Terms of Service | FitLife Wellness', meta_description: 'Club policies, membership terms, and digital platform agreement.' },
      ];

      for (const p of defaultPages) {
        const id = `pg_${Math.random().toString(36).substring(2, 9)}`;
        await execute(
          `INSERT INTO pages (id, title, slug, meta_title, meta_description, is_published)
           VALUES (?, ?, ?, ?, ?, 1)`,
          [id, p.title, p.slug, p.meta_title, p.meta_description]
        );
      }
      pages = await query<any>('SELECT * FROM pages ORDER BY title ASC');
    }

    return NextResponse.json({ pages });
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
    const { title, slug, meta_title, meta_description, og_image, is_published } = body;

    if (!title) {
      return NextResponse.json({ error: 'Page title is required' }, { status: 400 });
    }

    const pageSlug = slug ? slugify(slug) : slugify(title);
    const id = `pg_${Math.random().toString(36).substring(2, 9)}`;

    await execute(
      `INSERT INTO pages (id, title, slug, meta_title, meta_description, og_image, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        title,
        pageSlug,
        meta_title || `${title} | FitLife Wellness`,
        meta_description || '',
        og_image || null,
        is_published !== false ? 1 : 0,
      ]
    );

    return NextResponse.json({ success: true, message: 'Page created successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, slug, meta_title, meta_description, og_image, is_published } = body;

    if (!id) {
      return NextResponse.json({ error: 'Page ID required' }, { status: 400 });
    }

    await execute(
      `UPDATE pages SET
        title = COALESCE(?, title),
        slug = COALESCE(?, slug),
        meta_title = COALESCE(?, meta_title),
        meta_description = COALESCE(?, meta_description),
        og_image = COALESCE(?, og_image),
        is_published = COALESCE(?, is_published)
       WHERE id = ?`,
      [
        title,
        slug ? slugify(slug) : null,
        meta_title,
        meta_description,
        og_image,
        is_published !== undefined ? (is_published ? 1 : 0) : null,
        id,
      ]
    );

    return NextResponse.json({ success: true, message: 'Page updated successfully.' });
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
      return NextResponse.json({ error: 'Page ID required' }, { status: 400 });
    }

    await execute('DELETE FROM pages WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Page deleted.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

