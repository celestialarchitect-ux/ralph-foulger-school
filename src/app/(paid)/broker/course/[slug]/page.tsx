'use client';

import Link from 'next/link';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { getBrokerChapter, brokerNeighbors } from '@/lib/curriculum-broker';
import { BROKER_NATIONAL_CONTENT } from '@/lib/content/broker-national';
import { BROKER_STATE_CONTENT } from '@/lib/content/broker-state';
import type { ChapterContent } from '@/lib/content/national';
import { T, CARD, BUTTON_3D } from '@/lib/theme';
import { Header, Footer, Backgrounds } from '@/components/Shell';
import { VoicePlayer } from '@/components/VoicePlayer';

// Single broker chapter page — mirrors /course/[slug] but uses BROKER_*
// content sources. Same VoicePlayer + Overview/Concepts/Practice structure.
export default function BrokerChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const meta = getBrokerChapter(slug);
  const content: ChapterContent | undefined = [...BROKER_NATIONAL_CONTENT, ...BROKER_STATE_CONTENT].find(c => c.slug === slug);

  if (!meta) {
    return (
      <Shell>
        <p style={{ color: T.text }}>Chapter not found.</p>
        <Link href="/broker/course" style={{ color: T.ocean }}>← Back to broker course</Link>
      </Shell>
    );
  }
  if (!content) {
    return (
      <Shell>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, color: T.text, marginBottom: 12 }}>
          {meta.title}
        </h1>
        <p style={{ fontSize: 14, color: T.textDim, marginBottom: 18 }}>
          This module&rsquo;s content is being finalized. Check back shortly.
        </p>
        <Link href="/broker/course" style={{ ...BUTTON_3D.secondary, padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          ← Back to broker course
        </Link>
      </Shell>
    );
  }

  const accent = meta.portion === 'national' ? T.ocean : T.coral;
  const { prev, next } = brokerNeighbors(slug);

  return (
    <Shell>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <Link href="/broker/course" style={{ color: T.textMute, fontSize: 13, textDecoration: 'none' }}>← Broker course</Link>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.18em', color: accent, textTransform: 'uppercase', fontWeight: 700 }}>
          Ch. {meta.number.toString().padStart(2, '0')} · {meta.portion} · Cat {meta.category} · {meta.examItems}Q
        </span>
      </div>

      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.025em', color: T.text, lineHeight: 1.1, marginBottom: 12 }}>
        {meta.title}
      </h1>
      <p style={{ fontSize: 17, color: T.textDim, lineHeight: 1.55, fontStyle: 'italic', marginBottom: 24 }}>{content.intro}</p>

      <div style={{ marginBottom: 32 }}>
        <VoicePlayer sections={[
          { label: `Broker Ch. ${meta.number}: ${meta.title}`, text: content.intro },
          { label: 'Overview', text: content.overview.join(' ') },
          { label: 'Key Concepts', text: content.concepts.map(c => `${c.term}. ${c.body}${c.hawaiiNote ? ' Hawaii note: ' + c.hawaiiNote : ''}`).join(' ') },
        ]} />
      </div>

      <article style={{ ...CARD, padding: 36, marginBottom: 24 }}>
        <SectionH>Overview</SectionH>
        {content.overview.map((p, i) => (
          <p key={i} style={{ fontSize: 16, color: T.textDim, lineHeight: 1.75, marginBottom: 16 }}>{p}</p>
        ))}
      </article>

      {meta.brokerFocus.length > 0 && (
        <article style={{ ...CARD, padding: 28, marginBottom: 24, borderLeftWidth: 3, borderLeftColor: accent, borderLeftStyle: 'solid' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.22em', color: accent, textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>
            What makes this broker-depth
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {meta.brokerFocus.map((f, i) => (
              <li key={i} style={{ fontSize: 14, color: T.text, lineHeight: 1.6, paddingLeft: 18, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: accent, fontWeight: 700 }}>›</span>
                {f}
              </li>
            ))}
          </ul>
        </article>
      )}

      <article style={{ ...CARD, padding: 36, marginBottom: 24 }}>
        <SectionH>Key Concepts</SectionH>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {content.concepts.map(k => (
            <div key={k.term} style={{ padding: 16, background: T.bgRaised, borderRadius: 8, borderLeft: `3px solid ${accent}` }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 800, color: T.text, marginBottom: 6 }}>{k.term}</div>
              <p style={{ fontSize: 14, color: T.textDim, lineHeight: 1.6 }}>{k.body}</p>
              {k.hawaiiNote && <p style={{ fontSize: 12, color: T.coralDark, marginTop: 6, fontStyle: 'italic' }}>Hawaii: {k.hawaiiNote}</p>}
            </div>
          ))}
        </div>
      </article>

      <article style={{ ...CARD, padding: 36, marginBottom: 32 }}>
        <SectionH>Practice Questions</SectionH>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {content.practice.map((p, i) => <PracticeQ key={i} idx={i} q={p} accent={accent} />)}
        </div>
      </article>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        {prev && (
          <Link href={`/broker/course/${prev.slug}`} style={{ ...BUTTON_3D.secondary, flex: '1 1 200px', padding: '14px 22px', fontSize: 13, fontWeight: 600, borderRadius: 10, textDecoration: 'none', textAlign: 'center' }}>
            ← {prev.title}
          </Link>
        )}
        {next && (
          <Link href={`/broker/course/${next.slug}`} style={{ ...BUTTON_3D.primary, flex: '1 1 200px', padding: '14px 22px', fontSize: 13, fontWeight: 700, borderRadius: 10, textDecoration: 'none', textAlign: 'center' }}>
            {next.title} →
          </Link>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Backgrounds />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Header active="/broker" />
        <main style={{ padding: '32px 32px 48px', maxWidth: 880, margin: '0 auto' }}>{children}</main>
        <Footer />
      </div>
    </div>
  );
}

function SectionH({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.22em', color: T.textMute, textTransform: 'uppercase', fontWeight: 700, marginBottom: 18 }}>{children}</div>
  );
}

function PracticeQ({ idx, q, accent }: { idx: number; q: { q: string; options: [string, string, string, string]; correctIndex: 0 | 1 | 2 | 3; explain: string }; accent: string }) {
  return (
    <details style={{ background: T.bgRaised, borderRadius: 10, padding: '14px 18px', border: `1px solid ${T.border}` }}>
      <summary style={{ cursor: 'pointer', fontSize: 14, color: T.text, fontWeight: 600, lineHeight: 1.5 }}>
        <strong style={{ color: accent, marginRight: 8 }}>Q{idx + 1}.</strong>{q.q}
      </summary>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
        <ol style={{ paddingLeft: 22, margin: '0 0 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {q.options.map((opt, i) => (
            <li key={i} style={{ fontSize: 13, color: i === q.correctIndex ? T.text : T.textDim, fontWeight: i === q.correctIndex ? 700 : 400, lineHeight: 1.5 }}>
              {opt} {i === q.correctIndex && <span style={{ color: T.green, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', marginLeft: 6 }}>✓ correct</span>}
            </li>
          ))}
        </ol>
        <p style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
          {q.explain}
        </p>
      </div>
    </details>
  );
}
