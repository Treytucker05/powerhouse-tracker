# 5/3/1 Multi-Phase (Leader / Anchor) Design

Status: Draft (documentation only – no code changes yet)
Last Updated: 2025-08-14
Owner: Macrocycle / Periodization Enhancement

## 1. Goals
Provide native support for multi-cycle 5/3/1 programming ("5/3/1 Forever" style) using explicit phase definitions (Leader → Anchor) while keeping full backward compatibility with the existing single-cycle (phases = [] / undefined) flow.

Objectives:
- Allow users to compose a Macrocycle with ordered Phases (e.g., 2 x Leader (BBB 50%) → 1 x Anchor (PRs + Jokers + Deload))
- Support per-phase: template/supplemental selection, assistance strategy overrides, TM progression policy, deload rules
- Preserve existing pack + wizard behavior when no phases are defined (zero friction upgrade path)
- Enable deterministic schedule materialization across all phases for preview/export
- Maintain selective TM progression and AMRAP performance tracking across phase boundaries

Out of Scope (initial iteration):
- Auto-deload logic beyond standard week 4 pattern
- Complex daily undulating supplemental switching inside a phase
- Adaptive / auto-regulated TM changes (beyond fixed increments)

## 2. Data Model Extensions
Current pack excerpt:
```
"program": {
  "phases": []
}
```
Extended Schema (JSONC conceptual):
```
"program": {
  "phases": [
    {
      "id": "leader-1",                 // unique stable key
      "role": "leader",                 // enum: leader | anchor | custom
      "cycles": 1,                       // integer ≥ 1 (number of 4-week cycles)
      "template": "bbb50",              // references templates[].id OR inline override object in future
      "supplementalOverrides": {          // optional granular overrides
        "bbb": { "percent": 0.50, "sets": 5, "reps": 10 }
      },
      "assistancePlan": {                // optional, falls back to template/default
        "upperDay": ["dip", "hanging_leg_raise"],
        "lowerDay": ["back_extension", "ab_wheel"]
      },
      "progression": {                   // TM increment policy applied AFTER each phase OR cycle
        "apply": "after-phase",         // enum: after-cycle | after-phase
        "upperIncrement": 5,             // lbs (kg equivalent resolved at runtime)
        "lowerIncrement": 10
      },
      "amrapPolicy": {                   // optional; default = standard AMRAP on last set weeks 1–3
        "enabled": true
      },
      "deloadWeek": false,               // whether final (week 4) is deload (true by default for all cycles)
      "notes": "BBB Volume Accumulation"
    },
    {
      "id": "anchor-1",
      "role": "anchor",
      "cycles": 1,
      "template": "bbb50",              // Could be a different anchor template later
      "progression": { "apply": "after-phase", "upperIncrement": 5, "lowerIncrement": 10 },
      "deloadWeek": true,
      "notes": "Anchor: PR focus + Deload" 
    }
  ]
}
```
Backward Compatibility Rule: If `program.phases` is missing OR empty → treat as implicit single phase (leader-like) of exactly 1 cycle using the selected template (current behavior).

## 3. Runtime State Additions
Augment wizard / program instance state:
```
macrocycle: {
  phases: PhaseDefinition[],          // normalized from pack user edits
  currentPhaseIndex: number,          // 0-based
  cycleInPhase: number,               // 0-based
  totalCycles: number,                // sum(phases[i].cycles)
  absoluteCycleIndex: number          // (sum previous phases' cycles) + cycleInPhase
}
```
Derivable helpers:
- isLastCycleInPhase(phase, cycleInPhase)
- isLastPhase(index)
- currentPhaseRole()

## 4. Cycle Advancement Logic
Current: `advanceCycleSelective(includeMap)` increments TMs then resets week.
Extended:
1. Increment week normally until Week 4 complete.
2. On cycle advance trigger:
   - Determine progression policy origin phase: If `progression.apply === 'after-cycle'`, increment TMs each cycle; if `after-phase`, only increment when `cycleInPhase + 1 === phase.cycles`.
   - Update (cycleInPhase, currentPhaseIndex) with rollover.
   - If moving to next phase, apply new template/supplemental overrides (re-materialize schedule slice for upcoming cycles if needed).
3. If finished last phase & last cycle → optionally offer "Finalize Macrocycle / Start New Macrocycle" UX.

Pseudo:
```
function advanceCyclePhased(state, includeMap) {
  const phase = state.macrocycle.phases[state.macrocycle.currentPhaseIndex];
  const atPhaseEnd = state.macrocycle.cycleInPhase + 1 === phase.cycles;
  const shouldProgressTMs = phase.progression.apply === 'after-cycle' || atPhaseEnd;
  if (shouldProgressTMs) applyTMIncrements(includeMap, phase.progression);
  if (atPhaseEnd) moveToNextPhaseOrFinish(); else incrementCycleInPhase();
  resetWeek();
}
```

