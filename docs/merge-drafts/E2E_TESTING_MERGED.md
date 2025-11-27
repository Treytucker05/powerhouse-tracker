# Unified E2E + Coverage Guide (Draft)

This draft consolidates testing info from tracker-ui-good/tracker-ui/E2E_TESTING.md and tracker-ui-good/tracker-ui/README_testing.md.

## What’s covered
- Playwright E2E setup and CI integration
- Local run instructions (preview server + tests)
- Unit tests and coverage expectations

## E2E (Playwright)
- Config: tracker-ui-good/tracker-ui/playwright.config.js
- CI: .github/workflows/ci.yml installs browsers, builds, runs tests, uploads reports
- Smoke suite: e2e/smoke.spec.js exercises nav and core UI

Run locally (from tracker-ui-good/tracker-ui):
- npm run build
- npm run preview -- --port 5173
- npm run test:e2e

## Unit tests & coverage
- Run: npm run test or npm run test:coverage
- Coverage gating: see vitest config; graduate files by adding to include and meeting thresholds

## Next
- After validation, archive README_testing.md and reference this doc from app README.
