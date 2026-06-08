// Applies all verification fixes to the source data, then rewrites the source
// files. Backs up each file (.bak-fix). Covers answer-key flips, proration
// figure corrections, scoped family text replacements, and glossary fixes.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const C = (p) => path.join(root, 'src/lib/content', p);
const N = await import(C('national.ts')); const S = await import(C('state.ts'));
const T = await import(C('exam-tough.ts')); const VP = await import(C('variant-pool.ts'));
const TVP = await import(C('tough-variant-pool.ts')); const G = await import(C('glossary.ts'));
const M = await import(C('math.ts'));
const NATIONAL_CONTENT = N.NATIONAL_CONTENT, STATE_CONTENT = S.STATE_CONTENT, TOUGH_BANK = T.TOUGH_BANK;
const VARIANT_POOL = VP.VARIANT_POOL, TOUGH_VARIANT_POOL = TVP.TOUGH_VARIANT_POOL, GLOSSARY = G.GLOSSARY, MATH_PROBLEMS = M.MATH_PROBLEMS;
const pad2 = (n) => String(n).padStart(2, '0');

// ── build id → question-object index ──
const index = new Map();
for (const c of NATIONAL_CONTENT) c.practice.forEach((q, i) => { index.set(`${c.slug}-q${pad2(i)}`, q); (VARIANT_POOL[`${c.slug}-q${pad2(i)}`] || []).forEach((v, vi) => index.set(`${c.slug}-q${pad2(i)}.v${vi + 1}`, v)); });
for (const c of STATE_CONTENT) c.practice.forEach((q, i) => { index.set(`${c.slug}-q${pad2(i)}`, q); (VARIANT_POOL[`${c.slug}-q${pad2(i)}`] || []).forEach((v, vi) => index.set(`${c.slug}-q${pad2(i)}.v${vi + 1}`, v)); });
TOUGH_BANK.forEach((q, i) => index.set(`tough-${i}`, q));
Object.entries(TOUGH_VARIANT_POOL).forEach(([k, arr]) => arr.forEach((v, vi) => index.set(`${k}.v${vi + 1}`, v)));

