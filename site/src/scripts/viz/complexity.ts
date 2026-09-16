/**
 * <viz-complexity> — Eksploruesi i Kompleksitetit
 *
 * Supports Laboratori 2 and 3. The classes, their names and the reference
 * values are exactly those tabulated in the notebooks; the tool only lets a
 * student move n and watch the numbers move with it.
 */
import { h, svgEl, clamp, fmt, Player, liveNote } from './common';

interface Klass {
  id: string;
  label: string;
  name: string;
  f: (n: number) => number;
  colour: string;
  example: string;
}

// Exactly the table from Laboratori 2 / 3, nothing added.
const CLASSES: Klass[] = [
  { id: 'c1',    label: 'O(1)',        name: 'Konstant',     f: () => 1,                          colour: 'var(--viz-done)',    example: 'Lexo elementin e parë të listës' },
  { id: 'clogn', label: 'O(log n)',    name: 'Logaritmik',   f: (n) => Math.log2(Math.max(n, 1)),  colour: 'var(--viz-compare)', example: 'Binary Search' },
  { id: 'cn',    label: 'O(n)',        name: 'Linear',       f: (n) => n,                          colour: '#6a8f3c',            example: 'Kërko elementin në listë' },
  { id: 'cnlogn',label: 'O(n log n)',  name: 'Linearitmik',  f: (n) => n * Math.log2(Math.max(n, 2)), colour: 'var(--viz-path)', example: 'Merge Sort, Quick Sort' },
  { id: 'cn2',   label: 'O(n²)',       name: 'Kuadratik',    f: (n) => n * n,                      colour: 'var(--viz-active)',  example: 'Insertion Sort, Selection Sort' },
  { id: 'c2n',   label: 'O(2ⁿ)',       name: 'Eksponencial', f: (n) => Math.pow(2, Math.min(n, 60)), colour: 'var(--viz-reject)', example: 'Problemet rekursive naive' },
];

const N_STOPS = [10, 100, 1000, 10000];

class VizComplexity extends HTMLElement {
  private n = 32;
  private selected = new Set(['cn', 'cnlogn', 'cn2']);
  private logScale = true;

  connectedCallback() {
    this.classList.add('viz');
    this.build();
  }

  private stage!: HTMLElement;
  private table!: HTMLElement;
  private note!: HTMLElement;
  private nOut!: HTMLElement;
  private crossOut!: HTMLElement;

  private build() {
    /* ---- class pickers ---- */
    const picker = h('div', { class: 'viz-btnset', role: 'group', 'aria-label': 'Klasat e kompleksitetit' });
    for (const k of CLASSES) {
      const on = this.selected.has(k.id);
      const b = h('button', {
        type: 'button', class: 'viz-btn cx-pick',
        'aria-pressed': String(on), 'data-id': k.id,
        title: k.example,
      });
      b.append(h('span', { class: 'cx-swatch', style: `background:${k.colour}` }), k.label);
      b.addEventListener('click', () => {
        if (this.selected.has(k.id)) {
          if (this.selected.size === 1) return; // keep at least one curve
          this.selected.delete(k.id);
        } else this.selected.add(k.id);
        b.setAttribute('aria-pressed', String(this.selected.has(k.id)));
        this.render();
      });
      picker.append(b);
    }

    /* ---- n slider ---- */
    const slider = h('input', {
      type: 'range', class: 'viz-range', min: '2', max: '256', value: String(this.n), step: '1',
      'aria-label': 'Madhësia e inputit n',
    }) as HTMLInputElement;
    this.nOut = h('output', { class: 'cx-n mono' }, String(this.n));
    slider.addEventListener('input', () => { this.n = Number(slider.value); this.render(); });

    const scaleBtn = h('button', { type: 'button', class: 'viz-btn', 'aria-pressed': 'true' }, 'Bosht logaritmik');
    scaleBtn.addEventListener('click', () => {
      this.logScale = !this.logScale;
      scaleBtn.setAttribute('aria-pressed', String(this.logScale));
      this.render();
    });

    const setup = h('div', { class: 'viz-setup cx-setup' },
      h('label', { class: 'viz-field cx-slider' },
        h('span', {}, 'Madhësia e inputit — n'),
        h('div', { class: 'cx-slider-row' }, slider, this.nOut),
      ),
      h('div', { class: 'viz-field' }, h('span', {}, 'Krahaso'), picker),
      h('div', { class: 'viz-field' }, h('span', {}, 'Boshti'), scaleBtn),
    );

    this.stage = h('div', { class: 'viz-stage' });
    this.table = h('div', { class: 'viz-panel viz-scroll' });
    this.crossOut = h('div', { class: 'viz-panel' });
    this.note = liveNote();

    this.append(
      setup,
      this.stage,
      this.note,
      h('div', { class: 'viz-panels cols-2' }, this.table, this.crossOut),
      h('div', { class: 'viz-legend' },
        h('span', {}, 'Boshti X: n (madhësia e inputit)'),
        h('span', {}, 'Boshti Y: numri i operacioneve'),
        h('span', {}, 'Vija vertikale: n-ja juaj aktuale'),
      ),
    );
    this.render();
  }

