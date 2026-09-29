# Architecture — ANESVET V17.0.0 Identity, Roles & Multi-user Foundation

## Release intent
V17.0.0 turns the V16.21 local Security Baseline into a stable **single-device multi-user identity layer**. The release adds durable staff identities, role permissions, local sessions, device/session attribution, and explicit access gates while preserving the existing anesthesia clinical domains.

This is a foundation for future multi-device work. It does **not** introduce server authentication, cloud identity, concurrent editing, or cross-device synchronization.

## Identity registry
`security-baseline.js` remains the compatibility entry point and now exposes both:
- `ANESVET_SECURITY_BASELINE`
- `ANESVET_IDENTITY_ROLES`

The local registry migrates from schema 1 to schema 2 in place and keeps the existing storage key for compatibility. Each staff profile receives a stable `staffCode` in addition to its internal ID, display name, role, active state, and salted PIN credential.

PIN verification remains local and uses PBKDF2-SHA-256 with a random salt and 120,000 iterations. Plaintext PINs are not stored.

## Session and device context
A successful unlock creates a local session containing:
- `sessionId`
- `startedAt`
- `lastActivityAt`
- authenticated staff identity
- persistent local `deviceId`

Clinical/audit attribution can therefore distinguish **who was signed in**, **which app session documented the action**, and **which local device generated the record**.

## Permission model
V17.0.0 defines explicit permissions instead of relying only on role labels.

| Permission | Admin | Veterinarian | Nurse/Tech | Assistant |
|---|:---:|:---:|:---:|:---:|
| clinical-read | ✓ | ✓ | ✓ | ✓ |
| clinical-write | ✓ | ✓ | ✓ | ✓ |
| medication-document | ✓ | ✓ | ✓ | — |
| recovery-document | ✓ | ✓ | ✓ | ✓ |
| case-review | ✓ | ✓ | ✓ | — |
| backup-export | ✓ | ✓ | ✓ | — |
| restore-data | ✓ | — | — | — |
| final-signoff | ✓ | ✓ | — | — |
| protocol-review/publish/manage | ✓ | ✓ | — | — |
| manage-users / manage-security | ✓ | — | — | — |

The permission layer is deliberately conservative for destructive or governance actions. It does not infer clinical competence and does not decide treatment.

## Clinical attribution
The existing clinical record schema is extended non-destructively where documentation is created:
- vital snapshots can include `documentedBy`
- timeline/events can include `documentedBy`
- medication administration documentation can include `documentedBy`
- Recovery observations/scores/transfer snapshots can include `documentedBy`
- audit/protocol-audit rows can include staff/session/device metadata
- Final Sign-off stores staff/session/device attribution after re-authentication

For medications, `administeredBy` remains semantically separate from `documentedBy`. The person entering the record is not automatically asserted to be the person who physically administered the drug.

## High-risk authorization
High-risk actions use explicit permission checks and, where configured, PIN re-authentication:
- Final Sign-off: Admin/Vet + re-auth
- Protocol governance: Admin/Vet authenticated actor
- Restore / Restore rollback: Admin + re-auth
- Staff/security management: Admin + re-auth

Backup export and Case Review are restricted to Admin/Vet/Nurse when Security is enabled.

## Backup/security boundary
Local credential material is intentionally **excluded** from Full Backup Schema 3. Clinical backup/restore therefore does not clone PIN hashes or the local staff-security registry onto another device.

This preserves the V16.19 Data Safety integrity model while keeping credential enrollment device-local. A restored/new device must establish its own staff identity registry.

## Compatibility
- IndexedDB `DB_VERSION = 2` unchanged.
- Full Backup `backupSchema = 3` unchanged.
- Existing V16.22 clinical records remain readable.
- V16.21/V16.22 local security registry is migrated in place.
- Critical selected clinical/runtime modules remain byte-identical to V16.22.0.
