# Migration — V16.18.6 → V16.19.0

## Database
No IndexedDB migration is required. `DB_VERSION` remains **2**.

## Existing current and archived cases
No conversion is performed. Existing cases remain in their current persisted format.

## Backup format
V16.19.0 creates `ANESVET_BACKUP` files with `backupSchema = 3`.

New optional/required-for-schema-3 field:
- `integrityManifest`
  - `algorithm: SHA-256`
  - `payloadDigest`
  - `clinicalDigest`
  - counts/current-case metadata

V16.19.0 continues to read schema-2 backups. Since schema-2 files never contained a whole-file digest, they can only be checked using available locked-record checksums and structural validation.

## Backup history
Backup history is stored locally under a V16.19-specific metadata key. Existing V16.18.6 last-backup receipts are used as a legacy seed when no V16.19 history exists.

## External/off-device receipts
These are local metadata only. No file is uploaded and no external account is linked.

## Recommended migration check
1. Open the existing case/archive data in V16.19.0.
2. Create a new full backup.
3. Use **Verify backup file** on the downloaded file.
4. Copy that file to an off-device location and record the receipt.
5. Perform a restore test only in a disposable/test profile before using restore on the primary production device.
