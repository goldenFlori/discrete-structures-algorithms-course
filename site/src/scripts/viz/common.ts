/**
 * Shared pieces for the algorithm visualizers.
 *
 * Deliberately framework-free: each visualizer is a custom element that ships
 * only on its own page, so a student reading theory downloads none of this.
 *
 * Accessibility rules used throughout:
 *  - every algorithm state carries a label or shape, never colour alone
 *  - every control is a real <button> / <input> and keyboard reachable
 *  - the step explanation is announced through an aria-live region
 */

export const h = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else el.setAttribute(k, v);
  }
  el.append(...children);
  return el;
};

export const svgEl = <K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
};

export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
export const fmt = (n: number) =>
  n >= 1e9 ? `${(n / 1e9).toFixed(1)} mld` :
  n >= 1e6 ? `${(n / 1e6).toFixed(1)} mln` :
  n >= 1e4 ? `${Math.round(n / 1e3)} mijë` :
  n.toLocaleString('sq-AL', { maximumFractionDigits: 0 });

export const INF = Infinity;
export const infLabel = (v: number) => (v === Infinity ? '∞' : String(v));

/* ------------------------------------------------------------------ */
/* Step player                                                         */
/* ------------------------------------------------------------------ */

export interface Step {
  /** One sentence in Albanian explaining what this step does. */
  note: string;
  [k: string]: any;
}

export class Player {
  private timer: number | null = null;
  index = 0;
  steps: Step[] = [];
  speed = 1;
  onChange: (i: number) => void = () => {};
  onPlayState: (playing: boolean) => void = () => {};

  load(steps: Step[]) {
    this.pause();
    this.steps = steps;
    this.index = 0;
    this.onChange(0);
  }
  get playing() { return this.timer !== null; }
  get atEnd() { return this.index >= this.steps.length - 1; }

  go(i: number) {
    this.index = clamp(i, 0, Math.max(0, this.steps.length - 1));
    this.onChange(this.index);
  }
  next() { if (!this.atEnd) this.go(this.index + 1); else this.pause(); }
  prev() { this.go(this.index - 1); }
  reset() { this.pause(); this.go(0); }

  play() {
    if (this.timer !== null || this.atEnd) return;
    const tick = () => {
      this.next();
      if (this.atEnd) this.pause();
    };
    this.timer = window.setInterval(tick, 900 / this.speed);
    this.onPlayState(true);
  }
  pause() {
    if (this.timer !== null) { clearInterval(this.timer); this.timer = null; }
    this.onPlayState(false);
  }
  toggle() { this.playing ? this.pause() : this.play(); }
  setSpeed(s: number) {
    this.speed = s;
    if (this.playing) { this.pause(); this.play(); }
  }
}

/** Standard transport controls wired to a Player. */
export function buildControls(player: Player, opts: { onReset?: () => void } = {}) {
  const btn = (label: string, aria: string, cls = '') =>
    h('button', { type: 'button', class: `viz-btn ${cls}`, 'aria-label': aria }, label);

  const first = btn('⏮', 'Kthehu në fillim');
  const prev = btn('◀ Prapa', 'Hapi i mëparshëm');
  const play = btn('▶ Luaj', 'Luaj', 'viz-btn-primary');
  const next = btn('Përpara ▶', 'Hapi tjetër');

  const speed = h('select', { class: 'viz-select', 'aria-label': 'Shpejtësia' });
  for (const [v, l] of [['0.5', '0,5×'], ['1', '1×'], ['2', '2×'], ['4', '4×']]) {
    speed.append(h('option', { value: v, ...(v === '1' ? { selected: 'selected' } : {}) }, l));
  }
  speed.addEventListener('change', () => player.setSpeed(Number(speed.value)));

  first.addEventListener('click', () => { player.pause(); opts.onReset?.(); player.reset(); });
  prev.addEventListener('click', () => { player.pause(); player.prev(); });
  next.addEventListener('click', () => { player.pause(); player.next(); });
  play.addEventListener('click', () => player.toggle());

  player.onPlayState = (playing) => {
    play.textContent = playing ? '❚❚ Pauzë' : '▶ Luaj';
    play.setAttribute('aria-label', playing ? 'Pauzë' : 'Luaj');
  };

  const progress = h('input', {
    type: 'range', class: 'viz-range', min: '0', max: '0', value: '0',
    'aria-label': 'Pozicioni i hapit',
  }) as HTMLInputElement;
  progress.addEventListener('input', () => { player.pause(); player.go(Number(progress.value)); });

  const counter = h('span', { class: 'viz-counter mono' }, '0 / 0');

  const bar = h('div', { class: 'viz-controls' },
    h('div', { class: 'viz-buttons' }, first, prev, play, next),
    h('div', { class: 'viz-progress' }, progress, counter),
    h('label', { class: 'viz-speed' }, h('span', { class: 'visually-hidden' }, 'Shpejtësia'), speed),
  );

  const sync = (i: number) => {
    progress.max = String(Math.max(0, player.steps.length - 1));
    progress.value = String(i);
    counter.textContent = `${i + 1} / ${player.steps.length}`;
    prev.toggleAttribute('disabled', i === 0);
    next.toggleAttribute('disabled', player.atEnd);
    play.toggleAttribute('disabled', player.atEnd && player.steps.length > 1);
  };

  return { bar, sync };
}

/** Keyboard shortcuts scoped to the visualizer, not the whole page. */
export function bindKeys(root: HTMLElement, player: Player) {
  root.tabIndex = -1;
  root.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA') return;
    switch (e.key) {
      case 'ArrowRight': player.pause(); player.next(); e.preventDefault(); break;
      case 'ArrowLeft': player.pause(); player.prev(); e.preventDefault(); break;
      case ' ': player.toggle(); e.preventDefault(); break;
      case 'Home': player.reset(); e.preventDefault(); break;
    }
  });
}

/** A live region so screen readers hear each step, not just see it. */
export function liveNote() {
  return h('p', { class: 'viz-note', role: 'status', 'aria-live': 'polite' });
}

/* ------------------------------------------------------------------ */
/* Palette — matches the site tokens, readable in both themes          */
/* ------------------------------------------------------------------ */

export const C = {
  idle: 'var(--viz-idle)',
  idleInk: 'var(--viz-idle-ink)',
  active: 'var(--viz-active)',
  done: 'var(--viz-done)',
  compare: 'var(--viz-compare)',
  path: 'var(--viz-path)',
  reject: 'var(--viz-reject)',
  line: 'var(--viz-line)',
};

/** Parse "8, 3, 1, 7" into numbers; tolerant of spaces and stray separators. */
export function parseNumbers(text: string, max = 24): { values: number[]; error: string | null } {
  const parts = text.split(/[^0-9.\-]+/).filter(Boolean);
  if (!parts.length) return { values: [], error: 'Shkruani të paktën dy numra.' };
  const values = parts.map(Number);
  if (values.some((v) => !Number.isFinite(v))) return { values: [], error: 'Përdorni vetëm numra, ndarë me presje.' };
  if (values.length < 2) return { values: [], error: 'Duhen të paktën dy numra.' };
  if (values.length > max) return { values: values.slice(0, max), error: `U morën vetëm ${max} numrat e parë.` };
  return { values, error: null };
}
