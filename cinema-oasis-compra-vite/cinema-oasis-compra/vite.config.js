import { defineConfig } from 'vite';

// base './' hace que la web funcione en cualquier hosting
// (Netlify, Vercel, GitHub Pages, cPanel) y en cualquier carpeta.
export default defineConfig({
  base: './',
  build: { outDir: 'dist', assetsDir: 'assets' }
});
