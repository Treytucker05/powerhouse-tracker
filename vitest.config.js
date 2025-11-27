import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: [
      './vitest.setup.js', // legacy polyfills & helpers
      './tracker-ui-good/tracker-ui/src/test/setup.ts', // global noise filters & supabase mock
    ],
  },
  resolve: {
    alias: {
      // Map project-wide "@" to the tracker-ui-good subproject src so root test runs resolve UI imports
      '@': fileURLToPath(new URL('./tracker-ui-good/tracker-ui/src', import.meta.url)),
      '@packs': fileURLToPath(new URL('./tracker-ui-good/tracker-ui/src/packs', import.meta.url)),
      '@lib': fileURLToPath(new URL('./tracker-ui-good/tracker-ui/src/lib', import.meta.url)),
    },
  },
});
