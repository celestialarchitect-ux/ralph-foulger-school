'use client';

import { useRef, useState, type CSSProperties } from 'react';
import {
  segmentText,
  HIGHLIGHT_BG,
  HIGHLIGHT_COLORS,
  type Highlight,
  type HighlightColor,
} from '@/lib/highlights';

interface Props {
  blockId: string;
  text: string;
  highlights: Highlight[]; // already filtered to this block
  onAdd: (h: { blockId: string; startOffset: number; endOffset: number; text: string; color: HighlightColor }) => void;
  onRemove: (id: string) => void;
  style?: CSSProperties;
}

// Walk text nodes inside `root` and return the absolute character offset of
// (node, offset) within root's full plain text. Robust to the text being split
// across multiple text nodes by existing <mark> spans.
function offsetWithin(root: Node, node: Node | null, nodeOffset: number): number | null {
  if (!node || !root.contains(node)) return null;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let acc = 0;
  let n = walker.nextNode();
  while (n) {
    if (n === node) return acc + nodeOffset;
    acc += (n.textContent ?? '').length;
    n = walker.nextNode();
  }
  return null;
}

export function Highlightable({ blockId, text, highlights, onAdd, onRemove, style }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [pending, setPending] = useState<{ start: number; end: number; text: string; x: number; y: number } | null>(null);

  function handleMouseUp() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !ref.current) { setPending(null); return; }
    let start = offsetWithin(ref.current, sel.anchorNode, sel.anchorOffset);
    let end = offsetWithin(ref.current, sel.focusNode, sel.focusOffset);
    if (start == null || end == null) { setPending(null); return; } // selection spans outside this block
    if (start > end) [start, end] = [end, start];
    if (end - start < 2) { setPending(null); return; } // ignore stray micro-selections
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    setPending({ start, end, text: text.slice(start, end), x: rect.left + rect.width / 2, y: rect.top });
  }

  function commit(color: HighlightColor) {
    if (!pending) return;
    onAdd({ blockId, startOffset: pending.start, endOffset: pending.end, text: pending.text, color });
    setPending(null);
    window.getSelection()?.removeAllRanges();
  }

  const segments = segmentText(text, highlights);

  return (
    <>
      <p ref={ref} onMouseUp={handleMouseUp} style={style}>
        {segments.map((seg, i) =>
          seg.highlight ? (
            <mark
              key={i}
              title="Click to remove highlight"
              onClick={() => { if (window.getSelection()?.isCollapsed) onRemove(seg.highlight!.id); }}
              style={{
                background: HIGHLIGHT_BG[seg.highlight.color],
                color: 'inherit',
                borderRadius: 3,
                padding: '0 1px',
                cursor: 'pointer',
                boxShadow: seg.highlight.note ? `inset 0 -2px 0 ${HIGHLIGHT_BG[seg.highlight.color]}` : undefined,
              }}
            >
              {seg.text}
            </mark>
          ) : (
            <span key={i}>{seg.text}</span>
          ),
        )}
      </p>

      {pending && (
        <div
          role="toolbar"
          style={{
            position: 'fixed',
            left: Math.max(12, Math.min(pending.x - 90, (typeof window !== 'undefined' ? window.innerWidth : 400) - 192)),
            top: Math.max(8, pending.y - 48),
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 10px',
            background: '#13110c',
            border: '1px solid rgba(212,175,55,0.4)',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
          onMouseDown={(e) => e.preventDefault()} // keep the text selection alive while clicking
        >
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a99', marginRight: 2 }}>Highlight</span>
          {HIGHLIGHT_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => commit(c)}
              aria-label={`Highlight ${c}`}
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: '1.5px solid rgba(255,255,255,0.6)',
                background: HIGHLIGHT_BG[c].replace(/0\.\d+\)/, '0.95)'),
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
          <button
            onClick={() => { setPending(null); window.getSelection()?.removeAllRanges(); }}
            aria-label="Cancel"
            style={{ marginLeft: 2, background: 'none', border: 'none', color: '#a99', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}
          >×</button>
        </div>
      )}
    </>
  );
}
