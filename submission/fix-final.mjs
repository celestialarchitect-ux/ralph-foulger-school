import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const C = (p) => path.join(root, 'src/lib/content', p);
const VP = await import(C('variant-pool.ts')); const TVP = await import(C('tough-variant-pool.ts'));
const VARIANT_POOL = VP.VARIANT_POOL, TOUGH_VARIANT_POOL = TVP.TOUGH_VARIANT_POOL;

// tough-1rk32k.v7 (index 6): Mar 22 close, $8,400, 81 days -> $1,890
const v7 = TOUGH_VARIANT_POOL['tough-1rk32k'][6];
v7.options[0] = 'Seller debit of $1,890'; v7.options[1] = 'Seller credit of $1,890';
v7.explain = 'The seller owns Jan 1 – Mar 21 = 81 days (30+30+21). 81/360 × $8,400 = $1,890. The seller is DEBITED their share for the days owned; the buyer is credited the same.';
// tough-1rk32k.v8 (index 7): July 9 close, $7,200, 188 days -> $3,746.67
const v8 = TOUGH_VARIANT_POOL['tough-1rk32k'][7];
v8.options[3] = 'Debit $3,747';
v8.explain = 'Jan 1 – July 8 = 188 days (6×30 + 8). 188/360 × $7,200 = $3,746.67 ≈ $3,747. The seller is DEBITED their prorated tax obligation; the buyer is credited the same.';

// q05 duplicate "ancestry" cleanups
const q05 = VARIANT_POOL['hi-professional-conduct-q05'];
q05[5].options[1] = 'Sexual orientation, marital status, age, ancestry, gender identity, and HIV status';
q05[6].options[2] = 'Sexual orientation, gender identity, marital status, ancestry, age, and HIV status';
q05[7].options[2] = 'Hawaii adds protections for sexual orientation, gender identity, marital status, HIV status, ancestry, and age';

function literalRange(src, fromIdx, openCh, closeCh) {
  const start = src.indexOf(openCh, fromIdx); let depth = 0, i = start, inStr = null, esc = false;
  for (; i < src.length; i++) { const ch = src[i];
    if (inStr) { if (esc) esc = false; else if (ch === '\\') esc = true; else if (ch === inStr) inStr = null; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
    if (ch === openCh) depth++; else if (ch === closeCh) { depth--; if (depth === 0) return [start, i]; } } }
function splice(file, decl, open, close, val) { const f = fs.readFileSync(file, 'utf8'); const d = f.indexOf(decl); const eq = f.indexOf('=', d); const [o, c] = literalRange(f, eq, open, close); fs.writeFileSync(file, f.slice(0, o) + val + f.slice(c + 1)); }
const J = (o) => JSON.stringify(o, null, 2);
splice(C('variant-pool.ts'), 'export const VARIANT_POOL', '{', '}', J(VARIANT_POOL));
splice(C('tough-variant-pool.ts'), 'export const TOUGH_VARIANT_POOL', '{', '}', J(TOUGH_VARIANT_POOL));
console.log('final 5 fixes applied');
