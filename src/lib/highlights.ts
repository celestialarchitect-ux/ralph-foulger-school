// Student lesson highlights — server-backed when authenticated, with a
// localStorage mirror so the feature works for everyone (mirrors the pattern
// used by progress.ts and time-tracking.ts).
//
// A highlight is a character range [startOffset, endOffset) within a named text
// block (blockId) inside a chapter (chapterSlug). Blocks are the plain-text
// paragraphs the lesson renders, so offset math is reliable.

export type HighlightColor = 'gold' | 'ocean' | 'coral' | 'green';

export interface Highlight {
  id: string;
  chapterSlug: string;
  blockId: string;
  startOffset: number;
  endOffset: number;
  text: string;
  color: HighlightColor;
  note?: string | null;
  createdAt: number; // epoch ms
}

export const HIGHLIGHT_COLORS: HighlightColor[] = ['gold', 'ocean', 'coral', 'green'];

const LS_KEY = 'ralph-highlights-v1';

// ── localStorage mirror ──
export function loadLocal(): Highlight[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Highlight[]) : [];
  } catch {
    return [];
  }
}

function saveLocal(list: Highlight[]): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch { /* quota / private mode */ }
}

function upsertLocal(h: Highlight): void {
  const list = loadLocal().filter((x) => x.id !== h.id);
  list.push(h);
  saveLocal(list);
}

function removeLocal(id: string): void {
  saveLocal(loadLocal().filter((x) => x.id !== id));
}

// ── server-aware API (server is source of truth when reachable) ──

/** Fetch all of the current user's highlights. Falls back to the local mirror. */
export async function getHighlights(): Promise<Highlight[]> {
  try {
    const res = await fetch('/api/highlights', { cache: 'no-store' });
    if (res.ok) {
      const data = (await res.json()) as { highlights: Highlight[] };
      saveLocal(data.highlights); // keep the mirror fresh
      return data.highlights;
    }
  } catch { /* offline / not configured */ }
  return loadLocal();
}

/** Create a highlight. Writes locally immediately (optimistic), then tries the server. */
export async function addHighlight(
  input: Omit<Highlight, 'id' | 'createdAt'>,
): Promise<Highlight> {
  const local: Highlight = {
    ...input,
    id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `h_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    createdAt: Date.now(),
  };
  upsertLocal(local);
  try {
    const res = await fetch('/api/highlights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (res.ok) {
      const saved = (await res.json()) as { highlight: Highlight };
      // replace the optimistic local row with the server's canonical row
      removeLocal(local.id);
      upsertLocal(saved.highlight);
      return saved.highlight;
    }
  } catch { /* keep local */ }
  return local;
}

/** Delete a highlight everywhere. */
export async function removeHighlight(id: string): Promise<void> {
  removeLocal(id);
  try { await fetch(`/api/highlights?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); } catch { /* local already removed */ }
}

/** Set / update the optional note on a highlight. */
export async function setHighlightNote(id: string, note: string): Promise<void> {
  const list = loadLocal();
  const h = list.find((x) => x.id === id);
  if (h) { h.note = note; saveLocal(list); }
  try {
    await fetch('/api/highlights', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, note }),
    });
  } catch { /* local already updated */ }
}

// ── text segmentation for rendering ──

export interface Segment {
  text: string;
  highlight?: Highlight;
}

/**
 * Split a block's plain text into rendered segments given its highlights.
 * Ranges are clamped to the text length, sorted, and de-overlapped (later
 * highlights lose to earlier ones on conflict) so rendering never breaks.
 */
export function segmentText(text: string, ranges: Highlight[]): Segment[] {
  const valid = ranges
    .map((r) => ({ ...r, startOffset: Math.max(0, Math.min(r.startOffset, text.length)), endOffset: Math.max(0, Math.min(r.endOffset, text.length)) }))
    .filter((r) => r.endOffset > r.startOffset)
    .sort((a, b) => a.startOffset - b.startOffset);

  const segments: Segment[] = [];
  let cursor = 0;
  for (const r of valid) {
    if (r.startOffset < cursor) continue; // overlaps a prior highlight — skip
    if (r.startOffset > cursor) segments.push({ text: text.slice(cursor, r.startOffset) });
    segments.push({ text: text.slice(r.startOffset, r.endOffset), highlight: r });
    cursor = r.endOffset;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments;
}

/** CSS background for each highlight color (matches the academy theme). */
export const HIGHLIGHT_BG: Record<HighlightColor, string> = {
  gold: 'rgba(212, 175, 55, 0.34)',
  ocean: 'rgba(46, 134, 193, 0.30)',
  coral: 'rgba(255, 111, 97, 0.28)',
  green: 'rgba(45, 134, 89, 0.28)',
};
