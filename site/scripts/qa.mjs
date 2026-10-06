/**
 * Quality checks against the built site, in a real browser.
 *
 * Verifies what a student actually hits: every page renders without console
 * or hydration errors, every lab has its interactive visualizations, no
 * notebook error/noise leaks onto the page, every visualizer responds to its
 * controls, search works, downloads resolve, and nothing unpublished is
 * reachable.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const course = JSON.parse(fs.readFileSync(path.resolve(root, '..', 'src/generated/course.json'), 'utf8'));
const PORT = 4321;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.ipynb': 'application/json', '.woff2': 'font/woff2', '.wasm': 'application/wasm',
  '.pf_meta': 'application/octet-stream', '.pf_index': 'application/octet-stream', '.pf_fragment': 'application/octet-stream',
};
const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = path.join(root, url);
  if (!file.startsWith(root)) return void res.writeHead(403).end();
  try {
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(fs.readFileSync(file));
  } catch {
    res.writeHead(404).end('not found');
  }
});
await new Promise((r) => server.listen(PORT, r));
const BASE = `http://127.0.0.1:${PORT}`;
const results = [];
const pass = (name, detail = '') => results.push({ ok: true, name, detail });
const fail = (name, detail = '') => results.push({ ok: false, name, detail });

const browser = await chromium.launch();
async function withPage(viewport, fn) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  try { await fn(page, errors); } finally { await ctx.close(); }
}

const labs = course.labs.filter((l) => l.isPublic);
const supp = labs.flatMap((l) => l.resources.filter((r) => r.type !== 'main' && r.available).map((r) => `/laboratoret/${l.slug}/${r.notebook.replace(/\.ipynb$/, '')}/`));
const PAGES = [
  '/', '/laboratoret/', ...labs.map((l) => `/laboratoret/${l.slug}/`), ...supp,
  '/vizualizime/', ...course.visualizers.map((v) => `/vizualizime/${v.id}/`),
  '/detyrat/', ...course.homework.map((h) => `/detyrat/${h.id}/`), '/python/',
];

/* ------------------------------------------- 1. every page loads cleanly */
await withPage({ width: 1280, height: 900 }, async (page, errors) => {
  for (const p of PAGES) {
    errors.length = 0;
    const res = await page.goto(BASE + p, { waitUntil: 'networkidle' });
    // scroll through the page so lazily hydrated visualizers wake up too
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    });
    await page.waitForTimeout(300);
    const ok = res && res.status() === 200 && errors.length === 0;
    (ok ? pass : fail)(`ngarkohet pa gabime ${p}`, ok ? '' : `status ${res?.status()} · ${errors.slice(0, 2).join(' | ')}`);
  }
});

/* --------------------------------- 2. every lab has interactive visuals */
await withPage({ width: 1280, height: 900 }, async (page) => {
  for (const l of labs) {
    await page.goto(`${BASE}/laboratoret/${l.slug}/`, { waitUntil: 'domcontentloaded' });
    const n = await page.locator('[data-viz-id]').count();
    (n > 0 ? pass : fail)(`Laboratori ${l.n} ka vizualizime`, `${n}`);
  }
});

/* ------------------------------------ 3. no notebook noise on any page */
await withPage({ width: 1280, height: 900 }, async (page) => {
  const NOISE = [/Traceback \(most recent call last\)/, /SystemExit/, /Hello from the pygame community/, /pygame \d+\.\d+\.\d+ \(SDL/, /Kernel crashed/i, /Dalje \(stderr\)/];
  let bad = [];
  // the setup page explains these errors on purpose
  for (const p of PAGES.filter((x) => x !== '/python/')) {
    await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
    const text = await page.locator('main').innerText();
    for (const re of NOISE) if (re.test(text)) bad.push(`${p}: ${re}`);
  }
  (bad.length === 0 ? pass : fail)('asnjë gabim apo zhurmë nga fletoret në faqe', bad.slice(0, 4).join(' · '));
});

/* ------------------------------------- 4. every visualizer responds */
await withPage({ width: 1280, height: 900 }, async (page, errors) => {
  for (const v of course.visualizers) {
    errors.length = 0;
    await page.goto(`${BASE}/vizualizime/${v.id}/`, { waitUntil: 'networkidle' });
    const shell = page.locator('[data-viz]').first();
    await shell.waitFor({ timeout: 10000 });
    const before = await shell.innerText();
    const next = shell.locator('button[aria-label="Hapi tjetër (→)"]');
    if (await next.count()) {
      await next.first().click();
      await next.first().click();
    } else if (await shell.locator('[role="button"][aria-label^="Kulmi"]').count()) {
      // map games: click a city next to the start
      await shell.locator('[role="button"][aria-label^="Kulmi"]').nth(1).click();
    } else {
      // quiz games: answer with the last option
      const btn = shell.locator('button:not([aria-label])').filter({ hasNotText: /^$/ }).last();
      await btn.click().catch(() => {});
    }
    await page.waitForTimeout(400);
    const after = await shell.innerText();
    const ok = before !== after && errors.length === 0;
    (ok ? pass : fail)(`vizualizimi ${v.id} reagon`, ok ? '' : errors.slice(0, 2).join(' | ') || 'teksti nuk ndryshoi');
  }
});

/* ----------------------------------------------- 5. search palette */
await withPage({ width: 1280, height: 900 }, async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Control+k');
  const input = page.getByPlaceholder(/Kërko:/);
  await input.waitFor({ timeout: 5000 });
  for (const q of ['Dijkstra', 'Merge Sort', 'prerja']) {
    await input.fill(q);
    await page.waitForTimeout(900);
    const n = await page.locator('[role="option"]').count();
    (n > 0 ? pass : fail)(`kërkimi "${q}"`, `${n} rezultate`);
  }
});

