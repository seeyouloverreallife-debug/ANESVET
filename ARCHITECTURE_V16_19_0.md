# Architecture — ANESVET V16.19.0 Data Safety 2.0

## Release intent
V16.19.0 is a data-protection release layered on top of the controller extraction completed in V16.18.6. Clinical domain/orchestration/controller behavior is intentionally left unchanged.

## New/changed components

### `backup-restore-controller.js`
Owns:
- schema-3 backup creation
- whole-payload SHA-256 manifest
- clinical-dataset SHA-256 digest
- backup history receipts
- backup-file verification
- off-device user receipts
- restore transaction
- post-restore verification
- pre-restore rollback
- locked archive integrity audit
- Data Resilience/Data Safety bridge APIs

### `data-safety-2.js`
UI/status layer for:
- latest fully verified backup file
- latest off-device receipt
- latest restore verification
- recent backup history
- Verify Backup File workflow
- Mark Off-device Copy workflow

It does not alter clinical records.

### `data-safety-2.css`
Responsive Data Safety 2.0 cards, history rows, status chips, and off-device receipt dialog.

### `data-resilience.js`
Extended to display schema-3 whole-file manifest status during Backup Preflight/Restore Preview and to pass the explicit locked-checksum override to Restore while still blocking whole-file/clinical manifest mismatch.

## Integrity model

### Backup-file layer
`payloadDigest = SHA256(canonical backup payload without integrityManifest)`

### Clinical dataset layer
`clinicalDigest = SHA256(canonical {current, archive, patients})`

Archive and patient arrays are sorted by stable identity before hashing so restore ordering does not create a false mismatch.

### Final-record layer
Existing Final Lock checksums remain unchanged and independent of the backup-file manifest.

## Restore transaction
1. Parse and structurally validate ANESVET backup.
2. Verify schema-3 payload/clinical manifest when present.
3. Evaluate locked-final checksum mismatches.
4. Create pre-restore rollback snapshot.
5. Replace local dataset/configuration.
6. Verify restored archive/patient counts and identities/current case.
7. For schema 3, recompute and compare clinical SHA-256 digest.
8. Record restore verification receipt only after verification succeeds.
9. If verification fails, raise an error and use the rollback path.

## Persisted schema
- IndexedDB `DB_VERSION = 2` unchanged.
- Clinical record schema unchanged.
- Full backup file schema changes from 2 to 3.
- Schema-2 restore compatibility retained.
