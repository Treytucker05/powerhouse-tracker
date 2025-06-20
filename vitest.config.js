import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
<<<<<<< HEAD
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    include: ['tests/unit/**/*.{js,jsx}']   // ✅ only run unit tests
  },
  coverage: {
    provider: 'v8',
    reporter: ['text','lcov'],
    lines: 80,
    branches: 80,
    functions: 80,
    statements: 80
=======
    environment: 'node',
    include: ['tests/unit/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['lib/**/*.js'],
      exclude: ['lib/state/**', 'lib/rirProgression.js'],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80
      }
    }
>>>>>>> c606eb178f10f5b8e7f4be18e601d4f1ee451685
  }
});
