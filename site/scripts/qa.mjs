/**
 * Quality checks against the built site, in a real browser.
 *
 * Verifies the things a student would actually hit: every page renders without
 * console errors, the visualizers respond to their controls, search returns
 * results, downloads resolve, and nothing unpublished is reachable.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = 4321;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.ipynb': 'application/json', '.woff2': 'font/woff2', '.wasm': 'application/wasm',
};

const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = path.join(root, url);
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  try {
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  } catch {
    res.writeHead(404).end('not found');
    return;
  }
  try {
    const buf = fs.readFileSync(file);
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  } catch {
    res.writeHead(404).end('not found');
  }
});

await new Promise((r) => server.listen(PORT, r));
const BASE = `http://127.0.0.1:${PORT}`;

const results = [];
const pass = (n, d = '') => results.push({ ok: true, n, d });
const fail = (n, d = '') => results.push({ ok: false, n, d });

// Use the browser already present in the environment when one is provided,
// so the suite does not need a separate download.
const EXEC = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
const browser = await chromium.launch(fs.existsSync(EXEC) ? { executablePath: EXEC } : {});

/** innerText reflects CSS text-transform; compare case-insensitively. */
const has = (haystack, needle) => haystack.toLocaleLowerCase('sq').includes(needle.toLocaleLowerCase('sq'));

async function withPage(viewport, fn) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  try { await fn(page, errors); } finally { await ctx.close(); }
}

const PAGES = [
  '/', '/laboratoret/', '/laboratoret/01/', '/laboratoret/02/', '/laboratoret/03/',
  '/laboratoret/04/', '/laboratoret/05/', '/laboratoret/06/', '/laboratoret/07/',
  '/laboratoret/08/', '/laboratoret/09/',
  '/laboratoret/07/dijkstra-animated/', '/laboratoret/07/bellman-ford-animated/',
  '/detyrat/', '/detyrat/algoritmet-e-renditjes/', '/detyrat/analiza-e-kompleksitetit/',
  '/detyrat/scc-dhe-renditje-topologjike/',
  '/vizualizime/', '/vizualizime/kompleksiteti/', '/vizualizime/renditja/',
  '/vizualizime/grafet/', '/vizualizime/rruget/', '/vizualizime/floyd-warshall/',
  '/python/', '/informacion/', '/kerko/',
];

/* ---------------------------------------------------- 1. every page loads */
await withPage({ width: 1280, height: 900 }, async (page, errors) => {
  for (const p of PAGES) {
    errors.length = 0;
    const res = await page.goto(BASE + p, { waitUntil: 'networkidle' });
    if (!res || res.status() !== 200) { fail(`ngarkohet ${p}`, `status ${res?.status()}`); continue; }
    const h1 = await page.locator('h1').first().textContent().catch(() => null);
    if (!h1?.trim()) { fail(`ngarkohet ${p}`, 'pa <h1>'); continue; }
    // A page with no <main> content would render but be useless.
    const len = (await page.locator('main').innerText()).length;
    if (len < 120) { fail(`ngarkohet ${p}`, `përmbajtje shumë e shkurtër (${len})`); continue; }
    if (errors.length) { fail(`ngarkohet ${p}`, `gabime console: ${errors.slice(0, 2).join(' | ')}`); continue; }
    pass(`ngarkohet ${p}`);
  }
});

/* ------------------------------------------------- 2. unpublished is absent */
await withPage({ width: 1280, height: 900 }, async (page) => {
  const res = await page.goto(BASE + '/laboratoret/10/', { waitUntil: 'domcontentloaded' });
  if (res && res.status() === 404) pass('laboratorët e papublikuar nuk janë të arritshëm');
  else fail('laboratorët e papublikuar nuk janë të arritshëm', `status ${res?.status()}`);
});

