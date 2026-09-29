# ANESVET V17.2.0 — Backend-ready Sync & Conflict Review

V17.2.0 continues directly from V17.1.0 without rebuilding the application or changing established clinical calculation/Recovery/Finalization semantics.

## New: provider-neutral HTTP/LAN transport
A new `sync-transport.js` module defines the ANESVET Sync Protocol v1 boundary. It can target a future hospital LAN, cloud or hybrid canonical service without hard-coding a vendor into clinical-domain code.

Public plain HTTP endpoints are rejected; HTTP is accepted only for localhost/private LAN targets. Endpoint capability probing is available from Settings and sends no clinical case data.

## New: persistent case-level conflict hold
An unresolved conflict now blocks later queued sync operations for the same case across future sync passes. This closes a V17.1 safety gap where the initial sync pass stopped, but a later manual sync could otherwise attempt later same-case operations.

Local clinical documentation remains unaffected and continues saving locally.

## New: Conflict Review Center
Settings now shows unresolved conflicts with:
- record type and reason
- local/remote evidence preview
- review marker
- JSON evidence export

Review is intentionally non-resolving. There is no automatic rebase, overwrite or merge control in V17.2.0.

## New: pull preview
Remote changes can be queried through the canonical adapter and stored as preview evidence. Pull preview never applies changes to the active clinical state.

## Queue hardening
Never-attempted `case-snapshot` entries may be safely coalesced to reduce prolonged-offline queue growth. Medication and Final Lock operations are not coalesced.

Acknowledged queue compaction is available through the programmatic API and does not remove pending/conflict evidence.

## Fault injection
A deterministic adapter wrapper can simulate:
- transport failure before commit
- ACK loss after canonical commit
- delay

This supports repeatable idempotency and recovery regression.

## Compatibility
- `DB_VERSION = 2` unchanged
- `backupSchema = 3` unchanged
- V17.1 queue/conflict/revision keys retained
- identity/security schema retained
- `administeredBy` remains distinct from `documentedBy`
- selected critical clinical/runtime modules remain byte-identical to V17.1.0

## Production status
V17.2.0 remains an **experimental sync architecture release**. It is not a production concurrent multi-device release. Real-device browser acceptance and real two-device testing still remain required.
