/**
 * Makes `npm run dev` behave like the built site.
 *
 * Two things normally exist only after `npm run build`:
 *   - the Pagefind search index (dist/pagefind), and
 *   - plotly.min.js (copied to dist/vendor by scripts/vendor.mjs).
 * During `astro dev` this integration serves Plotly straight from
 * node_modules and builds the search index in memory from the pages the dev
 * server renders, so ⌘K search and notebook charts work without a build.
 * The index is built once at startup; after edits under src/ it is rebuilt
 * the next time search is opened. Nothing is written to disk and production
 * builds are unaffected.
 *
 * After editing this file, restart `npm run dev`: Astro reloads the config
 * when it changes, but not the modules the config imports.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);

const TYPES = { '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' };
// What a page fetches first when search opens; a stale index is rebuilt before serving these.
const ENTRY = new Set(['pagefind.js', 'pagefind-entry.json']);

export default function devExtras() {
  let base = '/';
  let srcDir = '';
  let origin = '';
  let logger;
  // Index files by path inside /pagefind/. The previous build is kept as well, so a
  // browser that loaded the old pagefind-entry.json can still fetch its chunks.
  let current = null;
  let previous = new Map();
  let building = null;
  let stale = true;
  let http = null; // the dev server's HTTP server (a config change restarts it in place)

  async function crawl() {
    const start = new URL(base, origin).href;
    const seen = new Set([start]);
    const queue = [start];
    const pages = [];
    while (queue.length) {
      await Promise.all(
        queue.splice(0, 4).map(async (href) => {
          const res = await fetch(href, { headers: { accept: 'text/html' } });
          if (!res.ok || !res.headers.get('content-type')?.includes('text/html')) return;
          const html = await res.text();
          pages.push({ url: '/' + new URL(href).pathname.slice(base.length), html });
          // Pages use trailing slashes; links without one are downloads (.ipynb, .py, …).
          for (const [, link] of html.matchAll(/href="([^"#?]+)/g)) {
            const u = new URL(link, href);
            if (u.origin !== origin || !u.pathname.startsWith(base) || !u.pathname.endsWith('/') || seen.has(u.href)) continue;
            seen.add(u.href);
            queue.push(u.href);
          }
        }),
      );
    }
    return pages;
  }

  async function buildIndex() {
    const t0 = performance.now();
    const pagefind = await import('pagefind');
    try {
      const pages = await crawl();
      const { index, errors } = await pagefind.createIndex();
      if (!index) throw new Error(errors.join('; '));
      for (const p of pages) await index.addHTMLFile({ url: p.url, content: p.html });
      const out = await index.getFiles();
      await index.deleteIndex();
      if (out.errors.length) throw new Error(out.errors.join('; '));
      previous = current ?? new Map();
      current = new Map(out.files.map((f) => [f.path.replaceAll('\\', '/'), f.content]));
      logger.info(`kërkimi gati: ${pages.length} faqe të indeksuara (${((performance.now() - t0) / 1000).toFixed(1)} s)`);
    } catch (err) {
      // The Pagefind service idles unref'd between builds; restart it only if it failed.
      await pagefind.close();
      throw err;
    }
  }

  function ensureIndex() {
    if (!building && http?.listening && (stale || !current)) {
      const owner = http;
      stale = false;
      building = buildIndex()
        .catch((err) => {
          stale = true;
          // Stay quiet when the server was stopped or restarted mid-build.
          if (owner === http && owner.listening) logger.warn(`indeksi i kërkimit nuk u ndërtua: ${err.message}`);
        })
        .finally(() => {
          building = null;
        });
    }
    return building;
  }

  function send(res, body, file) {
    res.setHeader('Content-Type', TYPES[path.extname(file)] ?? 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.end(body);
  }

  return {
    name: 'kursi:dev-extras',
    hooks: {
      'astro:config:done': ({ config }) => {
        base = config.base.endsWith('/') ? config.base : `${config.base}/`;
        srcDir = fileURLToPath(config.srcDir);
      },
      'astro:server:setup': ({ server, logger: l }) => {
        logger = l;
        // Not astro:server:start: when the config changes Astro restarts the server in
        // place and only this hook runs again, so follow Vite's own HTTP server.
        const httpServer = server.httpServer;
        http = httpServer;
        stale = true;
        httpServer?.once('listening', () => {
          const a = httpServer.address();
          const host = ['::', '0.0.0.0'].includes(a.address) ? 'localhost' : a.family === 'IPv6' ? `[${a.address}]` : a.address;
          origin = `http://${host}:${a.port}`;
          // A build still running against the previous server fails; start fresh after it.
          Promise.resolve(building).then(() => ensureIndex());
        });
        server.watcher.on('all', (_event, file) => {
          if (file.startsWith(srcDir)) stale = true;
        });
        // Astro strips the base path before this runs, so URLs start at the site root.
        server.middlewares.use(async (req, res, next) => {
          const pathname = new URL(req.url, 'http://dev').pathname;
          if (pathname === '/vendor/plotly.min.js') {
            let file;
            try {
              file = require.resolve('plotly.js-dist-min');
            } catch {
              return next();
            }
            res.setHeader('Content-Type', TYPES['.js']);
            return fs.createReadStream(file).on('error', next).pipe(res);
          }
          if (!pathname.startsWith('/pagefind/')) return next();
          const name = pathname.slice('/pagefind/'.length);
          if (!current || (stale && ENTRY.has(name))) await ensureIndex();
          const body = current?.get(name) ?? previous.get(name);
          if (!body) {
            res.statusCode = 404;
            return res.end();
          }
          send(res, body, name);
        });
      },
    },
  };
}
