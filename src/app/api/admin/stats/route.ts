import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const totalCustomers = await queryOne<any>(
      "SELECT COUNT(*) as count FROM users WHERE role = 'CUSTOMER'"
    );

    const activeMemberships = await queryOne<any>(
      "SELECT COUNT(*) as count FROM memberships WHERE status = 'ACTIVE'"
    );

    const totalCoaches = await queryOne<any>(
      "SELECT COUNT(*) as count FROM users WHERE role = 'COACH'"
    );

    const pendingEnquiries = await queryOne<any>(
      "SELECT COUNT(*) as count FROM enquiries WHERE status = 'NEW'"
    );

    const upcomingBookings = await queryOne<any>(
      "SELECT COUNT(*) as count FROM bookings WHERE status = 'CONFIRMED' AND scheduled_at >= NOW()"
    );

    const totalRevenue = await queryOne<any>(
      "SELECT SUM(amount) as sum FROM payments WHERE status = 'SUCCESS'"
    );

    // Monthly revenue chart data
    const monthlyRevenue = [
      { month: 'May', revenue: 145000, members: 12 },
      { month: 'Jun', revenue: 198000, members: 18 },
      { month: 'Jul', revenue: 240000, members: 24 },
      { month: 'Aug', revenue: 310000, members: 32 },
      { month: 'Sep', revenue: 385000, members: 41 },
      { month: 'Oct', revenue: 460000, members: 54 },
    ];

    // Recent enquiries
    const recentEnquiries = await query<any>(
      'SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 5'
    );

    // Recent payments
    const recentPayments = await query<any>(
      `SELECT p.*, u.name as user_name, u.email as user_email
       FROM payments p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC LIMIT 5`
    );

    return NextResponse.json({
      metrics: {
        totalCustomers: totalCustomers?.count || 0,
        activeMembers: activeMemberships?.count || 0,
        totalCoaches: totalCoaches?.count || 0,
        pendingEnquiries: pendingEnquiries?.count || 0,
        upcomingBookings: upcomingBookings?.count || 0,
        totalRevenue: totalRevenue?.sum || 9999,
      },
      monthlyRevenue,
      recentEnquiries,
      recentPayments,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

