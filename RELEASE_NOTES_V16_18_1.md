# ANESVET V16.18.1 — Patient Master + Pre-op Controller Extraction

## Summary
V16.18.1 continues architecture hardening. It extracts Patient Master and structured Pre-op UI/controller responsibilities from `app.js` while preserving the clinical data schema and core anesthesia/recovery behavior.

## Added
- `patient-master-controller.js`
- `preop-controller.js`
- Architecture registry entries for both controllers
- Service-worker cache coverage for both new runtime files
- targeted controller regression test report

## Patient Master extraction
Moved out of `app.js`:
- search / result rendering
- linked patient and history rendering
- use / new / unlink workflow
- retire / restore / merge duplicate workflow
- Patient Master upsert from current case form
- ASA card and save-status UI
- Patient risk banner

Patient Domain and Patient Master Orchestration modules are unchanged.

## Pre-op extraction
Moved out of `app.js`:
- structured Physical Examination status/save/report
- Anesthetic Risk Flags and BOAS details
- Pre-op checklist Done/N/A bindings
- Pre-op navigation controls
- report HTML for physical exam and risk review

## Clinical safety boundary
No intentional change to:
- dose calculations
- medication administration/reconciliation
- alert thresholds
- OR clinical workflow semantics
- Recovery readiness/completion criteria
- Documentation Guardian
- Problem → Intervention → Response review
- Final Lock / archive checksum verification

## Storage / migration
- `DB_VERSION = 2` unchanged
- no clinical-data migration
- no storage key rename
- no archive format change

## Browser smoke
Chromium headless again timed out in the execution environment. Browser/PWA smoke remains **BLOCKED / PENDING**, not PASS. Real-device Production Pilot testing remains required.
