# Dev Notes

## Extraction Builder
- Source of truth: scripts/extraction.config.json
- Build: npm run extract:build (TS) or npm run extract:build:js (JS fallback)
- Shortcut: npm run extract:all (auto-opens Excel + CSVs)
- Double-click: scripts/run-extraction.cmd

## VS Code
- Run task: Build Extraction Sheet (TS/JS)
- Format code: npm run format

## GitHub Actions
- CI ensures extraction is up-to-date on push/PR
- Fails if Excel/CSVs are stale

## Windows Setup
- Double-click scripts/setup-dev.cmd to install deps
