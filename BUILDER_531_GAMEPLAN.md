# 5/3/1 UI-First Builder Gameplan (Updated Aug 19 2025)

## Current Status Snapshot
- Steps Implemented: 1 (Fundamentals), 2 (Template & Scheme), 3 (Customize), 4 (Preview scaffold), 5 (Progression scaffold)
- Persistence: Supabase upsert + hydration for Steps 1–3 (full UI -> remote state) ✅
- Data Centralization: templates, schemes, details, meta consolidated in `src/lib/builder/templates.ts` ✅
- Progress Visualization: `BuilderProgress` integrated across Steps 1–5 ✅
- UX Improvements Delivered:
  - Single method selector per lift (vertical red stack) ✅
  - Blank inputs instead of forced zeros, leading zero auto-clear ✅
  - Rich template detail panel + auto scroll + meta badges ✅
  - Scheme selection feedback (badge, tint, wave descriptor) ✅
  - Template default lock/apply for customization ✅
  - Preview & Progression pages styled + navigation shortcuts ✅

## Gaps / Outstanding Work
| Area   | Gap                                                             | Impact                                |
| ------ | --------------------------------------------------------------- | ------------------------------------- |
| Step 1 | Validation / inline warnings                                    | User clarity on incomplete TM entries |
| Step 1 | Units constants abstraction                                     | Easier future changes (kg/lb logic)   |
| Step 2 | Search / filtering / tagging                                    | Faster template choice at scale       |
| Step 2 | Guard invalid template+scheme combos (future)                   | Prevent inconsistent plans            |
| Step 3 | Assistance custom builder UI                                    | Personalization depth                 |
| Step 3 | Drag & drop schedule / lift ordering                            | Flexible structure                    |
| Step 4 | Real generation engine (percent sets, supplemental, assistance) | Core value: preview accuracy          |
| Step 4 | Export to Active Program                                        | Activation of designed plan           |
| Step 5 | TM increment editor + per lift overrides                        | Progression control                   |
| Step 5 | Leader/Anchor multi-cycle modeling                              | Long-term planning                    |
| Cross  | Shared persistence hook (DRY)                                   | Maintainability & error handling      |
| Cross  | Versioning & migrations for stored state                        | Forward compatibility                 |
| Cross  | Error/loading UI states                                         | UX resilience                         |
| Cross  | Tests (unit, integration)                                       | Reliability & regression safety       |
| Cross  | Accessibility audit (ARIA beyond schemes)                       | Inclusivity/compliance                |
| Cross  | Offline/queue writes                                            | Reliability in spotty connections     |
| Cross  | Design tokens / theming pass                                    | Consistency & future scale            |

## Phase Roadmap
### Phase 1: Persistence & Validation Hardening
1. Implement `usePersistedStepState` hook (debounce, saving/error state, hydrate merge rule).
2. Add schema version to remote records `{ version: 1 }`; only hydrate if local untouched or remote newer.
3. Surface inline validation for Step 1 (highlight lifts missing TM) & disable Next with tooltip.
4. Units constants module; refactor Step 1 references.

### Phase 2: Generation Engine (Preview Accuracy)
1. Define `ProgramDefinition` TypeScript contract.
2. Implement wave set generator (classic 5/3/1, 3/5/1, 5s Pro) using TM table.
3. Map supplemental selection to a set recipe (e.g., BBB 5x10 @ 50–60% TM).
4. Inject generated structure into Step 4 cards (Week 1 initially; then weeks 1–3 + deload).
5. Show AMRAP markers and estimated top set weight.

### Phase 3: Progression & Multi-Cycle
1. TM increment editor (global + per lift override) on Step 5.
2. Leader/Anchor cycle configurator (cycles array with increment schedule).
3. Forecast TM evolution preview (table or sparkline placeholders).

### Phase 4: Advanced Customization
1. Assistance custom builder (select movement categories, auto-balance volume).
2. Drag & drop day order + lift order (persist ordering).
3. Conditioning plan detail editor.

### Phase 5: Export & Activation
1. Define export schema + DB table `programs` (id, user_id, definition, created_at, status).
2. "Export to Active" button (Step 4 or 5) -> write program, redirect to Active view.
3. Basic Active Program view (current week/day, session checklist placeholder).

