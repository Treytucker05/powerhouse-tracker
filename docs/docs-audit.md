# Docs Audit — Keep / Merge / Archive / Delete

Last updated: 2025-08-22

This audit classifies README and instructional Markdown files and proposes concrete merge targets.

Legend:
- KEEP = canonical, current
- MERGE = consolidate into listed target
- ARCHIVE = move to docs/archive/
- DELETE = remove (strict duplicates or backup noise)

## Root-level READMEs and indices
- KEEP: README.md (primary project overview; link docs/INDEX.md)
- MERGE: README_CONSOLIDATED.md → README.md (fold in any unique bits, then archive source)
- MERGE: README_V3_UPDATE_SUMMARY.md → CHANGELOG.md (version highlights) and README.md highlights
- EMPTY: README_NEW.md (delete or use as scratch); README_UPDATE_SUMMARY.md (empty) → DELETE
- MERGE: DOCS_INDEX.md + DOCUMENTATION_INDEX_UPDATED.md → docs/INDEX.md; then ARCHIVE originals

## App-level docs (tracker-ui-good/tracker-ui)
- KEEP: tracker-ui-good/tracker-ui/README.md (app quick start)
- MERGE: tracker-ui-good/tracker-ui/README_testing.md → docs/merge-drafts/E2E_TESTING_MERGED.md
- KEEP: tracker-ui-good/tracker-ui/E2E_TESTING.md (source for merge); plan to ARCHIVE after merge accepted
- KEEP: CONTRIBUTING.md

## Testing & Architecture notes
- KEEP: MACROCYCLE_TESTING_GUIDE.md
- KEEP: tracker-ui-good/tracker-ui/src/__tests__/new-architecture/V2_IMPLEMENTATION_SUMMARY.md

## Design System docs
- KEEP: DESIGN_SYSTEM_UNIFIED.md, DESIGN_SYSTEM_GUIDE.md, DESIGN_SYSTEM_COMPLETE.md

## Plans / Strategy / Status
- KEEP: MASTER_DEVELOPMENT_PLAN.md, CURRENT_STATUS_UPDATE_AUGUST_2025.md, CHANGELOG.md
- KEEP: GOAL_FIRST_DEVELOPMENT_PLAN.md, GOAL_FIRST_IMPLEMENTATION_COMPLETE.md
- KEEP: FIVETHREEONE_IMPLEMENTATION_COMPLETE.md

## Specialized reports
- KEEP: BUTTON_MASTER_TABLE.md, BUTTON_AUDIT_REPORT.md, CALCULATOR_AUDIT.md, DATABASE_SCHEMA_REVIEW.md, DETAILED_REFACTORING_ANALYSIS.md

## Suggested archive moves (non-destructive)
- ARCHIVE: README_CONSOLIDATED.md, README_V3_UPDATE_SUMMARY.md, DOCS_INDEX.md, DOCUMENTATION_INDEX_UPDATED.md

## Next actions
1) Draft merged E2E doc (created) → docs/merge-drafts/E2E_TESTING_MERGED.md
2) Link docs/INDEX.md from README.md Quick Reference
3) After review, move superseded docs to docs/archive/
