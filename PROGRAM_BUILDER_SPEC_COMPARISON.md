# 5/3/1 Program Builder – Current vs Research Spec vs Unified Plan

This document captures a structured comparison between the **current implementation** in the builder and the **full classic 5/3/1 research spec**, plus a **combined (unified) direction** column.

---
## Legend
- *Current*: What exists in code now
- *Research*: What the authoritative spec calls for
- *Match*: Core overlap already satisfied
- *Diff/Gaps*: Missing or divergent functionality
- *Combined*: Proposed unified approach covering both

---
## Step 1 – Fundamentals / Training Max Inputs
| Aspect      | Current                                                  | Research                                                              | Match                   | Diff / Gaps                                                             | Combined                                                                                               |
| ----------- | -------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Core Inputs | Units, TM % (90/85), microplates flag, per‑lift TM table | True 1RM or rep test, TM factor, e1RM calc, history, cycle increments | TM factor, units, lifts | No rep‑max workflow, no e1RM calc/history, no per‑lift increment config | Add rep‑max entry (weight+reps → e1RM), store actual/e1RM, tm_factor, tm, planned_increment, history[] |
| Validation  | Minimal readiness >0                                     | TM ≤ e1RM, factor ∈ {0.85,0.90}                                       | TM concept              | No sanity guards                                                        | Add TM sanity + start‑lighter recommendations                                                          |
| Variants    | None                                                     | Front squat, trap bar, push press, etc.                               | –                       | No variants                                                             | Variant selector mapped to canonical lift slot                                                         |
| Persistence | LocalStorage (+Supabase Step3)                           | Persistent model w/ history                                           | Basic state             | Lacks history versioning                                                | Versioned JSON with history & increments                                                               |

## Step 2 – Template / Split Selection
| Aspect              | Current                              | Research                                    | Match            | Diff / Gaps                                      | Combined                                        |
| ------------------- | ------------------------------------ | ------------------------------------------- | ---------------- | ------------------------------------------------ | ----------------------------------------------- |
| Split Options       | Implicit via frequency later (2/3/4) | 4‑day, 3‑day rotation, 2‑day Var A/B, 1‑day | Some frequencies | Missing 2‑day A/B & 1‑day, ordering of decisions | Separate Split step with all variants & preview |
| Assistance Template | Selected here (bbb, etc.)            | Chosen after split                          | Names            | Sequence difference                              | Move assistance template to dedicated step      |
| Main-set Option     | Not exposed                          | Option 1 vs 2 early                         | –                | Missing                                          | Add Option1/2 chooser here                      |
| Guidance            | Minimal                              | Decision tree + rest rationale              | –                | No context                                       | Add inline help + sample calendar               |

## Step 3 – Customize
| Aspect                | Current                               | Research                                      | Match            | Diff / Gaps                           | Combined                                                        |
| --------------------- | ------------------------------------- | --------------------------------------------- | ---------------- | ------------------------------------- | --------------------------------------------------------------- |
| Schedule Frequency    | 2/3/4 day + rotation editor           | All splits + paired sessions                  | Rotation idea    | Missing paired (2‑day A/B), 1‑day     | Extend to paired templates with session builder                 |
| Lift Order / Rotation | Order (4d), rotation (2/3d), warnings | Rotation table ensures coverage               | Coverage intent  | Lacks week phase labels               | Add week type labels (3×5/3×3/5/3/1) + dynamic rotation preview |
| Percent Scheme        | Scheme (AMRAP style) only             | Option1/2 % tables                            | AMRAP concept    | No % engine, week4 no‑plus rule       | Implement percent engine & plus flags                           |
| Warmups               | Toggle + scheme tag                   | Mandatory 40/50/60% + optional full-body prep | Warmup presence  | No auto loads, no full prep checklist | Auto-calc warm-ups; optional full prep module                   |
| Supplemental          | Single selection only                 | Template rule logic (BBB 5×10, etc.)          | Name parity      | No enforcement of rules               | Map selection → enforced rule set                               |
| Assistance Mode       | Placeholder modes                     | Exercise categories & volume rules            | Template concept | No library, volumes, validation       | Build assistance builder with category caps                     |
| Conditioning          | minimal/standard/extensive token      | Mode + trips (≥20) + schedule                 | Basic idea       | No quantitative targets               | Add mode, sessions, targets                                     |
| Deload                | Boolean toggle                        | Auto week4 unless low frequency               | Deload notion    | No conditional logic                  | Auto policy w/ override & warnings                              |
| Notes                 | Free text                             | (Not mandated)                                | –                | –                                     | Keep and export                                                 |
| Readiness             | TMs + schedule + scheme               | Rich validations                              | Partial          | Missing most checks                   | Multi-tier readiness engine                                     |
| Warnings              | Rotation only                         | Extensive validation set                      | Partial          | Missing other guards                  | Central validation hub                                          |

