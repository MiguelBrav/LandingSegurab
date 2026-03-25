import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  // Vite 8 uses Rolldown as the default bundler and LightningCSS by default.
  // Low-level optimizations like CSS minification and JS transformation
  // are handled by Oxc and LightningCSS for maximum performance.
  build: {
    // Vite 8 default is already high performance, but highlighting some options:
    cssMinify: 'lightningcss',
    minify: 'oxc',
  },
  server: {
    open: true,
  },
});
