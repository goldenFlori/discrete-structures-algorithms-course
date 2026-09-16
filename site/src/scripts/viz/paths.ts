/**
 * <viz-paths> — Dijkstra kundrejt Bellman-Ford
 *
 * Laboratori 7 runs entirely in Pygame, and both supplementary notebooks
 * depend on a .py script that was never published. This is the browser
 * replacement: the same graph, both algorithms, side by side, so the reason
 * Dijkstra requires w ≥ 0 becomes visible rather than asserted.
 */
import { h, svgEl, Player, buildControls, bindKeys, liveNote, infLabel } from './common';

interface N { id: string; x: number; y: number }
interface E { u: string; v: string; w: number }

interface PStep {
  note: string;
  dist: Record<string, number>;
  prev: Record<string, string | null>;
  current?: string | null;
  settled: string[];
  relaxing?: string | null;   // "u>v"
  updated: string[];
  iteration?: number;
  relaxations: number;
  negativeCycle?: boolean;
  done?: boolean;
}

/* The delivery-network shape used by Laboratori 7, exercises 1–4. */
const NODES: N[] = [
  { id: 'A', x: 70, y: 180 }, { id: 'B', x: 220, y: 70 }, { id: 'C', x: 220, y: 290 },
  { id: 'D', x: 380, y: 70 }, { id: 'E', x: 380, y: 290 }, { id: 'F', x: 530, y: 180 },
];
const BASE_EDGES: E[] = [
  { u: 'A', v: 'B', w: 4 }, { u: 'A', v: 'C', w: 6 }, { u: 'B', v: 'C', w: 2 },
  { u: 'B', v: 'D', w: 3 }, { u: 'C', v: 'E', w: 1 }, { u: 'D', v: 'E', w: 1 },
  { u: 'D', v: 'F', w: 7 }, { u: 'E', v: 'F', w: 2 },
];

const ek = (u: string, v: string) => `${u}>${v}`;

/* ------------------------------------------------------------ Dijkstra */

function dijkstra(nodes: N[], edges: E[], src: string): PStep[] {
  const steps: PStep[] = [];
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  for (const n of nodes) { dist[n.id] = Infinity; prev[n.id] = null; }
  dist[src] = 0;
  const settled: string[] = [];
  let relax = 0;

  const negative = edges.some((e) => e.w < 0);
  steps.push({
    note: negative
      ? `Inicializim: dist[${src}] = 0, të tjerat ∞. <strong>Kujdes:</strong> ky graf ka peshë negative — kushti i Dijkstra-s (w ≥ 0) është shkelur.`
      : `Inicializim: dist[${src}] = 0, të gjitha të tjerat ∞.`,
    dist: { ...dist }, prev: { ...prev }, settled: [], updated: [], relaxations: relax,
  });

  while (settled.length < nodes.length) {
    let u: string | null = null;
    for (const n of nodes) {
      if (settled.includes(n.id)) continue;
      if (u === null || dist[n.id] < dist[u]) u = n.id;
    }
    if (u === null || dist[u] === Infinity) {
      steps.push({ note: 'Kulmet e mbetura janë të paarritshme nga burimi. Algoritmi ndalet.', dist: { ...dist }, prev: { ...prev }, settled: [...settled], updated: [], relaxations: relax, done: true });
      break;
    }
    settled.push(u);
    steps.push({
      note: `Zgjedhim kulmin me distancë minimale mes atyre të patabeluar: <strong>${u}</strong> me dist = ${infLabel(dist[u])}. E shënojmë si të tabeluar — <em>vendim përfundimtar</em>.`,
      dist: { ...dist }, prev: { ...prev }, current: u, settled: [...settled], updated: [], relaxations: relax,
    });

    for (const e of edges.filter((x) => x.u === u)) {
      relax++;
      const cand = dist[u] + e.w;
      const better = cand < dist[e.v];
      if (better) { dist[e.v] = cand; prev[e.v] = u; }
      steps.push({
        note: `Relaksim i brinjës ${e.u}→${e.v} (w = ${e.w}): dist[${e.u}] + ${e.w} = ${infLabel(cand)} ${better ? '<' : '≥'} dist[${e.v}] = ${infLabel(better ? dist[e.v] : dist[e.v])}. ${better ? `Përditësojmë dist[${e.v}] = ${cand}, paraardhësi = ${e.u}.` : 'Asnjë përmirësim.'}`,
        dist: { ...dist }, prev: { ...prev }, current: u, settled: [...settled],
        relaxing: ek(e.u, e.v), updated: better ? [e.v] : [], relaxations: relax,
      });
    }
  }

  const wrong = negative;
  steps.push({
    note: wrong
      ? `Dijkstra përfundoi, por rezultati <strong>mund të jetë i gabuar</strong>: sapo një kulm tabelohet, ai nuk rishikohet kurrë — dhe një brinjë negative më vonë mund ta shkurtonte rrugën. Për këtë grafik duhet Bellman-Ford.`
      : `Dijkstra përfundoi pas ${relax} relaksimesh. Çdo kulm u tabelua saktësisht një herë.`,
    dist: { ...dist }, prev: { ...prev }, settled: [...settled], updated: [], relaxations: relax, done: true,
  });
  return steps;
}

