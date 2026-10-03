# ANESVET V17.9.5 — Regression & Cleanup

## Removed redundant ownership
- Workflow `aria-current`, active-step alignment and viewport workspace classes moved fully into `workspace-owner.js`.
- `ui-refinement.js` is now a compatibility marker only.
- `adaptive-workspace.js` now owns only its distinct save-success animation.
- Recovery → End Case / guided Final Review click ownership moved into `repeat-presentation-owner.js`.
- `recovery-endcase-ux.js` is now a compatibility marker only.

## Regression harness
Added `QA_V17_9_5_REGRESSION.js` covering source contracts for:
- End Surgery
- Calculated-as-Given medication and override audit
- OR core/secondary hierarchy
- Recovery/Handoff hierarchy
- Emergency Return to OR
- keyboard/editing owner
- mobile shell editing guard
- OR fast-vitals viewport delegation
- workspace step/alignment ownership
- Recovery → End Case and guided Final Review actions

No clinical state mutation or safety gate was intentionally changed.
