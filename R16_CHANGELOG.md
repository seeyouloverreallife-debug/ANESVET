# R16 CHANGELOG — 17.2.20

## Fixed
- Verified persistence is a prerequisite for activating an archived Working Copy.
- A failed/missing/throwing current-case save no longer replaces in-memory `state` or triggers reload.
- Removed duplicate `queueCurrentMirror()` call in Working Copy flow; bridge queues committed payload.
- Explicit success/failure return for `loadArchive()`.

## Unchanged
- Case schema, drug dose calculator, clinical thresholds, Final Lock and medication documentation.
- Previous R01–R15 history and tests.

## Verification
- 16 focused Working Copy tests; 21/21 regression suites; 131 JavaScript syntax checks.
- Static checks: 1329 HTML IDs, 0 duplicates, 91 cached assets, 0 missing.
- Not browser E2E or real mobile test.

## R17 remaining
- Backup Restore must verify rollback snapshots and cross-store consistency, especially older backups without integrity manifests.
