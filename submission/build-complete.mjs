// Builds the COMPLETE academy compendium: keeps the formal front matter from
// curriculum-submission.html (cover → Section VIII) and replaces the sample
// appendices with the ENTIRE academy content — every chapter's full lesson,
// every question + every variant with answers, all math drills, full glossary.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const { NATIONAL_CONTENT } = await import(path.join(root, 'src/lib/content/national.ts'));
const { STATE_CONTENT } = await import(path.join(root, 'src/lib/content/state.ts'));
const { TOUGH_BANK } = await import(path.join(root, 'src/lib/content/exam-tough.ts'));
const { MATH_PROBLEMS } = await import(path.join(root, 'src/lib/content/math.ts'));
const { VARIANT_POOL } = await import(path.join(root, 'src/lib/content/variant-pool.ts'));
const { TOUGH_VARIANT_POOL } = await import(path.join(root, 'src/lib/content/tough-variant-pool.ts'));
const { GLOSSARY } = await import(path.join(root, 'src/lib/content/glossary.ts'));
const { CURRICULUM } = await import(path.join(root, 'src/lib/curriculum.ts'));

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const LET = ['A', 'B', 'C', 'D'];
const pad2 = (n) => String(n).padStart(2, '0');

const metaBySlug = Object.fromEntries(CURRICULUM.map((c) => [c.slug, c]));
const consumedVariantKeys = new Set();
let qCount = 0, variantCount = 0;

// One question rendered compactly; correct option is bolded + ✓-marked.
function renderQ(q, label) {
  qCount++;
  const opts = q.options.map((o, i) => {
    const correct = i === q.correctIndex;
    return `<div class="qopt${correct ? ' qok' : ''}">${LET[i]}. ${esc(o)}${correct ? ' &#10003;' : ''}</div>`;
  }).join('');
  return `<div class="qitem">
    <div class="qstem"><span class="qlabel">${label}</span> ${esc(q.q)}</div>
    ${opts}
    <div class="qans"><strong>Answer: ${LET[q.correctIndex]}.</strong> ${esc(q.explain)}</div>
  </div>`;
}

function chapterBlock(c, portionLabel) {
  const meta = metaBySlug[c.slug] || {};
  const num = meta.number != null ? pad2(meta.number) : '--';
  const title = esc(meta.title || c.slug);
  let h = `<div class="cc-chapter">
    <div class="chapter-header">
      <div class="chapter-num">${num}</div>
      <div><div class="chapter-title">${title}</div>
        <div class="chapter-meta"><span><b>${portionLabel}</b> portion</span><span>${meta.examItems ?? '?'} PSI items</span><span>${(c.concepts || []).length} key concepts</span><span>${(c.practice || []).length} base questions</span></div>
      </div>
    </div>`;
  if (c.intro) h += `<p class="cc-intro">${esc(c.intro)}</p>`;
  if (c.overview?.length) {
    h += `<h5>Chapter Overview</h5>`;
    for (const p of c.overview) h += `<p>${esc(p)}</p>`;
  }
  if (c.concepts?.length) {
    h += `<h5>Key Concepts &amp; Definitions</h5>`;
    h += `<table class="dense cc-concepts"><tbody>`;
    for (const k of c.concepts) {
      h += `<tr><td style="width:26%;"><strong>${esc(k.term)}</strong></td><td>${esc(k.body)}${k.hawaiiNote ? `<br><em style="color:#0e5c8a;">Hawai&#699;i note: ${esc(k.hawaiiNote)}</em>` : ''}</td></tr>`;
    }
    h += `</tbody></table>`;
  }
  // Questions for this chapter: each base question followed by its variants.
  if (c.practice?.length) {
    h += `<h5>Question Bank &mdash; ${title}</h5>`;
    c.practice.forEach((q, i) => {
      const base = `${meta.number != null ? meta.number : ''}.${i + 1}`;
      h += renderQ(q, `Q ${base}`);
      const key = `${c.slug}-q${pad2(i)}`;
      const variants = VARIANT_POOL[key];
      if (variants?.length) {
        consumedVariantKeys.add(key);
        variants.forEach((v, vi) => {
          variantCount++;
          h += renderQ(v, `Q ${base}&middot;v${vi + 1}`);
        });
      }
    });
  }
  h += `</div>`;
  return h;
}

