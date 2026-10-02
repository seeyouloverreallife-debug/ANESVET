# ANESVET V17.10.7 — BUG CENTER Hotfix

Fixes device-reported startup blockers from V17.10.6.

- Verifies `app-pure-utils.js` loads before `recovery-handoff-view-model.js`, and the handoff model before `app.js`.
- Fixes diagnostic navigation calling nonexistent `refreshPanel()`; it now calls the existing issue renderer.
- Fixes diagnostic Copy button retaining `event.currentTarget` across an `await`; the button reference is captured synchronously and null-guarded.
- Adds regression contracts for the ASA card click handler, hidden ASA input update, selected-card sync, and readiness requirement.
- Preserves clinical workflow and safety actions.
