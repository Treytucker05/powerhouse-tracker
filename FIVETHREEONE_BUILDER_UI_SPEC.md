# 5/3/1 Builder – UI-First Specification

Saved: 2025-08-19
Source: Conversation gameplan (locked for reference). Adjust via new PRs; do not silently overwrite.

> Goal: lock **page structure, components, and interactions** before wiring engines. Keep IDs stable for tests. Avoid back-end coupling.

---
## Global UI Rules
- **Units**: `lb|kg`; microplates toggle affects rounding increment.
- **Rounding**: lb 5 (→2.5 if microplates), kg 2.5 (→1.0 if microplates).
- **TM% options**: 0.90 default, 0.85 conservative.
- **Stable lift order**: Press, Deadlift, Bench, Squat.
- **Primary actions**: Back / Next; persistent side rail summary.
- **A11y**: All inputs labeled; keyboard nav; ARIA live regions for TM table updates.
- **Test IDs**: Use `data-testid` noted per component.

---
## Step 1 — Fundamentals (Training Max Input)
**Route:** `/build/step1`

### Layout
- **Header**: Title + helper copy.
- **Main grid** (12 cols):
  - **Left (col-span-8)**: Input controls & lift cards.
  - **Right (col-span-4)**: Live TM table + meta settings.
- **Footer**: Back / Next, validation hint.

### Components
1. **UnitsBar** (`units`, `convertOnUnitChange`)
   - Toggle: `lb|kg`
   - Subtoggle: checkbox “Convert existing values when switching units”.
   - `data-testid="units-bar"`
2. **TMPercentSelect** (`value:0.85|0.90`)
   - Radio group 85% / 90%.
   - `data-testid="tm-pct"`
3. **RoundingPanel** (`microplates:boolean`, `roundingIncr:number`)
   - Checkbox: Microplates.
   - Readonly text: Current increment (lb or kg).
   - `data-testid="rounding-panel"`
4. **LiftCard** ×4 (`liftId`, `mode`, `inputs`, callbacks)
   - Tabs: **Tested 1RM**, **Rep Calc**, **Manual TM**.
   - Fields per tab:
     - 1RM: number.
     - Rep Calc: `weight`, `reps` (RPE-free).
     - Manual TM: number.
   - Soft validation banner for out-of-range.
   - `data-testid="lift-card-{liftId}"`
5. **TMTable** (read-only)
   - Rows: Press, Deadlift, Bench, Squat → TM (rounded), raw TM (tooltip).
   - Microcopy: “Wendler default: 90% TM. Conservative: 85%. Weights rounded to nearest increment.”
   - Live region updates on change.
   - `data-testid="tm-table"`

### Interactions
- Any input change updates local state and re-renders TM table. 200ms debounce for text.
- “Next” disabled until **all TMs > 0**.

### I/O Contract
- **Saves on Next:** `{ step1, tmTable, meta:{ units, rounding, tmPct, microplates } }`
- **No engine math in UI** (TMTable values are props/derived only when wired).

### Edge & A11y
- Unit switch: option to convert or keep-as-typed.
- Keyboard shortcut: `Ctrl+Enter` → Next.
- Error text announced via ARIA live.

---
## Step 2 — Template & Core Scheme
**Route:** `/build/step2`

### Layout
- **Header**: Title + short explainer.
- **Two card grids**: Templates (top), Schemes (bottom).
- **Side rail**: Current selections + AMRAP policy badges.
- **Footer**: Back / Next.

### Components
1. **TemplateCard** (id, title, tags, time, difficulty, default assistance, deload policy, why-this)
   - IDs: `bbb`, `triumvirate`, `periodization_bible`, `bodyweight`, `jackshit`.
   - Badge area: Deload ON/OFF by default.
   - `data-testid="template-{id}"`
2. **SchemeCard** (id, title, amrapPolicy)
   - IDs: `scheme_531`, `scheme_351`, `scheme_5spro`.
   - AMRAP badges: `on|off` (5s Pro = off, Deload = off).
   - `data-testid="scheme-{id}"`
3. **SelectionSummary**
   - Shows `{templateId, schemeId}` and AMRAP state from packs logic.
   - `data-testid="selection-summary"`

### Interactions
- Selecting a Template highlights it and locks its default knobs (shown in Step 3 unless “Unlock to customize”).
- Selecting a Scheme highlights it; shows AMRAP badge behavior.

### I/O Contract
- **Persists:** `{ templateId, schemeId }` to draft.
- **No mutation of engine** here.

### Acceptance
- Stable IDs render; AMRAP policy correctly displayed.

---
## Step 3 — Customize Design
**Route:** `/build/step3`

### Layout
- **Header** with “Use Template Defaults / Unlock to Customize” toggle.
- **Accordion sections**:
  1. Schedule
  2. Warm-ups
  3. Programming Approach
  4. Deload Policy
  5. Supplemental
  6. Assistance
  7. Conditioning
- **Side rail**: Live summary.
- **Footer**: Back / Next.

### Components & Fields
1. **ScheduleEditor**
   - Frequency: 2/3/4-day radio.
   - Drag & drop lift order (DnD list).
   - TestID: `schedule-editor`.
