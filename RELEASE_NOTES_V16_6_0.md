# RELEASE NOTES — ANESVET V16.6.0 RC1

## Goal
Freeze feature growth and validate ANESVET as a release candidate for routine hospital use.

## Confirmed bug fixed
### Sealed Final Lock incorrectly blocked PWA update
V16.5 used `hasActiveCaseData()` for update safety. A Final Locked current case still contains patient/record data, so an already-sealed case continued to block a version reload even after the record was immutable.

V16.6 introduces a separate reload-safety rule:
- mutable/current working case → update remains blocked
- incomplete lock / missing checksum → update remains blocked
- `caseLocked + finalChecksum + lockedAt` → sealed; version reload is permitted

This does **not** unlock, mutate, or rewrite the case. It only determines whether reloading into a new app version is safe.

## RC reliability additions
The existing self-check now also validates:
- mutable vs sealed version-reload guard semantics
- archive caseId uniqueness
- Patient Master patientId uniqueness
- page-level horizontal overflow on the current viewport
- Final Locked current record checksum presence

## Regression matrix
Automated harness: **16/16 PASS**
Clinical validation matrix: **15/15 PASS**

Covered scenarios include offline UI, multi-tab VIEW ONLY/takeover, duplicate vital guard, reset/autosave race, safety checkpoint recovery, legacy V14.2 current-case migration, and phone/tablet/desktop viewport integrity.

## Unchanged clinical/safety modules
Byte-identical to V16.5:
- clinical-validation.js
- clinical-workflow.js
- drug-dose-reference.js
- protocol-review.js
- medication-reconciliation.js
- finalization.js
- reliability.js
- usability-hardening.js

## Still requires real-device acceptance
- installed PWA update lifecycle
- Android Chrome/PWA background/foreground behavior
- iPad Safari/PWA keyboard, safe-area and memory pressure behavior
- Windows Chrome/Edge installed-app update behavior
- multi-tab coordination in two real browser tabs
- browser storage quota / eviction behavior
