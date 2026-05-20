'use client';

import Link from 'next/link';
import { T, CARD, BUTTON_3D } from '@/lib/theme';
import { Header, Footer, Backgrounds } from '@/components/Shell';

interface MockMeta {
  id: string;
  label: string;
  portion: 'national' | 'state' | 'full' | 'diagnostic' | 'tune-up';
  questions: number;
  minutes: number;
  when: string;
  body: string;
}

const MOCKS: MockMeta[] = [
  { id: 'diagnostic', label: 'Diagnostic', portion: 'diagnostic', questions: 50, minutes: 60, when: 'Week 1', body: 'Mixed national + state. Baseline your starting point so the platform knows what to drill you on.' },
  { id: 'mock-national-1', label: 'National Mock 1', portion: 'national', questions: 80, minutes: 150, when: 'After Modules 1-5', body: 'Full national portion under real exam timing. Score 70%+ before moving on.' },
  { id: 'mock-state-1', label: 'Hawaii State Mock 1', portion: 'state', questions: 50, minutes: 90, when: 'After Modules 1-8', body: 'Full Hawaii state portion. License law, trust accounts, HARPTA / FIRPTA, condo, contracts.' },
  { id: 'mock-full-1', label: 'Full Exam Mock 1', portion: 'full', questions: 130, minutes: 240, when: 'After all modules', body: 'Real-conditions simulation: 80 national + 50 state, scored independently. 75% to pass each.' },
  { id: 'mock-full-2', label: 'Full Exam Mock 2', portion: 'full', questions: 130, minutes: 240, when: 'Two weeks before exam', body: 'Alternative form. Different question pool. Build endurance and accuracy under pressure.' },
  { id: 'mock-full-3', label: 'Full Exam Mock 3', portion: 'full', questions: 130, minutes: 240, when: 'One week before exam', body: 'Third alternative form. Last full-length run before exam day.' },
  { id: 'mock-tuneup', label: 'Final Tune-Up', portion: 'tune-up', questions: 50, minutes: 60, when: '2 days before exam', body: 'Targeted at your weak areas based on prior mock performance. Confidence-builder, not a stress test.' },
];

const ACCENT_BY_PORTION: Record<MockMeta['portion'], string> = {
  diagnostic: '#c4881e',
  national: '#14837b',
  state: '#c14628',
  full: '#1f2937',
  'tune-up': '#2d8659',
};

export default function BrokerMocksPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Backgrounds />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Header active="/broker" />
        <main style={{ padding: '40px 32px', maxWidth: 1080, margin: '0 auto' }}>
          <Link href="/broker" style={{ color: T.textMute, fontSize: 13, textDecoration: 'none', marginBottom: 16, display: 'inline-block' }}>← Broker home</Link>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.22em', color: T.coral, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>
              Tier 4 · Broker mock exams
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 900, letterSpacing: '-0.025em', color: T.text, lineHeight: 1.1, marginBottom: 12 }}>
              7 timed mocks. Real conditions.
            </h1>
            <p style={{ fontSize: 16, color: T.textDim, lineHeight: 1.6, maxWidth: 760 }}>
              Diagnostic baseline · 3 portion mocks (1 national, 2 state) · 3 full-length 130-question exams · 1 final tune-up. Same timing as PSI. Same 75% passing threshold per portion.
            </p>
          </div>

          <div style={{ ...CARD, padding: 22, marginBottom: 28, borderLeftWidth: 3, borderLeftColor: T.coral, borderLeftStyle: 'solid' }}>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.22em', color: T.coral, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
              Why 75%, not 70%
            </div>
            <p style={{ fontSize: 14, color: T.textDim, lineHeight: 1.6, margin: 0 }}>
              Hawaii broker candidates must score <strong style={{ color: T.text }}>75% on each portion</strong> — both national and state — to pass. Salesperson candidates only need 70%. We score every mock to that broker standard so the day-of-exam shock is zero.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {MOCKS.map(m => (
              <Link key={m.id} href={`/broker/mocks/${m.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ ...CARD, padding: 22, borderLeftWidth: 3, borderLeftColor: ACCENT_BY_PORTION[m.portion], borderLeftStyle: 'solid', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', color: ACCENT_BY_PORTION[m.portion], fontWeight: 700, textTransform: 'uppercase' }}>
                        {m.portion}
                      </span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                        {m.questions} Q · {m.minutes} min
                      </span>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.textMute, fontWeight: 600, letterSpacing: '0.1em' }}>{m.when}</span>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: T.text, lineHeight: 1.3, marginBottom: 6 }}>{m.label}</div>
                  <div style={{ fontSize: 14, color: T.textDim, lineHeight: 1.55 }}>{m.body}</div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ ...CARD, padding: 22, marginTop: 32 }}>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.22em', color: T.ocean, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>
              Pass guarantee qualification
            </div>
            <p style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6, margin: 0 }}>
              Complete all 17 modules, take all 6 full-length / portion mocks, and score 75%+ on Mock 2 and Mock 3 (the last two full-length runs). If you then take the real PSI broker exam and don&apos;t pass on your first attempt, you get a free 365-day re-enrollment to try again. Submit your unofficial PSI score report to support@ralphfoulger.com within 30 days of the exam.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