// ── Build the complete sections ──
let body = '';

// Section: Complete Course Content (all chapters, full lessons + questions + variants)
body += `<section class="page-break"><div class="appendix-marker">Appendix A</div>
  <h1>Complete Course Content &amp; Question Bank</h1>
  <p>This appendix reproduces the Academy's entire course of study in full: every chapter's complete instructional text and key-concept definitions, followed by every assessment item for that chapter &mdash; each base examination question together with all of its calibrated variants. The correct response to each item is marked with a check (&#10003;) and accompanied by its full rationale. Nothing is withheld or abbreviated.</p>`;
body += `<h2 class="section-major" style="page-break-before:auto;">National Portion &mdash; Chapters 1&ndash;11</h2>`;
for (const c of NATIONAL_CONTENT) body += chapterBlock(c, 'National');
body += `<h2 class="section-major">State Portion (Hawai&#699;i) &mdash; Chapters 12&ndash;20</h2>`;
for (const c of STATE_CONTENT) body += chapterBlock(c, 'State');
body += `</section>`;

// Section: Elevated-difficulty bank (tough bank + every tough variant)
body += `<section class="page-break"><div class="appendix-marker">Appendix B</div>
  <h1>Elevated-Difficulty Examination Bank</h1>
  <p>The following items comprise the Academy's complete elevated-difficulty pool used to assemble the Hard and Gnarly mock examinations &mdash; longer scenarios, two-correct-but-one-best constructions, and the trickier financing, proration, and agency edge cases. Every item and every variant is reproduced with its answer and rationale.</p>`;
TOUGH_BANK.forEach((q, i) => { body += renderQ(q, `Tough ${i + 1}`); });
let tvi = 0;
for (const [k, arr] of Object.entries(TOUGH_VARIANT_POOL)) {
  arr.forEach((v) => { tvi++; variantCount++; body += renderQ(v, `Tough&middot;v${tvi}`); });
}
body += `</section>`;

// Catch-all: any base-question variants not already emitted under a chapter
const orphanKeys = Object.keys(VARIANT_POOL).filter((k) => !consumedVariantKeys.has(k));
if (orphanKeys.length) {
  body += `<section class="page-break"><div class="appendix-marker">Appendix B&mdash;Suppl.</div>
    <h1>Additional Question Variants</h1>
    <p>Supplementary calibrated variants from the question bank.</p>`;
  for (const k of orphanKeys) {
    body += `<h5>${esc(k)}</h5>`;
    VARIANT_POOL[k].forEach((v, vi) => { variantCount++; body += renderQ(v, `${esc(k)}&middot;v${vi + 1}`); });
  }
  body += `</section>`;
}

// Section: Complete mathematics drill set
body += `<section class="page-break"><div class="appendix-marker">Appendix C</div>
  <h1>Complete Mathematics Drill Set</h1>
  <p>Every quantitative drill in the Academy's bank, each presented with the givens, the governing formula, the full step-by-step solution, and the final answer.</p>`;
