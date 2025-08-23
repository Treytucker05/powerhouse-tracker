# 5/3/1 Program Design Tool — Information Architecture & Layout Plan

> Source of truth for pages, routes, and high-level UI layout choices.  
> Design constraints: React + TypeScript + Tailwind, dark theme `#1a1a2e`, accent `#ef4444`, mobile responsive.

---

## 1) Sitemap (Routes)

### Hub
- **/hub** — Home dashboard/entry to builder

### Builder (Wizard)
- **/build/step1** — Fundamentals (TMs, units, core lifts, days/week)
- **/build/step2** — Template & Scheme (CSV-driven Templates, Compare Mode, Details, Selection Summary)
- **/build/step3** — Customize (Assistance, Warm-up, Supplemental, Conditioning) — *CSV-driven*
- **/build/step4** — Preview (week-by-week plan; export)
- **/build/step5** — Progression (Leader/Anchor cycles, 7th Week, TM changes, deload)

### Libraries (Reference, all CSV-driven)
- **/library/templates** — Browse templates (same CSV as Step 2, list/table view)
- **/library/assistance** — Assistance catalog (Push/Pull/Single-leg/Core)
- **/library/warmups** — Warm-up protocols
- **/library/supplemental** — FSL/SSL/BBB/BBS/SST definitions
- **/library/conditioning** — Easy/Hard/Vest/Drags/Carries
- **/library/special-rules** — TM, 7th Week, Leader/Anchor rules

### Tools
- **/tools/tm-calculator** — Enter 1RM/e1RM → TM (85–90%)
- **/tools/percent-table** — 5/3/1 % breakdown table
- **/tools/set-rep-calculator** — Quick set/rep planner

### Data & Dev
- **/data/status** — CSV sync status + last copy timestamps
- **/data/viewer/:pack** — CSV quick viewer (templates, assistance, etc.)

---

## 2) Where Assistance Exercises Will Show

- **Primary**: **/build/step3** — main selection surface. Users choose Assistance by category (Push/Pull/Single-leg/Core), using filters from `assistance_exercises.csv` (equipment, difficulty bands).
- **Secondary**: **/library/assistance** — full catalog exploration (searchable/filterable list).
- **Contextual**: **/build/step2** details panel shows a *summary string* of assistance expectations for the chosen template (e.g., “25–50 reps each: Push/Pull/Core”).

---

## 3) Step-by-Step Pages — Responsibilities & Data

### Step 1 — Fundamentals
- Inputs: Training Maxes (OHP/Bench/Squat/Deadlift), Units, Days/Week.
- Actions: Save local/session state.
- Data: none (reference only).

### Step 2 — Template & Scheme
- Data: `templates_master.csv`.
- UI: 
  - Left: grid of cards (CSV-driven).
  - Header actions: Search, Filters (difficulty/focus), **Compare Templates** toggle.
  - Right: Details panel (Main Work, Supplemental, Assistance, Conditioning, Notes) from CSV.
  - Bottom: Selection Summary (CSV-backed).
- Compare Mode: Table with columns (Template | Main Work | Supplemental | Assistance | Conditioning | Notes), fed by CSV.

### Step 3 — Customize
- Data: `assistance_exercises.csv`, `warmup_protocols.csv`, `supplemental_work.csv`, `conditioning.csv`, `special_rules.csv`.
- UI layout:
  - **Left column**: Assistance selector (tabs or accordion for Push/Pull/Single-leg/Core); filters for Equipment/Beginner–Advanced.
  - **Middle column**: Supplemental picker (FSL/SSL/BBB/BBS/SST), Warm-up picker, Conditioning picker.
  - **Right column (sticky)**: Live Summary (assistance counts, chosen warm-up, supplemental, conditioning).
- Output: normalized selections stored in program state.

### Step 4 — Preview
- Data: All selections + templates + supplemental selections.
- UI: Week-by-week plan; print/export (CSV/PDF).

### Step 5 — Progression
- Data: `special_rules.csv` (Leader/Anchor cadence, 7th Week options).
- UI: Cycle planner (2 Leaders → 7th Week → Anchor), TM change options, deload scheduling.

### Libraries
- Tables/lists, CSV-backed. 
- Shared components with builder to avoid duplication.

---

## 4) Shared Components (to centralize)

- **Data**
  - `loadCsv(path)` — PapaParse wrapper (already exists)
  - `PacksContext` — provides loaded packs app-wide (optional optimization)
- **UI**
  - `TemplateCard`, `TemplateComparisonTable`, `SelectionSummary`
  - `AssistanceList`, `AssistanceFilters`, `WarmupPicker`, `SupplementalPicker`, `ConditioningPicker`
  - `StickySummaryPanel`, `EmptyState`, `ErrorState`, `LoadingState`

---

## 5) Data Flow (CSV → UI)

1. CSV sources live at `data/extraction/*.csv`
2. `npm run dev/build` runs `copy:csv` → copies into `public/methodology/extraction/`
3. UI loads via `loadCsv(\`${import.meta.env.BASE_URL}methodology/extraction/<file>.csv\`)`
4. Pages/components render data-driven UI
5. Optional: `PacksContext` preloads all CSVs once

---

## 6) Minimal Redesign Guidelines

- **Visual**: Keep current dark theme; elevate density with clear section headers and sticky summaries.
- **Behavioral**: “Data drives UI” — no hardcoded template/assistance lists.
- **Resilience**: Always show Loading/Empty/Error placeholders.
- **Mobile**: Stacked columns (Summary collapses to a bottom drawer).

---

## 7) Implementation Order (small steps)

1. **Lock Step 2** (done): cards, compare, details, summary → CSV-backed ✅
2. **Wire Step 3**: load all four packs; show debug blocks; then replace assistance UI with CSV list + filters.
3. **Add /library pages**: lightweight tables reusing the same CSVs.
4. **Preview & Progression**: consume chosen data; render plan.
5. **Polish**: sticky summary, empty/error states, keyboard shortcuts.

---

## 8) Open Questions (to track)

- Do we want Difficulty/Focus columns added to CSV? (Currently defaulting to “All/General”.)
- Do we persist selections locally only (no Supabase), or keep state sync?
- Export formats: CSV, PDF, and JSON?

---