/* ------------------------------------------------------- 3. visualizers */
const VIZ = [
  {
    url: '/vizualizime/kompleksiteti/', tag: 'viz-complexity',
    run: async (page) => {
      const before = await page.locator('viz-complexity .cx-n').textContent();
      await page.locator('viz-complexity input[type=range]').fill('200');
      await page.waitForTimeout(150);
      const after = await page.locator('viz-complexity .cx-n').textContent();
      if (before === after) throw new Error('rrëshqitësi i n nuk ndryshoi asgjë');
      const paths = await page.locator('viz-complexity svg path').count();
      if (paths < 3) throw new Error(`pritej ≥3 kurba, u gjetën ${paths}`);
      const note = await page.locator('viz-complexity .viz-note').innerText();
      if (!note.includes('200')) throw new Error('shënimi nuk u përditësua me n-në e re');
    },
  },
  {
    url: '/vizualizime/renditja/', tag: 'viz-sorting',
    run: async (page) => {
      const bars = await page.locator('viz-sorting svg rect').count();
      if (bars < 8) throw new Error(`pritej ≥8 shtylla, u gjetën ${bars}`);
      const counter = () => page.locator('viz-sorting .viz-counter').textContent();
      const c0 = await counter();
      await page.getByRole('button', { name: 'Hapi tjetër' }).click();
      await page.waitForTimeout(120);
      if ((await counter()) === c0) throw new Error('butoni "Përpara" nuk lëvizi hapin');
      // Jump to the end and confirm the array really is sorted.
      const max = await page.locator('viz-sorting input[type=range]').getAttribute('max');
      await page.locator('viz-sorting input[type=range]').fill(max);
      await page.waitForTimeout(200);
      const title = await page.locator('viz-sorting svg title').first().textContent();
      const nums = title.match(/-?\d+/g).map(Number);
      for (let i = 1; i < nums.length; i++) if (nums[i] < nums[i - 1]) throw new Error(`rezultati nuk është i renditur: ${nums}`);
      // Switching algorithm must reload the steps.
      await page.getByRole('button', { name: 'Merge Sort' }).click();
      await page.waitForTimeout(150);
      if (!(await page.locator('viz-sorting .viz-pseudo').innerText()).includes('MergeSort')) {
        throw new Error('pseudokodi nuk u ndërrua me algoritmin');
      }
    },
  },
  {
    url: '/vizualizime/grafet/', tag: 'viz-graph',
    run: async (page) => {
      const nodes = await page.locator('viz-graph [data-node]').count();
      if (nodes < 5) throw new Error(`pritej ≥5 kulme, u gjetën ${nodes}`);
      const adj = await page.locator('viz-graph .viz-panel').nth(1).innerText();
      if (!has(adj, 'Lista e fqinjësisë') || !has(adj, 'deg')) throw new Error('lista e fqinjësisë mungon');
      const mtx = await page.locator('viz-graph .viz-panel').nth(2).innerText();
      if (!has(mtx, 'Matrica e fqinjësisë')) throw new Error('matrica e fqinjësisë mungon');
      const max = await page.locator('viz-graph input[type=range]').getAttribute('max');
      await page.locator('viz-graph input[type=range]').fill(max);
      await page.waitForTimeout(200);
      if (!(await page.locator('viz-graph .viz-note').innerText()).match(/Rendi i zbulimit|zbraz/))
        throw new Error('BFS nuk arriti te hapi final');
      // Kruskal on the weighted preset must reach |V|-1 edges.
      await page.locator('viz-graph select').first().selectOption('klase2');
      await page.getByRole('button', { name: 'Kruskal', exact: true }).click();
      await page.waitForTimeout(200);
      const max2 = await page.locator('viz-graph input[type=range]').getAttribute('max');
      await page.locator('viz-graph input[type=range]').fill(max2);
      await page.waitForTimeout(200);
      const note = await page.locator('viz-graph .viz-note').innerText();
      // Verified independently: Kruskal on that graph accepts A-C(1), C-E(2),
      // B-D(3), C-D(4) — four edges, w(T*) = 10.
      if (!note.includes('w(T*) = 10') || !note.includes('4 brinjë'))
        throw new Error(`pritej MST me 4 brinjë dhe peshë 10, u lexua: ${note}`);
    },
  },
  {
    url: '/vizualizime/rruget/', tag: 'viz-paths',
    run: async (page) => {
      if (await page.locator('viz-paths .pv-col').count() !== 2) throw new Error('pritej dy kolona');
      await page.getByRole('button', { name: 'Ekzekuto të dy deri në fund' }).click();
      await page.waitForTimeout(300);
      const sum = await page.locator('viz-paths .viz-panels').innerText();
      if (!has(sum, 'Të dy japin të njëjtin rezultat'))
        throw new Error('me peshë jo-negative të dy duhet të përputhen');
      // Introduce a negative edge; Dijkstra should now be shown as unreliable.
      await page.getByRole('button', { name: /negative/ }).first().click();
      await page.waitForTimeout(200);
      await page.getByRole('button', { name: 'Ekzekuto të dy deri në fund' }).click();
      await page.waitForTimeout(300);
      const sum2 = await page.locator('viz-paths .viz-panels').innerText();
      if (!has(sum2, 'Peshë negative') || !has(sum2, 'Po'))
        throw new Error('pesha negative nuk u raportua');
      // Negative cycle must be detected by Bellman-Ford.
      await page.getByRole('button', { name: 'Shto cikël negativ' }).click();
      await page.waitForTimeout(200);
      await page.getByRole('button', { name: 'Ekzekuto të dy deri në fund' }).click();
      await page.waitForTimeout(300);
      if (!has(await page.locator('viz-paths .viz-panels').innerText(), 'Cikël negativ i zbuluar'))
        throw new Error('cikli negativ nuk u zbulua');
    },
  },
  {
    url: '/vizualizime/floyd-warshall/', tag: 'viz-floyd',
    run: async (page) => {
      const cells = await page.locator('viz-floyd .fw-table td').count();
      if (cells !== 16) throw new Error(`pritej matricë 4×4, u gjetën ${cells} qeliza`);
      const max = await page.locator('viz-floyd input[type=range]').getAttribute('max');
      await page.locator('viz-floyd input[type=range]').fill(max);
      await page.waitForTimeout(250);
      const row = await page.locator('viz-floyd .fw-table tbody tr').first().innerText();
      // D[0][2] must be 5: 0→1(3) then 1→2(2).
      if (!/\b5\b/.test(row)) throw new Error(`rreshti final i pritur përmban 5: ${row}`);
      if (!(await page.locator('viz-floyd .viz-panels').innerText()).includes('\u2192'))
        throw new Error('rruga nuk u rindërtua');
    },
  },
];