let mc = 0;
for (const m of MATH_PROBLEMS) {
  mc++;
  body += `<div class="qitem">
    <div class="qstem"><span class="qlabel">Math ${mc}</span> <span style="text-transform:uppercase;font-size:8pt;letter-spacing:0.08em;color:#0e5c8a;">${esc(m.category)}</span><br>${esc(m.question)}</div>
    ${m.given?.length ? `<div class="qsub"><strong>Given:</strong> ${m.given.map(esc).join('; ')}</div>` : ''}
    ${m.formula ? `<div class="qsub"><strong>Formula:</strong> ${esc(m.formula)}</div>` : ''}
    ${m.steps?.length ? `<div class="qsub"><strong>Solution:</strong><ol style="margin:2pt 0 2pt 18pt;">${m.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></div>` : ''}
    <div class="qans"><strong>Answer:</strong> ${esc(m.answer)}</div>
  </div>`;
}
body += `</section>`;

// Section: Complete glossary (all terms)
body += `<section class="page-break"><div class="appendix-marker">Appendix D</div>
  <h1>Complete Glossary</h1>
  <p>The Academy's full glossary &mdash; ${GLOSSARY.length} terms. Hawai&#699;i-specific terms carry a note distinguishing Hawai&#699;i practice from mainland doctrine.</p>
  <table class="dense"><thead><tr><th style="width:24%;">Term</th><th>Definition</th><th style="width:12%;">Domain</th></tr></thead><tbody>`;
const gl = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));
for (const g of gl) {
  body += `<tr><td><strong>${esc(g.term)}</strong></td><td>${esc(g.definition)}${g.hawaiiNote ? `<br><em style="color:#0e5c8a;">Hawai&#699;i: ${esc(g.hawaiiNote)}</em>` : ''}</td><td style="font-size:8.5pt;color:#6b5a3e;">${esc(g.category)}</td></tr>`;
}
body += `</tbody></table></section>`;

// ── Splice into the original document ──
const orig = fs.readFileSync(path.join(__dirname, 'curriculum-submission.html'), 'utf8');
// keep everything up to the start of the Appendix A <section>
const markerA = orig.indexOf('<div class="appendix-marker">Appendix A</div>');
const sectionStart = orig.lastIndexOf('<section', markerA);
let head = orig.slice(0, sectionStart);