/* --------------------------------------------------------- Bellman-Ford */

function bellmanFord(nodes: N[], edges: E[], src: string): PStep[] {
  const steps: PStep[] = [];
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  for (const n of nodes) { dist[n.id] = Infinity; prev[n.id] = null; }
  dist[src] = 0;
  let relax = 0;

  steps.push({
    note: `Inicializim: dist[${src}] = 0, të tjerat ∞. Bellman-Ford skanon <strong>të gjitha brinjët</strong> në çdo iterim — nuk zgjedh asnjë kulm në mënyrë greedy.`,
    dist: { ...dist }, prev: { ...prev }, settled: [], updated: [], iteration: 0, relaxations: relax,
  });

  for (let it = 1; it <= nodes.length - 1; it++) {
    let changed = false;
    steps.push({
      note: `<strong>Iterimi ${it}</strong> nga ${nodes.length - 1}. Kalojmë nëpër të gjitha ${edges.length} brinjët.`,
      dist: { ...dist }, prev: { ...prev }, settled: [], updated: [], iteration: it, relaxations: relax,
    });
    for (const e of edges) {
      relax++;
      if (dist[e.u] === Infinity) continue;
      const cand = dist[e.u] + e.w;
      const better = cand < dist[e.v];
      if (better) { dist[e.v] = cand; prev[e.v] = e.u; changed = true; }
      steps.push({
        note: `Brinja ${e.u}→${e.v} (w = ${e.w}): ${infLabel(dist[e.u])} + ${e.w} = ${infLabel(cand)} ${better ? '<' : '≥'} dist[${e.v}]. ${better ? 'Përditësohet.' : 'Pa ndryshim.'}`,
        dist: { ...dist }, prev: { ...prev }, settled: [], relaxing: ek(e.u, e.v),
        updated: better ? [e.v] : [], iteration: it, relaxations: relax,
      });
    }
    if (!changed) {
      steps.push({
        note: `Iterimi ${it} nuk prodhoi asnjë përmirësim → distancat kanë konvergjuar. Ndalim i hershëm, pa i bërë të ${nodes.length - 1} iterimet.`,
        dist: { ...dist }, prev: { ...prev }, settled: [], updated: [], iteration: it, relaxations: relax,
      });
      break;
    }
  }

  // One extra pass: any further improvement means a negative cycle.
  let negCycle = false;
  for (const e of edges) {
    if (dist[e.u] !== Infinity && dist[e.u] + e.w < dist[e.v]) { negCycle = true; break; }
  }
  steps.push({
    note: negCycle
      ? `Kontrolli final: pas ${nodes.length - 1} iterimeve ende mund të përmirësojmë një distancë → grafi përmban <strong>cikël negativ</strong>. Rruga më e shkurtër nuk ekziston.`
      : `Kontrolli final: asnjë distancë nuk përmirësohet më → <strong>nuk ka cikël negativ</strong>. Rezultati është i saktë edhe me peshë negative. Gjithsej ${relax} relaksime.`,
    dist: { ...dist }, prev: { ...prev }, settled: [], updated: [], relaxations: relax, negativeCycle: negCycle, done: true,
  });
  return steps;
}

