/**
 * Copies plotly.js into the built site.
 *
 * Self-hosted rather than loaded from a CDN: no third-party request from a
 * student's browser, and the site keeps working if a CDN is blocked or down.
 * It is fetched lazily by <plotly-figure>, so pages without a chart never
 * download it.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const dest = path.resolve('dist/vendor');

try {
  const src = require.resolve('plotly.js-dist-min');
  await fs.mkdir(dest, { recursive: true });
  await fs.copyFile(src, path.join(dest, 'plotly.min.js'));
  const { size } = await fs.stat(path.join(dest, 'plotly.min.js'));
  console.log(`  plotly.js -> dist/vendor/plotly.min.js (${(size / 1024 / 1024).toFixed(1)} MB, ngarkohet vetëm sipas nevojës)`);
} catch (err) {
  console.warn('  ⚠ plotly.js nuk u gjet — grafikët Plotly do të shfaqin një mesazh në vend të tyre.');
  console.warn('    Rregullimi:  npm install plotly.js-dist-min');
}
