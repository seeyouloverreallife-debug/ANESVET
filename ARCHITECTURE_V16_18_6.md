# ANESVET V16.18.6 — Architecture Hardening Phase 10

## Goal
Continue incremental controller extraction without changing backup schema, restore transaction semantics, rollback behavior, archive integrity rules, or clinical data format.

## New ownership boundary

### `backup-restore-controller.js`
Owns:
- backup age / storage-health summary used by Settings
- legacy backup timestamp migration
- Full Backup payload construction
- backup receipt persistence
- backup JSON download orchestration
- backup payload checksum validation for locked SHA-256 records
- patient normalization for legacy/partial backup payloads
- IndexedDB clinical-store replacement during Restore
- automatic pre-restore rollback snapshot
- Restore localStorage dataset replacement
- automatic rollback attempt on Restore failure
- manual Rollback last restore
- all-archive integrity audit
- recovery-copy status (safety checkpoint / current mirror / pre-restore snapshot)
- Backup / Restore DOM event bindings
- `window.AnesvetDataBridge` used by `data-resilience.js`

The controller receives storage, checksum, patient-normalization, Procedure Template, settings/library, cache, state, and restart services through dependency injection.

## Preserved boundaries
The following remain outside this controller:
- `core-storage.js` IndexedDB implementation and schema
- `case-runtime.js` clinical checksum payload definition and SHA-256 implementation
- `data-resilience.js` Backup Preflight / Restore Preview / persistence UX
- `finalization-archive-controller.js` Final Lock → Archive → Verify flow
- `reliability.js` and Production Pilot lifecycle diagnostics
- report/PDF builders
- clinical domains and orchestration

## Layer model
```text
Controller
├── patient-master-controller.js
├── preop-controller.js
├── or-live-controller.js
├── medication-workspace-controller.js
├── recovery-controller.js
├── finalization-archive-controller.js
├── backup-restore-controller.js        ← new extraction
└── dose-reference-controller.js

Data safety UX
└── data-resilience.js
    └── AnesvetDataBridge
        └── backup-restore-controller.js
            ├── core-storage.js
            ├── case-runtime checksum service
            └── app-owned configuration/cache services

App composition
└── app.js
    ├── case/procedure composition
    ├── protocol + Drug Library configuration
    ├── shared report/handoff builders
    ├── fluid/problem/alert services
    └── controller dependency wiring
```

## Compatibility contract
Unchanged:
- `DB_VERSION = 2`
- `backupSchema = 2`
- `ANESVET_BACKUP` format identifier
- current-case / archive / patient storage formats
- storage key names
- Full Backup includes settings, drug library, quick presets, procedure templates, protocol audit, breed aliases, and pilot feedback queue
- pre-restore rollback snapshot behavior
- locked SHA-256 checksum verification behavior
- legacy FNV1A records remain non-SHA-verifiable in backup-wide integrity audit
- Final Lock / Archive Assurance semantics

## Next architecture sequence
1. Real-device regression of Backup → Restore → Rollback on Android/Windows PWA
2. Optional Protocol / Settings controller boundary if regression remains stable
3. Close V16.18 Architecture Hardening with controller → storage integration tests
4. Begin V16.19 Data Safety 2.0 only after restore-path reliability is demonstrated

Do not combine the next extraction with major clinical behavior changes.
