# ANESVET V16.7.0 — Data Resilience & Disaster Recovery

## Goal
V16.7 strengthens data durability and restore safety without changing anesthesia dose logic, alert thresholds, recovery criteria, medication reconciliation, or Final Lock rules.

## Data Health Center
The Cases / Archive page now shows:
- browser database backend
- persistent-storage status
- estimated storage usage/quota and a Good / Getting full / Critical indicator
- backup coverage compared with newer local data
- locked-record integrity audit status
- available recovery sources: safety checkpoint, IndexedDB current mirror, and pre-restore rollback snapshot

`Protect local storage` requests the browser Storage Persistence API when available. Granting persistence is browser-controlled and is not a replacement for an external backup.

## Backup schema 2 + preflight
Full backup now includes:
- `backupSchema: 2`
- backup ID, source app version, export timestamp
- archive / locked / voided / patient counts
- current-case identity and last-saved metadata
- storage backend metadata

Before download ANESVET displays backup coverage and verifies locked-record checksums that can be verified.
A local backup receipt is recorded so Data Health can detect when newer cases/current-case changes exist after the last backup.

## Restore Preview
Restore no longer jumps directly from file selection to replacement.
The preview shows:
- source version/schema/date
- current device dataset vs backup-file dataset
- locked-record checksum results
- warning when the backup came from a newer ANESVET version
- warning when an editable current case will be replaced

A checksum mismatch requires explicit `RESTORE` override text.

## Pre-restore rollback
When IndexedDB is available, ANESVET saves the complete current dataset as `pre_restore_backup` before destructive restore.
The archive, Patient Master, and current mirror are then replaced in one IndexedDB transaction.
Data Health exposes `Rollback last restore` while that snapshot exists.

If IndexedDB is unavailable, restore can fall back to localStorage but ANESVET reports that a rollback snapshot is unavailable rather than claiming it was saved.

## Archive integrity audit
`Verify all locked records` performs a batch checksum audit without modifying archived clinical records.
Legacy records without a supported checksum are reported as unverifiable rather than failed.

## Reliability fixes found during V16.7 work
1. **Fallback archive reload bug** — `ARCHIVE_KEY` writes to `anesvet_v14_3_archive_legacy`, but the legacy reader previously started at v14.2. V16.7 reads the current fallback key first, so localStorage fallback archives survive reload as intended.
2. **IndexedDB meta write reporting** — `idbPutMeta()` now returns success/failure. Pre-restore rollback is only reported as saved after a successful write.
3. Restore failure handling restores prior localStorage values and attempts to restore the pre-restore dataset to IndexedDB/in-memory caches when a rollback payload is available.

## Compatibility
- Existing V16.6 local data uses the same storage keys and database schema.
- No reset is required.
- Older `ANESVET_BACKUP` files without `backupSchema: 2` are still accepted if their core structure is valid.
- New V16.7 backups include additional metadata but retain the same `ANESVET_BACKUP` format identifier.