/* ------------------------------------------------------------- element */

class VizPaths extends HTMLElement {
  private edges: E[] = BASE_EDGES.map((e) => ({ ...e }));
  private src = 'A';
  private mode: 'dijkstra' | 'bellman' | 'both' = 'both';
  private negative = false;

  private playerD = new Player();
  private playerB = new Player();
  private stageD!: HTMLElement;
  private stageB!: HTMLElement;
  private noteD!: HTMLElement;
  private noteB!: HTMLElement;
  private tableD!: HTMLElement;
  private tableB!: HTMLElement;
  private summary!: HTMLElement;
  private syncD!: (i: number) => void;
  private syncB!: (i: number) => void;
  private colD!: HTMLElement;
  private colB!: HTMLElement;

  connectedCallback() {
    this.classList.add('viz');
    this.build();
    this.run();
  }

  private build() {
    const srcSel = h('select', { class: 'viz-select', 'aria-label': 'Kulmi burim' }) as HTMLSelectElement;
    for (const n of NODES) srcSel.append(h('option', { value: n.id }, n.id));
    srcSel.addEventListener('change', () => { this.src = srcSel.value; this.run(); });

    const negBtn = h('button', { type: 'button', class: 'viz-btn', 'aria-pressed': 'false' }, 'Bëj C→E negative (−4)');
    negBtn.addEventListener('click', () => {
      this.negative = !this.negative;
      negBtn.setAttribute('aria-pressed', String(this.negative));
      const e = this.edges.find((x) => x.u === 'C' && x.v === 'E')!;
      e.w = this.negative ? -4 : 1;
      this.run();
    });

    const cycBtn = h('button', { type: 'button', class: 'viz-btn', 'aria-pressed': 'false' }, 'Shto cikël negativ');
    cycBtn.addEventListener('click', () => {
      const has = this.edges.some((x) => x.u === 'E' && x.v === 'B');
      if (has) this.edges = this.edges.filter((x) => !(x.u === 'E' && x.v === 'B'));
      else this.edges.push({ u: 'E', v: 'B', w: -8 });
      cycBtn.setAttribute('aria-pressed', String(!has));
      this.run();
    });

    const modeSet = h('div', { class: 'viz-btnset', role: 'group', 'aria-label': 'Çfarë të shfaqet' });
    for (const [m, label] of [['both', 'Të dy'], ['dijkstra', 'Vetëm Dijkstra'], ['bellman', 'Vetëm Bellman-Ford']] as const) {
      const b = h('button', { type: 'button', class: 'viz-btn', 'aria-pressed': String(m === this.mode) }, label);
      b.addEventListener('click', () => {
        this.mode = m;
        for (const o of modeSet.querySelectorAll('button')) o.setAttribute('aria-pressed', 'false');
        b.setAttribute('aria-pressed', 'true');
        this.applyMode();
      });
      modeSet.append(b);
    }

    const setup = h('div', { class: 'viz-setup' },
      h('label', { class: 'viz-field' }, h('span', {}, 'Burimi'), srcSel),
      h('div', { class: 'viz-field' }, h('span', {}, 'Eksperimento'), h('div', { class: 'viz-btnset' }, negBtn, cycBtn)),
      h('div', { class: 'viz-field' }, h('span', {}, 'Shfaq'), modeSet),
    );

    this.stageD = h('div', { class: 'viz-stage' });
    this.stageB = h('div', { class: 'viz-stage' });
    this.noteD = liveNote();
    this.noteB = liveNote();
    this.tableD = h('div', { class: 'viz-panel viz-scroll' });
    this.tableB = h('div', { class: 'viz-panel viz-scroll' });
    this.summary = h('div', { class: 'viz-panel' });

    const cD = buildControls(this.playerD); this.syncD = cD.sync;
    const cB = buildControls(this.playerB); this.syncB = cB.sync;
    this.playerD.onChange = (i) => this.paint('d', i);
    this.playerB.onChange = (i) => this.paint('b', i);

    this.colD = h('div', { class: 'pv-col' },
      h('div', { class: 'pv-head' }, h('strong', {}, 'Dijkstra'), h('code', {}, 'O((V+E) log V)'), h('span', { class: 'pv-req' }, 'kërkon w ≥ 0')),
      this.stageD, cD.bar, this.noteD, this.tableD);
    this.colB = h('div', { class: 'pv-col' },
      h('div', { class: 'pv-head' }, h('strong', {}, 'Bellman-Ford'), h('code', {}, 'O(V·E)'), h('span', { class: 'pv-req' }, 'lejon w < 0')),
      this.stageB, cB.bar, this.noteB, this.tableB);

    const syncBtn = h('button', { type: 'button', class: 'viz-btn' }, 'Ekzekuto të dy deri në fund');
    syncBtn.addEventListener('click', () => {
      this.playerD.go(this.playerD.steps.length - 1);
      this.playerB.go(this.playerB.steps.length - 1);
    });

    this.append(
      setup,
      h('div', { class: 'pv-grid' }, this.colD, this.colB),
      h('div', { class: 'viz-panels' }, this.summary),
      h('div', { class: 'viz-controls' }, syncBtn),
      h('div', { class: 'viz-legend' },
        lk('var(--viz-active)', '▶', 'Kulmi aktual'),
        lk('var(--viz-done)', '✓', 'I tabeluar (final)'),
        lk('var(--viz-compare)', '→', 'Brinja që po relaksohet'),
        lk('var(--viz-path)', '━', 'Pema e rrugëve më të shkurtra'),
        lk('var(--viz-reject)', '−', 'Peshë negative'),
      ),
    );
    bindKeys(this, this.playerD);
  }

