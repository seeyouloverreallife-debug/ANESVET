# Migration — V16.6 RC1 → V16.7.0

## No database reset required
V16.7 keeps the existing ANESVET current-case keys, Patient Master, archive database, clinical record structure, and Final Lock/checksum model.

Update the application files in place on the **same origin / URL / installed PWA** so the browser continues to use the same local storage area.

## After update
1. Open `Cases / Archive`.
2. Confirm Database shows IndexedDB when supported.
3. Review **Data resilience**.
4. Press `Protect local storage` if the browser reports best-effort storage.
5. Press `Verify all locked records` once.
6. Create a new V16.7 full backup and keep it outside the ANESVET device.

## Backup compatibility
- V16.7 reads older backups with `format: ANESVET_BACKUP` even when `backupSchema` is absent.
- V16.7-created backups use schema 2 and add summary/coverage metadata.
- A backup created by a newer ANESVET version triggers a compatibility warning before restore.

## Restore change
Restore now has a preview step. When IndexedDB is available, ANESVET attempts to save a pre-restore rollback snapshot before replacing the dataset.

Do not treat rollback as the primary backup strategy. Maintain external backup files according to hospital policy.
