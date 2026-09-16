/**
 * <viz-floyd> — Stepper-i Floyd-Warshall
 *
 * Floyd-Warshall is the only algorithm that appears in two laboratories (7
 * and 8). The triple loop is impossible to follow by eye, so this steps
 * through one comparison at a time with the matrix and the graph side by side.
 *
 * Default data is the D⁰ matrix from Punë në Klasë, Problemi 3 (Laboratori 7).
 */
import { h, svgEl, Player, buildControls, bindKeys, liveNote, infLabel } from './common';

const INF = Infinity;

interface FStep {
  note: string;
  D: number[][];
  P: (number | null)[][];
  k: number;
  i: number;
  j: number;
  improved: boolean;
  phase: 'init' | 'k' | 'cmp' | 'done';
  updates: number;
  negativeCycle?: boolean;
}

/** Punë në Klasë, Problemi 3 — Laboratori 7. */
const PRESET_CLASS: number[][] = [
  [0, 3, INF, 7],
  [8, 0, 2, INF],
  [5, INF, 0, 1],
  [2, INF, INF, 0],
];

/** A small delivery network in the spirit of UrbanPost (Laboratori 8). */
const PRESET_URBAN: number[][] = [
  [0, 12, INF, 24, INF],
  [INF, 0, 9, INF, 20],
  [INF, INF, 0, 6, 11],
  [INF, INF, INF, 0, 8],
  [15, INF, INF, INF, 0],
];

const LABELS_CLASS = ['0', '1', '2', '3'];
const LABELS_URBAN = ['DQ', 'QR-A', 'QR-B', 'PD-1', 'PD-2'];

function floydSteps(W: number[][], L: string[]): FStep[] {
  const n = W.length;
  const D = W.map((r) => r.slice());
  const P: (number | null)[][] = W.map((row, i) => row.map((v, j) => (i !== j && v !== INF ? i : null)));
  const steps: FStep[] = [];
  let updates = 0;

  steps.push({
    note: 'Inicializim: D⁰ = matrica e peshave. D[i][j] = pesha e harkut (i,j), ∞ nëse s\'ka hark, 0 në diagonale.',
    D: D.map((r) => r.slice()), P: P.map((r) => r.slice()), k: -1, i: -1, j: -1, improved: false, phase: 'init', updates,
  });

  for (let k = 0; k < n; k++) {
    steps.push({
      note: `<strong>k = ${L[k]}</strong> — provojmë kulmin ${L[k]} si ndërmjetës për çdo çift (i, j).`,
      D: D.map((r) => r.slice()), P: P.map((r) => r.slice()), k, i: -1, j: -1, improved: false, phase: 'k', updates,
    });
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j || i === k || j === k) continue; // these can never improve
        const through = D[i][k] === INF || D[k][j] === INF ? INF : D[i][k] + D[k][j];
        const improved = through < D[i][j];
        if (improved) { D[i][j] = through; P[i][j] = P[k][j]; updates++; }
        steps.push({
          note:
            `D[${L[i]}][${L[j]}] = min(${infLabel(improved ? Infinity : D[i][j])}, ` +
            `D[${L[i]}][${L[k]}] + D[${L[k]}][${L[j]}] = ${infLabel(D[i][k])} + ${infLabel(D[k][j])} = ${infLabel(through)}) ` +
            (improved
              ? `→ <strong>përmirësim!</strong> Rruga ${L[i]} → ${L[k]} → ${L[j]} është më e shkurtër. D[${L[i]}][${L[j]}] = ${through}.`
              : `→ pa ndryshim.`),
          D: D.map((r) => r.slice()), P: P.map((r) => r.slice()), k, i, j, improved, phase: 'cmp', updates,
        });
      }
    }
  }

  const negCycle = D.some((row, i) => row[i] < 0);
  steps.push({
    note: negCycle
      ? 'Përfundoi, por D[v][v] < 0 për ndonjë kulm → grafi ka <strong>cikël negativ</strong>. Algoritmi duhet të raportojë gabim.'
      : `Përfundoi pas ${n}³ = ${n ** 3} kontrollesh dhe ${updates} përmirësimesh. Matrica D përmban distancat minimale midis çdo çifti.`,
    D: D.map((r) => r.slice()), P: P.map((r) => r.slice()), k: n - 1, i: -1, j: -1, improved: false, phase: 'done', updates, negativeCycle: negCycle,
  });
  return steps;
}

