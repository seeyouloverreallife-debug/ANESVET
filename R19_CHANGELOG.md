# R19 Change Log — ANESVET V17.2.23

## Changed production files
- `backup-restore-controller.js`: journal + persistent readback at boundaries; interrupt detection / warning; guarded per-key Restore; supervised Review gate. Retains verified pre-restore snapshot.
- `app.js`: fail-closed clinical Save / Clinical Write / startup Current Case writing for unfinished Restore marker, plus bootstrap freshness lock.
- `index.html`, `manifest.webmanifest`, `service-worker.js`: synchronized version/cache bump only.

## Added tests
- `QA_R19_TRANSACTION_JOURNAL.js` (20 scenarios)
- `QA_R19_RUN_ALL.js` (cumulative regression gate)
- R19 copies of version-specific Navigation, ASA, and Boot checks
- Five R19 compatibility copies of previous VM regression fixtures, loading the actual R19 journal guard function; original historical QA files preserved unchanged.

## Safety details
- Journal and rollback snapshot are separate objects: journal has no clinical payload, rollback snapshot stores the verified prior dataset.
- A failed or interrupted Restore leaves journal + snapshot for supervised review and prevents starting a second Restore.
- `REVIEW` is a manual sign-off, not an automatic merge or automatic rollback. It is blocked if Journal/snapshot or local/IDB Current Case disagree.
- Verified automatic rollback may retire the marker; unverified rollback intentionally stays blocked.

## Known limitations
- No cross-storage atomicity, and no browser/device end-to-end validation.
- Cannot infer recovery completeness from the journal alone: the recorded stage is the **last confirmed checkpoint**, not a proof that later writes did not happen.
- On journal-storage corruption or local/IDB disagreement, manual forensic recovery is required; do not clear browser data.
