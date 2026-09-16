/**
 * <viz-graph> — Fusha e Lojës së Grafeve
 *
 * Covers Laboratori 4 (build a graph, read its adjacency list and matrix,
 * order and size, degrees) and Laboratori 5–6 (BFS, DFS, Kruskal, Prim),
 * replacing the Pygame/Tkinter exercises those laboratories rely on.
 */
import { h, svgEl, Player, buildControls, bindKeys, liveNote, infLabel } from './common';

interface Node { id: string; x: number; y: number }
interface Edge { u: string; v: string; w: number }

type Mode = 'build' | 'edge' | 'delete' | 'move';
type Algo = 'bfs' | 'dfs' | 'kruskal' | 'prim';

interface GStep {
  note: string;
  current?: string | null;
  visited: string[];
  frontier: string[];      // queue (BFS) or stack (DFS)
  treeEdges: string[];     // "u|v" accepted edges
  rejected?: string[];
  considering?: string | null;
  order: string[];
  line?: number;
  weight?: number;
}

const ekey = (u: string, v: string) => (u < v ? `${u}|${v}` : `${v}|${u}`);

/* ------------------------------------------------------------- presets */

const PRESETS: Record<string, { nodes: Node[]; edges: Edge[]; directed: boolean; weighted: boolean; note: string }> = {
  // Punë në Klasë, Problemi 1 of Laboratori 5 — the exact graph from the notebook.
  klase1: {
    note: 'Grafi i Problemit 1 të Punës në Klasë (Laboratori 5).',
    directed: false, weighted: false,
    nodes: [
      { id: '0', x: 300, y: 40 }, { id: '1', x: 170, y: 130 }, { id: '2', x: 430, y: 130 },
      { id: '3', x: 250, y: 235 }, { id: '4', x: 470, y: 240 }, { id: '5', x: 340, y: 330 },
    ],
    edges: [
      { u: '0', v: '1', w: 1 }, { u: '0', v: '2', w: 1 }, { u: '1', v: '3', w: 1 },
      { u: '2', v: '3', w: 1 }, { u: '2', v: '4', w: 1 }, { u: '3', v: '5', w: 1 }, { u: '4', v: '5', w: 1 },
    ],
  },
  // Punë në Klasë, Problemi 2 of Laboratori 5 — the weighted MST graph.
  klase2: {
    note: 'Grafi me peshë i Problemit 2 (Kruskal) — Laboratori 5.',
    directed: false, weighted: true,
    nodes: [
      { id: 'A', x: 300, y: 45 }, { id: 'B', x: 140, y: 165 }, { id: 'C', x: 420, y: 160 },
      { id: 'D', x: 200, y: 320 }, { id: 'E', x: 450, y: 310 },
    ],
    edges: [
      { u: 'A', v: 'B', w: 6 }, { u: 'A', v: 'C', w: 1 }, { u: 'B', v: 'C', w: 5 },
      { u: 'B', v: 'D', w: 3 }, { u: 'C', v: 'D', w: 4 }, { u: 'C', v: 'E', w: 2 }, { u: 'D', v: 'E', w: 8 },
    ],
  },
  k4: {
    note: 'Grafi i plotë K₄ — 4 kulme, çdo çift i lidhur (Laboratori 4).',
    directed: false, weighted: false,
    nodes: [{ id: 'A', x: 220, y: 70 }, { id: 'B', x: 430, y: 70 }, { id: 'C', x: 430, y: 280 }, { id: 'D', x: 220, y: 280 }],
    edges: [
      { u: 'A', v: 'B', w: 1 }, { u: 'A', v: 'C', w: 1 }, { u: 'A', v: 'D', w: 1 },
      { u: 'B', v: 'C', w: 1 }, { u: 'B', v: 'D', w: 1 }, { u: 'C', v: 'D', w: 1 },
    ],
  },
  bosh: { note: 'Graf bosh — klikoni te fusha për të shtuar kulme.', directed: false, weighted: false, nodes: [], edges: [] },
};

/* --------------------------------------------------------------- algos */

