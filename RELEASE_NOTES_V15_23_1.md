# ANESVET V15.23.1 — Patient Search & Mobile Focus Fix

## Scope
UX hotfix on top of V15.23.0. No medication calculations, clinical validation formulas, safety gates, record schema, finalization logic, or reconciliation logic were changed.

## Changes
### Patient Master: search on demand
- Empty search no longer renders recent/old patients automatically.
- Search results appear only after HN / patient name / Microchip / Breed is typed.
- Active/retired count remains available as a compact reference.
- Selecting a patient clears the search query and hides result cards again.
- Starting a New patient also clears the search query/results.

### Mobile input focus / keyboard resize
- Replaced workflow-tab `scrollIntoView()` alignment with horizontal-only scrolling of `.workflow-tabs`.
- Window resize (including virtual keyboard opening) can no longer drag the whole document toward the workflow bar.
- Resize alignment uses non-animated horizontal positioning to reduce keyboard/layout jank.

## Safety / compatibility
- `clinical-validation.js`, medication reconciliation, finalization, and medication safety logic are unchanged from V15.23.0.
- Existing Patient Master and case data remain compatible.
- Service-worker cache bumped to V15.23.1.
