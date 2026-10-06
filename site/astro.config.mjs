import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Change `site` (and `base`, if the repo is not a user/organisation page)
// when you deploy. See docs/UDHEZUES.md.
export default defineConfig({
  site: process.env.SITE_URL || 'https://example.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  build: { format: 'directory', assets: 'assets' },
  compressHTML: true,
  devToolbar: { enabled: false },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
