import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [sveltekit()],
  css: {
    postcss: {
      plugins: [tailwindcss]
    }
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
