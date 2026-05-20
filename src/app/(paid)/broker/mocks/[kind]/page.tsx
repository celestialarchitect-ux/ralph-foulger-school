'use client';

import Link from 'next/link';
import { use, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BROKER_EXAM_BANK, type BrokerExamQuestion } from '@/lib/content/broker-exam-bank';
import { T, CARD, BUTTON_3D } from '@/lib/theme';
import { Header, Footer, Backgrounds } from '@/components/Shell';

// Mock exam configurations, keyed by route param.
const MOCK_CONFIGS: Record<string, { label: string; nat: number; st: number; minutes: number; description: string }> = {
  'diagnostic':       { label: 'Diagnostic',        nat: 30, st: 20, minutes: 60,  description: 'Baseline mock — mixed national + state.' },
  'mock-national-1':  { label: 'National Mock 1',   nat: 80, st: 0,  minutes: 150, description: 'Full national portion under real PSI timing.' },
  'mock-state-1':     { label: 'Hawaii State Mock 1', nat: 0, st: 50, minutes: 90,  description: 'Full Hawaii state portion under real PSI timing.' },
  'mock-full-1':      { label: 'Full Exam Mock 1',  nat: 80, st: 50, minutes: 240, description: '130-question full-length mock, scored by portion.' },
  'mock-full-2':      { label: 'Full Exam Mock 2',  nat: 80, st: 50, minutes: 240, description: 'Alternate form. Different question pool. Endurance build.' },
  'mock-full-3':      { label: 'Full Exam Mock 3',  nat: 80, st: 50, minutes: 240, description: 'Final alternate form. Last full run before the real exam.' },
  'mock-tuneup':      { label: 'Final Tune-Up',     nat: 30, st: 20, minutes: 60,  description: 'Short targeted run on commonly missed broker categories.' },
};

