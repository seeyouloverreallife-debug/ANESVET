# ANESVET V16.3.0 — Progressive Clinical Flow

V16.3 continues the V16.1–V16.2 UX redesign. It changes presentation and navigation behavior only; clinical calculations and safety logic are preserved.

## Added / changed
- Mobile Continue action is now context-aware instead of generic.
- Patient setup uses an essentials-first mobile form with optional identity details behind one disclosure.
- Linked Patient Master search becomes compact after patient selection; search can be reopened with `ค้นหา / เปลี่ยน`.
- Mobile current-step label updated from `Drug Calculator` to `Medications`.
- Hospital Quick Presets gets an explicit collapse/expand control.
- Medication preparation warnings wrap within their cards; fixed a 90 px horizontal overflow seen on a 390 px phone viewport.
- Completed Patient / Pre-check / Drug Plan / End Case surfaces use quieter visual emphasis without hiding editable data.
- New UX layer: `progressive-clinical-flow.css` / `progressive-clinical-flow.js`.

## Clinical safety
Unchanged and byte-identical to V16.2:
- `clinical-validation.js`
- `clinical-workflow.js`
- `drug-dose-reference.js`
- `protocol-review.js`
- `medication-reconciliation.js`
- `finalization.js`
- `medication-safety.css`

V16.3 does not alter dose, alert thresholds, readiness rules, medication reconciliation requirements, recovery criteria or Final Lock rules.

## Compatibility
- Current case/archive schema unchanged.
- IndexedDB schema unchanged.
- Existing V16.2 data can be opened without migration or reset.
