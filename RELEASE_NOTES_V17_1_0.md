# ANESVET V17.1.0 — Multi-device Sync Foundation

V17.1.0 continues directly from V17.0.0 and adds a synchronization foundation without introducing a real remote backend or claiming production-safe concurrent multi-device editing.

## Local-save-first integration
Clinical persistence remains authoritative on the current device. The app only captures a synchronization mutation after the existing local save verification and active safety checkpoint succeed. Sync failure, offline state, adapter failure, or conflict does not block local OR documentation.

## Synchronization metadata
Each synchronizable mutation envelope can carry:
- `caseId`
- `recordId`
- `revision`
- `operationId`
- `deviceId`
- `sessionId`
- `actorId`
- `createdAt`
- `modifiedAt`
- `baseRevision`
- record type, operation, payload, and payload hash

Existing clinical IDs are reused; synchronization metadata is stored outside the signed clinical payload.

## Durable operation queue
The experimental queue persists locally across reload/force-close and tracks:
- pending
- acknowledged
- failed
- conflict

Operation IDs are idempotent. ACK-loss retry is designed not to duplicate the canonical mutation.

The queue is mirrored into the existing IndexedDB `meta` store when available, so `DB_VERSION` remains 2. Corrupt queue text is preserved as recovery evidence instead of modifying clinical data.

## Canonical adapter boundary
A provider-neutral interface is now defined:
- `pushOperations()`
- `pullChanges()`
- `getCaseRevision()`
- `acknowledgeOperations()`

V17.1.0 ships only a deterministic local/mock canonical adapter for regression and architecture work. No Firebase, Supabase, LAN server, or cloud provider is hard-coded into clinical-domain code.

## Conflict foundation
There is no silent last-write-wins behavior.

First-pass policies:
- append-only vital/event rows: stale append may merge when `recordId` is new
- medication administration: a distinct new record may append, but a stale change to an existing medication record becomes a conflict
- Final Sign-off / Final Lock / Archive / clinical VOID: strict stale-revision conflict
- patient demographics/settings/case snapshots: explicit review conflict
- conflict evidence preserves local payload and remote evidence

## UI / safety gate
A compact Sync Foundation panel is added under Settings. It is experimental and disabled by default. It exposes queue counts, offline/error/conflict state, local mock sync, retry diagnostics, and recent conflict evidence without adding controls to OR LIVE.

## Compatibility
- `DB_VERSION = 2` unchanged
- `backupSchema = 3` unchanged
- V17.0 identity/roles/security registry retained
- `administeredBy` remains separate from `documentedBy`
- selected critical clinical/runtime modules remain byte-identical to V17.0.0

## Validation status
Targeted sync regression and static QA are included in the release package. Browser/PWA interactive acceptance remains separate from static QA and requires real-device testing before any production multi-device rollout.
