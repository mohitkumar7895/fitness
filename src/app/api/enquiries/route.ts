import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';
import { SITE_CONFIG } from '@/lib/constants';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      subject = 'Membership & Trial Enquiry',
      message = '',
      fitness_goal = 'General Fitness',
      preferred_time = 'Flexible',
      source = 'WEBSITE_LEAD',
    } = body;

    // Minimum required: name and either phone or email
    if (!name || (!phone && !email)) {
      return NextResponse.json(
        { error: 'Please provide your name and contact phone number or email.' },
        { status: 400 }
      );
    }

    const id = `enq_${crypto.randomUUID()}`;
    const cleanEmail = email ? String(email).trim().toLowerCase() : `${phone.replace(/\D/g, '')}@lead.fitlifewellness.com`;
    const cleanPhone = phone ? String(phone).trim() : null;
    const cleanMessage = message ? String(message).trim() : `Lead from ${source} - Goal: ${fitness_goal} - Time: ${preferred_time}`;

    await execute(
      `INSERT INTO enquiries 
       (id, name, email, phone, subject, message, fitness_goal, preferred_time, source, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW')`,
      [
        id,
        name.trim(),
        cleanEmail,
        cleanPhone,
        subject.trim(),
        cleanMessage,
        fitness_goal,
        preferred_time,
        source,
      ]
    );

    // Build personalized WhatsApp direct link
    const waNumber = (SITE_CONFIG.whatsapp || '919876543210').replace(/\D/g, '');
    const waText = encodeURIComponent(
      `Hello FitLife Wellness team! My name is ${name.trim()}. I just submitted an inquiry for a Consultation & Club Tour for ${fitness_goal}. I would like to schedule my visit!`
    );
    const whatsappUrl = `https://wa.me/${waNumber}?text=${waText}`;

    return NextResponse.json({
      success: true,
      id,
      message: 'Your inquiry has been successfully received. A Master Coach will reach out shortly.',
      whatsappUrl,
    });
  } catch (error: any) {
    console.error('Error recording enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to record your inquiry. Please contact us directly via WhatsApp or phone.' },
      { status: 500 }
    );
  }
}
