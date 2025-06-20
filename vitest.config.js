import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",

    // ✅ keep tests fast – only cover source we own
    coverage: {
      enabled: true,
      provider: "istanbul",               // lighter than v8
      reporter: ["text", "html"],
      include: ["lib/**/*.js", "tracker-ui/src/**/*.{js,jsx}"],
      exclude: [
        "**/dist/**",
        "**/docs/**",
        "**/node_modules/**",
        "tracker-ui/src/tests/**"
      ],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    }
  }
});
