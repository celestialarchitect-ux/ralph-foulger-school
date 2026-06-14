import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser, authConfigured } from '@/lib/auth';
import { courseSecondsFromBuckets } from '@/lib/time-tracking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Returns the signed-in user's time aggregates: total, by-bucket, and recent events.
// Used by /profile and /practice (gate check).
//
// `courseSeconds` is the canonical number for the 60-hour Hawaii state-law
// gate — it counts ONLY real paid-course buckets (chapters, quizzes,
// flashcards, math, glossary, tutor). `totalSeconds` is all activity
// including the free preview and the mock exam, kept for display.
export async function GET() {
  if (!authConfigured() || !db) {
    return NextResponse.json({ error: 'auth_unavailable' }, { status: 503 });
  }
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  // Aggregate via grouped query
  const byBucketRows = await db.timeEvent.groupBy({
    by: ['bucket'],
    where: { userId: user.id },
    _sum: { seconds: true },
  });
  const byBucket: Record<string, number> = {
    chapters: 0, flashcards: 0, math: 0, glossary: 0,
    quizzes: 0, tutor: 0, practice: 0, preview: 0, other: 0,
  };
  let totalSeconds = 0;
  for (const row of byBucketRows) {
    const sec = row._sum.seconds ?? 0;
    byBucket[row.bucket] = (byBucket[row.bucket] ?? 0) + sec;
    totalSeconds += sec;
  }
  // Course-only total = the 60-hour state-law number (excludes free preview,
  // mock exam, and navigational 'other').
  const courseSeconds = courseSecondsFromBuckets(byBucket);
  const previewSeconds = byBucket.preview ?? 0;
  const practiceSeconds = byBucket.practice ?? 0;

  // Pull the mock-exam early-access flag so the practice page can bypass
  // the 60-hour gate when admins have granted it. Cheap single-column read.
  const u = await db.user.findUnique({
    where: { id: user.id },
    select: { mockExamEarlyAccess: true },
  });

  return NextResponse.json({
    totalSeconds,
    courseSeconds,
    previewSeconds,
    practiceSeconds,
    byBucket,
    user: { id: user.id, email: user.email, name: user.name, tier: user.tier, isAdmin: user.isAdmin },
    mockExamEarlyAccess: u?.mockExamEarlyAccess ?? false,
  });
}
