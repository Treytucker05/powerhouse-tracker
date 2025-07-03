# PowerHouse Tracker – Gap Analysis (v0)

_Last updated: 2025-06-25_

| Area / Feature            | Current State | Target MVP                               | Priority | Est. Effort |
|---------------------------|---------------|------------------------------------------|----------|-------------|
| **Mesocycle Builder UI**  | Not started   | Wizard with auto volume-ramp             | HIGH     | 3 d |
| **Microcycle Designer**   | Not started   | Split templates + drag-and-drop sessions | HIGH     | 4 d |
| **Supabase Sync Layer**   | Local only    | Full CRUD for plans & sets               | MED      | 2 d |
| **AI Fatigue Insights**   | None          | Basic fatigue alert card                 | MED      | 2 d |
| **CI/CD Pipeline**        | Lint + unit   | Add Playwright + auto-deploy             | LOW      | 1 d |

> _Update this table after each sprint._

### Technical-Debt Hotspots
* Legacy Parcel code under `/js` → migrate or delete.  
* ESLint warnings (run `pnpm run lint`).  
* Maintain ≥ 80 % Vitest coverage gate.

### Data-Model TODO
- [ ] Exercise library `sfr_score`
- [ ] Personalized VolumeLandmarks per user
- [ ] Progress history schema
- [ ] Supabase RLS policies