### Phase 6: Resilience & Polish
1. Loading skeleton & optimistic state merge.
2. Offline queue (localStorage queue -> replay on reconnect).
3. Toast + inline banners for save errors.
4. Accessibility sweep (progress nav, week tabs, buttons roles).
5. Design tokens extraction (color, spacing, typography scale).

### Phase 7: Testing & Docs
1. Unit tests: wave generator, TM rounding, template defaults, progression increments.
2. Integration tests: Step 1 -> Step 4 continuity with mocked Supabase.
3. Snapshot tests for template detail & assistance builder.
4. Documentation updates: architecture, export schema, hook usage.

## Data Contracts (Draft)
```ts
interface ProgramDefinition {
  meta: {
    units: 'lb' | 'kg';
    tmPct: number; // 0.85 | 0.9
    templateId: string;
    schemeId: string;
    supplemental: string; // from step3
    assistanceMode: string;
    conditioningPlan: string;
    version: number;
  };
  weeks: WeekDefinition[];
  progression?: ProgressionPlan; // after Step 5
}
interface WeekDefinition { week: number; days: DayDefinition[]; }
interface DayDefinition {
  day: number;
  main: MainSetBlock;
  supplemental?: SupplementalBlock;
  assistance?: AssistanceBlock[];
  conditioning?: ConditioningBlock | null;
}
interface MainSetBlock { lift: string; sets: SetPrescription[]; }
interface SetPrescription { pct: number; reps: string; amrap?: boolean; estWeight?: number; }
interface SupplementalBlock { scheme: string; sets: SetPrescription[]; }
interface AssistanceBlock { slot: string; movement: string; targetReps?: string; }
interface ConditioningBlock { type: string; duration?: string; intensity?: string; }
interface ProgressionPlan { increments: Record<string, number>; cycles: CyclePlan[]; }
interface CyclePlan { cycle: number; deload: boolean; increments?: Record<string, number>; }
```

## Shared Hook Sketch
```ts
function usePersistedStepState<T>({ step, state, setState, version, debounce=600 }: {
  step: number; state: T; setState: (p: Partial<T>) => void; version: number; debounce?: number;
}) {
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const lastLocalChange = React.useRef<number>(Date.now());

  // mark local edits
  React.useEffect(() => { lastLocalChange.current = Date.now(); }, [state]);

  // persist (debounced)
  React.useEffect(() => {
    const id = setTimeout(async () => {
      try {
        setSaving(true); setError(null);
        const userId = await getCurrentUserId(); if (!userId) return;
        await supabase.from('program_builder_state').upsert({ user_id: userId, step, state, version, updated_at: new Date().toISOString() }, { onConflict: 'user_id,step' });
      } catch (e:any) { setError(e.message || 'Save failed'); }
      finally { setSaving(false); }
    }, debounce);
    return () => clearTimeout(id);
  }, [state, step, version, debounce]);

  // hydrate (once)
  React.useEffect(() => { (async () => {
    const userId = await getCurrentUserId(); if (!userId) return;
    const { data } = await supabase.from('program_builder_state').select('*').eq('user_id', userId).eq('step', step).single();
    if (data?.state && data.version && data.version >= version) {
      // only apply if local is effectively empty (caller supplies heuristic) – exposed via return
    }
  })(); }, [step, version]);

  return { saving, error };
}
```

## Immediate Next Implementation Targets
1. Add builder schema version constant (e.g., `BUILDER_STATE_VERSION = 1`).
2. Introduce `usePersistedStepState` and refactor Step 2 first (simplest) for trial.
3. Add inline validation to Step 1 (prevent Next if any TM cell blank).
4. Start wave generation util stub returning sets for first lift of Week 1.

## Success Criteria (MVP Complete)
- User can: enter TMs → choose template/scheme → customize → preview real sets (weeks 1–3 + deload) → configure increments → export.
- All state survives reload (remote) & version upgrades.
- Basic test suite green (calc + persistence + navigation).
- Exported program object matches documented `ProgramDefinition` and loads in Active view.

## Open Questions
- Assistance volume balancing algorithm: rule-based or heuristic scoring? (Defer)
- Conditioning dosage: fixed templates vs adaptive to recovery metrics? (Phase 4+)
- Multi-user collaboration / sharing? (Out of scope MVP)

---
*This file tracks ONLY the 5/3/1 UI-first builder scope. See `MASTER_DEVELOPMENT_PLAN.md` for global system strategy.*
