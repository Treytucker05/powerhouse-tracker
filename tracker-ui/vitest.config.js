import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    reporters: 'dot',
    silent: true,
    globals: true,
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
