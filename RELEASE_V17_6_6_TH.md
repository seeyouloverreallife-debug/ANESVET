# ANESVET V17.6.6 — Architecture Consolidation Phase 4D

## Scope
- Added `session-lifecycle-model.js` for read-only timer/session derivation.
- Extracted elapsed-time calculation and timer button/badge presentation from `app.js`.
- Centralized Recovery navigation eligibility and active-case OR LIVE bypass derivation through the session model.
- `app.js` remains the owner of timer start/pause mutation, interval scheduling, case identity snapshot, protocol/branding snapshots, save, audit, and rendering side effects.
- Preserved the existing `case-lifecycle.js` safety domain; the newer `case-lifecycle-model.js` remains phase-presentation metadata only.
- Fixed a V17.6.5 runtime guard defect: the phase model guard referenced the legacy `CASE_LIFECYCLE` symbol instead of `CASE_PHASE_MODEL`.
- Added the session model to startup dependency order and service-worker precache.

## Validation
- JavaScript syntax: PASS.
- Case/session model runtime unit checks: PASS 9/9.
- Runtime dependency declaration/guard sanity: PASS.
- HTML duplicate IDs: 0 / 1,392.
- Missing local HTML references: 0.
- `app.js`: 4,311 lines (V17.6.5: 4,320).
- Version/cache namespace: 17.6.6.

## Safety boundary
No intended changes to timer mutation semantics, allowed clinical writes, case-start gates, pre-OR readiness, protocol governance, medication/dose logic, alert thresholds, Recovery readiness criteria, storage schema, save/restore, Final/Archive sealing, or clinical knowledge.

Browser/device E2E remains required before production deployment.
