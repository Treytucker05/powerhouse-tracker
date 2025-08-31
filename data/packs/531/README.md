# 5/3/1 Packs (composable program blocks)

This folder contains small, chainable "packs" that reference one or more templates inside a single 5/3/1 program JSON. Packs make it easy to assemble multi-week cycles from accurate book-derived templates without duplicating program data.

- Format: JSON with `{ kind: "pack", program: "531", sourceProgramFile, sequence: [{ templateId }] }`
- Source program: `sourceProgramFile` should be a file in `data/programs/531/`
- Discoverability: generated index at `data/packs/531/_index.json` via `npm run index:531:packs`

## included packs

- bbb-challenge-6wk.json
  - Title: BBB Challenge (6 weeks)
  - Source: `beyond-2013.json`
  - Sequence: `bbb-challenge-50-2wk` → `bbb-challenge-60-2wk` → `bbb-challenge-70-2wk`
  - Notes: Matches the book’s 6-week progression (50/50 → 60/60 → 70/70). All three templates use the same 4-day BBB schedule.

- svr-3wk.json
  - Title: SVR (3 weeks)
  - Source: `beyond-2013.json`
  - Sequence: `svr-4d` (contains Week 1 3x3+ @ ~90% TM, Week 2 5x5 @ ~80% TM, Week 3 5/3/1 + singles)
  - Notes: Repeatable wave; consider a deload or 7th-week protocol after one or two waves.

## usage

- Build the pack index (for UI or tooling to list packs):
  - `npm run index:531:packs`
- To run a pack in the app, load its `sourceProgramFile`, then execute each `templateId` in `sequence` in order.
- Packs are read-only orchestration; validation of program JSON remains under `npm run validate:531`.

## training max & guardrails

- BBB Challenge (Beyond 5/3/1)
  - Supplemental: 5x10 at 50% → 60% → 70% of TM across the six weeks.
  - Keep TM conservative so main + BBB volumes are sustainable. Consider staying closer to 85–90% of 1RM when in doubt.

- SVR (Beyond 5/3/1)
  - Week 1: three AMRAP triples around 90% TM (leave a rep in reserve as needed).
  - Week 2: 5x5 around the second-set load (~80% TM).
  - Week 3: 5/3/1 with 1–3 heavy singles after the top set; keep bar speed.
  - Insert a deload or 7th week test after the wave as appropriate.

## accuracy & provenance

- All templates and sequences are derived from the named books and pages in `data/programs/531/beyond-2013.json`.
- Packs only reference existing `templateId`s; adjust packs if template IDs change in the source program file.
