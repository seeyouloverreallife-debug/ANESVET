# R18 Changelog / Safety Audit

## Confirmed R17 defect
`applyRestorePayload` checked ownership at the beginning and after snapshot creation, but not after IndexedDB dataset replacement nor after asynchronous post-restore validation. If another tab took control mid-operation, the suspended tab could persist stale Current Case and issue a success receipt, or attempt automatic rollback over the new owner's changes.

## Changes
1. `backup-restore-controller.js`: `restoreSessionOwned()` / `requireRestoreOwner(stage)` introduced. New checks following async boundaries and immediately before/after verification receipt. When ownership is lost, no automatic rollback from the old tab; verified pre-restore snapshot stays available. Restore still performs normal rollback for errors while ownership remains valid.
2. `app.js`: supplies `canRestoreWrite` callback using Session ownership independent of Current-case freshness, which is expected to be stale while Restore mutates Current Case. Preflight `canWriteCurrent` remains unchanged.
3. `index.html`, `service-worker.js`, `manifest.webmanifest`: bump v17.2.22 and fresh cache.
4. R18 regression fixtures: verify takeover during DB init, transaction, read-back, failed writes, normal rollback and no false success. Historical tests remain unchanged.

## Explicit limitations
- Session checks are at JavaScript async boundaries. They do **not** make localStorage and IndexedDB atomic. A transaction already submitted before ownership transfer may still commit.
- A partial restore requires supervised reconciliation from the preserved snapshot/verified external backup, ideally from a single tab.
- No clinical, dosing, drug library schema, patient or OR LIVE logic changed.
- No physical device, sleep/wake, or Browser E2E evidence in this checkpoint.