/* --------------------------------------------------- 6. theme toggle */
await withPage({ width: 1280, height: 900 }, async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const before = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  await page.getByRole('button', { name: /temën/ }).click();
  const after = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  await page.reload({ waitUntil: 'networkidle' });
  const kept = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  (before !== after && kept === after ? pass : fail)('tema ndryshon dhe mbahet mend');
});

/* ------------------------------------------------ 7. plotly + KaTeX */
await withPage({ width: 1280, height: 900 }, async (page) => {
  await page.goto(BASE + '/laboratoret/01/', { waitUntil: 'networkidle' });
  const fig = page.locator('plotly-figure').first();
  await fig.scrollIntoViewIfNeeded();
  try {
    await page.waitForSelector('plotly-figure .pf-plot svg', { timeout: 20000 });
    pass('grafikët Plotly rirenderohen interaktivë');
  } catch {
    fail('grafikët Plotly rirenderohen interaktivë');
  }
  await page.goto(BASE + '/laboratoret/02/laborator-02-ushtrime-shtese/', { waitUntil: 'domcontentloaded' });
  const k = await page.locator('.katex').count();
  (k > 0 ? pass : fail)('matematika renderohet (KaTeX)', `${k}`);
});

/* ----------------------------------------------------- 8. downloads */
await withPage({ width: 1280, height: 900 }, async (page) => {
  const files = [...new Set(labs.flatMap((l) => l.resources.map((r) => r.notebook)))];
  let bad = 0;
  for (const f of files) {
    const res = await page.request.get(`${BASE}/shkarkime/${f}`);
    if (res.status() !== 200) bad++;
  }
  (bad === 0 ? pass : fail)('shkarkimet e fletoreve', `${files.length} skedarë, ${bad} mungojnë`);
});

/* ------------------------------------------ 9. nothing unpublished */
await withPage({ width: 1280, height: 900 }, async (page) => {
  const res = await page.goto(BASE + '/laboratoret/11/', { waitUntil: 'domcontentloaded' });
  (res && res.status() === 404 ? pass : fail)('laboratorët e papublikuar nuk janë të arritshëm', `status ${res?.status()}`);
});

/* ------------------------------------------------------- 10. mobile */
await withPage({ width: 390, height: 844 }, async (page) => {
  for (const p of ['/', '/laboratoret/', '/laboratoret/07/', '/laboratoret/09/', '/vizualizime/grafet/', '/python/']) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    (overflow <= 1 ? pass : fail)(`celular ${p} pa rrëshqitje horizontale`, `${overflow}px`);
  }
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.locator('summary[aria-label="Menyja"]').click();
  const visible = await page.getByRole('link', { name: 'Vizualizimet' }).last().isVisible();
  (visible ? pass : fail)('menyja në celular hapet');
});

/* ------------------------------------------------ 11. Albanian text */
await withPage({ width: 1280, height: 900 }, async (page) => {
  await page.goto(BASE + '/laboratoret/', { waitUntil: 'domcontentloaded' });
  const t = await page.locator('main').innerText();
  (/ë/.test(t) && /ç/i.test(t) ? pass : fail)('shkronjat shqipe shfaqen saktë', 'ë ç');
});

await browser.close();
server.close();

const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`  ${r.ok ? '✓' : '✗'} ${r.name}${r.detail ? `  — ${r.detail}` : ''}`);
console.log(`\n  ${results.length - failed.length} / ${results.length} kaluan`);
process.exit(failed.length ? 1 : 0);
