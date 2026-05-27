'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { T, CARD } from '@/lib/theme';
import { CURRICULUM } from '@/lib/curriculum';
import { getHighlights, removeHighlight, setHighlightNote, HIGHLIGHT_BG, type Highlight } from '@/lib/highlights';
import { addUserCard } from '@/lib/user-cards';

const TITLE = Object.fromEntries(CURRICULUM.map((c) => [c.slug, c.title]));
const ORDER = Object.fromEntries(CURRICULUM.map((c, i) => [c.slug, i]));

export function HighlightsArchive() {
  const [items, setItems] = useState<Highlight[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [savedCards, setSavedCards] = useState<Set<string>>(new Set());

  function saveAsCard(h: Highlight) {
    addUserCard({
      term: (h.note && h.note.trim()) || `${TITLE[h.chapterSlug] ?? 'Lesson'} — recall`,
      definition: h.text,
      sourceSlug: h.chapterSlug,
    });
    setSavedCards((prev) => new Set(prev).add(h.id));
  }
  const askTutorHref = (h: Highlight) =>
    `/tutor?q=${encodeURIComponent(`Explain this passage from the "${TITLE[h.chapterSlug] ?? 'course'}" chapter and why it matters for the Hawaii salesperson exam:\n\n"${h.text}"`)}`;

  useEffect(() => {
    let alive = true;
    getHighlights().then((all) => { if (alive) { setItems(all); setLoaded(true); } });
    return () => { alive = false; };
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, Highlight[]>();
    for (const h of items) {
      if (!map.has(h.chapterSlug)) map.set(h.chapterSlug, []);
      map.get(h.chapterSlug)!.push(h);
    }
    return [...map.entries()].sort((a, b) => (ORDER[a[0]] ?? 99) - (ORDER[b[0]] ?? 99));
  }, [items]);

  async function remove(id: string) {
    setItems((prev) => prev.filter((h) => h.id !== id));
    await removeHighlight(id);
  }
  async function saveNote(id: string) {
    const note = draft.trim();
    setItems((prev) => prev.map((h) => (h.id === id ? { ...h, note } : h)));
    setEditing(null);
    await setHighlightNote(id, note);
  }

  return (
    <div style={{ ...CARD, padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, color: T.text }}>Your Highlights</h2>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: T.textMute }}>{items.length} saved</span>
      </div>
      <p style={{ fontSize: 13, color: T.textMute, marginBottom: 20 }}>
        Everything you marked while studying, grouped by chapter. Select any text in a lesson to highlight it.
      </p>

      {!loaded ? (
        <p style={{ color: T.textMute, fontSize: 13 }}>Loading…</p>
      ) : items.length === 0 ? (
        <p style={{ color: T.textMute, fontSize: 14, fontStyle: 'italic' }}>
          No highlights yet. Open a chapter, select a sentence, and pick a color to save it here.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {grouped.map(([slug, list]) => (
            <div key={slug}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <Link href={`/course/${slug}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.ocean, fontWeight: 700, textDecoration: 'none' }}>
                  {TITLE[slug] ?? slug} →
                </Link>
                <span style={{ fontSize: 11, color: T.textMute, fontFamily: "'JetBrains Mono', monospace" }}>{list.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {list.sort((a, b) => a.createdAt - b.createdAt).map((h) => (
                  <div key={h.id} style={{ background: T.bgRaised, borderRadius: 8, borderLeft: `4px solid ${HIGHLIGHT_BG[h.color].replace(/0\.\d+\)/, '0.9)')}`, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                      <p style={{ fontSize: 14, color: T.textDim, lineHeight: 1.55, margin: 0, fontStyle: 'italic' }}>“{h.text}”</p>
                      <button onClick={() => remove(h.id)} aria-label="Remove highlight"
                        style={{ flexShrink: 0, background: 'none', border: 'none', color: T.textMute, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
                    </div>
                    {editing === h.id ? (
                      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                        <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') saveNote(h.id); if (e.key === 'Escape') setEditing(null); }}
                          placeholder="Add a note…"
                          style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: `1px solid ${T.border}`, background: T.bg, color: T.text, fontSize: 13, fontFamily: 'inherit' }} />
                        <button onClick={() => saveNote(h.id)} style={{ ...BTN, color: T.ocean }}>Save</button>
                      </div>
                    ) : h.note ? (
                      <p onClick={() => { setEditing(h.id); setDraft(h.note ?? ''); }} style={{ marginTop: 6, fontSize: 12.5, color: T.text, cursor: 'text' }}>
                        <span style={{ color: T.textMute }}>Note: </span>{h.note}
                      </p>
                    ) : (
                      <button onClick={() => { setEditing(h.id); setDraft(''); }} style={{ ...BTN, marginTop: 6, color: T.textMute }}>+ add note</button>
                    )}
                    <div style={{ display: 'flex', gap: 16, marginTop: 10, alignItems: 'center' }}>
                      <button onClick={() => saveAsCard(h)} disabled={savedCards.has(h.id)} style={{ ...BTN, color: savedCards.has(h.id) ? T.green : T.coralDark }}>
                        {savedCards.has(h.id) ? 'Saved to flashcards ✓' : 'Save as flashcard'}
                      </button>
                      <Link href={askTutorHref(h)} style={{ ...BTN, color: T.ocean, textDecoration: 'none' }}>Ask the tutor →</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const BTN: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', padding: 0, fontWeight: 600 };
