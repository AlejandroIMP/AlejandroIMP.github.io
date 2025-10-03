// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://alejandroimp.github.io', // Cambia esto por tu nombre de usuario de GitHub
  
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  // Modo estático para GitHub Pages
  output: 'static',
  
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },
});