# 5/3/1 Program Design Tool — Master Build Plan

> **Purpose:** A single reference for how we’re building the app end-to-end: pages, data flow, UI layout, and the step-by-step implementation order.
> **Stack:** React (Vite) + TypeScript + Tailwind. Dark theme `#1a1a2e`, accent `#ef4444`, mobile-responsive.
> **Design principle:** “Data drives UI.” No hardcoded template/assistance lists.

---

## 0) Current Snapshot (baseline)

* **CSV pipeline** works:

  * Source CSVs in `data/extraction/`.
  * `npm run dev` / `npm run build` runs `copy:csv` → copies into `public/methodology/extraction/`.
  * UI loads with `loadCsv(${import.meta.env.BASE_URL}methodology/extraction/<file>.csv)`.
* **Step 2 (Template & Scheme)** is CSV-driven.
* **Step 3 (Customize)** has CSV loader in place (assistance debug list).
* **Libraries/routes scaffolded** (e.g., `/library/templates` table exists).
* **Supabase** not required for CSVs.

---

## 1) Information Architecture (routes)

**Wizard (primary flow)**

* /build/step1 — Fundamentals
* /build/step2 — Template & Scheme
* /build/step3 — Customize
* /build/step4 — Preview
* /build/step5 — Progression

**Libraries (read-only CSV browsers)**

* /library/templates
* /library/assistance
* /library/warmups
* /library/supplemental
* /library/conditioning
* /library/special-rules

**Calendar**

* /calendar — Daily, Weekly, Monthly, Yearly tabs

**Tools**

* /tools/tm-calculator
* /tools/percent-table
* /tools/set-rep-calculator

**Dev/Debug**

* /data/status
* /data/viewer/\:pack

---

## 2) Data Packs (CSV → UI)

CSV files:

* templates_master.csv
* assistance_exercises.csv
* warmup_protocols.csv
* supplemental_work.csv
* conditioning.csv
* special_rules.csv

Load pattern:

1. Source in `data/extraction/`
2. Copied to `public/methodology/extraction/`
3. Parsed via `loadCsv()`

---

## 3) Wizard Redesign (UI)

**Step 1** — Fundamentals

* TMs, units, days/week; tooltips for clarity.

**Step 2** — Template & Scheme

* CSV cards, filters, details, compare table, selection summary.
* Nav pill link: 📚 Templates Library.

**Step 3** — Customize (split into tabs)

* Tab 1: Assistance (Push/Pull/Core/Single-Leg, filters)
* Tab 2: Supplemental (FSL/SSL/BBB/BBS/SST)
* Tab 3: Warm-up & Conditioning
* Right sticky summary panel.

**Step 4** — Preview

* Week-by-week plan.
* Toggle: Simple vs Full view.
* Export CSV/PDF.

**Step 5** — Progression

* Timeline view (Leader → Leader → 7th Week → Anchor).
* TM progression options.

---

## 4) Calendar Feature

* Daily → edit one workout.
* Weekly → drag/drop sessions.
* Monthly → training/off day grid.
* Yearly → block colors for Leader/Anchor/Deload.

---

## 5) State Model

```ts
programData = {
  trainingMaxes: { ohp, bench, squat, deadlift },
  units: "lbs" | "kg",
  frequency: number,
  templateId: string,
  supplemental: string,
  assistance: { push: string[], pull: string[], core: string[], singleLeg: string[] },
  warmup: string,
  conditioning: { hard?: string; easy?: string; notes?: string },
  cycles: number,
  progression: string,
  calendar: WorkoutEvent[],
}
```

---

## 6) Implementation Order

**Phase A — Libraries**

1. /library/assistance
2. /library/warmups
3. /library/supplemental
4. /library/conditioning
5. /library/special-rules

**Phase B — Step 3 redesign**
6. Add tabs + sticky summary
7. Wire Assistance tab
8. Wire Supplemental tab
9. Wire Warm-up & Conditioning tab

**Phase C — Preview & Calendar**
10. Preview toggle (Simple/Full)
11. Save to Calendar → Monthly view
12. Add Weekly/Daily
13. Add Yearly

**Phase D — Polish**
14. Add nav pills under step bar
15. Silence Supabase 404s
16. Add Empty/Loading/Error states
17. Export buttons

---

## 7) Acceptance Criteria

* Step 2 pulls from CSVs fully.
* Libraries render CSVs with search + tables.
* Step 3 tabs functional with sticky summary.
* Preview outputs week-by-week plan.
* Calendar saves workouts, shows in multiple views.
* No CSV 404s in console.

---

**End of Plan**

---
