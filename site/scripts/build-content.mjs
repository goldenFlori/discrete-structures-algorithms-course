/**
 * Build step: content/notebooks/*.ipynb  ->  src/generated/*.json  +  public/nb/*
 *
 * Runs before Astro. Originals are read-only; nothing is ever written back
 * into content/notebooks/. Notebooks are parsed, never executed.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderNotebook } from './notebook.mjs';
import { labs, homework, visualizers, course, topics, blocks, embeds } from '../content/course.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NB_DIR = path.join(root, 'content/notebooks');
const GEN_DIR = path.join(root, 'src/generated');
const PUB_NB = path.join(root, 'public/nb');
const PUB_DL = path.join(root, 'public/shkarkime');

const problems = [];
const warn = (m) => problems.push(m);

/* ------------------------------------------------------------------ */

async function main() {
  await fs.rm(GEN_DIR, { recursive: true, force: true });
  await fs.rm(PUB_NB, { recursive: true, force: true });
  await fs.rm(PUB_DL, { recursive: true, force: true });
  await fs.mkdir(GEN_DIR, { recursive: true });
  await fs.mkdir(PUB_NB, { recursive: true });
  await fs.mkdir(PUB_DL, { recursive: true });

  /* ---- which notebooks are actually referenced? ------------------- */
  const referenced = new Map(); // file -> [{labN, resourceTitle}]
  for (const lab of labs) {
    for (const r of lab.resources || []) {
      if (!r.notebook) continue;
      if (!referenced.has(r.notebook)) referenced.set(r.notebook, []);
      referenced.get(r.notebook).push({ lab: lab.n, title: r.title });
    }
  }
  for (const hw of homework) {
    if (!hw.notebook) continue;
    if (!referenced.has(hw.notebook)) referenced.set(hw.notebook, []);
    referenced.get(hw.notebook).push({ homework: hw.id, title: hw.title });
  }

  /* ---- render every referenced notebook once ---------------------- */
  const assets = new Map();
  const notebooks = {};

  for (const file of referenced.keys()) {
    const abs = path.join(NB_DIR, file);
    let raw;
    try {
      raw = await fs.readFile(abs, 'utf8');
    } catch {
      warn(`Fletorja mungon: content/notebooks/${file} (referuar nga: ${referenced
        .get(file)
        .map((r) => r.title)
        .join(', ')})`);
      continue;
    }
    const out = await renderNotebook(raw, { assets });
    const stat = await fs.stat(abs);

    notebooks[file] = {
      file,
      downloadName: file,
      sizeBytes: stat.size,
      title: out.title,
      toc: out.toc,
      sections: out.sections,
      cells: out.cells,
      imports: out.imports,
      dependencies: out.dependencies,
      flags: out.flags,
      missingScripts: out.missingScripts,
      stats: out.stats,
      hasEmbeddedHomework: out.hasEmbeddedHomework,
      hasClasswork: out.hasClasswork,
    };

    // Original, byte-for-byte, for download.
    await fs.copyFile(abs, path.join(PUB_DL, file));
  }

  /* ---- write extracted assets (images, plotly figures) ------------ */
  let assetBytes = 0;
  for (const [name, buf] of assets) {
    await fs.writeFile(path.join(PUB_NB, name), buf);
    assetBytes += buf.length;
  }

  /* ---- unreferenced notebooks are reported, never silently dropped */
  const onDisk = (await fs.readdir(NB_DIR)).filter((f) => f.endsWith('.ipynb'));
  for (const f of onDisk) {
    if (!referenced.has(f)) warn(`Fletore e papërdorur (nuk publikohet): content/notebooks/${f}`);
  }

  /* ---- validate & normalise labs ---------------------------------- */
  const VALID_STATUS = ['published', 'updated', 'draft', 'coming-soon'];
  const vizIds = new Set(visualizers.map((v) => v.id));
  const topicIds = new Set(topics.map((t) => t.id));

  const normLabs = labs
    .slice()
    .sort((a, b) => a.n - b.n)
    .map((lab) => {
      if (!VALID_STATUS.includes(lab.status)) warn(`Laboratori ${lab.n}: status i panjohur "${lab.status}"`);
      for (const t of lab.topics || []) if (!topicIds.has(t)) warn(`Laboratori ${lab.n}: temë e panjohur "${t}"`);

      const resources = (lab.resources || []).map((r) => {
        const nb = notebooks[r.notebook];
        let slice = null;
        if (r.sections && nb) {
          slice = resolveSlice(nb, r.sections, `Laboratori ${lab.n} / ${r.title}`);
        }
        return {
          ...r,
          available: Boolean(nb),
          notebookMeta: nb
            ? {
                title: nb.title,
                sizeBytes: nb.sizeBytes,
                stats: nb.stats,
                flags: nb.flags,
                dependencies: nb.dependencies,
                missingScripts: nb.missingScripts,
                hasEmbeddedHomework: nb.hasEmbeddedHomework,
                hasClasswork: nb.hasClasswork,
              }
            : null,
          slice,
        };
      });

      // Interactive visualizations of this lab = embeds that fall inside its part of each notebook.
      const labViz = [];
      for (const r of resources) {
        const nb = notebooks[r.notebook];
        if (!nb) continue;
        const inSlice = new Set(
          (r.slice?.length ? r.slice.flatMap((x) => nb.cells.slice(x.from ?? 0, x.to ?? nb.cells.length)) : nb.cells).map((c) => c.srcIndex),
        );
        for (const e of embeds[r.notebook] || []) {
          if (inSlice.has(e.cell) && !labViz.some((x) => x.viz === e.viz && x.resource === r.notebook && x.cell === e.cell)) {
            labViz.push({ ...e, resource: r.notebook, type: r.type, anchor: `viz-${r.notebook.replace(/\.ipynb$/, '')}-${e.cell}` });
          }
        }
      }

      // Dependencies actually needed for this lab, derived from real imports.
      const deps = new Set();
      const flags = { pygame: false, tkinter: false, widgets: false, plotly: false, matplotlib: false, networkx: false, numpy: false };
      for (const r of resources) {
        if (!r.notebookMeta) continue;
        for (const d of r.notebookMeta.dependencies) deps.add(d);
        for (const k of Object.keys(flags)) if (r.notebookMeta.flags[k]) flags[k] = true;
      }

      // Homework: declared embedded entries + anything detected inside notebooks.
      const hwEmbedded = (lab.homework || []).map((h) => ({ ...h, embedded: true }));
      const hwStandalone = homework.filter((h) => h.lab === lab.n || (h.alsoLabs || []).includes(lab.n));

      return {
        ...lab,
        slug: String(lab.n).padStart(2, '0'),
        resources,
        viz: labViz,
        dependencies: [...deps].sort(),
        flags,
        homeworkEmbedded: hwEmbedded,
        homeworkStandalone: hwStandalone.map((h) => ({ id: h.id, title: h.title, notebook: h.notebook, primary: h.lab === lab.n })),
        isPublic: lab.status === 'published' || lab.status === 'updated',
      };
    });

  for (const [file, list] of Object.entries(embeds)) {
    const nb = notebooks[file];
    if (!nb) {
      warn(`embeds: fletorja ${file} nuk publikohet.`);
      continue;
    }
    const indices = new Set(nb.cells.map((c) => c.srcIndex));
    for (const e of list) {
      if (!vizIds.has(e.viz)) warn(`embeds: ${file} qeliza ${e.cell} — vizualizim i panjohur "${e.viz}".`);
      if (!indices.has(e.cell)) warn(`embeds: ${file} nuk ka qelizë ${e.cell}.`);
    }
  }

  for (const hw of homework) {
    if (!normLabs.some((l) => l.n === hw.lab)) warn(`Detyra "${hw.id}" referon Laboratorin ${hw.lab} që nuk ekziston.`);
    if (hw.notebook && !notebooks[hw.notebook]) warn(`Detyra "${hw.id}": fletorja ${hw.notebook} mungon.`);
  }

  /* ---- derive the Python setup table from real imports ------------ */
  const PKG = {
    pygame: { pip: 'pygame', role: 'desktop', label: 'Vizualizime interaktive në dritare desktop' },
    plotly: { pip: 'plotly', role: 'browser', label: 'Grafikë interaktivë (punojnë edhe në këtë faqe)' },
    matplotlib: { pip: 'matplotlib', role: 'browser', label: 'Grafikë statikë dhe figura' },
    networkx: { pip: 'networkx', role: 'browser', label: 'Ndërtim dhe vizatim grafesh' },
    numpy: { pip: 'numpy', role: 'browser', label: 'Llogaritje numerike dhe matrica' },
    ipywidgets: { pip: 'ipywidgets', role: 'kernel', label: 'Butona interaktivë brenda Jupyter' },
    tkinter: { pip: null, role: 'stdlib-desktop', label: 'Vjen me Python (në Linux: python3-tk)' },
    IPython: { pip: null, role: 'bundled', label: 'Vjen me Jupyter' },
  };
  const packages = {};
  for (const lab of normLabs) {
    if (!lab.isPublic) continue;
    for (const r of lab.resources) {
      if (!r.notebookMeta) continue;
      for (const imp of notebooks[r.notebook].imports) {
        if (!PKG[imp]) continue;
        packages[imp] ??= { name: imp, ...PKG[imp], labs: new Set() };
        packages[imp].labs.add(lab.n);
      }
    }
  }
  for (const hw of homework) {
    const nb = notebooks[hw.notebook];
    if (!nb) continue;
    for (const imp of nb.imports) {
      if (!PKG[imp]) continue;
      packages[imp] ??= { name: imp, ...PKG[imp], labs: new Set() };
    }
  }
  const pkgList = Object.values(packages)
    .map((p) => ({ ...p, labs: [...p.labs].sort((a, b) => a - b) }))
    .sort((a, b) => a.name.localeCompare(b.name));

  /* ---- latest published lab (drives the homepage, automatically) -- */
  const published = normLabs.filter((l) => l.isPublic);
  const latest = published.length ? published[published.length - 1] : null;

  /* ---- write ------------------------------------------------------ */
  await fs.writeFile(path.join(GEN_DIR, 'notebooks.json'), JSON.stringify(notebooks));
  await fs.writeFile(
    path.join(GEN_DIR, 'course.json'),
    JSON.stringify({
      course,
      topics,
      blocks,
      labs: normLabs,
      homework,
      visualizers,
      embeds,
      packages: pkgList,
      latestLab: latest ? latest.n : null,
      problems,
      builtAt: new Date().toISOString(),
    }),
  );

  /* ---- report ----------------------------------------------------- */
  console.log(`\n  Fletore të renderuara : ${Object.keys(notebooks).length}`);
  console.log(`  Asete të nxjerra      : ${assets.size} (${(assetBytes / 1024 / 1024).toFixed(1)} MB)`);
  console.log(`  Laboratorë publikë    : ${published.length} / ${normLabs.length}`);
  console.log(`  Detyra të pavarura    : ${homework.length}`);
  console.log(`  Vizualizues           : ${visualizers.length}`);
  if (problems.length) {
    console.log('\n  ⚠ Vërejtje:');
    for (const p of problems) console.log(`    · ${p}`);
  }
  console.log('');
}

/**
 * Resolve { from, to } section ids into a cell index range.
 * `to` is exclusive. Supports multiple ranges via `ranges: [[from,to], ...]`.
 * Used only where one notebook serves two laboratories (see ANALYSIS.md C-2).
 */
function resolveSlice(nb, spec, label) {
  const ranges = spec.ranges || [[spec.from ?? null, spec.to ?? null]];
  const idxOf = (id) => {
    if (id == null) return null;
    const i = nb.cells.findIndex((c) => c.type === 'markdown' && c.id === id);
    if (i === -1) warn(`${label}: ankora "${id}" nuk u gjet në ${nb.file}.`);
    return i === -1 ? null : i;
  };
  return ranges.map(([from, to]) => ({ from: idxOf(from), to: idxOf(to) }));
}

await main();
