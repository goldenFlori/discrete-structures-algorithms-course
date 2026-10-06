/**
 * Notebook -> web-safe representation.
 *
 * Reads .ipynb JSON. NEVER executes a notebook or any code inside it.
 * Notebook content is treated as UNTRUSTED: raw HTML in markdown is disabled,
 * HTML outputs are sanitised, and embedded JavaScript outputs are shown as
 * inert notices rather than executed.
 *
 * The original .ipynb is never modified. This module only produces a separate
 * publication representation.
 */
import crypto from 'node:crypto';
import MarkdownIt from 'markdown-it';
import { katex } from '@mdit/plugin-katex';
import { codeToHtml } from 'shiki';

/* ------------------------------------------------------------------ */
/* Markdown                                                            */
/* ------------------------------------------------------------------ */

const md = new MarkdownIt({
  html: false, // untrusted content: no raw HTML passthrough
  linkify: false, // no auto-linking of untrusted text
  typographer: false, // would mangle -> and math-ish punctuation
}).use(katex, { throwOnError: false, strict: false });

// Tables need a wrapper so wide matrices scroll instead of breaking the page.
md.renderer.rules.table_open = () => '<div class="nb-table-wrap"><table>';
md.renderer.rules.table_close = () => '</table></div>';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const src = (cell) => (Array.isArray(cell.source) ? cell.source.join('') : cell.source || '');

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Strip ANSI escape codes from notebook stream output / tracebacks.
const ANSI = new RegExp(String.fromCharCode(27) + '\\[[0-9;]*[A-Za-z]', 'g');
const stripAnsi = (s) => String(s).replace(ANSI, '');

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[ëé]/g, 'e')
    .replace(/[çć]/g, 'c')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70) || 'seksion';

const hash = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);

/* ------------------------------------------------------------------ */
/* Section classification                                              */
/*                                                                     */
/* Derived from the real headings used across the supplied notebooks.  */
/* Nothing is invented: a heading that matches nothing stays "normal". */
/* ------------------------------------------------------------------ */

const SECTION_RULES = [
  { kind: 'homework', label: 'Detyrë Shtëpie', re: /detyr[ëeaë]*\s*(p[ëe]r\s*)?sht[ëe]pi/i },
  { kind: 'classwork', label: 'Punë në Klasë', re: /pun[ëe]\s*n[ëe]\s*klas/i },
  {
    kind: 'reflect',
    label: 'Pyetje Reflektuese',
    re: /(pyetje\s*reflektuese|mendoni\s*pak|pyetje\s*p[ëe]r\s*diskutim|pyetjet?\s*e\s*analiz)/i,
  },
  { kind: 'scenario', label: 'Skenar Real', re: /skenari?\s*real/i },
  { kind: 'exercise', label: 'Ushtrim', re: /^\s*(ushtrimi?|loja\s*finale|practice\s*exercises?)\b/i },
  { kind: 'theory', label: 'Teori', re: /^\s*(\d+\.\s*)?(teoria|hyrje|kujtues\s*teorik)\b/i },
  { kind: 'complexity', label: 'Kompleksiteti', re: /^\s*(\d+\.\s*)?complexity\s*$/i },
];

function classifyHeading(text) {
  for (const r of SECTION_RULES) if (r.re.test(text)) return r;
  return { kind: 'normal', label: null };
}

/* ------------------------------------------------------------------ */
/* Markdown cell -> sections                                           */
/*                                                                     */
/* Split on ATX headings so each section can carry its own visual      */
/* identity and its own TOC anchor. Fenced code blocks are respected   */
/* so a "# comment" inside a fence never splits a section.             */
/* ------------------------------------------------------------------ */

