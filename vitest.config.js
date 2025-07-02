import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
