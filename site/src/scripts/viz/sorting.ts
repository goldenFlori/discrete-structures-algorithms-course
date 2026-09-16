/**
 * <viz-sorting> — Vizualizuesi i Renditjes
 *
 * Insertion, Selection and Merge Sort, stepped one comparison at a time.
 *
 * Counts COMPARISONS as the primary metric, matching Laboratori 3:
 * "Ky vizualizim mat krahasimet (a[j] > k?) — jo shkëmbimet, jo kohën."
 */
import { h, svgEl, Player, buildControls, bindKeys, liveNote, parseNumbers, fmt } from './common';

type Algo = 'insertion' | 'selection' | 'merge';

interface SortStep {
  note: string;
  arr: number[];
  /** indices being compared right now */
  compare?: number[];
  /** indices just swapped / written */
  write?: number[];
  /** prefix already in final position */
  sortedTo?: number;
  /** explicit set of finished indices (merge sort) */
  sortedSet?: number[];
  comparisons: number;
  writes: number;
  /** highlighted pseudocode line */
  line?: number;
}

const META: Record<Algo, { name: string; best: string; avg: string; worst: string; pseudo: string[]; idea: string }> = {
  insertion: {
    name: 'Insertion Sort',
    best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)',
    idea: 'Fut çdo element në pozicionin e duhur në pjesën e renditur — si të renditësh letra në dorë.',
    pseudo: [
      'për i = 1 deri n-1:',
      '    v = a[i];  j = i - 1',
      '    ndërsa j ≥ 0 dhe a[j] > v:',
      '        a[j+1] = a[j];  j = j - 1',
      '    a[j+1] = v',
    ],
  },
  selection: {
    name: 'Selection Sort',
    best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)',
    idea: 'Në çdo hap gjen elementin më të vogël dhe e vendos në pozicionin e duhur.',
    pseudo: [
      'për i = 0 deri n-2:',
      '    min = i',
      '    për j = i+1 deri n-1:',
      '        nëse a[j] < a[min]:  min = j',
      '    këmbe a[i] me a[min]',
    ],
  },
  merge: {
    name: 'Merge Sort',
    best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)',
    idea: 'Përça e Sundo: ndaj listën në dy gjysma, rendit secilën, pastaj bashko të dyja.',
    pseudo: [
      'MergeSort(a, l, r):',
      '    nëse l ≥ r: kthehu',
      '    m = (l + r) / 2',
      '    MergeSort(a, l, m);  MergeSort(a, m+1, r)',
      '    Merge(a, l, m, r)   ← bashkon dy gjysmat e renditura',
    ],
  },
};

/* ---------------------------------------------------------------- algos */

function insertionSteps(src: number[]): SortStep[] {
  const a = src.slice();
  const steps: SortStep[] = [];
  let c = 0, w = 0;
  steps.push({ note: 'Fillimi. Elementi i parë konsiderohet tashmë i renditur.', arr: a.slice(), sortedTo: 0, comparisons: c, writes: w, line: 0 });

  for (let i = 1; i < a.length; i++) {
    const v = a[i];
    let j = i - 1;
    steps.push({ note: `Marrim a[${i}] = ${v} dhe e fusim në pjesën e renditur majtas.`, arr: a.slice(), compare: [i], sortedTo: i - 1, comparisons: c, writes: w, line: 1 });
    while (j >= 0) {
      c++;
      const bigger = a[j] > v;
      steps.push({
        note: `Krahasim: a[${j}] = ${a[j]} ${bigger ? '>' : '≤'} ${v}. ${bigger ? 'Zhvendosim djathtas.' : 'Vendi u gjet.'}`,
        arr: a.slice(), compare: [j], sortedTo: i - 1, comparisons: c, writes: w, line: 2,
      });
      if (!bigger) break;
      a[j + 1] = a[j];
      w++;
      steps.push({ note: `a[${j}] zhvendoset në pozicionin ${j + 1}.`, arr: a.slice(), write: [j + 1], sortedTo: i - 1, comparisons: c, writes: w, line: 3 });
      j--;
    }
    a[j + 1] = v;
    w++;
    steps.push({ note: `${v} vendoset në pozicionin ${j + 1}. Prefiksi 0…${i} është i renditur.`, arr: a.slice(), write: [j + 1], sortedTo: i, comparisons: c, writes: w, line: 4 });
  }
  steps.push({ note: `Përfundoi. ${c} krahasime, ${w} shkrime.`, arr: a.slice(), sortedTo: a.length - 1, comparisons: c, writes: w });
  return steps;
}