interface SelectedQ extends BrokerExamQuestion {
  selected?: number;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickQuestions(portion: 'national' | 'state', count: number): SelectedQ[] {
  const pool = (BROKER_EXAM_BANK ?? []).filter(q => q.portion === portion);
  return shuffle(pool).slice(0, count);
}

export default function BrokerMockPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = use(params);
  const router = useRouter();
  const config = MOCK_CONFIGS[kind];
  const [questions, setQuestions] = useState<SelectedQ[] | null>(null);
  const [phase, setPhase] = useState<'ready' | 'taking' | 'graded'>('ready');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!config) return;
    setSecondsLeft(config.minutes * 60);
  }, [config]);

  const start = () => {
    if (!config) return;
    const nat = pickQuestions('national', config.nat);
    const st = pickQuestions('state', config.st);
    setQuestions([...nat, ...st]);
    setPhase('taking');
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('graded');
          setSubmitted(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const submit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('graded');
    setSubmitted(true);
  };

  const selectOption = (qIdx: number, optionIdx: number) => {
    setQuestions(q => q ? q.map((qq, i) => i === qIdx ? { ...qq, selected: optionIdx } : qq) : q);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timerLow = secondsLeft <= 300; // last 5 min

  const score = useMemo(() => {
    if (!submitted || !questions) return null;
    const natQ = questions.filter(q => q.portion === 'national');
    const stQ = questions.filter(q => q.portion === 'state');
    const natRight = natQ.filter(q => q.selected === q.correctIndex).length;
    const stRight = stQ.filter(q => q.selected === q.correctIndex).length;
    const natPct = natQ.length ? Math.round(natRight / natQ.length * 100) : null;
    const stPct = stQ.length ? Math.round(stRight / stQ.length * 100) : null;
    return { natQ, stQ, natRight, stRight, natPct, stPct };
  }, [submitted, questions]);

  if (!config) {
    return <Shell><p style={{ color: T.text }}>Mock not found.</p><Link href="/broker/mocks" style={{ color: T.ocean }}>← Back</Link></Shell>;
  }

  // Pool unavailable yet — show friendly notice.
  if ((BROKER_EXAM_BANK ?? []).length === 0) {
    return (
      <Shell>
        <Link href="/broker/mocks" style={{ color: T.textMute, fontSize: 13, textDecoration: 'none' }}>← Mock list</Link>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: T.text, marginTop: 16, marginBottom: 12 }}>{config.label}</h1>
        <p style={{ fontSize: 14, color: T.textDim, lineHeight: 1.6, marginBottom: 20 }}>
          The broker question bank is still being populated. Mock exams unlock when the bank is ready (usually within 24 hours of enrollment).
        </p>
        <Link href="/broker" style={{ ...BUTTON_3D.secondary, padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>← Broker home</Link>
      </Shell>
    );
  }

  if (phase === 'ready') {
    return (
      <Shell>
        <Link href="/broker/mocks" style={{ color: T.textMute, fontSize: 13, textDecoration: 'none' }}>← Mock list</Link>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 900, color: T.text, marginTop: 16, marginBottom: 12, letterSpacing: '-0.02em' }}>{config.label}</h1>
        <p style={{ fontSize: 16, color: T.textDim, lineHeight: 1.6, marginBottom: 28, maxWidth: 720 }}>{config.description}</p>

        <div style={{ ...CARD, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 18 }}>
            <Stat label="National Qs" value={`${config.nat}`} />
            <Stat label="State Qs" value={`${config.st}`} />
            <Stat label="Total Qs" value={`${config.nat + config.st}`} />
            <Stat label="Time" value={`${config.minutes} min`} />
            <Stat label="Pass" value="75% each portion" />
          </div>
        </div>

        <div style={{ ...CARD, padding: 22, marginBottom: 28, borderLeftWidth: 3, borderLeftColor: T.coral, borderLeftStyle: 'solid' }}>
          <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.22em', color: T.coral, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Heads up</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6, paddingLeft: 14, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: T.coral }}>·</span>Once you start, the timer runs continuously even if you switch tabs.</li>
            <li style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6, paddingLeft: 14, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: T.coral }}>·</span>You can skip questions and return — answers are saved as you go.</li>
            <li style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6, paddingLeft: 14, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: T.coral }}>·</span>Submit early if you finish before the timer runs out.</li>
            <li style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6, paddingLeft: 14, position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: T.coral }}>·</span>Scored per-portion — you can pass national but fail state, or vice versa.</li>
          </ul>
        </div>

        <button type="button" onClick={start} style={{ ...BUTTON_3D.primary, padding: '16px 32px', fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', borderRadius: 10, fontFamily: 'inherit' }}>
          Start the {config.label} →
        </button>
      </Shell>
    );
  }

  if (phase === 'taking' && questions) {
    return (
      <Shell>
        <div style={{ position: 'sticky', top: 0, zIndex: 50, background: T.bg, padding: '12px 0', borderBottom: `1px solid ${T.border}`, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.22em', color: T.coral, fontWeight: 700, textTransform: 'uppercase' }}>{config.label}</div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800, color: timerLow ? T.coral : T.text, letterSpacing: '0.02em' }}>
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
            <button type="button" onClick={submit} style={{ ...BUTTON_3D.secondary, padding: '8px 16px', fontSize: 12, fontWeight: 700, borderRadius: 8, fontFamily: 'inherit' }}>
              Submit now
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {questions.map((q, i) => (
            <div key={q.id + i} style={{ ...CARD, padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: q.portion === 'national' ? T.ocean : T.coral, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  Q{i + 1} · {q.portion}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: T.textMute, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  {q.category} · {q.difficulty}
                </span>
              </div>
              <div style={{ fontSize: 15, color: T.text, fontWeight: 500, lineHeight: 1.6, marginBottom: 14 }}>{q.q}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {q.options.map((opt, oi) => {
                  const isSelected = q.selected === oi;
                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => selectOption(i, oi)}
                      style={{
                        padding: '10px 14px',
                        textAlign: 'left',
                        border: `1px solid ${isSelected ? T.ocean : T.border}`,
                        background: isSelected ? 'rgba(20,131,123,0.08)' : 'transparent',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: 14,
                        color: T.text,
                        lineHeight: 1.55,
                        fontFamily: 'inherit',
                      }}
                    >
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.textMute, marginRight: 10, letterSpacing: '0.1em' }}>{String.fromCharCode(65 + oi)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button type="button" onClick={submit} style={{ ...BUTTON_3D.primary, padding: '14px 28px', fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', borderRadius: 10, fontFamily: 'inherit', marginTop: 24 }}>
          Submit exam
        </button>
      </Shell>
    );
  }

  if (phase === 'graded' && questions && score) {
    const natPass = score.natPct === null || score.natPct >= 75;
    const stPass = score.stPct === null || score.stPct >= 75;
    return (
      <Shell>
        <Link href="/broker/mocks" style={{ color: T.textMute, fontSize: 13, textDecoration: 'none' }}>← Mock list</Link>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 900, color: T.text, marginTop: 16, marginBottom: 16, letterSpacing: '-0.02em' }}>{config.label} · Results</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 28 }}>
          {score.natPct !== null && (
            <div style={{ ...CARD, padding: 22, borderLeftWidth: 3, borderLeftColor: natPass ? '#2d8659' : T.coral, borderLeftStyle: 'solid' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.22em', color: T.textMute, textTransform: 'uppercase', fontWeight: 700 }}>National</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 900, color: natPass ? '#2d8659' : T.coral, lineHeight: 1, marginTop: 8 }}>{score.natPct}%</div>
              <div style={{ fontSize: 13, color: T.textDim, marginTop: 6 }}>{score.natRight} of {score.natQ.length} correct · {natPass ? '✓ Pass' : '✗ Below 75%'}</div>
            </div>
          )}
          {score.stPct !== null && (
            <div style={{ ...CARD, padding: 22, borderLeftWidth: 3, borderLeftColor: stPass ? '#2d8659' : T.coral, borderLeftStyle: 'solid' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.22em', color: T.textMute, textTransform: 'uppercase', fontWeight: 700 }}>Hawaii State</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 900, color: stPass ? '#2d8659' : T.coral, lineHeight: 1, marginTop: 8 }}>{score.stPct}%</div>
              <div style={{ fontSize: 13, color: T.textDim, marginTop: 6 }}>{score.stRight} of {score.stQ.length} correct · {stPass ? '✓ Pass' : '✗ Below 75%'}</div>
            </div>
          )}
        </div>

        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, color: T.text, marginBottom: 14, letterSpacing: '-0.01em' }}>Review</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {questions.map((q, i) => {
            const right = q.selected === q.correctIndex;
            const answered = q.selected !== undefined;
            return (
              <div key={q.id + i} style={{ ...CARD, padding: 18, borderLeftWidth: 3, borderLeftColor: right ? '#2d8659' : answered ? T.coral : T.textGhost, borderLeftStyle: 'solid' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: q.portion === 'national' ? T.ocean : T.coral, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Q{i + 1} · {q.portion}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: right ? '#2d8659' : answered ? T.coral : T.textMute, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    {right ? '✓ correct' : answered ? '✗ missed' : 'skipped'}
                  </span>
                </div>
                <div style={{ fontSize: 14, color: T.text, fontWeight: 500, lineHeight: 1.55, marginBottom: 10 }}>{q.q}</div>
                <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.55, marginBottom: 6 }}>
                  <strong style={{ color: T.text }}>Correct answer:</strong> {q.options[q.correctIndex]}
                </div>
                {answered && !right && (
                  <div style={{ fontSize: 12, color: T.coralDark, lineHeight: 1.55, marginBottom: 6 }}>
                    <strong>Your answer:</strong> {q.options[q.selected!]}
                  </div>
                )}
                <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.55, fontStyle: 'italic' }}>{q.explain}</div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/broker/mocks" style={{ ...BUTTON_3D.secondary, padding: '12px 22px', fontSize: 13, fontWeight: 700, borderRadius: 10, textDecoration: 'none' }}>← Back to mocks</Link>
          <Link href="/broker/math" style={{ ...BUTTON_3D.primary, padding: '12px 22px', fontSize: 13, fontWeight: 700, borderRadius: 10, textDecoration: 'none' }}>Drill weak areas →</Link>
        </div>
      </Shell>
    );
  }

  return <Shell><p style={{ color: T.text }}>Preparing…</p></Shell>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Backgrounds />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Header active="/broker" />
        <main style={{ padding: '32px 32px 64px', maxWidth: 980, margin: '0 auto' }}>{children}</main>
        <Footer />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', color: T.textMute, fontWeight: 700, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: '-0.01em', marginTop: 4 }}>{value}</div>
    </div>
  );
}
