import { defineConfig } from 'astro/config';

// Change `site` (and `base`, if the repo is not a user/organisation page)
// when you deploy. See docs/UDHEZUES.md.
export default defineConfig({
  site: process.env.SITE_URL || 'https://example.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  devToolbar: { enabled: false },
});
