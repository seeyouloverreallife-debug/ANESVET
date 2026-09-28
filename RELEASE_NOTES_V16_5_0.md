# Release Notes — ANESVET V16.5.0

## Usability Hardening

V16.5 focuses on production usability rather than visual redesign. Clinical logic and safety criteria are unchanged.

### Actionable readiness
- Pre-OR missing/recommended items now expose direct `ไปแก้` actions when a deterministic destination exists.
- The action closes the readiness sheet, opens the correct workflow page, reveals collapsed content when needed, scrolls to the target, and focuses the relevant control.

### Actionable End Case blockers
- Finalization blocker chips are now keyboard/click actionable through the V16.5 UX layer.
- Recovery, alerts, complications, medication reconciliation, sign-off, and final checklist blockers route directly to the relevant workspace.
- No blocker definitions or final-lock criteria changed.

### Save Assist
- Normal successful autosave remains visually quiet.
- Save Assist appears only for:
  - verified save error → retry action
  - persistent dirty state beyond the normal autosave window → retry action
  - offline mode → local-first status explanation
- Offline is informational, not treated as a clinical error.

### Active-case return
- When an active case is running and the user navigates away from OR/Recovery, a one-tap return shortcut appears.
- It routes to OR LIVE or Recovery according to current case phase.
- Mobile positioning was hardened to avoid overlap with the quick-navigation dock.

### Mobile ergonomics
- Important controls remain ~50 px touch targets in runtime QA.
- Focusable fields receive keyboard-safe scroll margins.
- Safe-area behavior preserved.

### Compatibility
- No data-schema or storage-key migration required.
- V16.4 clinical/safety modules remain byte-identical.
- `app.js` differs from V16.4 only by `APP_VERSION = 16.5.0`.
