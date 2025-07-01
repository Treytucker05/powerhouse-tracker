import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // globalSetup: "./playwright.global-setup.js",
  /* Only run e2e specs, ignore unit *.test.js */
  testMatch: ["**/tracker-ui/e2e/*.spec.{js,ts}"],
  testDir: "./",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  
  // ✅ Launch the React Vite dev server from tracker-ui
  webServer: {
    command: "pnpm --filter tracker-ui dev",
    cwd: "./tracker-ui",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