function bfsSteps(nodes: Node[], adj: Map<string, string[]>, start: string): GStep[] {
  const steps: GStep[] = [];
  const visited: string[] = [start];
  const queue: string[] = [start];
  const order: string[] = [];
  const tree: string[] = [];
  steps.push({ note: `Nisim BFS nga kulmi ${start}. E shënojmë si të vizituar dhe e fusim në radhë.`, visited: [...visited], frontier: [...queue], treeEdges: [], order: [], current: start, line: 0 });

  while (queue.length) {
    const v = queue.shift()!;
    order.push(v);
    steps.push({ note: `Nxjerrim ${v} nga fillimi i radhës (FIFO) dhe e përpunojmë.`, visited: [...visited], frontier: [...queue], treeEdges: [...tree], order: [...order], current: v, line: 1 });
    for (const w of adj.get(v) ?? []) {
      if (visited.includes(w)) {
        steps.push({ note: `${w} është tashmë i vizituar — e kapërcejmë.`, visited: [...visited], frontier: [...queue], treeEdges: [...tree], order: [...order], current: v, considering: ekey(v, w), line: 2 });
        continue;
      }
      visited.push(w);
      queue.push(w);
      tree.push(ekey(v, w));
      steps.push({ note: `${w} është i pavizituar: e shënojmë dhe e shtojmë në fund të radhës. Brinja (${v},${w}) hyn në pemën BFS.`, visited: [...visited], frontier: [...queue], treeEdges: [...tree], order: [...order], current: v, considering: ekey(v, w), line: 2 });
    }
  }
  steps.push({ note: `Radha u zbraz. Rendi i zbulimit: ${order.join(' → ')}. BFS gjen gjithmonë rrugën me numrin më të vogël të brinjëve.`, visited: [...visited], frontier: [], treeEdges: [...tree], order: [...order], current: null });
  return steps;
}

function dfsSteps(nodes: Node[], adj: Map<string, string[]>, start: string): GStep[] {
  const steps: GStep[] = [];
  const visited: string[] = [];
  const stack: string[] = [start];
  const order: string[] = [];
  const tree: string[] = [];
  const parent = new Map<string, string>();
  steps.push({ note: `Nisim DFS nga ${start}. E vendosim në stivë (LIFO).`, visited: [], frontier: [...stack], treeEdges: [], order: [], current: start, line: 0 });

  while (stack.length) {
    const v = stack.pop()!;
    if (visited.includes(v)) continue;
    visited.push(v);
    order.push(v);
    const p = parent.get(v);
    if (p) tree.push(ekey(p, v));
    steps.push({ note: `Nxjerrim ${v} nga maja e stivës dhe e shënojmë si të vizituar.`, visited: [...visited], frontier: [...stack], treeEdges: [...tree], order: [...order], current: v, line: 1 });

    const neigh = (adj.get(v) ?? []).slice().reverse();
    for (const w of neigh) {
      if (visited.includes(w)) continue;
      if (!parent.has(w)) parent.set(w, v);
      stack.push(w);
    }
    steps.push({ note: `Shtojmë në stivë fqinjët e pavizituar të ${v}. Stiva: [${stack.join(', ')}].`, visited: [...visited], frontier: [...stack], treeEdges: [...tree], order: [...order], current: v, line: 2 });
  }
  steps.push({ note: `Stiva u zbraz. Rendi i zbulimit: ${order.join(' → ')}. DFS nuk e garanton rrugën më të shkurtër.`, visited: [...visited], frontier: [], treeEdges: [...tree], order: [...order], current: null });
  return steps;
}

