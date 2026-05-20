'use client';

import Link from 'next/link';
import {
  BROKER_CURRICULUM,
  BROKER_NATIONAL_TOTAL,
  BROKER_STATE_TOTAL,
  BROKER_PASSING_PCT,
  BROKER_TOTAL_QUESTIONS,
  BROKER_REC_HOURS,
  BROKER_TOTAL_STUDY_HOURS,
} from '@/lib/curriculum-broker';
import { T, CARD, BUTTON_3D } from '@/lib/theme';
import { Header, Footer, Backgrounds } from '@/components/Shell';

// Broker (Tier 4) dashboard. Linked to from header nav for tier='broker' users.
// Mirrors /course but uses BROKER_CURRICULUM and the broker-specific routes.
export default function BrokerHome() {
  const nationalChapters = BROKER_CURRICULUM.filter(c => c.portion === 'national');
  const stateChapters = BROKER_CURRICULUM.filter(c => c.portion === 'state');

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Backgrounds />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Header active="/broker" />
        <main style={{ padding: '48px 32px', maxWidth: 1180, margin: '0 auto' }}>
          {/* Hero */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.22em', color: T.coral, textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>
              Tier 4 · Hawaii Broker License Prep
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 900, letterSpacing: '-0.025em', color: T.text, lineHeight: 1.05, marginBottom: 16 }}>
              From salesperson to broker.
            </h1>
            <p style={{ fontSize: 17, color: T.textDim, lineHeight: 1.6, maxWidth: 760 }}>
              The Hawaii broker exam tests deeper than salesperson — 130 questions, 75% to pass each portion (national + state). This course is built for that.
            </p>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 32 }}>
            <StatCard label="REC Hours" value={`${BROKER_REC_HOURS}`} sub="approved curriculum" />
            <StatCard label="Total Study" value={`${BROKER_TOTAL_STUDY_HOURS}h`} sub="incl. drills + mocks" />
            <StatCard label="National Items" value={`${BROKER_NATIONAL_TOTAL}`} sub="8 PSI categories" />
            <StatCard label="State Items" value={`${BROKER_STATE_TOTAL}`} sub="9 HI sections" />
            <StatCard label="Total Q" value={`${BROKER_TOTAL_QUESTIONS}`} sub="per real exam" />
            <StatCard label="Pass Score" value={`${BROKER_PASSING_PCT}%`} sub="per portion" />
          </div>

          {/* Primary CTAs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
            <ActionCard
              accent={T.coral}
              kicker="01 · The Hero Module"
              title="Closing Statement Workshop"
              body="Full CD reconciliation — prorations, HARPTA / FIRPTA withholding, conveyance tax, every line to the penny."
              href="/broker/workshop"
              cta="Open workshop →"
            />
            <ActionCard
              accent={T.ocean}
              kicker="02 · Curriculum"
              title="17 Broker-Depth Modules"
              body={`${BROKER_REC_HOURS} hours of REC-aligned content covering all 8 PSI national categories and 9 Hawaii broker sections.`}
              href="/broker/course"
              cta="Browse modules →"
            />
            <ActionCard
              accent={T.coral}
              kicker="03 · Math drills"
              title="300+ Broker Math Problems"
              body="22 categories, spaced repetition, step-by-step solutions with pitfall callouts. Math is where salespeople fail the broker exam."
              href="/broker/math"
              cta="Open drills →"
            />
            <ActionCard
              accent={T.ocean}
              kicker="04 · Mocks"
              title="6 Full-Length Timed Mocks"
              body="3 national (80Q) + 3 Hawaii state (50Q). Real timer, real scoring. 75% to pass each portion."
              href="/broker/mocks"
              cta="See mock list →"
            />
          </div>

          {/* Eligibility reminder */}
          <div style={{ ...CARD, padding: 24, marginBottom: 32, borderLeftWidth: 4, borderLeftColor: T.coral, borderLeftStyle: 'solid' }}>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.22em', color: T.coral, textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>
              Important · Broker Experience Certificate
            </div>
            <p style={{ fontSize: 14, color: T.textDim, lineHeight: 1.65, margin: 0 }}>
              Before PSI will let you sit the broker exam, you must apply for and receive the <strong style={{ color: T.text }}>Broker Experience Certificate</strong> from the Hawaii REC under HAR §16-99-19.2. This requires 3 full years of full-time (40+ hrs/wk) HI salesperson activity within the prior 5 years, plus principal-broker attestations. Apply early — processing can take weeks. <a href="https://cca.hawaii.gov/reb/rec_forms/eaf_brkexp/" target="_blank" rel="noopener" style={{ color: T.coral, textDecoration: 'underline' }}>REC form & instructions →</a>
            </p>
          </div>

          {/* National chapters */}
          <ChapterSection
            title="National Portion · PSI Categories I–VIII"
            subtitle={`${BROKER_NATIONAL_TOTAL} of ${BROKER_TOTAL_QUESTIONS} exam items · 8 modules`}
            chapters={nationalChapters}
            accent={T.ocean}
          />

          {/* Hawaii state chapters */}
          <ChapterSection
            title="Hawaii State Portion · Broker-Depth"
            subtitle={`${BROKER_STATE_TOTAL} of ${BROKER_TOTAL_QUESTIONS} exam items · 9 modules`}
            chapters={stateChapters}
            accent={T.coral}
          />
        </main>
        <Footer />
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div style={{ ...CARD, padding: '16px 18px' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: T.textMute, textTransform: 'uppercase', fontWeight: 700 }}>{label}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: T.text, letterSpacing: '-0.02em', lineHeight: 1, marginTop: 6 }}>{value}</div>
      <div style={{ fontSize: 12, color: T.textMute, marginTop: 4, lineHeight: 1.4 }}>{sub}</div>
    </div>
  );
}

function ActionCard({ accent, kicker, title, body, href, cta }: { accent: string; kicker: string; title: string; body: string; href: string; cta: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{ ...CARD, padding: 22, height: '100%', display: 'flex', flexDirection: 'column', borderLeftWidth: 3, borderLeftColor: accent, borderLeftStyle: 'solid', cursor: 'pointer' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: accent, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>{kicker}</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: T.text, lineHeight: 1.2, marginBottom: 10 }}>{title}</div>
        <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.55, marginBottom: 16, flex: 1 }}>{body}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>{cta}</div>
      </div>
    </Link>
  );
}

interface ChapterSectionProps {
  title: string;
  subtitle: string;
  chapters: typeof BROKER_CURRICULUM;
  accent: string;
}

function ChapterSection({ title, subtitle, chapters, accent }: ChapterSectionProps) {
  return (
    <section style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: T.text, letterSpacing: '-0.02em', marginBottom: 4 }}>{title}</h2>
          <div style={{ fontSize: 13, color: T.textMute, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {chapters.map(ch => (
          <Link key={ch.slug} href={`/broker/course/${ch.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{ ...CARD, padding: 18, height: '100%', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', color: accent, fontWeight: 700, textTransform: 'uppercase' }}>
                  Ch. {ch.number.toString().padStart(2, '0')} · {ch.examItems}Q
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.textMute, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  {ch.estimatedMinutes}m
                </div>
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 800, color: T.text, lineHeight: 1.3, marginBottom: 6 }}>{ch.title}</div>
              <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.55 }}>{ch.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
