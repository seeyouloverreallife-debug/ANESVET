# Migration — V16.18.5 → V16.18.6

## Data migration
None.

- `DB_VERSION = 2` unchanged
- `backupSchema = 2` unchanged
- storage keys unchanged
- current-case format unchanged
- archive format unchanged
- patient format unchanged
- checksum algorithm / payload unchanged
- no medication / Recovery / alert migration

## Code migration
Backup / Restore transaction ownership moves from `app.js` to `backup-restore-controller.js`.

Compatibility wrappers retained in `app.js`:
- `renderBackupHealth()`
- `backupAllData()`
- `getLastBackupEpoch()`
- `verifyBackupPayloadIntegrity()`
- `buildBackupPayload()`
- `downloadBackupPayload()`
- `applyRestorePayload()`
- `rollbackLastRestore()`
- `getPreRestoreSnapshot()`
- `clearPreRestoreSnapshot()`
- `verifyAllArchiveIntegrity()`
- `recoveryCopyStatus()`

`window.AnesvetDataBridge` is now installed by the Backup / Restore Controller with the same bridge methods consumed by `data-resilience.js`.

## Deployment
Replace the V16.18.5 package with V16.18.6 and allow the new Service Worker cache to activate. Existing local clinical data and existing V16 backup files require no conversion.

Before production use, test on a disposable/test device:
1. create Full Backup
2. verify backup file can be selected and previewed
3. Restore into a non-production test dataset
4. verify archive/patient/current-case counts
5. Rollback last restore
6. force-close/reopen after restore
7. verify a locked final record integrity audit