## Step 4 – Preview / Generation
| Aspect        | Current             | Research                                                                  | Match        | Diff/Gaps                         | Combined                                      |
| ------------- | ------------------- | ------------------------------------------------------------------------- | ------------ | --------------------------------- | --------------------------------------------- |
| Output        | Basic week ordering | Full weeks: warmups, sets, AMRAP, e1RM, PR flag, assistance, conditioning | Week notion  | Missing structured data & metrics | Generate full structured week objects         |
| Percent Loads | Not implemented     | Required                                                                  | –            | Missing                           | Integrate percent table & rounding            |
| AMRAP Entry   | Not present         | Final set wks1–3 only                                                     | –            | Missing control                   | Input field w/ automatic e1RM, disabled week4 |
| PR Tracking   | None                | e1RM comparison                                                           | –            | Missing                           | Maintain per-lift best e1RM, PR badge         |
| Rounding      | Implicit            | CEILING 5 (option microplates)                                            | Step concept | No mode toggle                    | Rounding settings (ceiling vs nearest, step)  |
| Cycle Roll    | Not here            | TM increment + rebuild                                                    | –            | Missing                           | Add cycle advance UI                          |

## Step 5 – Progression / Cycle Management
| Aspect            | Current               | Research                        | Match   | Diff/Gaps      | Combined                               |
| ----------------- | --------------------- | ------------------------------- | ------- | -------------- | -------------------------------------- |
| TM Progression    | Not built             | +5/+10 (or smaller)             | Intent  | Missing engine | Per-lift increment inputs w/ defaults  |
| Deload Scheduling | Manual toggle earlier | Auto logic                      | Concept | Not automated  | Auto-generate deload weeks w/ override |
| Stall / Reset     | Not built             | Reset single lift on stall      | –       | Missing        | Track failures → reset action          |
| History           | Not built             | Needed for PR & stall detection | –       | Missing        | Store cycle snapshots                  |
| Export            | Partial               | Full schema output              | –       | Missing detail | JSON/CSV export with schema version    |

## Assistance System (Module)
| Aspect           | Current     | Research                   | Match           | Diff/Gaps       | Combined                              |
| ---------------- | ----------- | -------------------------- | --------------- | --------------- | ------------------------------------- |
| Rules            | Name only   | Explicit per template      | Template naming | Logic missing   | Encode rules; enforce UI constraints  |
| Exercise Library | Absent      | Categorized bank + volumes | –               | Missing         | Provide curated JSON library + search |
| Custom Mode      | Placeholder | Full pick + validation     | Concept         | Not implemented | Build custom assistance builder       |

## Conditioning Module
| Aspect      | Current  | Research                          | Match             | Diff/Gaps             | Combined                                                 |
| ----------- | -------- | --------------------------------- | ----------------- | --------------------- | -------------------------------------------------------- |
| Abstraction | Tier tag | Mode + trips + targets + schedule | Conditioning idea | Quant targets missing | Detailed plan object (mode, sessions, targets, progress) |

## Validation & Readiness
| Aspect | Current | Research                                                                    | Match        | Diff/Gaps    | Combined                                            |
| ------ | ------- | --------------------------------------------------------------------------- | ------------ | ------------ | --------------------------------------------------- |
| Scope  | Minimal | TM sanity, assistance volume, AMRAP rules, deload policy, rotation coverage | A few basics | Most missing | Unified validator producing Critical/Advisory lists |

## Data / Output Schema
| Aspect      | Current                  | Research                                                                     | Match      | Diff/Gaps                          | Combined                                                                                     |
| ----------- | ------------------------ | ---------------------------------------------------------------------------- | ---------- | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| Step3 State | Flags + rotation & order | Rich config & history                                                        | Core flags | Missing history, assistance detail | Layered schema: userProfile, lifts[], planConfig, assistancePlan, conditioningPlan, cycles[] |
| Week Object | Not structured           | warmups[], worksets[], amrap, e1rm, pr_flag, assistance_plan[], conditioning | Concept    | Missing all fields                 | Adopt full week object & persist user AMRAP reps                                             |

## Edge Cases / Advanced
| Aspect         | Current       | Research                     | Match   | Diff/Gaps           | Combined                                      |
| -------------- | ------------- | ---------------------------- | ------- | ------------------- | --------------------------------------------- |
| Variant Lifts  | None          | Allowed list                 | –       | Missing             | Variant selector per lift + lock cycles       |
| Bands/Chains   | None          | Special TM derivation        | –       | Missing             | Advanced toggle + protocol form               |
| Paired Lifts   | Not supported | Bench+Press / SQ+DL rules    | –       | Missing             | Paired session layouts & secondary TM warning |
| Rounding Modes | Implicit      | Ceiling default, nearest alt | Concept | Mode toggle missing | Rounding settings UI                          |
| Reset Logic    | None          | Single-lift reset            | –       | Missing             | Failure counter + Reset action                |

---
## Unified Implementation Roadmap (Condensed)
1. Percent & Load Engine (Option1/2, warm-ups, rounding)  
2. e1RM + PR history tracking  
3. Assistance rule engine + exercise library  
4. Conditioning quantitative planner  
5. Additional splits (2‑day Var A/B, 1‑day, paired sessions) + phase labeling  
6. Cycle progression & stall/reset logic  
7. Comprehensive validation framework  
8. Advanced features (variants, bands/chains, rounding modes)  
9. Export schema & test harness  
10. UI refinement / tooltips / docs

---
## Version
Generated: 2025‑08‑20

This file is meant as a living reference. Update alongside feature milestones.
