# ANESVET V16.18.6 — Backup / Restore Controller Extraction

## Summary
V16.18.6 continues Architecture Hardening by extracting Backup / Restore / Rollback / archive-integrity orchestration from `app.js` into `backup-restore-controller.js`. This release intentionally avoids changing backup schema, restore semantics, clinical records, checksum rules, or IndexedDB schema.

## Added
- `backup-restore-controller.js`
- architecture registry entry for Backup / Restore Controller
- Service Worker precache coverage for the new controller
- targeted Backup / Restore controller regression tests
- extraction-parity QA for backup/restore bridge paths

## Extracted from `app.js`
- backup health rendering
- legacy backup timestamp migration
- Full Backup payload construction
- backup receipt read/write
- backup JSON download orchestration
- backup payload integrity verification
- restore patient normalization
- clinical-store dataset replacement
- pre-restore rollback snapshot
- Restore transaction and automatic failure rollback
- Rollback last restore
- all-archive checksum audit
- safety-checkpoint/current-mirror/rollback-copy status
- Backup / Restore DOM bindings
- `window.AnesvetDataBridge` installation

Compatibility wrappers remain in `app.js` for internal callers and existing module contracts.

## Data safety boundary
No intentional change to:
- `ANESVET_BACKUP` format
- `backupSchema = 2`
- storage keys
- IndexedDB `DB_VERSION = 2`
- checksum payload/algorithm
- Final Lock / Final Archive Assurance
- archive/patient/current-case formats
- dose calculation
- medication confirmation
- alert thresholds
- Recovery criteria
- Documentation Guardian

## Architecture effect
`app.js` reduced from **4,035 → 3,980 lines** and **413,055 → 402,010 bytes**. Backup/restore transaction logic and the Data Resilience bridge are now controller-owned while IndexedDB implementation and Data Resilience UX remain separate.

## Browser smoke
System Chromium headless was attempted against the local HTTP build with a 20-second timeout. It timed out with environment D-Bus/service-process errors and produced no DOM output.

Status: **BLOCKED / PENDING**, not PASS.