// ── Reframe from "Commission submission" to "printed textbook" ──
// (the original curriculum-submission.html stays untouched as the real filing)
function reframe(h) {
  // running header + footer
  h = h.replace(
    `content: "RALPH FOULGER'S ACADEMY OF REAL ESTATE  ·  SALESPERSON PRELICENSING CURRICULUM SUBMISSION";`,
    `content: "RALPH FOULGER'S ACADEMY OF REAL ESTATE  ·  COMPLETE SALESPERSON LICENSE TEXTBOOK";`);
  h = h.replace(
    `content: "Submitted to Hawai'i Real Estate Commission · DCCA";`,
    `content: "Ralph Foulger's Academy of Real Estate · Honolulu, Hawai'i";`);
  // cover -> book title page (replace from eyebrow through the cover's </section>)
  h = h.replace(/<div class="cover-eyebrow">[\s\S]*?<\/section>/,
`<div class="cover-eyebrow">2026 Edition &middot; Complete Course &amp; Question Bank</div>
    <h1 class="cover-title">Ralph Foulger's Academy of <span class="italic">Real Estate</span></h1>
    <p class="cover-sub">The complete Hawai&#699;i Real Estate Salesperson textbook &mdash; the full course of study, every practice question explained, real-estate mathematics, and a complete glossary, gathered in a single volume.</p>
    <div class="cover-meta">
      <div>
        <div class="l">Author &amp; Principal Instructor</div>
        <div class="v large">Ralph S. Foulger</div>
        <div class="v" style="font-size:9pt;">Licensed Hawai&#699;i Salesperson since 1972<br>Hawai&#699;i Broker since 1987 &middot; CPM<br>State-Certified Instructor &mdash; all tracks<br>Founder, Ralph Foulger's Academy of Real Estate</div>
      </div>
      <div>
        <div class="l">Published By</div>
        <div class="v large">Ralph Foulger's Academy of Real Estate</div>
        <div class="v" style="font-size:9pt;">Honolulu, Island of O&#699;ahu<br>State of Hawai&#699;i<br>ralphfoulger.com</div>
        <div class="l" style="margin-top:10pt;">Edition</div>
        <div class="v">First Edition &middot; 2026</div>
      </div>
    </div>
  </div>
</section>`);
  // transmittal letter -> book preface
  h = h.replace(/<div class="eyebrow">Letter of Transmittal<\/div>[\s\S]*?<\/section>/,
`<div class="eyebrow">Preface</div>
  <h1>About This Textbook</h1>
  <p style="margin-top:14pt;">This volume is the complete textbook for the Hawai&#699;i Real Estate Salesperson License course as taught at Ralph Foulger's Academy of Real Estate. It is meant to be the only book a candidate needs: the entire course of study, the full question bank with every answer explained, the real-estate mathematics, and a complete glossary are gathered here in one place.</p>
  <p>The book is organized to be read in order. The opening part presents the Academy, the instructor, and the structure of the course. The body delivers the twenty chapters of instruction &mdash; eleven on national real-estate principles, nine on Hawai&#699;i law and practice &mdash; each chapter pairing its lesson with the questions that test it. The closing parts collect the mathematics drills and the glossary for quick reference.</p>
  <p>Every chapter follows the same rhythm: read the lesson, study the key concepts, then work the questions. Each question shows all four options, marks the correct answer, and explains why it is correct &mdash; so the book teaches as much through its answer keys as through its lessons. A student who works this book from cover to cover will have met every concept, every calculation, and every question type the Hawai&#699;i Salesperson Examination can present.</p>
  <p>The curriculum is aligned to the State of Hawai&#699;i Real Estate Commission's published content outline and to the statutes and rules that govern practice in the Islands &mdash; among them HRS Chapters 467, 514B, 521, 247, and 235, and HAR Chapter 16-99. Where Hawai&#699;i law departs from mainland doctrine, the difference is named and explained.</p>
  <p style="margin-top:18pt;">With aloha,</p>
  <div class="signature">
    <strong>Ralph S. Foulger</strong><br>
    <span class="role">Principal Instructor &amp; Founder</span><br>
    Ralph Foulger's Academy of Real Estate<br>
    Hawai&#699;i Broker &mdash; Licensed since 1972
  </div>
</section>`);
  // prose: drop remaining "submission" framing
  h = h.replace('appears at Section II of this submission.', 'appears at Section II of this textbook.');
  h = h.replace('A current Tax Clearance Certificate (Form A-6) is on file and accompanies this submission as a separate exhibit at the Commission&rsquo;s request.', 'A current Tax Clearance Certificate (Form A-6) is maintained on file at the Academy.');
  h = h.replace('A current Tax Clearance Certificate (Form A-6) is on file and accompanies this submission as a separate exhibit at the Commission’s request.', 'A current Tax Clearance Certificate (Form A-6) is maintained on file at the Academy.');
  h = h.replace("A current Tax Clearance Certificate (Form A-6) is on file and accompanies this submission as a separate exhibit at the Commission's request.", 'A current Tax Clearance Certificate (Form A-6) is maintained on file at the Academy.');
  h = h.replace('Material revisions to the Course of Study are filed with the Commission as supplements to this submission.', 'Material revisions to the Course of Study are reflected in subsequent editions of this textbook.');
  h = h.replace("Registered Real Estate Schools (this submission's authority)", 'Registered Real Estate Schools (the Academy&rsquo;s governing authority)');
  h = h.split('this submission').join('this textbook');
  // Remove the interior title-page cover — the printed front cover page now
  // serves as the book's cover (avoids two cover pages back-to-back).
  h = h.replace(/<section class="cover">[\s\S]*?<\/section>/, '');
  return h;
}
head = reframe(head);