let applied = 0, missed = [];
// ── per-ID fixes ──
const byId = {
  'financing-q00.v2': { correctIndex: 0, explain: '$180,000 ÷ $225,000 = 80%. A loan-to-value at or below 80% generally avoids private mortgage insurance.' },
  'real-estate-calculations-q09.v6': { correctIndex: 3, explain: '6% × $350,000 = $21,000 total commission. The listing brokerage receives 50% = $10,500. The agent’s 70% share = $10,500 × 70% = $7,350.' },
  'real-estate-calculations-q09.v8': { correctIndex: 3, explain: '6% × $450,000 = $27,000 total commission. The office’s 50% share = $13,500. The agent receives 70% of $13,500 = $9,450.' },
  'real-estate-calculations-q10.v1': { correctIndex: 1, explain: '($195,000 − $150,000) ÷ $150,000 = $45,000 ÷ $150,000 = 0.30 = 30%.' },
  'financing-q03.v2': { q: 'A lender provides a borrower with the Closing Disclosure on Thursday for a Friday closing. Which statement is accurate?', explain: 'A Thursday delivery leaves only Friday (one business day) before consummation. TRID requires the borrower to receive the Closing Disclosure at least three business days before consummation, so this violates the rule.' },
  'financing-q03.v8': { correctIndex: 3, explain: 'TRID requires the borrower to receive the Closing Disclosure at least three business days before consummation (Saturdays count; consummation may occur on the third business day). For a Friday closing, Tuesday is the latest compliant delivery: Wed (1), Thu (2), Fri (3).' },
  'financing-q03.v4': { explain: 'A Monday delivery for a Wednesday closing allows only two business days (Tue, Wed) before consummation — fewer than the required three — so it violates TRID.' },
  'hi-property-management-q05.v6': { correctIndex: 1, explain: 'A month-to-month tenant must give at least 28 days’ written notice (HRS §521-71(a)). Notice on the 1st permits termination about the 29th of the same month.' },
  'hi-property-management-q05.v8': { correctIndex: 0, explain: 'A month-to-month tenant must give at least 28 days’ notice (HRS §521-71(a)). Notice given June 1 permits the earliest termination on June 29 (June 1 + 28 days).' },
  'tough-2bhipq.v7': { correctIndex: 3, explain: 'Discount points are a percentage of the loan amount. With 100% financing the loan equals the $720,000 price. 1.5 points = 0.015 × $720,000 = $10,800.' },
  'tough-ixf7ak.v3': { correctIndex: 0, explain: 'A mill rate of $13.20 per $1,000 of assessed value: ($575,000 ÷ $1,000) × $13.20 = 575 × $13.20 = $7,590.' },
  'tough-2bohzi.v7': { replace: [['income approach', 'sales comparison approach']] },
  // proration family — correct the dollar figures (direction was already right)
  'tough-1rk32k.v1': { options: { 1: 'Seller receives a credit of $4,507', 2: 'Seller receives a debit of $4,507' }, explain: 'The seller owned Jan 1 – June 19 = 169 days (5×30 + 19). 169/360 × $9,600 = $4,506.67 ≈ $4,507. The seller is DEBITED their share and the buyer is credited the same amount.' },
  'tough-1rk32k.v2': { options: { 0: 'A debit to seller and credit to buyer for approximately $8,133' }, explain: 'Jan 1 – Sept 4 = 244 days (8×30 + 4). 244/360 × $12,000 = $8,133.33. The seller is DEBITED this amount and the buyer is credited the same.' },
  'tough-1rk32k.v3': { options: { 0: 'Debiting the seller approximately $3,450', 2: 'Crediting the seller $3,450' }, explain: 'Jan 1 – Mar 9 = 69 days (2×30 + 9). 69/360 × $18,000 = $3,450 owed by the seller. The seller is DEBITED $3,450 and the buyer is credited the same.' },
  'tough-1rk32k.v4': { options: { 0: 'Debit of $3,400', 3: 'Credit of $3,400' }, explain: 'The seller owned Jan 1 – June 20 = 170 days (5×30 + 20). 170/360 × $7,200 = $3,400. The seller is DEBITED their tax obligation and the buyer is credited.' },
  'tough-1rk32k.v5': { options: { 1: 'A debit of $1,447', 2: 'A credit of $1,447' }, explain: 'Jan 1 – Mar 2 = 62 days (2×30 + 2). 62/360 × $8,400 = $1,446.67 ≈ $1,447. The seller is DEBITED and the buyer receives the corresponding credit.' },
  'tough-1rk32k.v6': { options: { 2: 'Debit $8,560' }, explain: 'The seller owned Jan 1 – Aug 4 = 214 days (7×30 + 4). 214/360 × $14,400 = $8,560. The seller is DEBITED this amount and the buyer is credited the same.' },
  'tough-19': { options: { 2: 'Credited $2,746.67', 3: 'Debited $2,746.67' }, explain: 'The seller owes tax for days owned. Jan 1 – Apr 13 = 103 days (3×30 + 13). 103/360 × $9,600 = $2,746.67. The seller is DEBITED that amount and the buyer is credited.' },
  // rationale / wording fixes
  'practice-of-real-estate-q03.v4': { replace: [['plus five additional protected classes', 'plus four additional protected classes']] },
  'property-ownership-q06.v1': { replace: [['Option A lists these same four elements in a different order.', 'Options A, B, and C do not state the four unities.']] },
  'property-ownership-q06.v6': { replace: [['Option B describes these concepts using alternative terminology.', 'Options B, C, and D do not state the four unities.']] },
  'contracts-q00.v7': { replace: [['signed by both parties is required', 'signed by the party to be charged is required']] },
  'contracts-q09.v2': { replace: [['expires without the buyer exercising their inspection rights', 'is not satisfied by the inspection deadline']] },
  'mandated-disclosures-q01.v5': { q: 'Under federal law, residential housing built before a certain year requires disclosure of potential lead-based paint hazards. Housing built before which year is covered?' },
  'hi-types-of-ownership-q03.v8': { explain: 'Hawai‘i grants timeshare buyers a seven-day rescission period (HRS §514E). A Monday execution allows cancellation through the following Monday (seven calendar days later).' },
};
for (const [id, fix] of Object.entries(byId)) {
  const q = index.get(id);
  if (!q) { missed.push(id); continue; }
  if (fix.correctIndex != null) q.correctIndex = fix.correctIndex;
  if (fix.q) q.q = fix.q;
  if (fix.explain) q.explain = fix.explain;
  if (fix.options) for (const [i, t] of Object.entries(fix.options)) q.options[+i] = t;
  if (fix.replace) for (const [a, b] of fix.replace) { q.q = q.q.split(a).join(b); q.explain = q.explain.split(a).join(b); q.options = q.options.map((o) => o.split(a).join(b)); }
  applied++;
}

