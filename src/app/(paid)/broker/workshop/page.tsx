'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BROKER_CLOSING_WORKSHOP, type WorkshopSection } from '@/lib/content/broker-closing-workshop';
import { T, CARD, BUTTON_3D } from '@/lib/theme';
import { Header, Footer, Backgrounds } from '@/components/Shell';

// Closing Statement Workshop — Tier 4 hero deliverable.
// Walks students through the full Closing Disclosure (CD) reconciliation
// process with worked examples and interactive drills.
export default function ClosingWorkshopPage() {
  const sections = BROKER_CLOSING_WORKSHOP ?? [];

  if (sections.length === 0) {
    return (
      <Shell>
        <div style={{ marginBottom: 16 }}><Link href="/broker" style={{ color: T.textMute, fontSize: 13, textDecoration: 'none' }}>← Broker home</Link></div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.22em', color: T.coral, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>
          Tier 4 · Closing Statement Workshop
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 900, letterSpacing: '-0.025em', color: T.text, lineHeight: 1.1, marginBottom: 14 }}>
          Workshop content is being finalized.
        </h1>
        <p style={{ fontSize: 16, color: T.textDim, lineHeight: 1.6, marginBottom: 20, maxWidth: 720 }}>
          The Closing Statement Workshop walks through full CD reconciliation — every proration, HARPTA / FIRPTA withholding, conveyance tax, every line item to the penny. New broker enrollments may see this section while the workshop is in its final review pass. We&apos;ll email you the moment it&apos;s live.
        </p>
        <Link href="/broker" style={{ ...BUTTON_3D.primary, padding: '12px 22px', fontSize: 13, fontWeight: 700, borderRadius: 10, textDecoration: 'none' }}>← Broker home</Link>
      </Shell>
    );
  }

  return (
    <Shell>
      <div style={{ marginBottom: 16 }}><Link href="/broker" style={{ color: T.textMute, fontSize: 13, textDecoration: 'none' }}>← Broker home</Link></div>

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.22em', color: T.coral, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>
          Tier 4 · The hero deliverable
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 900, letterSpacing: '-0.025em', color: T.text, lineHeight: 1.1, marginBottom: 14 }}>
          Closing Statement Workshop
        </h1>
        <p style={{ fontSize: 16, color: T.textDim, lineHeight: 1.6, maxWidth: 760 }}>
          Full Closing Disclosure (CD) reconciliation, taught one line item at a time. Prorations, HARPTA / FIRPTA withholding, conveyance tax, recording fees, commission with GE tax — by the end you can take any real-world transaction and reconcile to the penny.
        </p>
      </div>

      {/* Section nav */}
      <div style={{ ...CARD, padding: 18, marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.22em', color: T.textMute, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>
          Sections ({sections.length})
        </div>
        <ol style={{ paddingLeft: 22, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {sections.map(s => (
            <li key={s.id} style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6 }}>
              <a href={`#${s.id}`} style={{ color: T.text, textDecoration: 'none' }}>{s.title}</a>
              <span style={{ color: T.textMute, marginLeft: 8 }}>· {s.summary}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {sections.map((s, i) => <SectionBlock key={s.id} section={s} number={i + 1} />)}
      </div>

      <div style={{ marginTop: 36, ...CARD, padding: 22, borderLeftWidth: 3, borderLeftColor: T.coral, borderLeftStyle: 'solid' }}>
        <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.22em', color: T.coral, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>You finished the workshop</div>
        <p style={{ fontSize: 14, color: T.textDim, lineHeight: 1.6, margin: '0 0 14px' }}>
          Reinforce it with closing-statement math problems in the drill bank, then test yourself in the full-length mocks.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/broker/math" style={{ ...BUTTON_3D.secondary, padding: '12px 22px', fontSize: 13, fontWeight: 700, borderRadius: 10, textDecoration: 'none' }}>Closing-statement drills →</Link>
          <Link href="/broker/mocks" style={{ ...BUTTON_3D.primary, padding: '12px 22px', fontSize: 13, fontWeight: 700, borderRadius: 10, textDecoration: 'none' }}>Take a mock →</Link>
        </div>
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
        <main style={{ padding: '40px 32px 64px', maxWidth: 980, margin: '0 auto' }}>{children}</main>
        <Footer />
      </div>
    </div>
  );
}

function SectionBlock({ section, number }: { section: WorkshopSection; number: number }) {
  const [showExample, setShowExample] = useState(false);
  return (
    <section id={section.id} style={{ scrollMarginTop: 80 }}>
      <article style={{ ...CARD, padding: 32 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.22em', color: T.coral, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
          Section {number.toString().padStart(2, '0')}
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 10 }}>
          {section.title}
        </h2>
        <p style={{ fontSize: 15, color: T.textMute, lineHeight: 1.5, fontStyle: 'italic', marginBottom: 18 }}>{section.summary}</p>

        {section.body.map((p, i) => (
          <p key={i} style={{ fontSize: 15, color: T.textDim, lineHeight: 1.75, marginBottom: 14 }}>{p}</p>
        ))}

        {section.example && (
          <div style={{ marginTop: 20, padding: 22, background: T.bgRaised, borderRadius: 12, border: `1px solid ${T.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.22em', color: T.ocean, textTransform: 'uppercase', fontWeight: 700 }}>
                Worked example
              </div>
              <button type="button" onClick={() => setShowExample(s => !s)} style={{ ...BUTTON_3D.secondary, padding: '6px 14px', fontSize: 11, fontWeight: 700, borderRadius: 6, fontFamily: 'inherit' }}>
                {showExample ? 'Hide details' : 'Show full walkthrough'}
              </button>
            </div>
            <div style={{ fontSize: 14, color: T.text, lineHeight: 1.65, fontWeight: 600, marginBottom: 12 }}>{section.example.scenario}</div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', color: T.textMute, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Facts</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {section.example.facts.map((f, i) => (
                  <li key={i} style={{ fontSize: 13, color: T.textDim, lineHeight: 1.55, paddingLeft: 12, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: T.ocean }}>·</span>{f}
                  </li>
                ))}
              </ul>
            </div>

            {showExample && (
              <>
                <div style={{ marginBottom: 14, overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${T.border}` }}>
                        <th style={{ textAlign: 'left', padding: '8px 6px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.14em', color: T.textMute, fontWeight: 700, textTransform: 'uppercase' }}>Line item</th>
                        <th style={{ textAlign: 'right', padding: '8px 6px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.14em', color: T.coral, fontWeight: 700, textTransform: 'uppercase' }}>Seller debit</th>
                        <th style={{ textAlign: 'right', padding: '8px 6px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.14em', color: T.ocean, fontWeight: 700, textTransform: 'uppercase' }}>Seller credit</th>
                        <th style={{ textAlign: 'right', padding: '8px 6px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.14em', color: T.coral, fontWeight: 700, textTransform: 'uppercase' }}>Buyer debit</th>
                        <th style={{ textAlign: 'right', padding: '8px 6px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.14em', color: T.ocean, fontWeight: 700, textTransform: 'uppercase' }}>Buyer credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.example.table.map((row, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                          <td style={{ padding: '8px 6px', fontSize: 12, color: T.text, lineHeight: 1.4 }}>
                            {row.label}
                            {row.note && <div style={{ fontSize: 10, color: T.textMute, marginTop: 2, lineHeight: 1.4 }}>{row.note}</div>}
                          </td>
                          <td style={{ padding: '8px 6px', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: row.sellerDebit ? T.coralDark : T.textGhost }}>
                            {row.sellerDebit ?? '—'}
                          </td>
                          <td style={{ padding: '8px 6px', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: row.sellerCredit ? T.text : T.textGhost }}>
                            {row.sellerCredit ?? '—'}
                          </td>
                          <td style={{ padding: '8px 6px', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: row.buyerDebit ? T.coralDark : T.textGhost }}>
                            {row.buyerDebit ?? '—'}
                          </td>
                          <td style={{ padding: '8px 6px', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: row.buyerCredit ? T.text : T.textGhost }}>
                            {row.buyerCredit ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 14 }}>
                  <div style={{ padding: '10px 14px', background: 'rgba(20,131,123,0.08)', borderRadius: 8, borderLeft: '3px solid #14837b' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', color: '#14837b', fontWeight: 700, textTransform: 'uppercase' }}>Seller net</div>
                    <div style={{ fontSize: 16, color: T.text, fontWeight: 800, marginTop: 4 }}>{section.example.sellerNet}</div>
                  </div>
                  <div style={{ padding: '10px 14px', background: 'rgba(193,70,40,0.08)', borderRadius: 8, borderLeft: '3px solid #c14628' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', color: '#c14628', fontWeight: 700, textTransform: 'uppercase' }}>Buyer cash to close</div>
                    <div style={{ fontSize: 16, color: T.text, fontWeight: 800, marginTop: 4 }}>{section.example.buyerCashToClose}</div>
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', color: T.textMute, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Walkthrough</div>
                  <ol style={{ paddingLeft: 22, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {section.example.walkthrough.map((w, i) => (
                      <li key={i} style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6 }}>{w}</li>
                    ))}
                  </ol>
                </div>
              </>
            )}
          </div>
        )}

        {section.drill && section.drill.length > 0 && (
          <div style={{ marginTop: 22 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.22em', color: T.coral, textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Section drill</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {section.drill.map((d, i) => (
                <details key={i} style={{ padding: '14px 18px', background: T.bgRaised, borderRadius: 8, border: `1px solid ${T.border}` }}>
                  <summary style={{ cursor: 'pointer', fontSize: 14, color: T.text, fontWeight: 600, lineHeight: 1.5 }}>
                    <strong style={{ color: T.coral, marginRight: 8 }}>D{i + 1}.</strong>{d.q}
                  </summary>
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
                    <ol style={{ paddingLeft: 22, margin: '0 0 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {d.options.map((opt, oi) => (
                        <li key={oi} style={{ fontSize: 13, color: oi === d.correctIndex ? T.text : T.textDim, fontWeight: oi === d.correctIndex ? 700 : 400, lineHeight: 1.5 }}>
                          {opt} {oi === d.correctIndex && <span style={{ color: '#2d8659', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, marginLeft: 4 }}>✓</span>}
                        </li>
                      ))}
                    </ol>
                    <p style={{ fontSize: 12, color: T.textDim, fontStyle: 'italic', margin: 0, lineHeight: 1.55 }}>{d.explain}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