function kruskalSteps(nodes: Node[], edges: Edge[]): GStep[] {
  const steps: GStep[] = [];
  const sorted = edges.slice().sort((a, b) => a.w - b.w);
  const parent = new Map(nodes.map((n) => [n.id, n.id]));
  const find = (x: string): string => (parent.get(x) === x ? x : (parent.set(x, find(parent.get(x)!)), parent.get(x)!));
  const tree: string[] = [];
  const rejected: string[] = [];
  let total = 0;

  steps.push({
    note: `Renditim të gjitha brinjët sipas peshës: ${sorted.map((e) => `${e.u}–${e.v}(${e.w})`).join(', ')}.`,
    visited: [], frontier: [], treeEdges: [], order: [], weight: 0, line: 0,
  });

  for (const e of sorted) {
    const ru = find(e.u), rv = find(e.v);
    const accept = ru !== rv;
    steps.push({
      note: `Shqyrtojmë brinjën ${e.u}–${e.v} me peshë ${e.w}. find(${e.u}) = ${ru}, find(${e.v}) = ${rv}.`,
      visited: [], frontier: [], treeEdges: [...tree], rejected: [...rejected], considering: ekey(e.u, e.v), order: [], weight: total, line: 1,
    });
    if (accept) {
      parent.set(ru, rv);
      tree.push(ekey(e.u, e.v));
      total += e.w;
      steps.push({
        note: `find(${e.u}) ≠ find(${e.v}) → PRANOHET. MST ka tani ${tree.length} brinjë, peshë totale ${total}.`,
        visited: [], frontier: [], treeEdges: [...tree], rejected: [...rejected], order: [], weight: total, line: 2,
      });
      if (tree.length === nodes.length - 1) break;
    } else {
      rejected.push(ekey(e.u, e.v));
      steps.push({
        note: `find(${e.u}) = find(${e.v}) → REFUZOHET, do të formonte cikël.`,
        visited: [], frontier: [], treeEdges: [...tree], rejected: [...rejected], order: [], weight: total, line: 3,
      });
    }
  }
  steps.push({
    note: `Përfundoi. MST ka ${tree.length} brinjë (pritet |V|−1 = ${nodes.length - 1}) me peshë totale w(T*) = ${total}.`,
    visited: [], frontier: [], treeEdges: [...tree], rejected: [...rejected], order: [], weight: total,
  });
  return steps;
}

function primSteps(nodes: Node[], edges: Edge[], start: string): GStep[] {
  const steps: GStep[] = [];
  const inTree = new Set([start]);
  const tree: string[] = [];
  let total = 0;
  steps.push({ note: `Nisim Primin nga kulmi ${start}. MST përmban vetëm ${start}.`, visited: [start], frontier: [], treeEdges: [], order: [], weight: 0, line: 0 });

  while (inTree.size < nodes.length) {
    const candidates = edges.filter((e) => inTree.has(e.u) !== inTree.has(e.v));
    if (!candidates.length) {
      steps.push({ note: 'Nuk ka më brinjë që e zgjerojnë pemën — grafi nuk është i lidhur. Primi kërkon graf të lidhur.', visited: [...inTree], frontier: [], treeEdges: [...tree], order: [], weight: total });
      break;
    }
    const best = candidates.reduce((a, b) => (b.w < a.w ? b : a));
    steps.push({
      note: `Brinjët që dalin nga pema: ${candidates.map((e) => `${e.u}–${e.v}(${e.w})`).join(', ')}. Minimumi është ${best.u}–${best.v}(${best.w}).`,
      visited: [...inTree], frontier: [], treeEdges: [...tree], considering: ekey(best.u, best.v), order: [], weight: total, line: 1,
    });
    const added = inTree.has(best.u) ? best.v : best.u;
    inTree.add(added);
    tree.push(ekey(best.u, best.v));
    total += best.w;
    steps.push({
      note: `Shtojmë kulmin ${added} dhe brinjën ${best.u}–${best.v}. Peshë totale: ${total}.`,
      visited: [...inTree], frontier: [], treeEdges: [...tree], order: [], weight: total, line: 2,
    });
  }
  steps.push({ note: `Përfundoi. Pesha totale w(T*) = ${total} — e njëjtë me Kruskalin mbi të njëjtin graf.`, visited: [...inTree], frontier: [], treeEdges: [...tree], order: [], weight: total });
  return steps;
}

const PSEUDO: Record<Algo, string[]> = {
  bfs: ['fut s në radhë; shëno s', 'ndërsa radha jo bosh: v = nxirr nga fillimi', '    për çdo fqinj w i pavizituar: shëno dhe shto në radhë'],
  dfs: ['shty s në stivë', 'ndërsa stiva jo bosh: v = nxirr nga maja', '    shty fqinjët e pavizituar të v'],
  kruskal: ['rendit brinjët sipas peshës rritëse', 'për çdo brinjë (u,v): kontrollo find(u), find(v)', '    nëse ndryshojnë → prano, union(u,v)', '    ndryshe → refuzo (cikël)'],
  prim: ['fillo nga një kulm çfarëdo', 'gjej brinjën minimale që del nga pema', '    shto kulmin dhe brinjën; përsërit'],
};

/* ------------------------------------------------------------- element */

class VizGraph extends HTMLElement {
  private nodes: Node[] = [];
  private edges: Edge[] = [];
  private directed = false;
  private weighted = false;
  private mode: Mode = 'move';
  private algo: Algo = 'bfs';
  private start = '';
  private pendingEdge: string | null = null;
  private player = new Player();