2. **WarmupChooser**
   - Toggle ON/OFF.
   - Scheme select: `standard|minimalist|jumps_integrated`.
   - TestID: `warmup-chooser`.
3. **ApproachCards**
   - Cards: Classic 5/3/1, 3/5/1, 5s Pro, Leader/Anchor, Competition Prep.
   - TestID: `approach-{id}`.
4. **DeloadToggle**
   - ON/OFF; defaults from template.
   - TestID: `deload-toggle`.
5. **SupplementalPicker**
   - Options: FSL, SSL, BBB, BBS, Widowmakers, etc.
   - Per-lift toggles if applicable.
   - TestID: `supplemental-picker`.
6. **AssistancePicker**
   - Modes: Minimal (25–50), Balanced (50–100), Template-based (Triumvirate/PB/Bodyweight), Custom.
   - If Custom: exercise catalog with filters (Push, Pull, SL/Core; equipment).
   - TestID: `assistance-picker`.
7. **ConditioningPlanner**
   - Intensity plan: Minimal / Standard / Extensive.
   - Activities list with examples: prowler, hills, jumps/throws, walking, circuits.
   - Weekly target chips: `2–3 hard`, `2–3 easy`.
   - TestID: `conditioning-planner`.

### Interactions
- If “Use Template Defaults” is ON, sections show read-only defaults with an “Unlock to customize” switch.

### I/O Contract
- **On Next**: persist consolidated design object (schedule, warmups, approach, deload, supplemental, assistance, conditioning) without engine computation.

---
## Step 4 — Review & Export (Cycle Preview)
**Route:** `/build/step4`

### Layout
- **Header** with template + scheme chips and AMRAP status.
- **Week Tabs**: W1, W2, W3, W4 (Deload/Skipped).
- **Day Cards** within each week.
- **Side rail**: TMs, rounding/unit summary, deload policy, conditioning targets.
- **Footer**: Back / Print / Export JSON / Start Program.

### Components
1. **WeekTabs** (`W1..W4`)
2. **DayCard**
   - **WarmupTable** (if ON).
   - **MainSetsTable** (shows % of TM and AMRAP flag per set; AMRAP hidden for 5s Pro; Deload 40/50/60 no AMRAP).
   - **SupplementalPanel** (e.g., BBB 5×10 @ %TM; pairing).
   - **AssistanceList** (with target volume).
   - **ConditioningPlan** (day-level note or rest).
3. **JSONExportModal** (pretty JSON snapshot of program)
   - `data-testid="export-json"`

### Acceptance
- Numbers and flags are placeholders until engine wiring; layout must accommodate notes, badges, and pairings.

---
## Step 5 — Progression (End of Cycle)
**Route:** `/build/step5`

### Layout
- **Header**: Cycle rollover.
- **Grid**: 4 cards (Press, DL, Bench, Squat).
- **Footer**: Back / Apply / Start Next Cycle.

### Components
1. **ProgressionCard**
   - Shows Current TM → Increment (dropdown: Standard / Conservative) → Next TM (preview).
   - Notes: Leader/Anchor and 7th-week flags (read-only unless template requires).
   - `data-testid="progression-{liftId}"`

### I/O Contract
- **Apply** persists updated TMs; records chosen progression rule.

---
## Tracking Mode — Active Program
**Route:** `/program/active`

### Layout
- **Header**: Program name, cycle #.
- **Tabs**: Week 1–4.
- **Left**: Day view; **Right**: Side rail.
- **Footer**: Log Today / Advance Day / Progress TMs / Edit Program / Clear Program.

### Components
1. **DayView**
   - **Warmups** (if ON).
   - **MainSetsLogger** (weights × reps; AMRAP field where applicable).
   - **SupplementalLogger**.
   - **AssistanceChecklist** with volume meter.
   - **ConditioningLogger** (distance/time/sets).
2. **RecoveryExtras** (optional)
   - RPE/fatigue, sleep, notes.
3. **SideRail**
   - Current cycle, TMs, next progression rule.

---
## Hub — Dashboard
**Route:** `/hub`

### Layout
- **Hero**: Today’s Workout CTA.
- **Cards**: Active Program Summary, Templates Gallery, History, Learn 5/3/1.

### Components
1. **TodaysWorkoutCard** (deep-link into Tracking Mode).
2. **ActiveProgramSummary** (template, cycle, TMs).
3. **TemplatesGallery** (start new).
4. **HistoryList** (past cycles).
5. **LearnPanel** (links to research content).

---
## Test IDs (global minimal set)
`units-bar`, `tm-pct`, `rounding-panel`, `lift-card-{press|deadlift|bench|squat}`, `tm-table`
`template-{id}`, `scheme-{id}`, `selection-summary`
`schedule-editor`, `warmup-chooser`, `approach-{id}`, `deload-toggle`, `supplemental-picker`, `assistance-picker`, `conditioning-planner`
`export-json`
`progression-{liftId}`

---
## Definition of Done (UI-first)
- All pages render with **placeholder data** matching structure above.
- Navigable Back/Next across Step 1–5.
- Side rails present on Steps 1, 3, 4.
- Test IDs present and unique.
- No engine imports required to review UX.
