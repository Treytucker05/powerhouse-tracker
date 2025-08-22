# Extraction Workflow Guide

1. Source of truth: `scripts/extraction.config.json`.
2. Configure all extraction settings only in that JSON file.
3. Outputs are written to `data/extraction/*.xlsx`.
4. CSV artifacts are written to `public/methodology/extraction/*.csv`.
5. Do not hand-edit any generated Excel or CSV files.
6. Regenerate instead by running the build command.
7. To run: `npm run extract:build`.
8. Make sure necessary deps (ts-node, etc.) are installed in the root.
9. Commit the config and generated artifacts as needed.
10. Keep this guide alongside repo docs for quick reference.