for (const v of VIZ) {
  await withPage({ width: 1366, height: 1000 }, async (page, errors) => {
    await page.goto(BASE + v.url, { waitUntil: 'networkidle' });
    // Wait for the element to be upgraded AND to have painted once.
    await page.waitForFunction(
      (tag) => {
        const el = document.querySelector(tag);
        return !!el && !!el.querySelector('.viz-note') && (el.querySelector('.viz-note').textContent || '').length > 5;
      },
      v.tag,
      { timeout: 10000 },
    ).catch(() => {});
    try {
      await v.run(page);
      if (errors.length) fail(`vizualizuesi ${v.tag}`, `gabime console: ${errors[0]}`);
      else pass(`vizualizuesi ${v.tag}`);
    } catch (e) {
      fail(`vizualizuesi ${v.tag}`, e.message);
    }
  });
}

/* ------------------------------------------------------------ 4. search */
await withPage({ width: 1280, height: 900 }, async (page) => {
  await page.goto(BASE + '/kerko/', { waitUntil: 'networkidle' });
  for (const term of ['Dijkstra', 'Merge Sort', 'BFS', 'Kruskal']) {
    const input = page.locator('#search input').first();
    await input.fill(term);
    await page.waitForTimeout(700);
    const n = await page.locator('.pagefind-ui__result').count();
    if (n > 0) pass(`kërkimi "${term}"`, `${n} rezultate`);
    else fail(`kërkimi "${term}"`, 'asnjë rezultat');
  }
});

/* --------------------------------------------------------- 5. downloads */
await withPage({ width: 1280, height: 900 }, async (page) => {
  await page.goto(BASE + '/laboratoret/07/', { waitUntil: 'domcontentloaded' });
  const links = await page.locator('.dl-list a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  let bad = 0;
  for (const href of links) {
    const r = await page.request.get(BASE + href);
    if (r.status() !== 200) bad++;
  }
  if (!bad && links.length === 3) pass('shkarkimet e Laboratorit 7', `${links.length} skedarë, të gjithë 200`);
  else fail('shkarkimet e Laboratorit 7', `${links.length} lidhje, ${bad} të prishura`);
});

/* ------------------------------------------------------- 6. plotly output */
await withPage({ width: 1280, height: 900 }, async (page, errors) => {
  await page.goto(BASE + '/laboratoret/02/', { waitUntil: 'networkidle' });
  await page.locator('plotly-figure').first().scrollIntoViewIfNeeded();
  try {
    await page.waitForSelector('plotly-figure .pf-plot svg', { timeout: 20000 });
    pass('grafikët Plotly rirenderohen interaktivë');
  } catch {
    fail('grafikët Plotly rirenderohen interaktivë', 'figura nuk u vizatua');
  }
});

/* ----------------------------------------------------- 7. mobile layout */
await withPage({ width: 375, height: 780 }, async (page) => {
  for (const p of ['/', '/laboratoret/', '/laboratoret/08/', '/detyrat/', '/vizualizime/renditja/', '/python/']) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 2) fail(`mobile ${p}`, `rrëshqitje horizontale ${overflow}px`);
    else pass(`mobile ${p}`);
  }
  // The mobile menu must actually open.
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.locator('#nav-toggle').click();
  if (await page.locator('#nav-mobile').isVisible()) pass('menuja në celular hapet');
  else fail('menuja në celular hapet');
});

