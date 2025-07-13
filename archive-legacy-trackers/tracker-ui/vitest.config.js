import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    reporters: ['verbose', 'json'],
    silent: false,
    globals: true,
    testTimeout: 10000, // 10 second timeout per test
    hookTimeout: 5000, // 5 second timeout for setup/teardown
    teardownTimeout: 5000,
    exclude: [
      '**/node_modules/**',
      '**/e2e/**',
      '**/playwright/**',
      '**/cypress/**',
      '**/*.e2e.*',
      '**/*.playwright.*',
      '**/*.spec.ts',
      '**/*.spec.js'
    ],
    // Add bail to stop on first failure for faster debugging
    bail: 1,
    // Show which tests are running
    logHeapUsage: true,
    // Enable better error reporting
    printConsoleTrace: true
  }
})
