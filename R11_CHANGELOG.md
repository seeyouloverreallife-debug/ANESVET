# ANESVET V17.2.15 — R11 Storage-safe Startup

## Source
- Based strictly on V17.2.14 R10 checkpoint; **not rebuilt**.
- Focus: storage read/write failures during startup and legacy current-case reload.
- No clinical thresholds, dose calculation, patient database schema, or OR LIVE logic changed.

## Bug evidence from R10 source
- app.js `load()` read legacy current snapshots in a chain without independent try/catch. If any first version held malformed JSON or a blocked storage read, scanning stopped before later valid snapshots.
- Startup directly read ALERT_PREF_KEY and TAB_KEY; blocked localStorage reads could abort initialization.
- Mirrored current-case restore attempted an unguarded localStorage write after confirmation.

## Fix in R11
- Validate each legacy snapshot independently in historical priority order; malformed/unavailable candidates do not conceal later valid snapshots.
- Retain v3, v4/v5, v6.1, v7/v8, v9 migrations, using a clone of source data.
- Do not auto-overwrite unreadable primary current data with older legacy state. Show a visible recovery notice and load the older candidate in memory only; instruct backup/review.
- Verify legacy migration write/readback. On blocked or silently dropped writes, show warning rather than claiming persistent recovery.
- Safeguard startup preference reads; handle mirror write rejection without crashing asynchronous bootstrap.
- Existing safety checkpoint takes priority. Patient Safety Gate, clinical workflow and case schema left unchanged.

## QA
- `node RUN_R11_QA.js`: 16/16 test suites, 99/99 JS syntax, 0 missing cache/HTML assets, 0 duplicate HTML IDs.
- `node QA_R11_STORAGE_SAFE_STARTUP.js`: 20/20 simulated storage scenarios.
- `QA_R11_RESULTS.json`, `CHECKPOINT_R11_SOURCE_PARITY.json`, `SHA256SUMS_R11.txt` for evidence.
- **Browser E2E and Android/iPad device testing NOT completed.** Simulations do not prove browser storage or PWA behavior on real devices.

## Safety
- **Do not uninstall PWA, clear site data, overwrite an active case or switch to this build on a production-only device.**
- Export backup and independently verify on a second test device/origin BEFORE upgrading a device holding clinical data.
- If a recovery banner reports storage write failure, do not close or rely on the on-screen state being saved. Export a verified backup.
- `index.html` is the web entry; deploy entire directory to a separate test origin/URL. DO NOT deploy the old and new files selectively.

## Next R12
- Validate actual Android/iPad cold start, tab sleep/wake and real localStorage/IndexedDB failover via separate test origin; fix only confirmed failures. Do not claim production-ready until validated.