  private render() {
    const active = CLASSES.filter((k) => this.selected.has(k.id));
    this.nOut.textContent = String(this.n);
    this.drawChart(active);
    this.drawTable(active);
    this.drawCrossings(active);

    const worst = active.reduce((a, b) => (b.f(this.n) > a.f(this.n) ? b : a), active[0]);
    const best = active.reduce((a, b) => (b.f(this.n) < a.f(this.n) ? b : a), active[0]);
    if (active.length > 1 && worst !== best) {
      const ratio = worst.f(this.n) / Math.max(best.f(this.n), 1);
      this.note.innerHTML =
        `Për <strong>n = ${this.n}</strong>: <strong>${worst.label}</strong> bën ${fmt(Math.round(worst.f(this.n)))} operacione, ` +
        `ndërsa <strong>${best.label}</strong> bën ${fmt(Math.round(best.f(this.n)))} — rreth <strong>${fmt(Math.round(ratio))}×</strong> më pak.`;
    } else {
      this.note.innerHTML = `Për <strong>n = ${this.n}</strong>, <strong>${worst.label}</strong> bën ${fmt(Math.round(worst.f(this.n)))} operacione. Zgjidhni një klasë të dytë për ta krahasuar.`;
    }
  }

  /* ------------------------------------------------------------ chart */
  private drawChart(active: Klass[]) {
    const W = 760, H = 320, P = { l: 58, r: 16, t: 14, b: 34 };
    const iw = W - P.l - P.r, ih = H - P.t - P.b;
    const nMax = 256;

    const maxY = Math.max(...active.map((k) => k.f(nMax)), 10);
    const yScale = this.logScale
      ? (v: number) => ih - (Math.log10(Math.max(v, 1)) / Math.log10(maxY)) * ih
      : (v: number) => ih - (Math.min(v, maxY) / maxY) * ih;
    const xScale = (n: number) => (n / nMax) * iw;

    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' });
    svg.append(svgEl('title'));
    svg.querySelector('title')!.textContent =
      `Kurbat e rritjes për ${active.map((k) => k.label).join(', ')}, me n nga 0 deri 256.`;

    const g = svgEl('g', { transform: `translate(${P.l},${P.t})` });

    // grid + y labels
    const ticks = this.logScale
      ? [1, 10, 100, 1e3, 1e4, 1e5, 1e6].filter((v) => v <= maxY * 1.2)
      : [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxY);
    for (const v of ticks) {
      const y = yScale(v);
      if (y < -2 || y > ih + 2) continue;
      const line = svgEl('line', { x1: 0, x2: iw, y1: y, y2: y, stroke: 'var(--border)', 'stroke-width': 1 });
      const lab = svgEl('text', { x: -8, y: y + 4, 'text-anchor': 'end', fill: 'var(--ink-faint)', 'font-size': 10, 'font-family': 'var(--font-mono)' });
      lab.textContent = fmt(Math.round(v));
      g.append(line, lab);
    }
    for (const n of [0, 64, 128, 192, 256]) {
      const x = xScale(n);
      const lab = svgEl('text', { x, y: ih + 20, 'text-anchor': 'middle', fill: 'var(--ink-faint)', 'font-size': 10, 'font-family': 'var(--font-mono)' });
      lab.textContent = String(n);
      g.append(lab);
    }
    g.append(svgEl('line', { x1: 0, x2: iw, y1: ih, y2: ih, stroke: 'var(--border-strong)', 'stroke-width': 1.2 }));

    // current n marker
    const nx = xScale(this.n);
    g.append(svgEl('line', { x1: nx, x2: nx, y1: 0, y2: ih, stroke: 'var(--ink-faint)', 'stroke-width': 1.2, 'stroke-dasharray': '4 3' }));

    // curves
    for (const k of active) {
      let d = '';
      for (let n = 1; n <= nMax; n += 2) {
        const y = clamp(yScale(k.f(n)), -20, ih + 20);
        d += `${d ? 'L' : 'M'}${xScale(n).toFixed(1)},${y.toFixed(1)}`;
      }
      g.append(svgEl('path', { d, fill: 'none', stroke: k.colour, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }));

      const cy = clamp(yScale(k.f(this.n)), 0, ih);
      g.append(svgEl('circle', { cx: nx, cy, r: 4.5, fill: k.colour, stroke: 'var(--surface)', 'stroke-width': 2 }));

      // Label each curve at its own point, so colour is never the only cue.
      const t = svgEl('text', { x: nx + 9, y: cy - 7, fill: k.colour, 'font-size': 11, 'font-weight': 700, 'font-family': 'var(--font-mono)' });
      t.textContent = k.label;
      g.append(t);
    }

    svg.append(g);
    this.stage.replaceChildren(svg);
  }

