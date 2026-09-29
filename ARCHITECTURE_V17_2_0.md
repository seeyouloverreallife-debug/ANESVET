# ANESVET V17.2.0 — Backend-ready Sync & Conflict Review Architecture

## Scope
V17.2.0 continues from V17.1.0. The release does not add a production server and does not enable production-safe concurrent multi-device editing.

## Layering
`Device UI → verified local clinical save → Sync Foundation → provider-neutral adapter → canonical server contract`

Local persistence remains authoritative during network failure. Synchronization remains secondary.

### Sync Transport
`sync-transport.js` defines a provider-neutral HTTP/LAN canonical adapter with:
- capability handshake
- push operations
- pull changes
- case revision lookup
- acknowledgements
- private-LAN HTTP safety restriction
- fault-injection wrapper for deterministic testing

No Firebase/Supabase/cloud vendor is embedded in clinical-domain code.

### Conflict safety
Unresolved conflicts now create a **case-level hold**. Future sync passes do not push later mutations for that case while an open conflict remains.

Conflict review is evidence-only in this release:
- mark evidence reviewed
- retain local and remote evidence
- export conflict JSON
- no overwrite/rebase/merge button
- review does not release the hold

This is deliberate for medication, Final Sign-off, Final Lock, Archive and clinical VOID.

### Remote pull boundary
Remote `pullChanges()` is implemented as **preview-only**. The result is stored in a bounded local preview ledger and is never auto-applied to clinical state.

### Offline queue control
Only unattempted `case-snapshot` entries may be coalesced, and only when there is no later unresolved same-case operation. Medication, Final Lock, append-only clinical records and conflict evidence are never coalesced by this mechanism.

## Compatibility
- IndexedDB `DB_VERSION = 2`
- Full Backup `backupSchema = 3`
- security registry schema 2
- existing V17.1 queue/conflict/revision keys retained so pending experimental queue data survives upgrade
- `administeredBy` remains separate from `documentedBy`
