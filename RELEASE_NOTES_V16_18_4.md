# ANESVET V16.18.4 — Medication Workspace Controller Extraction

## Summary
V16.18.4 continues Architecture Hardening by extracting the active medication documentation workspace from `app.js` into `medication-workspace-controller.js`. This release does not intentionally change medication calculation, confirmation, plan-vs-actual, or Final Lock semantics.

## Added
- `medication-workspace-controller.js`
- architecture registry entry for Medication Workspace Controller
- Service Worker precache coverage for the new controller
- targeted medication workspace regression checks
- extraction-parity QA for medication administration and Quick Drug paths

## Medication workspace extraction
Moved out of `app.js`:
- generic medication administration dialog state / confirmation
- actual administration record creation + VOID workflow
- medication administration audit rendering
- frozen-protocol Quick Drug candidate construction
- OR quick-med strip selection/rendering
- continuous Quick Drug workspace
- concentration + route preset presentation
- planned induction multi-drug batch editor
- induction medication review completion
- Recovery medication workspace entry point
- medication workspace DOM event bindings

Compatibility wrappers remain in `app.js` so calculators, OR LIVE, Recovery, reporting, and external modules retain the same function names.

## Clinical safety boundary
No intentional change to:
- `safeMedicationCalculation()` and medication safety profiles
- Hospital Drug Library / Case Drug Plan semantics
- planned medication `NEEDS REVIEW / LATER / DOCUMENTED` semantics
- actual administration confirmation requirements
- duplicate-administration confirmation window
- medication reconciliation / explicit Not-given decisions
- dose reference content
- OR alert thresholds
- Recovery completion
- Documentation Guardian
- Final Lock / archive checksum verification

## Architecture effect
The active medication documentation state is now controller-owned rather than app-global. Hospital protocol configuration / Drug Library editing remains app-owned for a later settings/protocol boundary.

## Storage / migration
- `DB_VERSION = 2` unchanged
- no clinical-data migration
- no storage-key rename
- no archive format change

## Browser smoke
Automated static/runtime-independent checks are included. Real-device Production Pilot remains required before production use, especially Induction multi-drug entry, Recovery medication entry, VOID, and Final Lock medication reconciliation.