// ── scoped family text replacements ──
const familyReplace = [
  { prefix: 'hi-property-management-q07', pairs: [['5-business-day', '10-calendar-day'], ['5 business days', '10 calendar days'], ['5 calendar days', '10 calendar days'], ['five business days', 'ten calendar days'], ['five-day', 'ten-day'], ['5-day', '10-day'], ['5 days', '10 days'], ['five days', 'ten days']] },
  { prefix: 'hi-professional-conduct-q05', pairs: [['source of income, ', ''], [', source of income', ''], ['and source of income', 'and ancestry'], ['source of income', 'ancestry']] },
  { prefix: 'hi-professional-conduct-q14', pairs: [['HRS 467-2', 'HRS §467-14(14)'], ['HRS §467-2', 'HRS §467-14(14)']] },
  { prefix: 'practice-of-real-estate-q08', pairs: [['Hawaii regulations, like most jurisdictions, require brokers to reconcile', 'As in most jurisdictions, industry best practice is for brokers to reconcile'], ['Hawaii REC rules require brokers to reconcile trust accounts on a monthly basis', 'Monthly reconciliation of trust accounts is the industry standard'], ['Hawaii REC rules require brokers to reconcile trust accounts monthly', 'Monthly reconciliation of trust accounts is the industry standard'], ['Hawaii’s trust account rules mandate monthly reconciliation', 'Monthly reconciliation of trust accounts is the industry standard'], ["Hawaii's trust account rules mandate monthly reconciliation", 'Monthly reconciliation of trust accounts is the industry standard'], ['Hawaii regulation requires brokers to reconcile trust accounts typically on a monthly basis', 'Industry best practice is for brokers to reconcile trust accounts monthly'], ['standard requirement in Hawaii', 'standard practice']] },
  { prefix: 'hi-types-of-ownership-q02', pairs: [['January 1, 2006', 'July 1, 2006']] },
  { prefix: 'hi-material-facts-q08', pairs: [['the 1850s', '1848'], ['1850s', '1848']] },
  { prefix: 'hi-material-facts-q00', pairs: [['Hawaii Sanford Act', 'Hawaii Real Property Tax Act'], ['Hawaii Residential Property Tax', 'Hawaii Real Property Tax Act']] },
  { prefix: 'hi-material-facts-q04', pairs: [['must always apply', 'may apply concurrently'], ['both always apply', 'both may apply concurrently']] },
  { prefix: 'hi-property-management-q00', pairs: [['HRS 521-42', 'HRS 521-44'], ['§521-42', '§521-44']] },
  { prefix: 'hi-contracts-addenda-q06', pairs: [['HRS 508D (Condominium Property Regimes)', 'HRS 508D (Mandatory Seller Disclosures)'], ['HRS 508D (Mortgage Servicer Conduct)', 'HRS 508D (Mandatory Seller Disclosures)'], ['HRS 508D (Mortgage Foreclosure)', 'HRS 508D (Mandatory Seller Disclosures)'], ['HRS 521 (Condominium Property Regimes)', 'HRS 521 (Residential Landlord-Tenant Code)'], ['HRS 521 (Condominium Regimes)', 'HRS 521 (Residential Landlord-Tenant Code)'], ['HRS 480E (Unfair or Deceptive Acts in Trade or Commerce)', 'HRS 480E (Mortgage Rescue Fraud Prevention / Distressed Property Conveyance)'], ['HRS 480E (Unfair and Deceptive Practices)', 'HRS 480E (Mortgage Rescue Fraud Prevention / Distressed Property Conveyance)']] },
  { prefix: 'lks7oo', pairs: [['HEC', 'HREC'], ['HRREC', 'HREC']] },
];
let famApplied = 0;
for (const [id, q] of index) {
  for (const fam of familyReplace) {
    if (id.startsWith(fam.prefix)) {
      for (const [a, b] of fam.pairs) { q.q = q.q.split(a).join(b); q.explain = q.explain.split(a).join(b); q.options = q.options.map((o) => o.split(a).join(b)); }
      famApplied++;
    }
  }
}

