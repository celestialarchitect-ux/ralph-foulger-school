import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser, authConfigured } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COLORS = ['gold', 'ocean', 'coral', 'green'];
const MAX_TEXT = 2000;

// Self-heal: `prisma db push` has been observed to skip newly-added tables on
// this stack (see project memory). If the table is missing, create it on demand
// so highlights persist without a manual migration step.
async function ensureTable(): Promise<void> {
  if (!db) return;
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Highlight" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "chapterSlug" TEXT NOT NULL,
      "blockId" TEXT NOT NULL,
      "startOffset" INTEGER NOT NULL,
      "endOffset" INTEGER NOT NULL,
      "text" TEXT NOT NULL,
      "color" TEXT NOT NULL DEFAULT 'gold',
      "note" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`);
  await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Highlight_userId_idx" ON "Highlight"("userId");`);
  await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Highlight_userId_chapterSlug_idx" ON "Highlight"("userId","chapterSlug");`);
}

function isMissingTable(e: unknown): boolean {
  const msg = String((e as { message?: string })?.message ?? e);
  return msg.includes('does not exist') || (e as { code?: string })?.code === 'P2021';
}

type Row = { id: string; chapterSlug: string; blockId: string; startOffset: number; endOffset: number; text: string; color: string; note: string | null; createdAt: Date };
const toClient = (h: Row) => ({
  id: h.id, chapterSlug: h.chapterSlug, blockId: h.blockId,
  startOffset: h.startOffset, endOffset: h.endOffset, text: h.text,
  color: h.color, note: h.note, createdAt: h.createdAt.getTime(),
});

async function withTable<T>(fn: () => Promise<T>): Promise<T> {
  try { return await fn(); }
  catch (e) {
    if (isMissingTable(e)) { await ensureTable(); return await fn(); }
    throw e;
  }
}

export async function GET() {
  if (!authConfigured() || !db) return NextResponse.json({ error: 'auth_unavailable' }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const rows = await withTable(() => db!.highlight.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } }));
  return NextResponse.json({ highlights: rows.map(toClient) });
}

export async function POST(req: NextRequest) {
  if (!authConfigured() || !db) return NextResponse.json({ error: 'auth_unavailable' }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'bad_json' }, { status: 400 }); }

  const chapterSlug = String(b.chapterSlug ?? '').slice(0, 80);
  const blockId = String(b.blockId ?? '').slice(0, 120);
  const startOffset = Math.max(0, Math.floor(Number(b.startOffset)));
  const endOffset = Math.max(0, Math.floor(Number(b.endOffset)));
  const text = String(b.text ?? '').slice(0, MAX_TEXT);
  const color = COLORS.includes(String(b.color)) ? String(b.color) : 'gold';
  const note = b.note == null ? null : String(b.note).slice(0, 2000);

  if (!chapterSlug || !blockId || !text || endOffset <= startOffset) {
    return NextResponse.json({ error: 'bad_payload' }, { status: 400 });
  }

  const row = await withTable(() => db!.highlight.create({
    data: { userId: user.id, chapterSlug, blockId, startOffset, endOffset, text, color, note },
  }));
  return NextResponse.json({ highlight: toClient(row) });
}

export async function PATCH(req: NextRequest) {
  if (!authConfigured() || !db) return NextResponse.json({ error: 'auth_unavailable' }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'bad_json' }, { status: 400 }); }
  const id = String(b.id ?? '');
  const note = b.note == null ? null : String(b.note).slice(0, 2000);
  if (!id) return NextResponse.json({ error: 'bad_payload' }, { status: 400 });
  // ownership-scoped update
  const res = await withTable(() => db!.highlight.updateMany({ where: { id, userId: user.id }, data: { note } }));
  return NextResponse.json({ ok: true, updated: res.count });
}

export async function DELETE(req: NextRequest) {
  if (!authConfigured() || !db) return NextResponse.json({ error: 'auth_unavailable' }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id') ?? '';
  if (!id) return NextResponse.json({ error: 'bad_payload' }, { status: 400 });
  await withTable(() => db!.highlight.deleteMany({ where: { id, userId: user.id } }));
  return NextResponse.json({ ok: true });
}
