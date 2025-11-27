# Contributing

Focused quality gate with incremental coverage expansion.

## Workflow
1. Branch from `main` or appropriate feature branch.
2. Implement changes with tests (prefer small, deterministic units).
3. Run local checks:
   ```bash
   npm run lint    # if configured
   npm test        # fast feedback
   npm run test:cov
   ```
4. If adding tests for a legacy file, consider *graduating* it:
   - Add to `coverage.include` in `vitest.config.js`.
   - Remove broad exclusion (add `!` pattern) if necessary.
   - Ensure gate still passes (statements>=80, branches>=70, functions>=75, lines>=80).
5. Commit with conventional style (e.g., `test:`, `feat:`, `refactor:`).
6. Open PR; CI must be green.

## Supabase Testing
- Import the Supabase client from `@/lib/supabaseClient` (unified TypeScript source).
- Extend the central mock there only.

## React Testing Warnings
Eliminate `act()` warnings before requesting review. Wrap stateful updates:
```js
await act(async () => {
  logSet({ exercise: 'squat', reps: 5, weight: 200 });
});
```

## Adding Coverage for a Module
1. Add/extend tests covering happy path + at least one failure/edge branch.
2. Add file to `coverage.include`.
3. Run `npm run test:cov` and ensure thresholds pass.
4. Document graduation in `README_testing.md` if notable.

## Pre-Push Quick Command
```bash
npm run test:cov
```

Keep changes tight and purposeful. Expand coverage surface gradually to maintain fast feedback.

### Pre-push checks
```
pnpm clean && pnpm vitest --coverage
# Ensure green suite + thresholds. If adding files, graduate them into coverage incrementally.
```
