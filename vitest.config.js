import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',       // mock browser APIs
    setupFiles: './vitest.setup.js',
    reporters: 'dot', // tiny one-line summary per run
    silent: true,     // suppress passing-test output
    globals: true,    // enable describe, test, expect globals
    exclude: [
      '**/node_modules/**',
      '**/e2e/**',
      '**/playwright/**',
      '**/cypress/**',
      '**/*.e2e.*',
      '**/*.playwright.*',
      '**/*.spec.ts',
      '**/*.spec.js'
    ]
  }
})
