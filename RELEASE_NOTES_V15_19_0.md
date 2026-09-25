# ANESVET V15.19.0 — Progressive Disclosure & Collapsible Sections

## Goal
Reduce scrolling and cognitive load without hiding safety-critical information or changing clinical behavior.

## Settings — compact by default
- All 11 top-level Settings sections start collapsed for a first-time V15.19 user.
- Each section keeps a compact title/description row and opens only when requested.
- Added Settings search so users can type terms such as `logo`, `alert`, `Drug Library`, or `Recovery`.
- Added `Collapse all` and `Expand all` actions.
- Per-section open/collapsed preference is stored locally as UI preference only.
- Save/Edit actions inside a Settings section are hidden while that section is collapsed and reappear when opened.

## Other long pages
Progressive disclosure was also applied conservatively outside Settings:
- **Patient**: Patient Master and ASA sections can be collapsed manually, but remain open by default.
- **Pre-check**: Physical Examination and Anesthetic Risk Flags can be collapsed manually, but remain open by default.
- **Drug Calculator**: long reference sections start collapsed:
  - Peri-anesthetic drug calculator
  - Peri-anesthetic drug plan by phase
  - Emergency drugs reference
- **Recovery**:
  - Recovery Handoff starts collapsed
  - Recovery vital-sign history starts collapsed
  - Recovery Readiness Score remains open
  - Unresolved alerts/problems remain visible and are not placed behind disclosure.

## Auto-reveal safeguards
- A collapsed section automatically opens if a field inside it receives focus or triggers browser validation.
- Disclosure header/toggle focus is excluded from auto-reveal to avoid double-toggle behavior on touch devices.
- A small public UI helper is exposed as `window.ANESVETProgressiveDisclosure` for future internal navigation hooks.

## Architecture / compatibility
- New UI-only module: `progressive-disclosure.js`
- New styles: `progressive-disclosure.css`
- Existing DOM nodes are **not moved or recreated**; the module only toggles visibility of existing direct panel content. This preserves existing IDs and event listeners.
- `clinical-workflow.js`, `support.js`, and `reliability.js` are byte-identical to V15.18.0.
- `app.js` changes only `APP_VERSION` to 15.19.0.
- No dose, concentration, ETT, ventilation, fluid, alert threshold, final-lock rule, recovery rule, storage schema, or PDF/report-content change.