  private stage!: HTMLElement;
  private note!: HTMLElement;
  private panelState!: HTMLElement;
  private panelAdj!: HTMLElement;
  private panelMatrix!: HTMLElement;
  private startSel!: HTMLSelectElement;
  private sync!: (i: number) => void;
  private hint!: HTMLElement;

  connectedCallback() {
    this.classList.add('viz');
    this.build();
    this.loadPreset('klase1');
  }

  /* ------------------------------------------------------------- UI */
  private build() {
    const presetSel = h('select', { class: 'viz-select', 'aria-label': 'Grafi fillestar' }) as HTMLSelectElement;
    for (const [k, label] of [
      ['klase1', 'Punë në Klasë — BFS/DFS'],
      ['klase2', 'Punë në Klasë — Kruskal (me peshë)'],
      ['k4', 'Grafi i plotë K₄'],
      ['bosh', 'Graf bosh — ndërtoje vetë'],
    ]) presetSel.append(h('option', { value: k }, label));
    presetSel.addEventListener('change', () => this.loadPreset(presetSel.value));

    const modeSet = h('div', { class: 'viz-btnset', role: 'group', 'aria-label': 'Mënyra e redaktimit' });
    for (const [m, label, title] of [
      ['move', 'Zhvendos', 'Tërhiq kulmet për t\'i rregulluar'],
      ['build', 'Shto kulm', 'Klikoni në hapësirë boshe'],
      ['edge', 'Shto brinjë', 'Klikoni kulmin burim, pastaj destinacionin'],
      ['delete', 'Fshi', 'Klikoni një kulm ose brinjë'],
    ] as [Mode, string, string][]) {
      const b = h('button', { type: 'button', class: 'viz-btn', 'aria-pressed': String(m === this.mode), title }, label);
      b.addEventListener('click', () => {
        this.mode = m;
        this.pendingEdge = null;
        for (const o of modeSet.querySelectorAll('button')) o.setAttribute('aria-pressed', 'false');
        b.setAttribute('aria-pressed', 'true');
        this.draw();
      });
      modeSet.append(b);
    }

    const algoSet = h('div', { class: 'viz-btnset', role: 'group', 'aria-label': 'Algoritmi' });
    for (const [a, label] of [['bfs', 'BFS'], ['dfs', 'DFS'], ['kruskal', 'Kruskal'], ['prim', 'Prim']] as [Algo, string][]) {
      const b = h('button', { type: 'button', class: 'viz-btn', 'aria-pressed': String(a === this.algo) }, label);
      b.addEventListener('click', () => {
        this.algo = a;
        for (const o of algoSet.querySelectorAll('button')) o.setAttribute('aria-pressed', 'false');
        b.setAttribute('aria-pressed', 'true');
        this.run();
      });
      algoSet.append(b);
    }

    this.startSel = h('select', { class: 'viz-select', 'aria-label': 'Kulmi fillestar' }) as HTMLSelectElement;
    this.startSel.addEventListener('change', () => { this.start = this.startSel.value; this.run(); });

    const dirBtn = h('button', { type: 'button', class: 'viz-btn', 'aria-pressed': 'false' }, 'I drejtuar');
    dirBtn.addEventListener('click', () => {
      this.directed = !this.directed;
      dirBtn.setAttribute('aria-pressed', String(this.directed));
      this.run();
    });
    const wBtn = h('button', { type: 'button', class: 'viz-btn', 'aria-pressed': 'false' }, 'Me peshë');
    wBtn.addEventListener('click', () => {
      this.weighted = !this.weighted;
      wBtn.setAttribute('aria-pressed', String(this.weighted));
      this.run();
    });
    this.dirBtn = dirBtn; this.wBtn = wBtn;

    const runBtn = h('button', { type: 'button', class: 'viz-btn viz-btn-primary' }, 'Ekzekuto');
    runBtn.addEventListener('click', () => this.run());

    const setup = h('div', { class: 'viz-setup' },
      h('label', { class: 'viz-field' }, h('span', {}, 'Grafi'), presetSel),
      h('div', { class: 'viz-field' }, h('span', {}, 'Redakto'), modeSet),
      h('div', { class: 'viz-field' }, h('span', {}, 'Lloji'), h('div', { class: 'viz-btnset' }, dirBtn, wBtn)),
      h('div', { class: 'viz-field' }, h('span', {}, 'Algoritmi'), algoSet),
      h('label', { class: 'viz-field' }, h('span', {}, 'Nisja'), this.startSel),
      h('div', { class: 'viz-field' }, h('span', { class: 'visually-hidden' }, 'Nis'), runBtn),
    );

    this.stage = h('div', { class: 'viz-stage viz-graph-stage' });
    this.note = liveNote();
    this.panelState = h('div', { class: 'viz-panel' });
    this.panelAdj = h('div', { class: 'viz-panel viz-scroll' });
    this.panelMatrix = h('div', { class: 'viz-panel viz-scroll' });
    this.hint = h('p', { class: 'viz-mobile-hint is-shown' },
      'Ndërtimi i grafit me prekje është i kufizuar në ekrane të vogla. Për të ndërtuar grafe, përdorni një ekran më të madh — ekzekutimi i algoritmeve funksionon kudo.');

    const { bar, sync } = buildControls(this.player);
    this.sync = sync;
    this.player.onChange = (i) => this.paint(i);

    this.append(
      setup, this.stage, this.hint, bar, this.note,
      h('div', { class: 'viz-panels cols-3' }, this.panelState, this.panelAdj, this.panelMatrix),
      h('div', { class: 'viz-legend' },
        lk('var(--viz-active)', '▶', 'Kulmi aktual'),
        lk('var(--viz-done)', '✓', 'I vizituar / në pemë'),
        lk('var(--viz-compare)', '▸', 'Në radhë / stivë'),
        lk('var(--viz-path)', '━', 'Brinjë e pranuar'),
        lk('var(--viz-reject)', '✕', 'Brinjë e refuzuar (cikël)'),
      ),
    );
    bindKeys(this, this.player);
  }

