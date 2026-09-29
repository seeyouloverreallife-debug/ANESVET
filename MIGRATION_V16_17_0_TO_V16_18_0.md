# Migration — ANESVET V16.17.0 → V16.18.0

## Data migration
No clinical-data migration is required.

Unchanged:
- IndexedDB database: `ANESVET_DB`
- `DB_VERSION = 2`
- current case key: `anesvet_v14_3_current`
- archive storage semantics
- Patient Master data
- settings / hospital protocol keys
- medication library / quick preset keys
- Production Pilot acceptance/lifecycle keys

## Upgrade behavior
V16.18 uses a new service-worker cache namespace:
`anesvet-v16-18-0-architecture-hardening`

The normal PWA update guard still defers version reload while a mutable current case exists. A Final Locked/sealed case or a blank case can safely accept the update according to the existing release-safety query.

## Rollback
Because the persisted clinical schema is unchanged, V16.17 and V16.18 use compatible case/archive data structures. Before any manual rollback, create a verified Full Backup as normal.
