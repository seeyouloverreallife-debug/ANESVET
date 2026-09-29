# ANESVET V16.18.5 — Finalization & Archive Controller Extraction

## Summary
V16.18.5 continues Architecture Hardening by extracting Finalization and Archive UI/orchestration from `app.js` into `finalization-archive-controller.js`. This release intentionally avoids changing clinical Final Lock, checksum, archive, amendment, VOID, or medication-reconciliation semantics.

## Added
- `finalization-archive-controller.js`
- architecture registry entry for Finalization & Archive Controller
- Service Worker precache coverage for the new controller
- targeted Finalization / Archive controller regression tests
- extraction-parity QA for Final Lock and archive paths

## Extracted from `app.js`
- Final Sign-off rendering and signing
- End Case readiness rendering
- Final Lock button transaction orchestration
- medication-reconciliation gate helper
- archive snapshot writing
- locked current ↔ archived copy checksum verification
- archive retry
- archive filtering and rendering
- integrity verification action
- amendment dialog/save flow
- VOID final record flow
- working-copy archive load/delete
- related DOM event bindings

Compatibility wrappers remain in `app.js` so Recovery, Data Resilience, Production Pilot, Finalization, Final Archive Assurance, reporting, and external modules retain the same function names/API surface.

## Clinical safety boundary
No intentional change to:
- Final Lock prerequisites
- Recovery completion requirement
- unresolved alert / complication gate
- medication reconciliation requirement
- anesthetist + surgeon sign-off
- report-review checklist
- SHA-256 final checksum
- legacy FNV1A verification compatibility
- locked record amendment semantics
- VOID-not-delete rule for final records
- dose calculations
- alert thresholds
- Recovery criteria
- Documentation Guardian

## Architecture effect
`app.js` reduced from **4,146 → 4,035 lines** and **432,683 → 413,055 bytes**. Finalization/archive stateful UI logic is now controller-owned while storage initialization and report builders remain app-owned.

## Storage / migration
- `DB_VERSION = 2` unchanged
- no clinical-data migration
- no storage-key rename
- no archive-format change

## Browser smoke
System Chromium headless was attempted against the local HTTP build with a 20-second timeout. It timed out with environment D-Bus/service-process errors and produced no DOM output.

Status: **BLOCKED / PENDING**, not PASS.
