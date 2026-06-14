import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser, authConfigured, hasRole } from '@/lib/auth';
import { COURSE_BUCKETS } from '@/lib/time-tracking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Admin-only user list with aggregated study hours per user.
// Gated by session user's isAdmin flag (set by ADMIN_EMAILS env var at signup).
export async function GET() {
  if (!authConfigured() || !db) {
    return NextResponse.json({ error: 'auth_unavailable' }, { status: 503 });
  }
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!hasRole(session, 'admin')) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  // Load all users (limit cap for safety as the academy grows)
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 500,
    select: {
      id: true,
      email: true,
      name: true,
      tier: true,
      isAdmin: true,
      roles: true,
      createdAt: true,
      lastSeenAt: true,
      passedExamAt: true,
      accessExpiresAt: true,
      mockExamEarlyAccess: true,
    },
  });

  // Aggregate seconds per user. Two numbers:
  //  • courseSeconds — real paid-course study only (the 60-hour compliance
  //    number an instructor checks). Excludes the free preview + mock exam.
  //  • totalSeconds — all activity, kept for context.
  const [courseAggs, totalAggs] = await Promise.all([
    db.timeEvent.groupBy({
      by: ['userId'],
      where: { bucket: { in: [...COURSE_BUCKETS] } },
      _sum: { seconds: true },
    }),
    db.timeEvent.groupBy({
      by: ['userId'],
      _sum: { seconds: true },
    }),
  ]);
  const courseByUser = new Map<string, number>();
  for (const a of courseAggs) courseByUser.set(a.userId, a._sum.seconds ?? 0);
  const totalByUser = new Map<string, number>();
  for (const a of totalAggs) totalByUser.set(a.userId, a._sum.seconds ?? 0);

  const rows = users.map(u => ({
    ...u,
    // `totalSeconds` now reflects course-only study so existing admin UI shows
    // the compliance-relevant hours; `allActivitySeconds` keeps the raw total.
    totalSeconds: courseByUser.get(u.id) ?? 0,
    allActivitySeconds: totalByUser.get(u.id) ?? 0,
  }));

  return NextResponse.json({ users: rows });
}