// ── glossary fixes ──
let glossFixed = 0;
for (const g of GLOSSARY) {
  const t = g.term.toLowerCase();
  if (t.includes('earnest') && /5 business|five business/.test(g.definition + (g.hawaiiNote || ''))) {
    g.definition = 'A buyer’s good-faith deposit submitted with an offer and held in trust. In Hawai‘i a broker must deposit trust funds (including earnest money) into a federally insured trust account or neutral escrow by the next business day after receipt (HAR §16-99-4).';
    g.hawaiiNote = 'Late deposit of trust funds is grounds for license discipline.'; glossFixed++;
  } else if (t === 'eviction' || (t.includes('eviction') && /5 day|five day/.test(g.definition + (g.hawaiiNote || '')))) {
    g.definition = 'The legal process to remove a tenant: proper written notice, then court summary possession (HRS 521/666).';
    g.hawaiiNote = 'As of Feb 5, 2026 (Act 278), residential nonpayment requires 10 days’ written notice (with mediation if the tenant requests); other curable breaches require 10 days under HRS §521-72.'; glossFixed++;
  } else if (t === 'conversion') {
    g.definition = 'Using or misappropriating client trust funds for one’s own benefit. A license-law violation under HRS 467 that may also be criminal.'; glossFixed++;
  } else if (t === 'curtesy') {
    g.definition = 'At common law, a husband’s life interest in his deceased wife’s real property, historically conditioned on the birth of issue. Largely abolished today.'; glossFixed++;
  } else if (t === 'harpta') {
    g.definition = 'Hawai‘i Real Property Tax Act (HRS §235-68): a 7.25% withholding on the amount realized when a non-resident sells Hawai‘i real property — a prepayment of state income tax on the gain, distinct from the county real-property (ad valorem) tax.'; glossFixed++;
  }
}

// ── math fix (π consistency) ──
let mathFixed = 0;
for (const m of MATH_PROBLEMS) {
  if (m.given) { const g2 = m.given.map((x) => x.split('3.14)').join('3.14159)').split('≈ 3.14').join('≈ 3.14159')); if (JSON.stringify(g2) !== JSON.stringify(m.given)) { m.given = g2; mathFixed++; } }
}

// ── string-aware bracket matcher + splice (reused) ──
function literalRange(src, fromIdx, openCh, closeCh) {
  const start = src.indexOf(openCh, fromIdx); let depth = 0, i = start, inStr = null, esc = false;
  for (; i < src.length; i++) { const ch = src[i];
    if (inStr) { if (esc) esc = false; else if (ch === '\\') esc = true; else if (ch === inStr) inStr = null; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
    if (ch === openCh) depth++; else if (ch === closeCh) { depth--; if (depth === 0) return [start, i]; } }
  throw new Error('unbalanced');
}
function spliceConst(file, decl, open, close, value) {
  const full = fs.readFileSync(file, 'utf8'); fs.writeFileSync(file + '.bak-fix', full);
  const d = full.indexOf(decl); const eq = full.indexOf('=', d); const [o, c] = literalRange(full, eq, open, close);
  fs.writeFileSync(file, full.slice(0, o) + value + full.slice(c + 1));
}
const J = (o) => JSON.stringify(o, null, 2);
spliceConst(C('national.ts'), 'export const NATIONAL_CONTENT', '[', ']', J(NATIONAL_CONTENT));
spliceConst(C('state.ts'), 'export const STATE_CONTENT', '[', ']', J(STATE_CONTENT));
spliceConst(C('exam-tough.ts'), 'export const TOUGH_BANK', '[', ']', J(TOUGH_BANK));
spliceConst(C('variant-pool.ts'), 'export const VARIANT_POOL', '{', '}', J(VARIANT_POOL));
spliceConst(C('tough-variant-pool.ts'), 'export const TOUGH_VARIANT_POOL', '{', '}', J(TOUGH_VARIANT_POOL));
spliceConst(C('glossary.ts'), 'export const GLOSSARY', '[', ']', J(GLOSSARY));
spliceConst(C('math.ts'), 'export const MATH_PROBLEMS', '[', ']', J(MATH_PROBLEMS));

console.log(JSON.stringify({ byIdApplied: applied, byIdMissed: missed, familyItemsTouched: famApplied, glossaryFixed: glossFixed, mathFixed }, null, 2));
