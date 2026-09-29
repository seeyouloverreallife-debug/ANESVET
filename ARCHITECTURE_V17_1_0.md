# Architecture — ANESVET V17.1.0 Multi-device Sync Foundation

## Scope
V17.1.0 establishes the boundary:

`Device → local clinical store → mutation envelope / durable queue → sync engine → canonical adapter`

The canonical adapter is local/mock in this release. The architecture intentionally avoids selecting Firebase, Supabase, a custom LAN server, or a cloud service inside clinical-domain code.

## Authoritative local write path
The existing current-case localStorage write, verification, IndexedDB current mirror, and safety checkpoint remain the clinical write path. Sync capture is secondary and runs only after verified local persistence.

A synchronization error is therefore not a clinical-save error.

## Storage compatibility
- IndexedDB database: `ANESVET_DB`
- `DB_VERSION = 2`
- existing stores remain `cases`, `patients`, `meta`
- queue/revision/conflict/status mirrors use namespaced records in the existing `meta` store
- local queue/config/mock-canonical state uses isolated V17.1 localStorage keys
- Full Backup remains schema 3 and does not include local identity credentials or experimental sync internals

## Mutation envelope
Required fields are generated without replacing existing clinical identifiers:

```text
caseId
recordId
revision
operationId
deviceId
sessionId
actorId
createdAt
modifiedAt
baseRevision
```

Additional fields: `recordType`, `operation`, `payload`, `payloadHash`, queue state and retry metadata.

## Revision model
Each case tracks:
- known canonical revision
- projected local revision
- last acknowledged revision

A queued mutation receives `baseRevision = projectedRevision` and `revision = baseRevision + 1`. This permits an offline local sequence to remain ordered. A remote canonical revision mismatch is detected when processing the queue.

## Queue state machine
`pending → acknowledged`

or

`pending → failed → pending` after retry

or

`pending → conflict`

Conflicted operations are retained. Dependent operations for the same case are not processed past an open conflict during the same sync pass.

## Idempotency
The canonical adapter records `operationId` acknowledgements. Re-delivery of an already-applied operation returns the original acknowledgement instead of applying the mutation again. This covers the ACK-lost/retry case.

## Conflict policy
### Append-safe
- `vital`
- `event`

A stale append can merge if its stable `recordId` does not already exist.

### Medication
A stale new medication record can be preserved as a distinct append. A stale update to an existing medication administration is a conflict and is never auto-collapsed.

### Strict
- Final Sign-off
- Final Lock
- Archive
- clinical VOID

Any stale base revision blocks automatic application.

### Review required
- patient demographics
- settings
- case snapshot/document

Concurrent changes are preserved for explicit review.

## Canonical adapter interface
The engine depends only on:

```js
pushOperations(operations)
pullChanges({ caseId, sinceRevision })
getCaseRevision(caseId)
acknowledgeOperations(operationIds)
```

A local/mock implementation is provided for deterministic tests.

## UI boundary
Sync status is intentionally kept in Settings rather than OR LIVE. Status vocabulary includes Local only, Pending, Mock synced, Conflict, Offline and Error.

## Safety boundary
V17.1.0 is not a production multi-device release. There is no real central server, remote authentication, remote account revocation, server-attested clock, or validated two-device concurrent workflow.
