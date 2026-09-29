# Migration — ANESVET V17.1.0 → V17.2.0

## Data migration
No IndexedDB schema bump is required.

- `DB_VERSION` remains 2.
- `backupSchema` remains 3.
- V17.1 sync queue, revision, conflict, canonical mock and status localStorage keys are intentionally retained.
- New V17.2 pull-preview and transport-probe keys are additive.
- Existing clinical case, archive, patient, protocol, Recovery, medication and Final Lock payloads are not rewritten by this migration.

## Behavioral change
The important safety change is conflict hold persistence across sync passes. If V17.1 already contains an open conflict, V17.2 treats that case as held and will not push later queued operations for the same case.

Conflict evidence may be marked reviewed, but review does not resolve or release the hold.

## Rollback caution
Because V17.2 intentionally retains V17.1 queue keys, reopening V17.1 may still see the same experimental queue/conflict data. Do not use rollback as a method of conflict resolution.
