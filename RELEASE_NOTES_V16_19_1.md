# ANESVET V16.19.1 — Production Validation & Reliability

V16.19.1 is a real-device validation release built on V16.19.0 Data Safety 2.0. It does not introduce new clinical treatment logic, dose logic, medication semantics, alert thresholds, Recovery criteria, Final Lock rules, or backup schema changes.

## Production Validation Center
A new Validation Center is embedded in the existing Production Pilot area.

It provides:
- persistent validation runs that survive app/browser reopen
- 12-step real-device workflow protocol
- PASS / FAIL / BLOCKED / Not run status per step
- technical evidence snapshot captured when a step is marked or manually captured
- device label and build/device signature
- recent run history
- target display for 20 consecutive PASS runs on the same build/device signature
- JSON export for validation evidence

## Validation protocol
The required run covers:
1. device readiness baseline
2. active-case save/resume
3. OR LIVE repeated documentation
4. medication documentation semantics
5. screen lock/background ≥5 minutes
6. force-close/reopen
7. offline/reconnect
8. Recovery/handoff/complete
9. Final Lock → Archive VERIFIED
10. schema-3 backup → verify file
11. restore drill in a disposable profile
12. orientation/soft-keyboard/endurance behavior

## Evidence privacy
Validation evidence intentionally records technical state only, including phase, lock state, timer state, record/event/drug counts, save age, connectivity, runtime-error count, archive verification state, and Data Safety status.

Patient name, HN, microchip, owner information, drug details, and vital values are not automatically copied into the validation report.

## Existing Production Pilot
The V16.17+ Production Pilot remains available and its readiness/lifecycle evidence is included in exported validation reports.

## Compatibility
- IndexedDB `DB_VERSION = 2` unchanged.
- Full backup `backupSchema = 3` unchanged.
- Clinical record schema unchanged.
- Existing V16.19.0 local clinical data and schema-3 backup files remain compatible.
- Critical clinical/runtime modules checked for this release are byte-identical to V16.19.0.

## Real-device status
Automated/static validation is not a substitute for actual-device evidence. Chromium headless in the build environment still times out with D-Bus/service-process errors, so interactive browser smoke is recorded as BLOCKED/PENDING rather than PASS.
