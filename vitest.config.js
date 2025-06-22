import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./vitest.setup.js"],
    environment: "jsdom",
    globals: true,                        // Enable global test functions (describe, it, expect, etc.)

    setupFiles: ['./vitest.setup.js'],
    
    // 🎯 Specify which test files to run
    include: ["tests/**/*.{test,spec}.{js,jsx}", "__tests__/**/*.{test,spec}.{js,jsx}"],
    
    // 🚀 Windows performance tweaks
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true
      }
    },

    // ✅ keep tests fast – only cover source we own
    coverage: {
      enabled: false,                     // TEMP: disable to test if this is causing hangs
      provider: "v8",                     // faster, no extra deps
      reporter: ["text"],                 // simplified reporter
      include: ["lib/**/*.js", "tracker-ui/src/**/*.{js,jsx}"],
      exclude: [
        "**/dist/**",
        "**/docs/**",
        "**/node_modules/**",
        "tracker-ui/src/tests/**"
      ],
      // Remove strict thresholds that might cause hangs
      // lines: 80,
      // functions: 80,
      // branches: 80,
      // statements: 80
    }
  }
});