function splitIntoSections(source) {
  const lines = source.split('\n');
  const out = [];
  let current = { level: 0, title: null, lines: [] };
  let fence = null;

  for (const line of lines) {
    const f = line.match(/^\s*(```+|~~~+)/);
    if (f) {
      if (!fence) fence = f[1][0];
      else if (line.trim().startsWith(fence)) fence = null;
      current.lines.push(line);
      continue;
    }
    const h = !fence && line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      if (current.title !== null || current.lines.join('').trim()) out.push(current);
      current = { level: h[1].length, title: h[2].trim().replace(/\s*#+\s*$/, ''), lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  if (current.title !== null || current.lines.join('').trim()) out.push(current);
  return out;
}

/* Fenced blocks that are really complexity statements.
   The notebooks write e.g.  ```\nKompleksiteti kohor:  O(V + E)\n```      */
function preRenderFences(body) {
  return body.replace(/```\s*\n([\s\S]*?)```/g, (whole, inner) => {
    const t = inner.trim();
    if (/^kompleksiteti/i.test(t) && t.split('\n').length <= 4) {
      const rows = t
        .split('\n')
        .filter(Boolean)
        .map((l) => {
          const m = l.match(/^([^:]+):\s*(.+)$/);
          return m
            ? `<div class="cx-row"><span class="cx-k">${esc(m[1].trim())}</span><span class="cx-v">${esc(m[2].trim())}</span></div>`
            : `<div class="cx-row"><span class="cx-v">${esc(l.trim())}</span></div>`;
        })
        .join('');
      return `\n\n<<<RAW:<div class="callout callout-complexity">${rows}</div>>>>\n\n`;
    }
    return whole;
  });
}

function renderMarkdownBody(body) {
  const pre = preRenderFences(body);
  const parts = pre.split(/<<<RAW:([\s\S]*?)>>>/);
  let html = '';
  for (let i = 0; i < parts.length; i++) {
    html += i % 2 === 1 ? parts[i] : md.render(parts[i]);
  }
  return html;
}

/* ------------------------------------------------------------------ */
/* Code cells                                                          */
/* ------------------------------------------------------------------ */

const COLLAPSE_OVER = 40;

/** Summarise a long implementation so students see the shape before the detail. */
function codeSummary(code) {
  const defs = [];
  for (const line of code.split('\n')) {
    let m = line.match(/^\s*class\s+([A-Za-z_]\w*)/);
    if (m) {
      defs.push({ t: 'class', n: m[1] });
      continue;
    }
    m = line.match(/^(\s*)def\s+([A-Za-z_]\w*)/);
    if (m && m[1].length <= 4) defs.push({ t: 'def', n: m[2] });
  }
  const seen = new Set();
  return defs.filter((d) => !seen.has(d.t + d.n) && seen.add(d.t + d.n)).slice(0, 14);
}

/** Static inspection only — the code is never run to learn what it does. */
function codeFlags(code) {
  return {
    pygame: /\bimport\s+pygame\b|\bpygame\./.test(code),
    tkinter: /\bimport\s+tkinter\b|\btkinter\./.test(code),
    widgets: /\bipywidgets\b/.test(code),
    plotly: /\bplotly\b/.test(code),
    subprocess: /\bsubprocess\b/.test(code),
    sysexit: /\bsys\.exit\s*\(/.test(code),
    networkx: /\bnetworkx\b/.test(code),
    matplotlib: /\bmatplotlib\b/.test(code),
  };
}

function externalScripts(code) {
  const out = new Set();
  for (const m of code.matchAll(/['"]([\w./-]+\.py)['"]/g)) out.add(m[1]);
  return [...out];
}

/* ------------------------------------------------------------------ */
/* Outputs                                                             */
/* ------------------------------------------------------------------ */

const MAX_STREAM_CHARS = 4000;

/**
 * A closed Pygame/Tkinter window leaves a SystemExit or a "Kernel crashed"
 * trace in the saved notebook. That is the desktop program ending — not the
 * algorithm failing — so it is presented as a neutral note. Anything else is
 * shown as a real error, unaltered.
 */
function classifyError(out, cellFlags) {
  const name = out.ename || '';
  const tb = stripAnsi((out.traceback || []).join('\n'));
  const gui = cellFlags.pygame || cellFlags.tkinter;

  if (name === 'SystemExit') {
    return {
      benign: true,
      title: 'Programi u mbyll normalisht',
      note: 'Dritarja interaktive u mbyll. Kjo nuk është gabim — algoritmi përfundoi.',
    };
  }
  if (!name && /kernel crashed/i.test(tb) && gui) {
    return {
      benign: true,
      title: 'Dritarja u mbyll / kerneli u ristartua',
      note: 'Gjurmë e zakonshme kur një dritare Pygame mbyllet nga brenda Jupyter. Kodi vetë është në rregull — ekzekutojeni lokalisht.',
    };
  }
  return { benign: false, name, evalue: out.evalue || '', traceback: tb };
}

/** Conservative sanitiser for text/html output from an untrusted notebook. */
function sanitizeHtml(html) {
  return String(html)
    .replace(/<\s*(script|iframe|object|embed|link|meta|form|style)\b[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|iframe|object|embed|link|meta|form|style)\b[^>]*>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"');
}

function renderOutputs(outputs, cellFlags, assets) {
  const items = [];
  for (const out of outputs || []) {
    const type = out.output_type;

    if (type === 'stream') {
      let text = stripAnsi(Array.isArray(out.text) ? out.text.join('') : out.text || '');
      const truncated = text.length > MAX_STREAM_CHARS;
      if (truncated) text = text.slice(0, MAX_STREAM_CHARS) + '\n…';
      if (text.trim()) items.push({ kind: 'stream', stream: out.name || 'stdout', text, truncated });
      continue;
    }

    if (type === 'error') {
      items.push({ kind: 'error', ...classifyError(out, cellFlags) });
      continue;
    }

    if (type === 'display_data' || type === 'execute_result') {
      const data = out.data || {};

      if (data['application/vnd.plotly.v1+json']) {
        const json = JSON.stringify(data['application/vnd.plotly.v1+json']);
        const file = `plotly-${hash(json)}.json`;
        assets.set(file, Buffer.from(json, 'utf8'));
        items.push({ kind: 'plotly', file, bytes: json.length });
        continue;
      }
      if (data['application/vnd.jupyter.widget-view+json']) {
        items.push({ kind: 'widget' });
        continue;
      }
      if (data['image/png']) {
        const b64 = String(
          Array.isArray(data['image/png']) ? data['image/png'].join('') : data['image/png'],
        ).replace(/\s/g, '');
        const buf = Buffer.from(b64, 'base64');
        const file = `img-${hash(b64)}.png`;
        assets.set(file, buf);
        items.push({ kind: 'image', file, bytes: buf.length });
        continue;
      }
      if (data['image/svg+xml']) {
        const svg = Array.isArray(data['image/svg+xml']) ? data['image/svg+xml'].join('') : data['image/svg+xml'];
        const file = `img-${hash(svg)}.svg`;
        assets.set(file, Buffer.from(sanitizeHtml(svg), 'utf8'));
        items.push({ kind: 'image', file, bytes: svg.length });
        continue;
      }
      if (data['application/javascript']) {
        // Never executed. Shown as an inert notice so the record stays honest.
        items.push({ kind: 'inert-js' });
        continue;
      }
      if (data['text/html']) {
        const html = Array.isArray(data['text/html']) ? data['text/html'].join('') : data['text/html'];
        items.push({ kind: 'html', html: sanitizeHtml(html) });
        continue;
      }
      if (data['text/plain']) {
        const text = stripAnsi(
          Array.isArray(data['text/plain']) ? data['text/plain'].join('') : data['text/plain'],
        );
        if (text.trim()) items.push({ kind: 'stream', stream: 'result', text });
        continue;
      }
    }
  }
  return items;
}

/* ------------------------------------------------------------------ */
/* Clean outputs                                                       */
/*                                                                     */
/* The site shows a clean lab, not a log of someone's Jupyter session. */
/*  - Desktop programs (Pygame/Tkinter/launched scripts) and Jupyter    */
/*    widgets keep no output at all: their interactive version is a web */
/*    visualizer embedded on the page instead.                          */
/*  - Errors, stderr, the Pygame start-up banner and the "⏳ pending"    */
/*    lines of the self-check cells are dropped.                        */
/* The .ipynb file itself is never modified.                           */
/* ------------------------------------------------------------------ */
const NOISE_LINE = [
  /^pygame \d+\.\d+/,
  /Hello from the pygame community/,
  /^\s*⏳/,
];

function cleanOutputs(items, cf) {
  if (isInteractiveCell(cf)) return [];
  const out = [];
  for (const o of items) {
    if (o.kind === 'error' || o.kind === 'widget' || o.kind === 'inert-js') continue;
    if (o.kind === 'stream') {
      if (o.stream === 'stderr') continue;
      const text = o.text
        .split('\n')
        .filter((l) => !NOISE_LINE.some((re) => re.test(l)))
        .join('\n')
        .replace(/^\n+|\s+$/g, '');
      if (!text) continue;
      out.push({ ...o, text });
      continue;
    }
    out.push(o);
  }
  return out;
}

/** A cell whose real output is a desktop window or a live Jupyter widget. */
function isInteractiveCell(cf) {
  return cf.pygame || cf.tkinter || cf.subprocess || cf.widgets;
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

const STDLIB = new Set([
  'os', 'sys', 'math', 'random', 'time', 'copy', 'collections', 'itertools', 'heapq',
  'threading', 'subprocess', 'json', 're', 'functools', 'string', 'typing', 'dataclasses',
  'tkinter', 'IPython',
]);

export async function renderNotebook(raw, { assets = new Map() } = {}) {
  const nb = JSON.parse(raw);
  const cells = nb.cells || [];

  const toc = [];
  const rendered = [];
  const imports = new Set();
  const flags = {
    pygame: false, tkinter: false, widgets: false, plotly: false,
    matplotlib: false, networkx: false, numpy: false,
  };
  const missingScripts = new Set();
  const sectionIndex = [];
  const usedIds = new Set();

  const mkId = (base) => {
    const root = slug(base);
    let id = root;
    let n = 2;
    while (usedIds.has(id)) id = `${root}-${n++}`;
    usedIds.add(id);
    return id;
  };

  const seenTitles = new Set();
  let title = null;
  let titleSeen = false;
  let totalCodeLines = 0;

  for (const [srcIndex, cell] of cells.entries()) {
    const source = src(cell);

    if (cell.cell_type === 'markdown') {
      if (!source.trim()) continue;
      for (const sec of splitIntoSections(source)) {
        const body = sec.lines.join('\n');

        if (sec.title === null) {
          const html = renderMarkdownBody(body);
          if (html.trim()) rendered.push({ type: 'markdown', kind: 'normal', html, srcIndex });
          continue;
        }

        // The first level-1 heading is the notebook title; the page renders it
        // in the header, so it is not repeated inline.
        if (!titleSeen && sec.level === 1) {
          title = sec.title;
          titleSeen = true;
          const html = renderMarkdownBody(body);
          if (html.trim()) rendered.push({ type: 'markdown', kind: 'normal', html, srcIndex, intro: true });
          continue;
        }

        const cls = classifyHeading(sec.title);
        const id = mkId(sec.title);
        const html = renderMarkdownBody(body);

        // Several notebooks repeat a heading verbatim in a one-line cell just
        // before the code it introduces. Keep the anchor (ranges may target it)
        // but do not repeat the heading on screen or in the table of contents.
        const redundant = !html.trim() && seenTitles.has(sec.title.trim().toLowerCase());
        seenTitles.add(sec.title.trim().toLowerCase());

        if (!redundant) {
          toc.push({ id, title: sec.title, level: sec.level, kind: cls.kind });
          sectionIndex.push({ id, title: sec.title, kind: cls.kind });
        }

        rendered.push({
          type: 'markdown',
          kind: cls.kind,
          label: cls.label,
          id,
          heading: redundant ? null : sec.title,
          level: sec.level,
          redundant,
          html,
          srcIndex,
        });
      }
      continue;
    }

    if (cell.cell_type !== 'code') continue;
    if (!source.trim() && !(cell.outputs || []).length) continue;

    for (const m of source.matchAll(/^\s*(?:import|from)\s+([A-Za-z_][\w.]*)/gm)) {
      imports.add(m[1].split('.')[0]);
    }
    const cf = codeFlags(source);
    for (const k of Object.keys(flags)) if (cf[k]) flags[k] = true;
    if (/\bnumpy\b/.test(source)) flags.numpy = true;
    if (cf.subprocess) for (const s of externalScripts(source)) missingScripts.add(s);

    const lines = source.split('\n').length;
    totalCodeLines += lines;

    rendered.push({
      type: 'code',
      srcIndex,
      interactive: isInteractiveCell(cf),
      html: await codeToHtml(source, {
        lang: 'python',
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: false,
      }),
      raw: source,
      lines,
      collapsed: lines > COLLAPSE_OVER,
      summary: lines > COLLAPSE_OVER ? codeSummary(source) : [],
      flags: cf,
      externalScripts: cf.subprocess ? externalScripts(source) : [],
      outputs: cleanOutputs(renderOutputs(cell.outputs, cf, assets), cf),
    });
  }

  const deps = [...imports].filter((i) => !STDLIB.has(i)).sort();

  // Long notebooks get a level-1/2 table of contents; short ones keep level 3
  // so the detail is not lost. Keeps the sidebar usable on every lab.
  const maxTocLevel = toc.length > 22 ? 2 : 3;
  const trimmedToc = toc.filter((t) => t.level <= maxTocLevel);

  return {
    title,
    toc: trimmedToc,
    tocFull: toc,
    sections: sectionIndex,
    cells: rendered,
    imports: [...imports].sort(),
    dependencies: deps,
    flags,
    missingScripts: [...missingScripts],
    stats: {
      cells: cells.length,
      markdown: cells.filter((c) => c.cell_type === 'markdown').length,
      code: cells.filter((c) => c.cell_type === 'code').length,
      codeLines: totalCodeLines,
    },
    hasEmbeddedHomework: sectionIndex.some((s) => s.kind === 'homework'),
    hasClasswork: sectionIndex.some((s) => s.kind === 'classwork'),
    assets,
  };
}