  private dirBtn!: HTMLElement;
  private wBtn!: HTMLElement;

  private loadPreset(key: string) {
    const p = PRESETS[key] ?? PRESETS.bosh;
    this.nodes = p.nodes.map((n) => ({ ...n }));
    this.edges = p.edges.map((e) => ({ ...e }));
    this.directed = p.directed;
    this.weighted = p.weighted;
    this.dirBtn.setAttribute('aria-pressed', String(this.directed));
    this.wBtn.setAttribute('aria-pressed', String(this.weighted));
    this.start = this.nodes[0]?.id ?? '';
    this.run();
  }

  /* ---------------------------------------------------------- model */
  private adjacency(): Map<string, string[]> {
    const m = new Map<string, string[]>(this.nodes.map((n) => [n.id, []]));
    for (const e of this.edges) {
      m.get(e.u)?.push(e.v);
      if (!this.directed) m.get(e.v)?.push(e.u);
    }
    for (const [, list] of m) list.sort();
    return m;
  }

  private run() {
    this.refreshStartOptions();
    if (!this.nodes.length) {
      this.player.load([{ note: 'Grafi është bosh. Zgjidhni një shembull ose shtoni kulme me mënyrën “Shto kulm”.', visited: [], frontier: [], treeEdges: [], order: [] } as GStep]);
      this.paint(0);
      return;
    }
    if (!this.nodes.some((n) => n.id === this.start)) this.start = this.nodes[0].id;

    const adj = this.adjacency();
    let steps: GStep[];
    if (this.algo === 'bfs') steps = bfsSteps(this.nodes, adj, this.start);
    else if (this.algo === 'dfs') steps = dfsSteps(this.nodes, adj, this.start);
    else if (this.algo === 'kruskal') steps = kruskalSteps(this.nodes, this.edges);
    else steps = primSteps(this.nodes, this.edges, this.start);

    if ((this.algo === 'kruskal' || this.algo === 'prim') && !this.weighted) {
      steps.unshift({
        note: 'Ky graf është pa peshë, prandaj çdo brinjë ka peshë 1. Aktivizoni “Me peshë” ose zgjidhni grafin e Problemit 2 për një MST kuptimplotë.',
        visited: [], frontier: [], treeEdges: [], order: [], weight: 0,
      });
    }
    this.player.load(steps);
    this.paint(0);
  }

  private refreshStartOptions() {
    const cur = this.start;
    this.startSel.replaceChildren(...this.nodes.map((n) => h('option', { value: n.id }, n.id)));
    if (this.nodes.some((n) => n.id === cur)) this.startSel.value = cur;
    this.startSel.disabled = this.algo === 'kruskal' || !this.nodes.length;
  }