// Rebuild the Table of Contents appendix listing to match THIS document.
// Page numbers are filled by the two-pass renderer (fix-toc-pages step).
const tocOld = /<li class="toc-section"><span>Appendices<\/span>[\s\S]*?Statutory &amp; Regulatory Authorities Cited<\/span><span class="num">\d+<\/span><\/li>/;
const tocNew = `<li class="toc-section"><span>Appendices</span><span class="num">@@PGa@@</span></li>
    <li><span>A &nbsp; Complete Course Content &amp; Question Bank</span><span class="num">@@PGa@@</span></li>
    <li><span>B &nbsp; Elevated-Difficulty Examination Bank</span><span class="num">@@PGb@@</span></li>
    <li><span>C &nbsp; Complete Mathematics Drill Set</span><span class="num">@@PGc@@</span></li>
    <li><span>D &nbsp; Complete Glossary</span><span class="num">@@PGd@@</span></li>
    <li><span>E &nbsp; Instructor Evaluation Instrument</span><span class="num">@@PGe@@</span></li>
    <li><span>F &nbsp; Statutory &amp; Regulatory Authorities Cited</span><span class="num">@@PGf@@</span></li>
    <li><span>G &nbsp; Sample Certificate of Completion</span><span class="num">@@PGg@@</span></li>`;
if (!tocOld.test(head)) { console.error('WARNING: TOC appendix block not found — TOC not updated'); }
head = head.replace(tocOld, tocNew);

// preserve the formal appendices we keep: C (instructor eval), D (authorities), E (certificate)
function extractByMarker(label) {
  const m = orig.indexOf(`<div class="appendix-marker">${label}</div>`);
  if (m < 0) return '';
  const s = orig.lastIndexOf('<section', m);
  const e = orig.indexOf('</section>', m);
  return orig.slice(s, e + '</section>'.length);
}
let preserved = '';
preserved += extractByMarker('Appendix C').replace('<div class="appendix-marker">Appendix C</div>', '<div class="appendix-marker">Appendix E</div>');
preserved += '\n' + extractByMarker('Appendix D').replace('<div class="appendix-marker">Appendix D</div>', '<div class="appendix-marker">Appendix F</div>');
preserved += '\n' + extractByMarker('Appendix E').replace('<div class="appendix-marker">Appendix E</div>', '<div class="appendix-marker">Appendix G</div>');
// reframe leftover submission language in the preserved formal appendices
preserved = preserved.replace("Registered Real Estate Schools (this submission's authority)", 'Registered Real Estate Schools (the Academy&rsquo;s governing authority)');
preserved = preserved.split('this submission').join('this textbook');

// extra CSS for compact question items, injected before </style>
const extraCss = `
.qitem { page-break-inside: avoid; margin: 0 0 9pt; padding: 7pt 10pt; border-left: 2pt solid var(--rule-soft); background: #fcfaf4; font-size: 9.5pt; line-height: 1.42; }
.qstem { font-weight: 600; color: var(--ink); margin-bottom: 3pt; }
.qlabel { font-family: var(--mono); font-size: 7.5pt; color: var(--gold); font-weight: 700; letter-spacing: 0.04em; margin-right: 3pt; }
.qopt { padding: 1pt 0 1pt 12pt; color: var(--ink-2); }
.qopt.qok { color: #0e5c8a; font-weight: 600; }
.qans { margin-top: 3pt; padding-top: 3pt; border-top: 0.3pt solid var(--rule-soft); font-size: 9pt; color: var(--ink-2); }
.qsub { font-size: 9pt; color: var(--ink-2); margin: 2pt 0; }
.cc-chapter { margin-bottom: 16pt; }
.cc-intro { font-style: italic; color: var(--ink-2); }
.cc-concepts td { font-size: 9pt; }
`;
const out = head.replace('</style>', extraCss + '\n</style>') + '\n' + body + '\n' + preserved + '\n</body>\n</html>\n';
fs.writeFileSync(path.join(__dirname, 'curriculum-complete.html'), out, 'utf8');

console.log(JSON.stringify({
  baseQuestionsAndVariantsRendered: qCount,
  variantCount,
  toughBank: TOUGH_BANK.length,
  toughVariantGroups: Object.keys(TOUGH_VARIANT_POOL).length,
  mathProblems: mc,
  glossaryTerms: GLOSSARY.length,
  orphanVariantKeys: orphanKeys.length,
  chapters: NATIONAL_CONTENT.length + STATE_CONTENT.length,
}, null, 2));
