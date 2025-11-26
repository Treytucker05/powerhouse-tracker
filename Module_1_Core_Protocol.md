# Module 1: Core Protocol

## ENTRY MODES

### Quick Entry
- **Trigger window (48 hours):** Surfaces automatically when there has been no log, recap, or MAP/LOOP activity for 48 hours, appearing ahead of standard entry prompts to recover continuity quickly.
- **Abbreviated three-question flow:** Limits capture to three essentials—current state (energy/stress/readiness), primary blocker or win since the last touchpoint, and the single next action/commitment for the next 24 hours—to minimize friction while preserving decision-critical data.
- **Auto-imported recap context:** Pre-fills the quick entry view with the last completed recap’s highlights (wins, risks, focus lane, and open MAP/LOOP items) so the user can respond with context and avoid repetition.
- **Triage reconfirmation:** If the user was previously triaged (e.g., in a recovery or constraint-handling lane), the flow asks them to reconfirm or update that status before saving, ensuring downstream routines keep the correct laning.
- **Resume to LOOP/MAP logic:** On submission, the system records the quick entry, updates recap continuity markers, and then resumes the appropriate workflow: return to the active LOOP if one was in progress, otherwise reopen MAP with the newly captured context; if triage status changed, route through MAP to re-establish priorities before restarting LOOP cycles.
