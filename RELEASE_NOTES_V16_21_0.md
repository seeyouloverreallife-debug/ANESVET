# ANESVET V16.21.0 — Security Baseline

V16.21.0 adds a local staff-identity and access-control baseline on top of V16.20.0 Hospital Protocol Governance. The release is intentionally migration-safe: existing V16.20 installs remain usable until the hospital creates the first local Administrator and explicitly enables local security.

## Local staff identity + PIN
When local security is enabled, ANESVET stores a local staff directory with the roles:
- Administrator
- Veterinarian
- Veterinary nurse / technician
- Assistant

PINs are never stored as plaintext. ANESVET stores a per-user random salt plus a PBKDF2-SHA-256 derived hash (`120,000` iterations) in the local browser profile.

PINs are numeric, 6–12 digits. This improves ordinary local access control but is not equivalent to server authentication, hardware-backed credentials, or a qualified electronic signature.

## Session lock
Once security is enabled:
- app launch/reload starts in a locked state
- unlock requires an active staff profile + PIN
- the user can manually lock from the identity chip or Settings
- background locking is configurable at 5 / 15 / 30 / 60 minutes
- while locked, the app UI is covered by the security overlay and the underlying application surface is marked inert
- `clinicalWriteAllowed()` also rejects clinical writes while the local security session is locked
- after 5 failed PIN attempts, local PIN entry is temporarily throttled for 30 seconds in memory

The default background-lock interval is 15 minutes to reduce interruption during active OR work.

## Role groundwork
V16.21 introduces the first local permission map:
- all active local roles may document clinical data
- Administrator / Veterinarian may perform Final Sign-off
- Administrator / Veterinarian may review/publish/manage Hospital Protocol Governance
- only Administrator may manage local staff security

This is deliberately a coarse baseline. It is not yet full hospital RBAC.

## Authenticated Final Sign-off
When local security is enabled, Final Sign-off requires PIN re-authentication. The authenticated local staff identity is stored in the new sign-off entry as:
- display name
- local staff ID
- staff role
- `authMethod = local-pin`

The authenticated staff name must match the corresponding case-team field before sign-off is accepted. Existing unmanaged installs retain the previous sign-off behavior until security is enabled.

## Authenticated Protocol Governance attribution
When local security is enabled, Draft / Review / Publish / Retire / Discard actions use PIN re-authentication instead of free-text actor entry. The authenticated staff display name is recorded in the existing protocol governance history.

## Audit identity metadata
Case and protocol audit entries created through the central audit path can now additionally carry:
- `actorId`
- `actorRole`
- `authMethod`
- `authenticatedAt`
- `reauthenticated = true` when the action used fresh PIN re-authentication

This metadata supplements the existing human-readable `actor` field. It does not change locked legacy records.

## Credential backup policy
The local security credential registry is **intentionally excluded from Full Backup / Restore**. Clinical backup files therefore do not contain PIN salts/hashes.

Cases remain self-describing because authenticated audit/sign-off entries store the staff name/ID/role that performed the recorded action. A restored ANESVET profile must enroll its local staff security separately.

## Compatibility
- IndexedDB `DB_VERSION = 2` unchanged.
- Full Backup `backupSchema = 3` unchanged.
- Existing clinical record schema remains readable.
- Existing V16.20 Protocol Governance registry remains compatible.
- Existing clinical dose, alert, OR, Recovery, medication-reconciliation and Final Archive Assurance logic are not changed.
- `finalization-archive-controller.js` is intentionally changed only to add optional authenticated Final Sign-off attribution when local security is enabled.

## Real-device validation
System Chromium in the build environment still times out with D-Bus/service-process errors. Interactive browser/PWA smoke therefore remains **BLOCKED / PENDING**, not PASS. V16.21 must be tested through the Production Validation Center on actual hospital Android/Windows/iPad profiles before production deployment.
