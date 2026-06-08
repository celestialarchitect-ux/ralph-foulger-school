import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));

const b = await puppeteer.launch({ headless: 'new' });
const p = await b.newPage();
await p.goto('file://' + path.join(dir, 'cover-part-two.html'), { waitUntil: 'domcontentloaded' });
await p.evaluateHandle('document.fonts.ready');
await new Promise(r => setTimeout(r, 400));

const out = path.join(dir, 'Ralph-Foulger-Cover-Part-Two.pdf');
await p.pdf({
  path: out,
  width: '8.5in', height: '11in',
  printBackground: true, preferCSSPageSize: true,
  margin: { top:0, right:0, bottom:0, left:0 },
});
await b.close();
console.log('wrote', out);
