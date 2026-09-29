# ANESVET Sync Protocol v1 — Canonical Server Contract (V17.2.0)

This document defines the provider-neutral boundary required by ANESVET V17.2.0. It is a contract for a future hospital LAN, cloud, or hybrid canonical backend. V17.2.0 does not ship a production canonical server.

## Transport and safety
- Protocol name: `anesvet-sync`
- Protocol version: `1`
- JSON over HTTP(S)
- Public/non-private endpoints must use HTTPS.
- Plain HTTP is accepted by the client only for localhost/private LAN hosts.
- Clinical documentation is local-first. A network failure must never block local clinical save.
- Server operations must be idempotent by `operationId`.
- The server must not silently last-write-wins a clinical conflict.
- Server time may be returned, but device timestamps remain evidence and must not be silently rewritten.

## Capability handshake
`GET /api/anesvet-sync/v1/capabilities`

Minimum response:
```json
{
  "protocol": "anesvet-sync",
  "protocolVersion": 1,
  "canonical": true,
  "serverTime": 0
}
```

The client rejects an endpoint that does not identify itself as protocol v1 canonical storage.

## Push mutation envelopes
`POST /api/anesvet-sync/v1/operations`

Request:
```json
{
  "protocol": "anesvet-sync",
  "protocolVersion": 1,
  "operations": [
    {
      "caseId": "...",
      "recordId": "...",
      "revision": 1,
      "operationId": "...",
      "deviceId": "...",
      "sessionId": "...",
      "actorId": "...",
      "createdAt": 0,
      "modifiedAt": 0,
      "baseRevision": 0,
      "recordType": "case-snapshot",
      "operation": "upsert",
      "payload": {},
      "payloadHash": "..."
    }
  ]
}
```

The client also sends `X-ANESVET-Operation-Ids` for diagnostics/idempotency tracing.

Response:
```json
{
  "results": [
    {
      "ok": true,
      "status": "acknowledged",
      "operationId": "...",
      "caseId": "...",
      "recordId": "...",
      "canonicalRevision": 2,
      "mergedStaleAppend": false
    }
  ]
}
```

Conflict response for one operation:
```json
{
  "ok": false,
  "status": "conflict",
  "conflict": {
    "operationId": "...",
    "caseId": "...",
    "recordId": "...",
    "recordType": "medication",
    "baseRevision": 1,
    "canonicalRevision": 2,
    "reason": "MEDICATION_CONFLICT",
    "remoteRecord": {},
    "localPayload": {}
  }
}
```

## Pull changes
`GET /api/anesvet-sync/v1/cases/{caseId}/changes?sinceRevision={n}`

Response:
```json
{
  "caseId": "...",
  "revision": 4,
  "changes": []
}
```

V17.2.0 stores pull results only as preview evidence. It does not apply remote changes to clinical state.

## Current case revision
`GET /api/anesvet-sync/v1/cases/{caseId}/revision`

Response:
```json
{"revision": 4}
```

## Acknowledgement endpoint
`POST /api/anesvet-sync/v1/acknowledgements`

Request:
```json
{"operationIds": ["..."]}
```

Response:
```json
{"acknowledged": ["..."]}
```

## Required conflict policy
- New stable-ID vital/event rows may append when stale if no same `recordId` exists.
- Medication changes to an existing record must conflict rather than collapse.
- Final Sign-off, Final Lock, Archive and clinical VOID use strict stale-revision conflict.
- Patient/settings/case-document concurrent changes require explicit review.
- No server-side silent overwrite of conflicting clinical records.

## Authentication boundary
Authentication is intentionally outside the clinical-domain module. A production server must provide authenticated/authorized requests, device enrollment/revocation, and server-side authorization. V17.2.0's HTTP adapter accepts externally supplied headers but does not define or store production credentials.
