## Testing & Coverage
- Run: `pnpm clean && pnpm vitest --coverage`
- Coverage is whitelisted (see `vitest.config.*`). To graduate a file:
  1) Add/extend tests
  2) Add glob to `coverage.include`
  3) Ensure thresholds still pass

