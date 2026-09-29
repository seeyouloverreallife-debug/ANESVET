# ANESVET V16.19.0 — Data Safety 2.0

V16.19.0 follows the V16.18 Architecture Hardening series and focuses on protection, verification, and visibility of local-first ANESVET data. No new clinical treatment logic is introduced.

## What changed

### Backup schema 3 with whole-file integrity manifest
Full backups created in V16.19.0 use `backupSchema = 3` and include an `integrityManifest` with:
- SHA-256 digest of the entire backup payload, excluding the manifest itself
- SHA-256 digest of the clinical dataset (`current`, `archive`, `patients`)
- expected case/patient counts and current case identifier

This is intended to detect accidental backup-file modification or corruption. It is not a digital signature and does not provide identity/authenticity guarantees against a party able to rewrite both the file and digest.

### Backup history
Each generated or verified backup creates/updates a local receipt containing:
- backup ID
- export time and source version
- backup schema
- archive/patient/locked-final counts
- whole-file and clinical digests when available
- file verification time/status
- user-confirmed off-device storage receipt when recorded

History is limited to the latest 50 receipts; the UI shows the latest 10.

### Verify backup file
A new **Verify backup file** action checks a downloaded JSON backup:
- JSON/ANESVET backup structure
- schema-3 whole-file SHA-256 manifest
- schema-3 clinical digest
- locked final record checksums when available

Schema-2/legacy backups remain readable and can receive a **legacy partial** verification, but cannot receive whole-file manifest verification because those files did not contain one.

### Off-device copy receipt
A new **Mark latest copy off-device** workflow lets the user record that a backup file was stored outside the current ANESVET browser/device, such as a hospital PC, cloud drive, USB/external drive, or NAS/server.

This is a user confirmation only. V16.19.0 does **not** upload to, authenticate with, or remotely verify the external destination.

### Post-restore verification
After restore, ANESVET now verifies the restored local dataset before reporting success:
- archive count
- patient count
- archive identifiers
- patient identifiers
- current case identity
- clinical SHA-256 digest for schema-3 backups

If post-restore verification fails, the restore transaction throws an error and the existing pre-restore rollback path is used.

### Data Safety 2.0 panel
Case Management now shows:
- latest fully verified backup file
- off-device copy status
- last restore verification
- backup history count and recent receipts

## Compatibility
- IndexedDB `DB_VERSION` remains **2**.
- Existing clinical record formats are unchanged.
- Existing schema-2 backups remain restoreable.
- Schema-3 backups are produced by V16.19.0.
- Existing Final Lock, Archive Assurance, Recovery, medication, dose, and alert logic are not changed in this release.

## Real-device validation still required
The sandbox Chromium browser smoke remains blocked by the environment. Before production deployment, verify the complete backup → external copy → file verification → restore → restart workflow on the actual Android/Windows/iPad device profile used by the hospital.