function selectionSteps(src: number[]): SortStep[] {
  const a = src.slice();
  const steps: SortStep[] = [];
  let c = 0, w = 0;
  steps.push({ note: 'Fillimi. Asnjë element nuk është ende në pozicionin final.', arr: a.slice(), sortedTo: -1, comparisons: c, writes: w, line: 0 });

  for (let i = 0; i < a.length - 1; i++) {
    let min = i;
    steps.push({ note: `Kandidati fillestar për minimum: a[${i}] = ${a[i]}.`, arr: a.slice(), compare: [i], sortedTo: i - 1, comparisons: c, writes: w, line: 1 });
    for (let j = i + 1; j < a.length; j++) {
      c++;
      const smaller = a[j] < a[min];
      if (smaller) min = j;
      steps.push({
        note: `Krahasim: a[${j}] = ${a[j]} ${smaller ? '<' : '≥'} a[${min}] = ${a[min]}. ${smaller ? 'Minimumi i ri.' : 'Minimumi nuk ndryshon.'}`,
        arr: a.slice(), compare: [j, min], sortedTo: i - 1, comparisons: c, writes: w, line: 3,
      });
    }
    if (min !== i) { [a[i], a[min]] = [a[min], a[i]]; w += 2; }
    steps.push({
      note: min !== i ? `Këmbejmë a[${i}] me a[${min}]. Pozicioni ${i} është final.` : `a[${i}] ishte tashmë minimumi. Pozicioni ${i} është final.`,
      arr: a.slice(), write: min !== i ? [i, min] : [i], sortedTo: i, comparisons: c, writes: w, line: 4,
    });
  }
  steps.push({ note: `Përfundoi. ${c} krahasime — gjithmonë saktësisht n(n−1)/2 = ${(a.length * (a.length - 1)) / 2}.`, arr: a.slice(), sortedTo: a.length - 1, comparisons: c, writes: w });
  return steps;
}

function mergeSteps(src: number[]): SortStep[] {
  const a = src.slice();
  const steps: SortStep[] = [];
  let c = 0, w = 0;

  steps.push({ note: 'Fillimi. Merge Sort ndan listën përgjysmë në mënyrë rekursive.', arr: a.slice(), sortedSet: [], comparisons: c, writes: w, line: 0 });

  const sort = (l: number, r: number, depth: number) => {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    steps.push({ note: `Ndajmë [${l}…${r}] në [${l}…${m}] dhe [${m + 1}…${r}].`, arr: a.slice(), compare: range(l, r), sortedSet: [], comparisons: c, writes: w, line: 2 });
    sort(l, m, depth + 1);
    sort(m + 1, r, depth + 1);

    const left = a.slice(l, m + 1), right = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    steps.push({ note: `Bashkojmë [${l}…${m}] me [${m + 1}…${r}].`, arr: a.slice(), compare: range(l, r), sortedSet: [], comparisons: c, writes: w, line: 4 });

    while (i < left.length && j < right.length) {
      c++;
      const takeLeft = left[i] <= right[j];
      steps.push({
        note: `Krahasim: ${left[i]} ${takeLeft ? '≤' : '>'} ${right[j]} → marrim ${takeLeft ? left[i] : right[j]}.`,
        arr: a.slice(), compare: [k], sortedSet: [], comparisons: c, writes: w, line: 4,
      });
      a[k++] = takeLeft ? left[i++] : right[j++];
      w++;
      steps.push({ note: `Shkruajmë ${a[k - 1]} në pozicionin ${k - 1}.`, arr: a.slice(), write: [k - 1], sortedSet: range(l, k - 1), comparisons: c, writes: w, line: 4 });
    }
    while (i < left.length) { a[k++] = left[i++]; w++; }
    while (j < right.length) { a[k++] = right[j++]; w++; }
    steps.push({ note: `Segmenti [${l}…${r}] është i renditur.`, arr: a.slice(), sortedSet: range(l, r), comparisons: c, writes: w, line: 4 });
  };

  sort(0, a.length - 1, 0);
  steps.push({ note: `Përfundoi. ${c} krahasime ≈ n·log₂n = ${Math.round(a.length * Math.log2(Math.max(a.length, 2)))}.`, arr: a.slice(), sortedSet: range(0, a.length - 1), comparisons: c, writes: w });
  return steps;
}

const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);

const RUN: Record<Algo, (a: number[]) => SortStep[]> = {
  insertion: insertionSteps, selection: selectionSteps, merge: mergeSteps,
};

/* -------------------------------------------------------------- element */

class VizSorting extends HTMLElement {
  private algo: Algo = 'insertion';
  private values: number[] = [8, 3, 1, 7, 4, 9, 2, 6];
  private player = new Player();
  private stage!: HTMLElement;
  private note!: HTMLElement;
  private stats!: HTMLElement;
  private pseudo!: HTMLElement;
  private meta!: HTMLElement;
  private sync!: (i: number) => void;
  private input!: HTMLInputElement;

