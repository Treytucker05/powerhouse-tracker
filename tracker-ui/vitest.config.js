import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    include: ['tests/unit/**/*.{js,jsx}']
  },
  coverage: {
    provider: 'v8',
    reporter: ['text', 'lcov'],
    lines: 80,
    branches: 80,
    functions: 80,
    statements: 80
  }
});
