# ANESVET V16.18.2 — Recovery Controller Extraction

## Summary
V16.18.2 continues architecture hardening by extracting Recovery UI/controller behavior from `app.js` into `recovery-controller.js`. Existing Recovery Domain and Recovery Orchestration modules remain unchanged.

## Added
- `recovery-controller.js`
- architecture registry entry for Recovery Controller
- service-worker cache coverage for the new runtime module
- targeted Recovery Controller regression tests

## Recovery extraction
Moved out of `app.js`:
- Recovery start / completion controller
- extubation → Recovery transition
- emergency return / return-to-Recovery controller
- readiness/checklist/N/A UI
- Recovery serial record entry/rendering
- Recovery score entry/history
- Recovery due reminder state
- Recovery 2.0 trend presentation
- post-anesthetic medication review presentation
- transfer / ward handoff capture UI
- Recovery mobile dock and More dialog bindings

Shared Recovery handoff/report view-model generation remains in app composition and is injected into the controller because the same view model is also used by report/PDF generation.

## Clinical safety boundary
No intentional change to:
- Recovery readiness/completion criteria
- Recovery score calculations
- medication administration/reconciliation
- dose calculations
- alert thresholds / alert episode semantics
- OR clinical workflow semantics
- Documentation Guardian
- Problem → Intervention → Response review
- Final Lock / archive checksum verification

## Storage / migration
- `DB_VERSION = 2` unchanged
- no clinical-data migration
- no storage key rename
- no archive format change

## Browser smoke
System Chromium headless again timed out in the execution environment. Browser/PWA smoke remains **BLOCKED / PENDING**, not PASS. Real-device Production Pilot testing remains required.