  connectedCallback() {
    this.classList.add('viz');
    this.build();
    this.run();
  }

  private build() {
    this.input = h('input', {
      type: 'text', class: 'viz-input', value: this.values.join(', '),
      size: '22', 'aria-label': 'Lista e numrave',
    }) as HTMLInputElement;
    const err = h('span', { class: 'viz-err', role: 'alert' });

    const apply = () => {
      const { values, error } = parseNumbers(this.input.value, 16);
      err.textContent = error ?? '';
      this.input.setAttribute('aria-invalid', String(Boolean(error) && !values.length));
      if (values.length) { this.values = values; this.run(); }
    };
    this.input.addEventListener('change', apply);

    const useBtn = h('button', { type: 'button', class: 'viz-btn viz-btn-primary' }, 'Rendit');
    useBtn.addEventListener('click', apply);

    const presets = h('div', { class: 'viz-btnset' });
    for (const [label, gen] of [
      ['Rastësore', () => shuffle(seq(8))],
      ['E renditur', () => seq(8)],
      ['E anasjelltë', () => seq(8).reverse()],
    ] as [string, () => number[]][]) {
      const b = h('button', { type: 'button', class: 'viz-btn' }, label);
      b.addEventListener('click', () => {
        this.values = gen();
        this.input.value = this.values.join(', ');
        err.textContent = '';
        this.run();
      });
      presets.append(b);
    }

    const algoSel = h('div', { class: 'viz-btnset', role: 'group', 'aria-label': 'Algoritmi' });
    for (const a of ['insertion', 'selection', 'merge'] as Algo[]) {
      const b = h('button', { type: 'button', class: 'viz-btn', 'aria-pressed': String(a === this.algo) }, META[a].name);
      b.addEventListener('click', () => {
        this.algo = a;
        for (const other of algoSel.querySelectorAll('button')) other.setAttribute('aria-pressed', 'false');
        b.setAttribute('aria-pressed', 'true');
        this.run();
      });
      algoSel.append(b);
    }

    const setup = h('div', { class: 'viz-setup' },
      h('label', { class: 'viz-field' }, h('span', {}, 'Lista'), h('div', { class: 'viz-row' }, this.input, useBtn), err),
      h('div', { class: 'viz-field' }, h('span', {}, 'Shembuj'), presets),
      h('div', { class: 'viz-field' }, h('span', {}, 'Algoritmi'), algoSel),
    );

    this.stage = h('div', { class: 'viz-stage' });
    this.note = liveNote();
    this.stats = h('div', { class: 'viz-panel' });
    this.pseudo = h('div', { class: 'viz-panel' });
    this.meta = h('div', { class: 'viz-panel' });

    const { bar, sync } = buildControls(this.player);
    this.sync = sync;
    this.player.onChange = (i) => this.paint(i);

    this.append(
      setup, this.stage, bar, this.note,
      h('div', { class: 'viz-panels cols-3' }, this.stats, this.pseudo, this.meta),
      h('div', { class: 'viz-legend' },
        legendKey('var(--viz-compare)', 'K', 'Po krahasohet'),
        legendKey('var(--viz-active)', 'S', 'Sapo u shkrua / këmbye'),
        legendKey('var(--viz-done)', '✓', 'Në pozicion final'),
        legendKey('var(--viz-idle)', '', 'Ende i papërpunuar'),
      ),
    );
    bindKeys(this, this.player);
  }

  private run() {
    this.player.load(RUN[this.algo](this.values));
    this.paint(0);
  }

  private paint(i: number) {
    const s = this.player.steps[i];
    if (!s) return;
    this.sync(i);
    this.note.innerHTML = s.note;
    this.drawBars(s);
    this.drawStats(s);
    this.drawPseudo(s);
    this.drawMeta();
  }