function reconstruct(P: (number | null)[][], src: number, dst: number): number[] | null {
  if (src === dst) return [src];
  if (P[src][dst] === null) return null;
  const path = [dst];
  let guard = 0;
  while (path[path.length - 1] !== src && guard++ < 64) {
    const p = P[src][path[path.length - 1]];
    if (p === null) return null;
    path.push(p);
  }
  return path.reverse();
}

/* ------------------------------------------------------------- element */

class VizFloyd extends HTMLElement {
  private W = PRESET_CLASS.map((r) => r.slice());
  private L = LABELS_CLASS.slice();
  private player = new Player();
  private matrix!: HTMLElement;
  private stage!: HTMLElement;
  private note!: HTMLElement;
  private pathPanel!: HTMLElement;
  private sync!: (i: number) => void;
  private srcSel!: HTMLSelectElement;
  private dstSel!: HTMLSelectElement;
  private positions: { x: number; y: number }[] = [];

  connectedCallback() {
    this.classList.add('viz');
    this.build();
    this.load('klase');
  }

  private build() {
    const presetSel = h('select', { class: 'viz-select', 'aria-label': 'Matrica fillestare' }) as HTMLSelectElement;
    presetSel.append(
      h('option', { value: 'klase' }, 'Punë në Klasë — Problemi 3 (Lab 7)'),
      h('option', { value: 'urban' }, 'Rrjet dorëzimi — 5 pika (Lab 8)'),
    );
    presetSel.addEventListener('change', () => this.load(presetSel.value));

    const nextK = h('button', { type: 'button', class: 'viz-btn' }, 'Kapërce te k-ja tjetër');
    nextK.addEventListener('click', () => {
      this.player.pause();
      const cur = (this.player.steps[this.player.index] as FStep).k;
      const idx = this.player.steps.findIndex((s, n) => n > this.player.index && (s as FStep).k > cur);
      this.player.go(idx === -1 ? this.player.steps.length - 1 : idx);
    });
    const nextHit = h('button', { type: 'button', class: 'viz-btn' }, 'Kapërce te përmirësimi tjetër');
    nextHit.addEventListener('click', () => {
      this.player.pause();
      const idx = this.player.steps.findIndex((s, n) => n > this.player.index && (s as FStep).improved);
      this.player.go(idx === -1 ? this.player.steps.length - 1 : idx);
    });

    this.srcSel = h('select', { class: 'viz-select', 'aria-label': 'Nga' }) as HTMLSelectElement;
    this.dstSel = h('select', { class: 'viz-select', 'aria-label': 'Deri te' }) as HTMLSelectElement;
    for (const s of [this.srcSel, this.dstSel]) s.addEventListener('change', () => this.paint(this.player.index));

    const setup = h('div', { class: 'viz-setup' },
      h('label', { class: 'viz-field' }, h('span', {}, 'Të dhënat'), presetSel),
      h('div', { class: 'viz-field' }, h('span', {}, 'Kapërce'), h('div', { class: 'viz-btnset' }, nextK, nextHit)),
      h('div', { class: 'viz-field' }, h('span', {}, 'Rindërto rrugën'),
        h('div', { class: 'viz-btnset' }, this.srcSel, h('span', { style: 'align-self:center;color:var(--ink-3)' }, '→'), this.dstSel)),
    );

    this.matrix = h('div', { class: 'viz-panel viz-scroll fw-matrix' });
    this.stage = h('div', { class: 'viz-stage' });
    this.note = liveNote();
    this.pathPanel = h('div', { class: 'viz-panel' });

    const { bar, sync } = buildControls(this.player);
    this.sync = sync;
    this.player.onChange = (i) => this.paint(i);

    this.append(
      setup,
      h('div', { class: 'fw-grid' }, this.matrix, this.stage),
      bar, this.note,
      h('div', { class: 'viz-panels' }, this.pathPanel),
      h('div', { class: 'viz-legend' },
        lk('var(--viz-active)', 'k', 'Kulmi ndërmjetës aktual'),
        lk('var(--viz-compare)', 'i k', 'D[i][k] dhe D[k][j] — termat e shumës'),
        lk('var(--viz-done)', '↓', 'D[i][j] sapo u përmirësua'),
        lk('var(--viz-path)', '━', 'Rruga e rindërtuar'),
      ),
    );
    bindKeys(this, this.player);
  }

