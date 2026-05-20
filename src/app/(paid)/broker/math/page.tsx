'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { BROKER_MATH_PROBLEMS, type BrokerMathProblem } from '@/lib/content/broker-math';
import { T, CARD, BUTTON_3D } from '@/lib/theme';
import { Header, Footer, Backgrounds } from '@/components/Shell';

const CATEGORY_LABELS: Record<BrokerMathProblem['category'], string> = {
  'proration': 'Proration',
  'commission': 'Commission Splits & Overrides',
  'cap-rate': 'Cap Rate / NOI',
  'ltv': 'Loan-to-Value',
  'dscr': 'Debt Service Coverage',
  'grm': 'Gross Rent Multiplier',
  'depreciation': 'Depreciation',
  'capital-gains': 'Capital Gains',
  'exchange-1031': '1031 Exchange',
  'amortization': 'Mortgage Amortization',
  'points': 'Points & Discount',
  'closing-statement': 'Closing Statement',
  'area': 'Area / Sq Footage',
  't-bar': 'T-Bar Method',
  'percentage': 'Percentage',
  'appreciation': 'Appreciation',
  'equity': 'Equity',
  'lease-economics': 'Lease Economics',
  'pv-fv': 'Present / Future Value',
  'property-tax': 'Property Tax',
  'insurance': 'Insurance',
  'breakeven': 'Breakeven',
};

const DIFFICULTY_COLOR = {
  easy: '#2d8659',
  medium: '#c4881e',
  hard: '#c14628',
} as const;

export default function BrokerMathPage() {
  const [category, setCategory] = useState<BrokerMathProblem['category'] | 'all'>('all');
  const [difficulty, setDifficulty] = useState<BrokerMathProblem['difficulty'] | 'all'>('all');

  const filtered = useMemo(() => {
    const items = BROKER_MATH_PROBLEMS ?? [];
    return items.filter(p => {
      if (category !== 'all' && p.category !== category) return false;
      if (difficulty !== 'all' && p.difficulty !== difficulty) return false;
      return true;
    });
  }, [category, difficulty]);

  const totalByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    (BROKER_MATH_PROBLEMS ?? []).forEach(p => { map[p.category] = (map[p.category] ?? 0) + 1; });
    return map;
  }, []);

  const allCategories = Object.keys(CATEGORY_LABELS) as BrokerMathProblem['category'][];

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Backgrounds />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Header active="/broker" />
        <main style={{ padding: '40px 32px', maxWidth: 1100, margin: '0 auto' }}>
          <Link href="/broker" style={{ color: T.textMute, fontSize: 13, textDecoration: 'none', marginBottom: 16, display: 'inline-block' }}>← Broker home</Link>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.22em', color: T.coral, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>
              Tier 4 · Broker math drill bank
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 900, letterSpacing: '-0.025em', color: T.text, lineHeight: 1.1, marginBottom: 12 }}>
              {(BROKER_MATH_PROBLEMS ?? []).length}+ broker math problems.
            </h1>
            <p style={{ fontSize: 16, color: T.textDim, lineHeight: 1.6, maxWidth: 760 }}>
              22 categories, original problems, full step-by-step solutions, pitfall callouts on medium and hard problems. Math is the single biggest difficulty jump from salesperson to broker — this is where you put in the reps.
            </p>
          </div>

          {/* Filters */}
          <div style={{ ...CARD, padding: 18, marginBottom: 24 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              <FilterChip active={category === 'all'} label={`All (${(BROKER_MATH_PROBLEMS ?? []).length})`} onClick={() => setCategory('all')} />
              {allCategories.map(c => {
                const count = totalByCategory[c] ?? 0;
                if (count === 0) return null;
                return (
                  <FilterChip
                    key={c}
                    active={category === c}
                    label={`${CATEGORY_LABELS[c]} (${count})`}
                    onClick={() => setCategory(c)}
                  />
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
              <FilterChip active={difficulty === 'all'} label="All difficulties" onClick={() => setDifficulty('all')} />
              <FilterChip active={difficulty === 'easy'} label="Easy" onClick={() => setDifficulty('easy')} color={DIFFICULTY_COLOR.easy} />
              <FilterChip active={difficulty === 'medium'} label="Medium" onClick={() => setDifficulty('medium')} color={DIFFICULTY_COLOR.medium} />
              <FilterChip active={difficulty === 'hard'} label="Hard" onClick={() => setDifficulty('hard')} color={DIFFICULTY_COLOR.hard} />
            </div>
          </div>

          {/* Problem list */}
          {filtered.length === 0 ? (
            <div style={{ ...CARD, padding: 36, textAlign: 'center' }}>
              <p style={{ color: T.textDim, fontSize: 14, lineHeight: 1.6 }}>
                No problems match those filters yet. The drill bank is still being populated for some categories.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filtered.map(p => <MathCard key={p.id} p={p} />)}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}

function FilterChip({ active, label, onClick, color }: { active: boolean; label: string; onClick: () => void; color?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'inherit',
        cursor: 'pointer',
        border: `1px solid ${active ? (color ?? T.ocean) : T.border}`,
        background: active ? (color ?? T.ocean) : 'transparent',
        color: active ? '#fff' : T.textDim,
        letterSpacing: '0.02em',
      }}
    >
      {label}
    </button>
  );
}

function MathCard({ p }: { p: BrokerMathProblem }) {
  return (
    <details style={{ ...CARD, padding: '18px 22px' }}>
      <summary style={{ cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', color: T.textMute, fontWeight: 700, textTransform: 'uppercase' }}>
              {p.id}
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em', color: T.coral, fontWeight: 700, textTransform: 'uppercase' }}>
              {CATEGORY_LABELS[p.category] ?? p.category}
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: DIFFICULTY_COLOR[p.difficulty], textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              {p.difficulty}
            </span>
          </div>
          <div style={{ fontSize: 14, color: T.text, fontWeight: 500, lineHeight: 1.55 }}>{p.question}</div>
        </div>
      </summary>
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
        {p.given.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', color: T.textMute, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Given</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {p.given.map((g, i) => (
                <li key={i} style={{ fontSize: 13, color: T.textDim, lineHeight: 1.55, paddingLeft: 14, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: T.ocean }}>·</span>{g}
                </li>
              ))}
            </ul>
          </div>
        )}
        {p.formula && (
          <div style={{ marginBottom: 12, padding: '10px 14px', background: T.bgRaised, borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: T.text, letterSpacing: '0.02em' }}>
            <strong style={{ color: T.ocean }}>Formula:</strong> {p.formula}
          </div>
        )}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', color: T.textMute, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Steps</div>
          <ol style={{ paddingLeft: 22, margin: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {p.steps.map((s, i) => (
              <li key={i} style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6 }}>{s}</li>
            ))}
          </ol>
        </div>
        <div style={{ padding: '10px 14px', background: 'rgba(45,134,89,0.08)', borderRadius: 8, borderLeft: '3px solid #2d8659' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', color: '#2d8659', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Answer</div>
          <div style={{ fontSize: 14, color: T.text, fontWeight: 700 }}>{p.answer}</div>
        </div>
        {p.pitfall && (
          <div style={{ marginTop: 10, padding: '10px 14px', background: 'rgba(193,70,40,0.08)', borderRadius: 8, borderLeft: '3px solid #c14628' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', color: '#c14628', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Common pitfall</div>
            <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.55 }}>{p.pitfall}</div>
          </div>
        )}
      </div>
    </details>
  );
}