/* ------------------------------------------------- 8. Albanian + math + a11y */
await withPage({ width: 1280, height: 900 }, async (page) => {
  await page.goto(BASE + '/laboratoret/05/', { waitUntil: 'domcontentloaded' });
  const text = await page.locator('main').innerText();
  const chars = ['ë', 'ç', 'Ë', 'Ç'].filter((c) => text.includes(c));
  if (chars.length >= 2) pass('shkronjat shqipe shfaqen saktë', chars.join(' '));
  else fail('shkronjat shqipe shfaqen saktë');

  if ((await page.locator('.katex').count()) > 0) pass('matematika renderohet (KaTeX)');
  else fail('matematika renderohet (KaTeX)');

  if ((await page.locator('.nb-table-wrap').count()) > 0) pass('tabelat kanë kontejner me rrëshqitje');
  else fail('tabelat kanë kontejner me rrëshqitje');

  if ((await page.locator('.sec-homework').count()) > 0 && (await page.locator('.sec-classwork').count()) > 0)
    pass('detyra dhe puna në klasë kanë identitet vizual');
  else fail('detyra dhe puna në klasë kanë identitet vizual');

  // The TOC must move with the reader.
  await page.locator('.toc-list a').nth(3).click();
  await page.waitForTimeout(600);
  if ((await page.locator('.toc-list a.is-current').count()) > 0) pass('tabela e përmbajtjes ndjek pozicionin');
  else fail('tabela e përmbajtjes ndjek pozicionin');

  // Images must carry alt text.
  const noAlt = await page.locator('main img:not([alt])').count();
  if (noAlt === 0) pass('të gjitha figurat kanë tekst alternativ');
  else fail('të gjitha figurat kanë tekst alternativ', `${noAlt} pa alt`);
});

/* ------------------------------------------- 9. GUI traces read as neutral */
await withPage({ width: 1280, height: 900 }, async (page) => {
  await page.goto(BASE + '/laboratoret/07/', { waitUntil: 'domcontentloaded' });
  const benign = await page.locator('.nb-out-benign').count();
  const hard = await page.locator('.nb-out-error').count();
  if (benign >= 6 && hard === 0) pass('gjurmët SystemExit shfaqen si shënime, jo gabime', `${benign} shënime`);
  else fail('gjurmët SystemExit shfaqen si shënime, jo gabime', `${benign} shënime, ${hard} gabime`);

  await page.goto(BASE + '/laboratoret/01/', { waitUntil: 'domcontentloaded' });
  const real = await page.locator('.nb-out-error').count();
  if (real === 1) pass('gabimi real i Laboratorit 1 mbetet i dukshëm si gabim');
  else fail('gabimi real i Laboratorit 1 mbetet i dukshëm si gabim', `u gjetën ${real}`);
});

/* ------------------------------------ 10. lab5/lab6 split and cross-links */
await withPage({ width: 1280, height: 900 }, async (page) => {
  await page.goto(BASE + '/laboratoret/05/', { waitUntil: 'domcontentloaded' });
  const t5 = await page.locator('.lab-main').innerText();
  await page.goto(BASE + '/laboratoret/06/', { waitUntil: 'domcontentloaded' });
  const t6 = await page.locator('.lab-main').innerText();

  const ok5 = t5.includes('Kruskal') && t5.includes('Detyrë për Shtëpi') && !t5.includes('Renditjet Topologjike');
  const ok6 = t6.includes('Renditjet Topologjike') && t6.includes('Komponentet e Lidhura Fort') && !t6.includes('Punë në Klasë');
  if (ok5 && ok6) pass('Lab 5 dhe Lab 6 ndajnë saktë të njëjtën fletore');
  else fail('Lab 5 dhe Lab 6 ndajnë saktë të njëjtën fletore', `lab5=${ok5} lab6=${ok6}`);

  // Embedded homework must link into the notebook, not be duplicated.
  await page.goto(BASE + '/detyrat/', { waitUntil: 'domcontentloaded' });
  const hrefs = await page.locator('.c-actions a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  if (hrefs.some((x) => x.includes('/laboratoret/05/#'))) pass('detyra e brendshme lidhet te seksioni i fletores');
  else fail('detyra e brendshme lidhet te seksioni i fletores');
});

/* ----------------------------------------------------- 11. prev/next nav */
await withPage({ width: 1280, height: 900 }, async (page) => {
  await page.goto(BASE + '/laboratoret/05/', { waitUntil: 'domcontentloaded' });
  await page.locator('.nav-next').click();
  await page.waitForLoadState('domcontentloaded');
  if (page.url().includes('/laboratoret/06/')) pass('navigimi Para/Pas midis laboratorëve');
  else fail('navigimi Para/Pas midis laboratorëve', page.url());
});

await browser.close();
server.close();

/* --------------------------------------------------------------- report */
const failed = results.filter((r) => !r.ok);
console.log('');
for (const r of results) {
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.n}${r.d ? `  — ${r.d}` : ''}`);
}
console.log(`\n  ${results.length - failed.length} / ${results.length} kaluan\n`);
process.exit(failed.length ? 1 : 0);
