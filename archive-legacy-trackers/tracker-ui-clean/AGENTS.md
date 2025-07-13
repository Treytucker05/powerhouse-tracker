# AGENTS Guidelines

## Project Structure
- `js/` contains ES modules for UI, algorithms, and core state
- `js/ui/globals.js` exposes browser globals for legacy code
- Entry point is `main.js` (legacy) and `index.js` (Node.js exports), bundler is Vite
- React UI components in `tracker-ui/` subdirectory

## Running Tests
- Install dependencies with `pnpm install`
- Run `pnpm run test:unit` to execute Vitest test suite with coverage
- Run `pnpm run test:e2e` to execute Playwright end-to-end tests
- Run `pnpm run verify` to build, test, and lint in one command

## Button Handler Mapping
Handlers live in `js/ui/globals.js` and `js/ui/additionalHandlers.js`. Buttons follow the `btnActionName` naming convention. Event delegation in `js/app.js` maps button IDs to these handlers.

## RP Methodology
- Uses Renaissance Periodization (RP) volume landmarks (MV/MEV/MAV/MRV)
- Auto–progression adjusts sets week to week based on feedback
- Deloads triggered when MRV breached or fatigue accumulates

## Code Style
- ES6 modules with named exports
- Use semicolons and double quotes
- Prefer functional helpers over large classes
