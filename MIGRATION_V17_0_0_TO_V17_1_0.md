# Migration — ANESVET V17.0.0 → V17.1.0

## Database / backup
No IndexedDB version migration is required.

- `DB_VERSION` remains 2
- `backupSchema` remains 3
- existing `cases`, `patients` and `meta` stores are retained
- V17.0 clinical records, archives, Patient Master and identity/security registry remain compatible

## New V17.1 local keys
V17.1 adds isolated experimental sync keys for configuration, queue, revisions, conflicts, mock canonical state and status. They do not replace current clinical storage.

## Upgrade behavior
After upgrade:
1. Existing V17.0 case data loads through the existing path.
2. Sync Foundation is disabled by default.
3. No remote connection is attempted.
4. Local documentation behavior is unchanged until the experimental mock foundation is explicitly enabled.
5. Existing locked/checksummed records are not rewritten to add synchronization metadata.

## Rollback note
Because clinical database and backup schemas are unchanged, the V17.1 sync foundation does not require rewriting clinical records. Experimental sync keys may remain in browser storage if rolling back, but older releases do not use them.