  private drawBars(s: SortStep) {
    const n = s.arr.length;
    const maxV = Math.max(...s.arr.map(Math.abs), 1);
    const W = 720, H = 230, pad = 6;
    const bw = (W - pad * (n + 1)) / n;

    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' });
    const title = svgEl('title');
    title.textContent = `Gjendja e listës: ${s.arr.join(', ')}`;
    svg.append(title);

    const sortedSet = new Set(s.sortedSet ?? (s.sortedTo !== undefined ? range(0, s.sortedTo) : []));
    const compare = new Set(s.compare ?? []);
    const write = new Set(s.write ?? []);

    for (let k = 0; k < n; k++) {
      const v = s.arr[k];
      const bh = Math.max(8, (Math.abs(v) / maxV) * (H - 58));
      const x = pad + k * (bw + pad);
      const y = H - 30 - bh;

      let fill = 'var(--viz-idle)', ink = 'var(--ink-2)', mark = '';
      if (write.has(k)) { fill = 'var(--viz-active)'; ink = '#fff'; mark = 'S'; }
      else if (compare.has(k)) { fill = 'var(--viz-compare)'; ink = '#fff'; mark = 'K'; }
      else if (sortedSet.has(k)) { fill = 'var(--viz-done)'; ink = '#fff'; mark = '✓'; }

      svg.append(svgEl('rect', { x, y, width: bw, height: bh, rx: 4, fill, stroke: 'var(--border-strong)', 'stroke-width': mark ? 0 : 1 }));

      const vt = svgEl('text', { x: x + bw / 2, y: y + Math.min(bh - 8, 20), 'text-anchor': 'middle', fill: bh > 26 ? ink : 'var(--ink-2)', 'font-size': 13, 'font-weight': 650, 'font-family': 'var(--font-mono)' });
      vt.textContent = String(v);
      if (bh <= 26) { vt.setAttribute('y', String(y - 6)); }
      svg.append(vt);

      // index + state marker: never colour alone
      const it = svgEl('text', { x: x + bw / 2, y: H - 14, 'text-anchor': 'middle', fill: 'var(--ink-faint)', 'font-size': 10, 'font-family': 'var(--font-mono)' });
      it.textContent = String(k);
      svg.append(it);

      if (mark) {
        const mt = svgEl('text', { x: x + bw / 2, y: H - 2, 'text-anchor': 'middle', fill: fill, 'font-size': 10, 'font-weight': 700, 'font-family': 'var(--font-mono)' });
        mt.textContent = mark;
        svg.append(mt);
      }
    }
    this.stage.replaceChildren(svg);
  }

  private drawStats(s: SortStep) {
    const m = META[this.algo];
    const theoretical =
      this.algo === 'selection' ? (this.values.length * (this.values.length - 1)) / 2
      : this.algo === 'merge' ? Math.round(this.values.length * Math.log2(Math.max(this.values.length, 2)))
      : null;

    this.stats.replaceChildren(
      h('h4', {}, 'Numëruesit'),
      h('dl', { class: 'viz-stats' },
        h('div', { class: 'viz-stat' }, h('dt', {}, 'Krahasime'), h('dd', {}, String(s.comparisons))),
        h('div', { class: 'viz-stat' }, h('dt', {}, 'Shkrime'), h('dd', {}, String(s.writes))),
        h('div', { class: 'viz-stat' }, h('dt', {}, 'n'), h('dd', {}, String(this.values.length))),
      ),
      theoretical !== null
        ? h('p', { class: 'muted', style: 'font-size:.8rem;margin:.6rem 0 0' },
            `Vlera teorike për këtë n: ≈ ${theoretical} krahasime.`)
        : h('p', { class: 'muted', style: 'font-size:.8rem;margin:.6rem 0 0' },
            'Insertion Sort varet nga rendi fillestar: provoni "E renditur" dhe "E anasjelltë".'),
    );
  }

  private drawPseudo(s: SortStep) {
    const lines = META[this.algo].pseudo.map((l, idx) =>
      h('div', { class: idx === s.line ? 'is-on' : '' }, l));
    this.pseudo.replaceChildren(h('h4', {}, 'Pseudokodi'), h('div', { class: 'viz-pseudo' }, ...lines));
  }

  private drawMeta() {
    const m = META[this.algo];
    this.meta.replaceChildren(
      h('h4', {}, m.name),
      h('p', { style: 'font-size:.85rem;margin:0 0 .6rem;color:var(--ink-2)' }, m.idea),
      h('table', {},
        h('tbody', {},
          h('tr', {}, h('th', { scope: 'row' }, 'Best'), h('td', {}, m.best)),
          h('tr', {}, h('th', { scope: 'row' }, 'Average'), h('td', {}, m.avg)),
          h('tr', {}, h('th', { scope: 'row' }, 'Worst'), h('td', {}, m.worst)),
        ),
      ),
    );
  }
}

const seq = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
const shuffle = (a: number[]) => {
  const c = a.slice();
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
};

function legendKey(colour: string, mark: string, label: string) {
  return h('span', {},
    h('span', { class: 'viz-key', style: `background:${colour};color:${colour === 'var(--viz-idle)' ? 'var(--border-strong)' : '#fff'}` }, mark),
    label);
}

if (!customElements.get('viz-sorting')) customElements.define('viz-sorting', VizSorting);
