# ANESVET V16.4.0 — Adaptive Workspace & Finishing Polish

V16.4 continues the V16 UX redesign by making tablet and desktop layouts intentionally different from the phone layout. This release is presentation/accessibility only; clinical calculations, safety gates and record rules are unchanged.

## Added / changed
- New `adaptive-workspace.css` + `adaptive-workspace.js` presentation layer.
- Wide desktop workspace expands to 1480 px and uses a structured workflow stepper rather than stretched pill tabs.
- Patient setup becomes a two-column workspace: core case entry on the left, Patient Master/history + ASA context on the right.
- Pre-check uses physical examination as the primary canvas with Anesthetic Risk Flags as a visible side rail.
- Medications separates the actual case drug plan from supporting presets/reference content.
- OR LIVE becomes a two-column cockpit on wide screens:
  - primary actions / vitals / maintenance on the left;
  - medication queue / workflow profile / phase status / watch context on the right.
- OR vital cards form a balanced 3 × 2 matrix on wide desktop and tablet.
- Recovery separates live recovery work from handoff/readiness/problem context.
- Tablet OR/Recovery keeps only one fixed action surface instead of stacking the global quick bar with the clinical dock.
- Added restrained hover/press/focus micro-interactions and a visual saved-state pulse.
- `prefers-reduced-motion` disables nonessential motion.
- Workflow stepper now mirrors `aria-current="step"` for the visually active step.

## Clinical safety
Byte-identical to V16.3:
- `clinical-validation.js`
- `clinical-workflow.js`
- `drug-dose-reference.js`
- `protocol-review.js`
- `medication-reconciliation.js`
- `finalization.js`
- `medication-safety.css`
- `reliability.js`

`app.js` differs from V16.3 only by `APP_VERSION` (`16.3.0` → `16.4.0`).

V16.4 does not change dose, concentration logic, alert thresholds, medication reconciliation, Recovery completion criteria, Final Lock rules, current-case schema or IndexedDB schema.

## Compatibility
- Existing V16.3 current cases and archives open without reset or migration.
- No storage key or IndexedDB schema migration.
- Existing mobile Progressive Clinical Flow remains intact below the adaptive breakpoints.