  private applyMode() {
    this.colD.hidden = this.mode === 'bellman';
    this.colB.hidden = this.mode === 'dijkstra';
    this.classList.toggle('is-single', this.mode !== 'both');
  }

  private run() {
    this.playerD.load(dijkstra(NODES, this.edges, this.src));
    this.playerB.load(bellmanFord(NODES, this.edges, this.src));
    this.paint('d', 0);
    this.paint('b', 0);
    this.applyMode();
  }

  private paint(which: 'd' | 'b', i: number) {
    const player = which === 'd' ? this.playerD : this.playerB;
    const s = player.steps[i] as PStep | undefined;
    if (!s) return;
    (which === 'd' ? this.syncD : this.syncB)(i);
    (which === 'd' ? this.noteD : this.noteB).innerHTML = s.note;
    this.drawGraph(which === 'd' ? this.stageD : this.stageB, s);
    this.drawTable(which === 'd' ? this.tableD : this.tableB, s, which);
    this.drawSummary();
  }

  private drawGraph(stage: HTMLElement, s: PStep) {
    const W = 600, H = 360;
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' });
    const t = svgEl('title');
    t.textContent = `Graf i drejtuar me ${NODES.length} kulme; distancat aktuale: ${NODES.map((n) => `${n.id}=${infLabel(s.dist[n.id])}`).join(', ')}`;
    svg.append(t);

    const defs = svgEl('defs');
    for (const [id, colour] of [['pa', 'var(--viz-line)'], ['pa-on', 'var(--viz-compare)'], ['pa-tree', 'var(--viz-path)'], ['pa-neg', 'var(--viz-reject)']]) {
      const m = svgEl('marker', { id: `p-${id}`, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' });
      m.append(svgEl('path', { d: 'M0,0 L10,5 L0,10 z', fill: colour }));
      defs.append(m);
    }
    svg.append(defs);

    const pos = new Map(NODES.map((n) => [n.id, n]));
    const treeEdges = new Set(
      Object.entries(s.prev).filter(([, p]) => p).map(([v, p]) => ek(p!, v)),
    );

    for (const e of this.edges) {
      const a = pos.get(e.u)!, b = pos.get(e.v)!;
      const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, r = 20;
      const x1 = a.x + (dx / len) * r, y1 = a.y + (dy / len) * r;
      const x2 = b.x - (dx / len) * r, y2 = b.y - (dy / len) * r;
      const k = ek(e.u, e.v);
      const isRelax = s.relaxing === k;
      const inTree = treeEdges.has(k);
      const neg = e.w < 0;

      const stroke = isRelax ? 'var(--viz-compare)' : neg ? 'var(--viz-reject)' : inTree ? 'var(--viz-path)' : 'var(--viz-line)';
      const mk = isRelax ? 'p-pa-on' : neg ? 'p-pa-neg' : inTree ? 'p-pa-tree' : 'p-pa';
      svg.append(svgEl('line', {
        x1, y1, x2, y2, stroke, 'stroke-width': isRelax ? 4 : inTree ? 3.2 : 2,
        'marker-end': `url(#${mk})`, 'stroke-linecap': 'round',
        'stroke-dasharray': neg ? '6 3' : '',
      }));

      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      svg.append(svgEl('circle', { cx: mx, cy: my, r: 12, fill: 'var(--surface)', stroke, 'stroke-width': 1.5 }));
      const wt = svgEl('text', { x: mx, y: my + 4, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: stroke, 'font-family': 'var(--font-mono)' });
      wt.textContent = String(e.w);
      svg.append(wt);
    }

    for (const n of NODES) {
      const isCur = s.current === n.id;
      const settled = s.settled.includes(n.id);
      const updated = s.updated.includes(n.id);

      let fill = 'var(--surface)', stroke = 'var(--viz-line)', ink = 'var(--ink-2)', mark = '';
      if (isCur) { fill = 'var(--viz-active)'; stroke = 'var(--viz-active)'; ink = '#fff'; mark = '▶'; }
      else if (settled) { fill = 'var(--viz-done)'; stroke = 'var(--viz-done)'; ink = '#fff'; mark = '✓'; }
      else if (updated) { stroke = 'var(--viz-compare)'; ink = 'var(--viz-compare)'; mark = '↓'; }

      svg.append(svgEl('circle', { cx: n.x, cy: n.y, r: 20, fill, stroke, 'stroke-width': isCur || updated ? 3 : 2 }));
      const lt = svgEl('text', { x: n.x, y: n.y + 5, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: ink, 'font-family': 'var(--font-mono)' });
      lt.textContent = n.id;
      svg.append(lt);

      // distance label always visible, so the table and picture agree
      const dv = infLabel(s.dist[n.id]);
      svg.append(svgEl('rect', { x: n.x - 17, y: n.y + 24, width: 34, height: 17, rx: 4, fill: updated ? 'var(--viz-compare)' : 'var(--surface-2)', stroke: 'var(--border)', 'stroke-width': 1 }));
      const dt = svgEl('text', { x: n.x, y: n.y + 36, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: updated ? '#fff' : 'var(--ink-2)', 'font-family': 'var(--font-mono)' });
      dt.textContent = dv;
      svg.append(dt);

      if (mark) {
        const mt = svgEl('text', { x: n.x + 18, y: n.y - 15, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: stroke });
        mt.textContent = mark;
        svg.append(mt);
      }
    }
    stage.replaceChildren(svg);
  }

  private drawTable(panel: HTMLElement, s: PStep, which: 'd' | 'b') {
    panel.replaceChildren(
      h('h4', {}, which === 'd' ? 'Tabela e distancave' : `Tabela e distancave${s.iteration ? ` — iterimi ${s.iteration}` : ''}`),
      h('table', {},
        h('thead', {}, h('tr', {}, h('th', {}, 'v'), ...NODES.map((n) => h('th', {}, n.id)))),
        h('tbody', {},
          h('tr', {}, h('th', { scope: 'row' }, 'dist'),
            ...NODES.map((n) => h('td', { class: s.updated.includes(n.id) ? 'm-on' : '' }, infLabel(s.dist[n.id])))),
          h('tr', {}, h('th', { scope: 'row' }, 'prev'),
            ...NODES.map((n) => h('td', {}, s.prev[n.id] ?? '—'))),
        ),
      ),
      h('p', { class: 'muted', style: 'font-size:.78rem;margin:.5rem 0 0' }, `Relaksime deri tani: ${s.relaxations}`),
    );
  }

  private drawSummary() {
    // The first player to load paints before the second has any steps.
    const d = this.playerD.steps[this.playerD.steps.length - 1] as PStep | undefined;
    const b = this.playerB.steps[this.playerB.steps.length - 1] as PStep | undefined;
    if (!d || !b) return;
    const disagree = NODES.filter((n) => d.dist[n.id] !== b.dist[n.id]);
    const neg = this.edges.some((e) => e.w < 0);

    const rows = NODES.map((n) =>
      h('tr', { class: d.dist[n.id] !== b.dist[n.id] ? 'row-diff' : '' },
        h('th', { scope: 'row' }, n.id),
        h('td', {}, infLabel(d.dist[n.id])),
        h('td', {}, infLabel(b.dist[n.id])),
        h('td', {}, d.dist[n.id] === b.dist[n.id] ? '=' : '≠'),
      ));

    const verdict = b.negativeCycle
      ? h('div', { class: 'callout callout-danger', style: 'margin:.8rem 0 0' },
          h('p', { class: 'callout-title' }, 'Cikël negativ i zbuluar'),
          h('p', { style: 'margin:0' }, 'Bellman-Ford e detekton; Dijkstra as nuk e sheh. Me një cikël negativ, rruga më e shkurtër thjesht nuk ekziston — mund të bëhet pafundësisht e vogël.'))
      : disagree.length
        ? h('div', { class: 'callout callout-warn', style: 'margin:.8rem 0 0' },
            h('p', { class: 'callout-title' }, 'Të dy algoritmet japin rezultate të ndryshme'),
            h('p', { style: 'margin:0' }, `Ndryshojnë te ${disagree.map((n) => n.id).join(', ')}. Dijkstra e tabelon një kulm përgjithmonë sapo e zgjedh, prandaj një brinjë negative më vonë nuk mund ta korrigjojë. Bellman-Ford ka të drejtë këtu.`))
        : h('div', { class: 'callout callout-ok', style: 'margin:.8rem 0 0' },
            h('p', { class: 'callout-title' }, 'Të dy japin të njëjtin rezultat'),
            h('p', { style: 'margin:0' }, neg
              ? 'Rastësisht përputhen edhe me peshë negative — por Dijkstra nuk e garanton këtë. Provoni një burim tjetër.'
              : `Me të gjitha peshat ≥ 0 të dy janë të saktë. Dijkstra e arriti me ${d.relaxations} relaksime, Bellman-Ford me ${b.relaxations}.`));

    this.summary.replaceChildren(
      h('h4', {}, 'Krahasimi i rezultateve'),
      h('div', { class: 'viz-scroll' },
        h('table', {},
          h('thead', {}, h('tr', {}, h('th', {}, 'Kulmi'), h('th', {}, 'Dijkstra'), h('th', {}, 'Bellman-Ford'), h('th', {}, ''))),
          h('tbody', {}, ...rows))),
      h('dl', { class: 'viz-stats', style: 'margin-top:.7rem' },
        h('div', { class: 'viz-stat' }, h('dt', {}, 'Relaksime · Dijkstra'), h('dd', {}, String(d.relaxations))),
        h('div', { class: 'viz-stat' }, h('dt', {}, 'Relaksime · B-F'), h('dd', {}, String(b.relaxations))),
        h('div', { class: 'viz-stat' }, h('dt', {}, 'Peshë negative'), h('dd', {}, neg ? 'Po' : 'Jo')),
      ),
      verdict,
    );
  }
}

function lk(colour: string, mark: string, label: string) {
  return h('span', {}, h('span', { class: 'viz-key', style: `background:${colour};color:#fff` }, mark), label);
}

if (!customElements.get('viz-paths')) customElements.define('viz-paths', VizPaths);