## 5. Schedule Materialization Strategy
Approach A (Lazy / On-Demand): Compute weeks for the *current* cycle only, reusing existing single-cycle calculation pipeline; phase metadata only affects TM progression & chosen template at cycle boundaries.
Approach B (Eager Full Expansion): Expand all weeks for all cycles across all phases upfront for preview/export. (Better for global preview, but more complex if user edits mid-way.)

Recommendation: Start with Approach A + provide derived macrocycle summary preview using phase metadata (counts, total weeks = totalCycles * 4). Add optional full expansion later.

## 6. Wizard UX Adjustments
Insert new Step before Review (or immediately after Template selection): "Macrocycle".
Minimal MVP fields:
- Number of Leader Cycles (1–3)
- Leader Template (default current template)
- Anchor Cycles (0–2) – if >0 show Anchor Template selection (future: different supplemental)
- TM Progression Timing: After Each Cycle / After Each Phase
- Display resulting total cycles & weeks

Display in Review Step:
- Table: Phase | Role | Cycles | Template | Progression Timing | Notes

Progression Step Modification:
- If macrocycle multi-phase & policy=after-phase and not final cycle of phase → show advisory: "Phase progression deferred until phase completion"; disable increments accordingly.

## 7. API / Function Additions
New Utils (phasedProgression.js):
- normalizePhases(raw, selectedTemplate)
- deriveMacrocycleState(phases)
- isPhaseEnd(state)
- shouldIncrementThisAdvance(state, phase)
- advanceCyclePhased(state, includeMap)

Refactor existing `advanceCycleSelective` → internal shared increment helper used by both single-cycle and phased version.

## 8. Migration & Compatibility
- Packs with `phases` non-empty override user macrocycle defaults.
- Wizard: If pack supplies phases, pre-load them; hide Macrocycle builder (show read-only summary + "Customize" toggle to clone & edit).
- Existing saved programs (without phases) continue to function: loader injects implicit phases = [] path.

## 9. Testing Plan
Unit:
- normalizePhases(): correct default construction.
- advanceCyclePhased(): transitions across phase boundaries; increments only at correct times.
- shouldIncrementThisAdvance(): matrix of (apply after-cycle / after-phase) × (position in phase).
Integration:
- Simulate 2 Leader + 1 Anchor → verify total increments count matches expectation.
- Selective increment: uncheck bench on final cycle before phase boundary; ensure only others increment.
Snapshot / UI:
- Macrocycle step form; Review summary; Progression step messaging changes.
Edge Cases:
- Single phase (leader) with cycles >1
- Phase with cycles=1 & after-phase progression (increments applied once)
- Empty phases array (legacy)

## 10. Increment Policy Matrix (lbs example)
| Policy      | Phases (Leader2+Anchor1)                         | Expected Upper TM Increment Applications |
| ----------- | ------------------------------------------------ | ---------------------------------------- |
| after-cycle | L1, L2, A1 (3 times)                             | +15 total                                |
| after-phase | End Leader phase (once), End Anchor phase (once) | +10 total                                |

## 11. Performance & Complexity Considerations
The phased approach adds negligible computational overhead given tiny state footprint. Avoid pre-expanding all microcycles initially to minimize memory churn and complexity.

## 12. Rollout Steps
Phase 0 (This Doc): Align design + stakeholder sign-off.
Phase 1: Implement data model + advanceCyclePhased with fallback compatibility; no UI yet (internal tests).
Phase 2: Add Macrocycle wizard step (hidden behind feature flag `enablePhases`).
Phase 3: Enable preview & review summary; adjust progression step logic.
Phase 4: Allow pack-defined phases to pre-populate macrocycle.
Phase 5: Optional full schedule export across phases.

## 13. Open Questions / Future Enhancements
- Anchor template differentiation (e.g., using First Set Last (FSL) instead of BBB)
- Jokers / 7th week protocol integration (testing / deload variations)
- Auto TM reduction (5–10% reset) on repeated stalls
- Phase-specific assistance volume caps (e.g., Anchor reduces assistance sets)

## 14. Immediate Documentation Note (To Surface in UI)
"Multi-phase (Leader/Anchor) macrocycles are not yet active. Current build supports a single 4-week cycle at a time with manual TM progression."

## 15. Minimal Patch Set (when implementing)
Files to Add:
- phasedProgression.js
Tests:
- phasedProgression.test.js
Wizard Edits:
- ProgramWizard531V2.jsx (insert Macrocycle step, adjust navigation, adapt ProgressionStep)
Pack Edits (Optional Later):
- Add meaningful `program.phases` examples in a new variant pack (e.g., `531.bbb.leader_anchor.v1.jsonc`).

---
End of Design Draft.
