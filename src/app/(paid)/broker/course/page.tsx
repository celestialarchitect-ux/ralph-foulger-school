'use client';

import Link from 'next/link';
import { BROKER_CURRICULUM, BROKER_NATIONAL_TOTAL, BROKER_STATE_TOTAL } from '@/lib/curriculum-broker';
import { T, CARD, BUTTON_3D } from '@/lib/theme';
import { Header, Footer, Backgrounds } from '@/components/Shell';

// All 17 broker chapters in one scrollable list.
export default function BrokerCourseList() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Backgrounds />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Header active="/broker" />
        <main style={{ padding: '40px 32px', maxWidth: 1100, margin: '0 auto' }}>
          <Link href="/broker" style={{ color: T.textMute, fontSize: 13, textDecoration: 'none', marginBottom: 16, display: 'inline-block' }}>← Broker home</Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 900, letterSpacing: '-0.025em', color: T.text, lineHeight: 1.1, marginBottom: 12 }}>
            Broker Curriculum
          </h1>
          <p style={{ fontSize: 16, color: T.textDim, lineHeight: 1.6, maxWidth: 760, marginBottom: 32 }}>
            17 modules · 80 REC-approved hours · PSI-aligned. National Categories I–VIII first, then 9 Hawaii-specific broker sections. Read in order or jump to where you need work.
          </p>

          <Section
            title="National Portion"
            subtitle={`8 modules · ${BROKER_NATIONAL_TOTAL} of 130 exam items`}
            chapters={BROKER_CURRICULUM.filter(c => c.portion === 'national')}
            accent={T.ocean}
          />
          <Section
            title="Hawaii State Portion"
            subtitle={`9 modules · ${BROKER_STATE_TOTAL} of 130 exam items`}
            chapters={BROKER_CURRICULUM.filter(c => c.portion === 'state')}
            accent={T.coral}
          />
        </main>
        <Footer />
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  subtitle: string;
  chapters: typeof BROKER_CURRICULUM;
  accent: string;
}

function Section({ title, subtitle, chapters, accent }: SectionProps) {
  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: T.text, letterSpacing: '-0.02em', marginBottom: 6 }}>{title}</h2>
        <div style={{ fontSize: 13, color: T.textMute, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>{subtitle}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {chapters.map(ch => (
          <Link key={ch.slug} href={`/broker/course/${ch.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{ ...CARD, padding: '20px 22px', cursor: 'pointer', borderLeftWidth: 3, borderLeftColor: accent, borderLeftStyle: 'solid' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', color: accent, fontWeight: 700, textTransform: 'uppercase' }}>
                    Ch. {ch.number.toString().padStart(2, '0')}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    Category {ch.category} · {ch.examItems} items · {ch.estimatedMinutes}min
                  </span>
                </div>
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 800, color: T.text, lineHeight: 1.3, marginBottom: 6 }}>{ch.title}</div>
              <div style={{ fontSize: 14, color: T.textDim, lineHeight: 1.55, marginBottom: 10 }}>{ch.description}</div>
              {ch.brokerFocus.length > 0 && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.18em', color: T.textMute, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>Broker focus</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {ch.brokerFocus.map((f, i) => (
                      <li key={i} style={{ fontSize: 12, color: T.textDim, lineHeight: 1.55, paddingLeft: 14, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: accent }}>›</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
