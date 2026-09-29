# Architecture — ANESVET V16.21.0 Security Baseline

## Release intent
Add a migration-safe local identity/access-control layer before future multi-user and multi-device architecture, without rewriting clinical domains or changing the IndexedDB clinical schema.

## `security-baseline.js`
Owns local security metadata and UI:
- local staff registry
- role labels and coarse permission map
- PBKDF2-SHA-256 PIN derivation
- launch lock / manual lock / background lock
- active local identity
- action re-authentication dialog
- Settings staff-management panel
- local security audit
- sanitized security snapshot for diagnostics/validation

### Local registry
Storage key:
`anesvet_v16_21_security_registry`

Format:
`ANESVET_SECURITY_REGISTRY_V1`

The registry contains local staff display names, roles, active status, PIN salt/hash/KDF iteration count and local security audit metadata.

Raw PIN values are not persisted.

## PIN derivation
Credential material is derived with Web Crypto:

`PBKDF2 -> SHA-256 -> 256-bit derived value`

Each user receives a random 16-byte salt. Current iteration count: `120,000`.

This is an application-layer local PIN. It is not intended to resist an unlimited offline attack against a compromised device profile as strongly as a high-entropy password or hardware-backed credential.

## Session model
The unlocked identity exists only in JavaScript memory for the current app instance. A reload/restart therefore requires PIN unlock again when security is enabled.

When locked:
- a fixed security overlay is shown
- normal body surfaces are set `inert`
- app-level clinical-write gating also rejects writes

When the app returns from background after the configured threshold, the session is locked.

## Permission baseline
| Action | Admin | Vet | Nurse/Tech | Assistant |
| --- | --- | --- | --- | --- |
| Clinical documentation | yes | yes | yes | yes |
| Final Sign-off | yes | yes | no | no |
| Protocol review/publish/manage | yes | yes | no | no |
| Manage local staff security | yes | no | no | no |

This table is groundwork for V17 RBAC, not the final authorization model.

## Final Sign-off integration
`finalization-archive-controller.js` calls the Security Baseline action-authentication adapter when local security is enabled. Authenticated identity metadata is stored in the sign-off object before the normal Final Lock checksum is generated.

The legacy path remains available only when local security has not been enabled.

## Protocol Governance integration
`hospital-protocol-governance.js` uses authenticated local identity for governance actions when Security Baseline is enabled. In unmanaged/migration mode it retains the existing free-text actor path for backward compatibility.

## Central audit integration
`app.js` enriches central case/protocol audit entries with local authenticated identity metadata when available. Fresh action re-authentication is tracked separately from the currently unlocked session identity.

## Backup boundary
Security credentials are **not** included in `ANESVET_BACKUP` schema 3. This is deliberate so a clinical backup file does not become a portable local PIN credential database.

The existing protocol registry, clinical cases, Patient Master and configuration backup behavior remain unchanged.

## Persisted clinical schema
- IndexedDB `DB_VERSION = 2`
- Full Backup `backupSchema = 3`
- no clinical database migration
- no server identity store
- no cloud synchronization
