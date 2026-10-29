import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query, execute } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await query<any>('SELECT * FROM site_settings');
    const sections = await query<any>('SELECT * FROM page_sections ORDER BY display_order ASC');

    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.setting_key] = s.setting_value;
    });

    return NextResponse.json({ settings: settingsMap, rawSettings: settings, sections });
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
    const { settings, sections } = body;

    // Bulk save key-value settings
    if (settings && typeof settings === 'object') {
      for (const [key, value] of Object.entries(settings)) {
        await execute(
          `INSERT INTO site_settings (id, setting_key, setting_value, setting_group)
           VALUES (?, ?, ?, 'GENERAL')
           ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
          [`set_${key}`, key, String(value)]
        );
      }
    }

    // Save page sections
    if (sections && Array.isArray(sections)) {
      for (const sec of sections) {
        await execute(
          `INSERT INTO page_sections (
            id, page_slug, section_key, heading, subheading, content, badge,
            primary_cta_text, primary_cta_link, is_enabled
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            heading = VALUES(heading),
            subheading = VALUES(subheading),
            content = VALUES(content),
            badge = VALUES(badge),
            primary_cta_text = VALUES(primary_cta_text),
            primary_cta_link = VALUES(primary_cta_link),
            is_enabled = VALUES(is_enabled)`,
          [
            sec.id || `sec_${sec.page_slug}_${sec.section_key}`,
            sec.page_slug || 'home',
            sec.section_key,
            sec.heading || '',
            sec.subheading || null,
            sec.content || null,
            sec.badge || null,
            sec.primary_cta_text || null,
            sec.primary_cta_link || null,
            sec.is_enabled !== false ? 1 : 0,
          ]
        );
      }
    }

    return NextResponse.json({ success: true, message: 'Settings saved successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