  private load(key: string) {
    if (key === 'urban') { this.W = PRESET_URBAN.map((r) => r.slice()); this.L = LABELS_URBAN.slice(); }
    else { this.W = PRESET_CLASS.map((r) => r.slice()); this.L = LABELS_CLASS.slice(); }

    // Lay the vertices on a circle so the picture stays readable for any n.
    const n = this.L.length;
    this.positions = this.L.map((_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      return { x: 200 + Math.cos(a) * 130, y: 170 + Math.sin(a) * 120 };
    });

    for (const sel of [this.srcSel, this.dstSel]) {
      sel.replaceChildren(...this.L.map((l, i) => h('option', { value: String(i) }, l)));
    }
    this.srcSel.value = '0';
    this.dstSel.value = String(n - 1);

    this.player.load(floydSteps(this.W, this.L));
    this.paint(0);
  }

  private paint(i: number) {
    const s = this.player.steps[i] as FStep | undefined;
    if (!s) return;
    this.sync(i);
    this.note.innerHTML = s.note;
    this.drawMatrix(s);
    this.drawGraph(s);
    this.drawPath(s);
  }

  private drawMatrix(s: FStep) {
    const n = this.L.length;
    const head = h('tr', {}, h('th', {}, 'D'), ...this.L.map((l, j) =>
      h('th', { class: j === s.k ? 'fw-k' : j === s.j ? 'fw-j' : '' }, l)));

    const rows = this.L.map((l, i) =>
      h('tr', {},
        h('th', { scope: 'row', class: i === s.k ? 'fw-k' : i === s.i ? 'fw-i' : '' }, l),
        ...this.L.map((_, j) => {
          const cls: string[] = [];
          if (i === s.i && j === s.j) cls.push(s.improved ? 'fw-hit' : 'fw-cmp');
          else if ((i === s.i && j === s.k) || (i === s.k && j === s.j)) cls.push('fw-term');
          else if (i === s.k || j === s.k) cls.push('fw-krow');
          if (i === j) cls.push('fw-diag');
          return h('td', { class: cls.join(' ') }, infLabel(s.D[i][j]));
        }),
      ));

    this.matrix.replaceChildren(
      h('h4', {}, s.phase === 'init' ? 'Matrica D⁰' : s.phase === 'done' ? 'Matrica D përfundimtare' : `Matrica D — k = ${this.L[s.k]}`),
      h('table', { class: 'fw-table' }, h('thead', {}, head), h('tbody', {}, ...rows)),
      h('p', { class: 'fw-formula mono' },
        s.phase === 'cmp'
          ? `D[${this.L[s.i]}][${this.L[s.j]}] = min(D[${this.L[s.i]}][${this.L[s.j]}], D[${this.L[s.i]}][${this.L[s.k]}] + D[${this.L[s.k]}][${this.L[s.j]}])`
          : 'D[i][j] = min(D[i][j], D[i][k] + D[k][j])'),
      h('p', { class: 'muted', style: 'font-size:.78rem;margin:.4rem 0 0' }, `Përmirësime deri tani: ${s.updates} · Kompleksiteti O(V³)`),
    );
  }