  /* ------------------------------------------------------------ table */
  private drawTable(active: Klass[]) {
    const head = h('tr', {}, h('th', {}, 'Klasa'), h('th', {}, `n = ${this.n}`),
      ...N_STOPS.map((n) => h('th', {}, `n = ${fmt(n)}`)));
    const rows = active.map((k) =>
      h('tr', {},
        h('th', { scope: 'row' },
          h('span', { class: 'cx-swatch', style: `background:${k.colour}` }),
          `${k.label} · ${k.name}`),
        h('td', { class: 'is-now' }, fmt(Math.round(k.f(this.n)))),
        ...N_STOPS.map((n) => h('td', {}, k.id === 'c2n' && n > 64 ? 'jashtë shkalle' : fmt(Math.round(k.f(n))))),
      ),
    );
    this.table.replaceChildren(
      h('h4', {}, 'Numri i operacioneve'),
      h('table', {}, h('thead', {}, head), h('tbody', {}, ...rows)),
    );
  }

  /* -------------------------------------------------------- crossings */
  private drawCrossings(active: Klass[]) {
    const body: Node[] = [h('h4', {}, 'Pikat e kryqëzimit (n₀)')];

    const pairs: [Klass, Klass, number][] = [];
    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const a = active[i], b = active[j];
        // Smallest n at which the order of the two curves flips.
        let cross = -1;
        const start = Math.sign(a.f(2) - b.f(2));
        for (let n = 3; n <= 4096; n++) {
          if (Math.sign(a.f(n) - b.f(n)) !== start && start !== 0) { cross = n; break; }
        }
        if (cross > 0) pairs.push([a, b, cross]);
      }
    }

    if (!pairs.length) {
      body.push(h('p', { class: 'muted', style: 'font-size:.86rem;margin:0' },
        'Në këtë interval, asnjë nga kurbat e zgjedhura nuk e kalon tjetrën — renditja e tyre nuk ndryshon.'));
    } else {
      body.push(h('p', { class: 'muted', style: 'font-size:.84rem;margin:0 0 .5rem' },
        'Deri te n₀ kompleksiteti nuk ka rëndësi të madhe. Pas tij, po.'));
      const ul = h('ul', { class: 'cx-cross' });
      for (const [a, b, n0] of pairs) {
        const slower = a.f(n0 + 1) > b.f(n0 + 1) ? a : b;
        ul.append(h('li', {},
          h('code', {}, `n₀ ≈ ${n0}`),
          ` — pas kësaj `,
          h('strong', { style: `color:${slower.colour}` }, slower.label),
          ` bëhet më i shtrenjtë se `,
          h('strong', {}, slower === a ? b.label : a.label),
        ));
      }
      body.push(ul);
    }
    this.crossOut.replaceChildren(...body);
  }
}

if (!customElements.get('viz-complexity')) customElements.define('viz-complexity', VizComplexity);
