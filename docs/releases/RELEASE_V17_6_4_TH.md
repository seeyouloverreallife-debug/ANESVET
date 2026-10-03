# ANESVET V17.6.6 — Architecture Consolidation Phase 4B

## Scope
- Extracted Recovery Handoff read-only derivation from `app.js` into `recovery-handoff-view-model.js`.
- Moved medication grouping/role classification, handoff timeline derivation, WATCH item derivation, and handoff view-model assembly into the dedicated module.
- Kept DOM rendering, capture/audit/save, state mutation, clinical thresholds, storage schema, and case lifecycle behavior in their existing owners.
- Preserved the existing renderer-facing `handoffMedicationGroups()` compatibility wrapper.
- Added the new module to startup dependency order and service-worker precache.
- Updated release/cache version to 17.6.6.

## Validation
- JavaScript syntax: PASS.
- HTML duplicate IDs: 0.
- Local HTML asset references: no missing files.
- Dependency order: `app-pure-utils.js` → `recovery-handoff-view-model.js` → `app.js`.
- Static ownership check: legacy timeline/watch derivation removed from `app.js`; renderer and capture behavior remain in `app.js`.

## Safety boundary
No intended changes to dose calculation, drug administration semantics, alert thresholds, Recovery readiness criteria, patient/case storage schema, final-record lock/archive behavior, or clinical source data.

Browser/device E2E remains required before production deployment.