  private paint(i: number) {
    const s = this.player.steps[i] as GStep | undefined;
    this.sync(i);
    if (s) this.note.innerHTML = s.note;
    this.draw(s);
    this.drawPanels(s);
  }

  /* ----------------------------------------------------------- draw */
  private draw(s?: GStep) {
    const W = 660, H = 380;
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', class: `mode-${this.mode}` });
    const title = svgEl('title');
    title.textContent = `Graf me ${this.nodes.length} kulme dhe ${this.edges.length} brinjë.`;
    svg.append(title);

    if (this.directed) {
      const defs = svgEl('defs');
      for (const [id, colour] of [['ah', 'var(--viz-line)'], ['ah-on', 'var(--viz-path)'], ['ah-cur', 'var(--viz-active)']]) {
        const m = svgEl('marker', { id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' });
        m.append(svgEl('path', { d: 'M0,0 L10,5 L0,10 z', fill: colour }));
        defs.append(m);
      }
      svg.append(defs);
    }

    const pos = new Map(this.nodes.map((n) => [n.id, n]));
    const tree = new Set(s?.treeEdges ?? []);
    const rejected = new Set(s?.rejected ?? []);

    /* edges */
    for (const e of this.edges) {
      const a = pos.get(e.u), b = pos.get(e.v);
      if (!a || !b) continue;
      const k = ekey(e.u, e.v);
      const isTree = tree.has(k);
      const isRej = rejected.has(k);
      const isCur = s?.considering === k;

      const dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const r = 22;
      const x1 = a.x + (dx / len) * r, y1 = a.y + (dy / len) * r;
      const x2 = b.x - (dx / len) * r, y2 = b.y - (dy / len) * r;

      const stroke = isCur ? 'var(--viz-active)' : isTree ? 'var(--viz-path)' : isRej ? 'var(--viz-reject)' : 'var(--viz-line)';
      const line = svgEl('line', {
        x1, y1, x2, y2, stroke,
        'stroke-width': isCur ? 4 : isTree ? 3.5 : 2,
        'stroke-dasharray': isRej ? '5 4' : '',
        'stroke-linecap': 'round',
        class: 'g-edge', 'data-edge': k,
      });
      if (this.directed) line.setAttribute('marker-end', `url(#${isCur ? 'ah-cur' : isTree ? 'ah-on' : 'ah'})`);
      svg.append(line);

      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      if (this.weighted) {
        svg.append(svgEl('circle', { cx: mx, cy: my, r: 11, fill: 'var(--surface)', stroke, 'stroke-width': 1.4 }));
        const t = svgEl('text', { x: mx, y: my + 4, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, 'font-family': 'var(--font-mono)', fill: stroke });
        t.textContent = String(e.w);
        svg.append(t);
      }
      if (isRej) {
        const t = svgEl('text', { x: mx, y: my - 14, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: 'var(--viz-reject)' });
        t.textContent = '✕';
        svg.append(t);
      }
    }

    /* pending edge preview */
    if (this.pendingEdge) {
      const a = pos.get(this.pendingEdge);
      if (a) svg.append(svgEl('circle', { cx: a.x, cy: a.y, r: 28, fill: 'none', stroke: 'var(--viz-active)', 'stroke-width': 2, 'stroke-dasharray': '4 4' }));
    }

    /* nodes */
    const visited = new Set(s?.visited ?? []);
    const frontier = new Set(s?.frontier ?? []);
    for (const n of this.nodes) {
      const isCur = s?.current === n.id;
      const inTree = visited.has(n.id);
      const inFront = frontier.has(n.id);

      let fill = 'var(--surface)', stroke = 'var(--viz-line)', ink = 'var(--ink-2)', mark = '';
      if (isCur) { fill = 'var(--viz-active)'; stroke = 'var(--viz-active)'; ink = '#fff'; mark = '▶'; }
      else if (inTree) { fill = 'var(--viz-done)'; stroke = 'var(--viz-done)'; ink = '#fff'; mark = '✓'; }
      else if (inFront) { fill = 'var(--surface)'; stroke = 'var(--viz-compare)'; ink = 'var(--viz-compare)'; mark = '▸'; }

      const g = svgEl('g', { class: 'g-node', 'data-node': n.id, tabindex: '0', role: 'img' });
      const t2 = svgEl('title');
      t2.textContent = `Kulmi ${n.id}${mark ? ` — ${isCur ? 'aktual' : inTree ? 'i vizituar' : 'në radhë/stivë'}` : ''}`;
      g.append(t2);
      g.append(svgEl('circle', { cx: n.x, cy: n.y, r: 21, fill, stroke, 'stroke-width': isCur || inFront ? 3 : 2 }));
      const label = svgEl('text', { x: n.x, y: n.y + 5, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: ink, 'font-family': 'var(--font-mono)', 'pointer-events': 'none' });
      label.textContent = n.id;
      g.append(label);
      if (mark) {
        const m = svgEl('text', { x: n.x + 19, y: n.y - 16, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: stroke, 'pointer-events': 'none' });
        m.textContent = mark;
        g.append(m);
      }
      if (n.id === this.start && this.algo !== 'kruskal') {
        const st = svgEl('text', { x: n.x, y: n.y + 38, 'text-anchor': 'middle', 'font-size': 10, fill: 'var(--ink-faint)', 'font-family': 'var(--font-mono)', 'pointer-events': 'none' });
        st.textContent = 'nisja';
        g.append(st);
      }
      svg.append(g);
    }

    this.stage.replaceChildren(svg);
    this.wireStage(svg, W, H);
  }

  /* --------------------------------------------------- interaction */
  private wireStage(svg: SVGSVGElement, W: number, H: number) {
    const toLocal = (e: MouseEvent | Touch) => {
      const r = svg.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
    };

    svg.addEventListener('click', (ev) => {
      const target = ev.target as Element;
      const nodeEl = target.closest('[data-node]');
      const edgeEl = target.closest('[data-edge]');
      const id = nodeEl?.getAttribute('data-node');

      if (this.mode === 'delete') {
        if (id) {
          this.nodes = this.nodes.filter((n) => n.id !== id);
          this.edges = this.edges.filter((e) => e.u !== id && e.v !== id);
          this.run();
        } else if (edgeEl) {
          const k = edgeEl.getAttribute('data-edge')!;
          this.edges = this.edges.filter((e) => ekey(e.u, e.v) !== k);
          this.run();
        }
        return;
      }

      if (this.mode === 'edge' && id) {
        if (!this.pendingEdge) { this.pendingEdge = id; this.draw(this.player.steps[this.player.index] as GStep); return; }
        if (this.pendingEdge === id) { this.pendingEdge = null; this.draw(); return; }
        const k = ekey(this.pendingEdge, id);
        if (!this.edges.some((e) => ekey(e.u, e.v) === k)) {
          const w = this.weighted ? this.askWeight() : 1;
          if (w !== null) this.edges.push({ u: this.pendingEdge, v: id, w });
        }
        this.pendingEdge = null;
        this.run();
        return;
      }

      if (this.mode === 'build' && !id && !edgeEl) {
        const { x, y } = toLocal(ev);
        this.nodes.push({ id: this.nextId(), x: Math.round(x), y: Math.round(y) });
        this.run();
      }
    });

    if (this.mode !== 'move') return;

    // Drag to reposition, pointer events so touch works too.
    let dragging: Node | null = null;
    svg.addEventListener('pointerdown', (ev) => {
      const id = (ev.target as Element).closest('[data-node]')?.getAttribute('data-node');
      if (!id) return;
      dragging = this.nodes.find((n) => n.id === id) ?? null;
      if (dragging) { svg.setPointerCapture(ev.pointerId); ev.preventDefault(); }
    });
    svg.addEventListener('pointermove', (ev) => {
      if (!dragging) return;
      const { x, y } = toLocal(ev as unknown as MouseEvent);
      dragging.x = Math.round(Math.max(26, Math.min(W - 26, x)));
      dragging.y = Math.round(Math.max(26, Math.min(H - 26, y)));
      this.draw(this.player.steps[this.player.index] as GStep);
    });
    const stop = () => { dragging = null; };
    svg.addEventListener('pointerup', stop);
    svg.addEventListener('pointercancel', stop);
  }

  private askWeight(): number | null {
    const raw = prompt('Pesha e brinjës (numër i plotë):', '1');
    if (raw === null) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : 1;
  }

  private nextId(): string {
    const used = new Set(this.nodes.map((n) => n.id));
    const numeric = this.nodes.every((n) => /^\d+$/.test(n.id));
    if (numeric || !this.nodes.length) {
      for (let i = 0; i < 99; i++) if (!used.has(String(i))) return String(i);
    }
    for (const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') if (!used.has(c)) return c;
    return `N${this.nodes.length}`;
  }

  /* --------------------------------------------------------- panels */
  private drawPanels(s?: GStep) {
    const adj = this.adjacency();
    const ids = this.nodes.map((n) => n.id);

    /* state */
    const frontierLabel = this.algo === 'bfs' ? 'Radha (FIFO)' : this.algo === 'dfs' ? 'Stiva (LIFO)' : 'Pema aktuale';
    const stateRows: Node[] = [];
    const isMst = this.algo === 'kruskal' || this.algo === 'prim';

    this.panelState.replaceChildren(
      h('h4', {}, 'Gjendja'),
      h('dl', { class: 'viz-stats' },
        h('div', { class: 'viz-stat' }, h('dt', {}, 'Rendi |V|'), h('dd', {}, String(ids.length))),
        h('div', { class: 'viz-stat' }, h('dt', {}, 'Përmasa |E|'), h('dd', {}, String(this.edges.length))),
        ...(isMst
          ? [h('div', { class: 'viz-stat' }, h('dt', {}, 'Peshë MST'), h('dd', {}, String(s?.weight ?? 0)))]
          : [h('div', { class: 'viz-stat' }, h('dt', {}, 'Të vizituar'), h('dd', {}, String(s?.visited.length ?? 0)))]),
      ),
      h('p', { class: 'g-line' }, h('strong', {}, `${frontierLabel}: `),
        h('code', {}, isMst ? `${s?.treeEdges.length ?? 0} brinjë` : `[${(s?.frontier ?? []).join(', ')}]`)),
      !isMst
        ? h('p', { class: 'g-line' }, h('strong', {}, 'Rendi i zbulimit: '), h('code', {}, (s?.order ?? []).join(' → ') || '—'))
        : h('p', { class: 'g-line' }, h('strong', {}, 'Brinjët e pranuara: '), h('code', {}, (s?.treeEdges ?? []).map((k) => k.replace('|', '–')).join(', ') || '—')),
      h('h4', { style: 'margin-top:.9rem' }, 'Pseudokodi'),
      h('div', { class: 'viz-pseudo' }, ...PSEUDO[this.algo].map((l, idx) => h('div', { class: idx === s?.line ? 'is-on' : '' }, l))),
    );

    /* adjacency list — Laboratori 4 */
    this.panelAdj.replaceChildren(
      h('h4', {}, 'Lista e fqinjësisë'),
      h('table', {}, h('tbody', {},
        ...ids.map((id) =>
          h('tr', {},
            h('th', { scope: 'row' }, id),
            h('td', { style: 'text-align:left' }, `[${(adj.get(id) ?? []).join(', ')}]`),
            h('td', { title: 'Fuqia (degree)' }, `deg ${(adj.get(id) ?? []).length}`),
          )),
      )),
      h('p', { class: 'muted', style: 'font-size:.76rem;margin:.5rem 0 0' }, 'Hapësirë: O(|V| + |E|)'),
    );

    /* adjacency matrix — Laboratori 4 */
    const matrixRows = ids.map((u) =>
      h('tr', {},
        h('th', { scope: 'row' }, u),
        ...ids.map((v) => {
          const on = this.edges.some((e) => (e.u === u && e.v === v) || (!this.directed && e.u === v && e.v === u));
          return h('td', { class: on ? 'm-on' : 'm-off' }, on ? (this.weighted ? String(this.edges.find((e) => ekey(e.u, e.v) === ekey(u, v))!.w) : '1') : '0');
        }),
      ));
    this.panelMatrix.replaceChildren(
      h('h4', {}, 'Matrica e fqinjësisë'),
      h('table', {},
        h('thead', {}, h('tr', {}, h('th', {}, ''), ...ids.map((v) => h('th', {}, v)))),
        h('tbody', {}, ...matrixRows),
      ),
      h('p', { class: 'muted', style: 'font-size:.76rem;margin:.5rem 0 0' },
        this.directed ? 'Tek digrafet A[i][j] ≠ A[j][i]. Hapësirë: O(|V|²)' : 'Hapësirë: O(|V|²)'),
    );
  }
}

function lk(colour: string, mark: string, label: string) {
  return h('span', {},
    h('span', { class: 'viz-key', style: `background:${colour};color:#fff` }, mark), label);
}

if (!customElements.get('viz-graph')) customElements.define('viz-graph', VizGraph);
