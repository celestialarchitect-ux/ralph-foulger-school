// Two-pass render: render once, detect the real start page of each appendix via
// pdftotext, fill the TOC page tokens, render the final PDF.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
const HTML = 'curriculum-complete.html';
const PDF = 'Ralph-Foulger-Academy-COMPLETE-Compendium-2026.pdf';
const run = (c) => execSync(c, { stdio: ['ignore', 'pipe', 'pipe'] });

console.log('pass 1: render for pagination...');
run(`weasyprint ${HTML} _tmp.pdf`);
run(`pdftotext -layout _tmp.pdf _tmp.txt`);
const pages = fs.readFileSync('_tmp.txt', 'utf8').split('\f');
// Appendices appear in order; each search starts after the previous match to
// avoid front-matter cross-references matching first.
let floor = 44;
const pageOf = (anchor) => {
  for (let i = floor; i < pages.length; i++) {
    if (pages[i].includes(anchor)) { floor = i; return i + 1; }
  }
  return '?';
};
const map = {
  '@@PGa@@': pageOf('Complete Course Content'),
  '@@PGb@@': pageOf('Elevated-Difficulty Examination Bank'),
  '@@PGc@@': pageOf('Complete Mathematics Drill Set'),
  '@@PGd@@': pageOf('Complete Glossary'),
  '@@PGe@@': pageOf('Instructor Evaluation Instrument'),
  '@@PGf@@': pageOf('Regulatory Authorities Cited'),
  '@@PGg@@': pageOf('Sample Certificate of Completion'),
};
console.log('detected appendix pages:', JSON.stringify(map));
let html = fs.readFileSync(HTML, 'utf8');
for (const [tok, pg] of Object.entries(map)) html = html.split(tok).join(String(pg));
fs.writeFileSync(HTML, html);
console.log('pass 2: final render...');
run(`weasyprint ${HTML} _interior.pdf`);

console.log('adding front + back cover pages...');
run(`weasyprint cover-pages.html _covers.pdf`);
run(`pdfseparate _covers.pdf _cov-%d.pdf`);          // _cov-1 = front, _cov-2 = back
run(`pdfunite _cov-1.pdf _interior.pdf _cov-2.pdf "${PDF}"`);

for (const f of ['_tmp.pdf', '_tmp.txt', '_interior.pdf', '_covers.pdf', '_cov-1.pdf', '_cov-2.pdf']) fs.rmSync(f, { force: true });
console.log('done:', PDF, '(front cover + interior + back cover)');
