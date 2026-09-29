# ANESVET V17.0.0 — Identity, Roles & Multi-user Foundation

V17.0.0 is the first V17 release. It upgrades the local Security Baseline into a structured staff identity, role, session, and attribution foundation while keeping the core anesthesia workflow and clinical rules unchanged.

## Staff identity and local sessions
Each enabled staff account now has:
- stable internal staff ID
- stable staff code
- display name
- role
- active/inactive state
- local PIN credential
- last-login metadata

Unlocking ANESVET creates a local session with a `sessionId` and persistent local `deviceId`. The current identity can be switched without changing clinical case identity fields automatically.

## Staff administration
Administrators can now:
- add staff
- edit staff name/role
- reset PIN
- activate/deactivate staff
- inspect the local identity/security audit

Safety rules prevent removing the last active Administrator and prevent deactivating the identity that is currently signed in until another user is selected.

## Role-based permissions
The release adds explicit action permissions. When Security is enabled:
- all roles can read/write general clinical documentation
- Admin/Vet/Nurse can document medication administration
- Admin/Vet/Nurse can use Case Review and export Full Backup
- only Admin can Restore/Rollback and manage users/security
- Admin/Vet can Final Sign-off and manage Hospital Protocol Governance

When Security is disabled, the existing unmanaged/legacy workflow remains available for compatibility.

## Documentation attribution
ANESVET can now attach local actor/session/device context to newly created documentation. This includes central audit records and selected vital/event/medication/Recovery documentation paths.

Medication semantics remain explicit: **`administeredBy` is not replaced by `documentedBy`**.

## Final Sign-off and governance
Final Sign-off remains a PIN re-authenticated action when Security is enabled and now records staff code, session ID, device ID, and authentication method in addition to the existing signer identity metadata.

Hospital Protocol Governance continues to use authenticated Admin/Vet actors.

## Backup/Restore access control
- Full Backup export: Admin/Vet/Nurse
- Restore: Admin only, with re-authentication
- Restore rollback: Admin only, with re-authentication

Credential hashes and the local identity registry are intentionally excluded from Full Backup Schema 3.

## Compatibility
- `DB_VERSION = 2` unchanged.
- `backupSchema = 3` unchanged.
- Core dose, alert, OR, Recovery, medication reconciliation, Final Lock, and Archive Assurance logic is unchanged.
- Local V16.21+ staff/security data migrates to identity registry schema 2 in place.

## Validation status
Static and targeted identity/access-control regressions pass in the build environment. Interactive Chromium smoke remains blocked by the sandbox D-Bus/service-process environment, so Android/Windows/iPad real-device testing is still required before production reliance.