  private drawGraph(s: FStep) {
    const W = 400, H = 340;
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' });
    const t = svgEl('title');
    t.textContent = `Grafi me ${this.L.length} kulme; kulmi ndërmjetës aktual: ${s.k >= 0 ? this.L[s.k] : 'asnjë'}.`;
    svg.append(t);

    const defs = svgEl('defs');
    for (const [id, c] of [['f', 'var(--viz-line)'], ['f-on', 'var(--viz-compare)'], ['f-path', 'var(--viz-path)']]) {
      const m = svgEl('marker', { id: `fw-${id}`, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' });
      m.append(svgEl('path', { d: 'M0,0 L10,5 L0,10 z', fill: c }));
      defs.append(m);
    }
    svg.append(defs);

    const src = Number(this.srcSel.value), dst = Number(this.dstSel.value);
    const path = s.phase === 'done' ? reconstruct(s.P, src, dst) : null;
    const onPath = new Set((path ?? []).slice(0, -1).map((v, idx) => `${v}>${path![idx + 1]}`));

    for (let i = 0; i < this.L.length; i++) {
      for (let j = 0; j < this.L.length; j++) {
        if (i === j || this.W[i][j] === INF) continue;
        const a = this.positions[i], b = this.positions[j];
        const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, r = 20;
        // curve slightly so both directions of a pair stay visible
        const ox = -dy / len * 9, oy = dx / len * 9;
        const x1 = a.x + (dx / len) * r + ox, y1 = a.y + (dy / len) * r + oy;
        const x2 = b.x - (dx / len) * r + ox, y2 = b.y - (dy / len) * r + oy;

        const isTerm = (i === s.i && j === s.k) || (i === s.k && j === s.j);
        const inPath = onPath.has(`${i}>${j}`);
        const stroke = inPath ? 'var(--viz-path)' : isTerm ? 'var(--viz-compare)' : 'var(--viz-line)';
        svg.append(svgEl('line', {
          x1, y1, x2, y2, stroke, 'stroke-width': inPath ? 3.4 : isTerm ? 3 : 1.6,
          'marker-end': `url(#fw-${inPath ? 'f-path' : isTerm ? 'f-on' : 'f'})`,
        }));

        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        const wt = svgEl('text', { x: mx, y: my + 3, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, fill: stroke, 'font-family': 'var(--font-mono)' });
        wt.textContent = String(this.W[i][j]);
        svg.append(svgEl('circle', { cx: mx, cy: my, r: 9, fill: 'var(--surface)', stroke, 'stroke-width': 1.2 }));
        svg.append(wt);
      }
    }

    for (let i = 0; i < this.L.length; i++) {
      const p = this.positions[i];
      const isK = i === s.k, isI = i === s.i, isJ = i === s.j;
      let fill = 'var(--surface)', stroke = 'var(--viz-line)', ink = 'var(--ink-2)', mark = '';
      if (isK) { fill = 'var(--viz-active)'; stroke = 'var(--viz-active)'; ink = '#fff'; mark = 'k'; }
      else if (isI) { stroke = 'var(--viz-compare)'; ink = 'var(--viz-compare)'; mark = 'i'; }
      else if (isJ) { stroke = 'var(--viz-compare)'; ink = 'var(--viz-compare)'; mark = 'j'; }

      svg.append(svgEl('circle', { cx: p.x, cy: p.y, r: 19, fill, stroke, 'stroke-width': isK || isI || isJ ? 3 : 2 }));
      const lt = svgEl('text', { x: p.x, y: p.y + 4, 'text-anchor': 'middle', 'font-size': this.L[i].length > 2 ? 9 : 13, 'font-weight': 700, fill: ink, 'font-family': 'var(--font-mono)' });
      lt.textContent = this.L[i];
      svg.append(lt);
      if (mark) {
        const mt = svgEl('text', { x: p.x + 20, y: p.y - 15, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: stroke, 'font-family': 'var(--font-mono)' });
        mt.textContent = mark;
        svg.append(mt);
      }
    }
    this.stage.replaceChildren(svg);
  }

  private drawPath(s: FStep) {
    const src = Number(this.srcSel.value), dst = Number(this.dstSel.value);
    const done = s.phase === 'done';
    const path = done ? reconstruct(s.P, src, dst) : null;
    const d = s.D[src][dst];

    this.pathPanel.replaceChildren(
      h('h4', {}, 'Rindërtimi i rrugës nga matrica P'),
      done
        ? h('div', {},
            h('p', { style: 'margin:0 0 .4rem' },
              h('strong', {}, `${this.L[src]} → ${this.L[dst]}: `),
              d === INF ? 'e paarritshme' : `distanca minimale = ${d}`),
            path && path.length > 1
              ? h('p', { class: 'mono', style: 'margin:0;font-size:.9rem;color:var(--viz-path)' }, path.map((v) => this.L[v]).join(' → '))
              : h('p', { class: 'muted', style: 'margin:0;font-size:.86rem' },
                  d === INF ? 'Nuk ekziston rrugë nga ky burim te ky destinacion.' : 'Burimi dhe destinacioni përputhen.'),
            h('p', { class: 'muted', style: 'font-size:.8rem;margin:.6rem 0 0' },
              'P[i][j] ruan paraardhësin e j në rrugën optimale nga i. Ndiqet pas→para deri te burimi.'))
        : h('p', { class: 'muted', style: 'margin:0;font-size:.88rem' },
            'Rruga rindërtohet pasi algoritmi të përfundojë. Ecni deri në fund ose shtypni "Kapërce te k-ja tjetër".'),
    );
  }
}

function lk(colour: string, mark: string, label: string) {
  return h('span', {}, h('span', { class: 'viz-key', style: `background:${colour};color:#fff` }, mark), label);
}

if (!customElements.get('viz-floyd')) customElements.define('viz-floyd', VizFloyd);
