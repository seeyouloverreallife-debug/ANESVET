# Migration — ANESVET V16.22.0 → V17.0.0

## Clinical/database migration
No IndexedDB migration is required.

- `DB_VERSION` remains **2**.
- Full Backup `backupSchema` remains **3**.
- Existing current case, archive, patient, protocol, Recovery, medication, and Final Lock data remain compatible.

## Security registry migration
The existing local V16.21/V16.22 security registry storage key is retained. On V17.0 startup, registry schema 1 is normalized to schema 2.

Migration adds/normalizes:
- stable `staffCode`
- updated role/session-compatible profile metadata
- V17 security version/schema fields

Existing salted PIN credentials are retained; users do not need to recreate their PIN solely because of the V17 upgrade.

## Device identity
V17.0 creates a persistent local device identity on first use. This identifier is used for audit attribution and is not a cryptographic hardware identity.

## Changed access behavior when Security is enabled
After upgrade:
- Assistant cannot document/void medication administration.
- Case Review is available to Admin/Vet/Nurse.
- Full Backup export is available to Admin/Vet/Nurse.
- Restore and Restore rollback require Admin re-authentication.
- Final Sign-off remains Admin/Vet with re-authentication.
- Hospital Protocol Governance remains Admin/Vet.
- General clinical documentation remains available to all four roles.

Review staff role assignments before using V17.0 with live cases.

## Backup warning
Clinical Full Backup intentionally does not include local PIN hashes or staff-security registry data. If V17.0 is installed on another device, restore clinical data first and then enroll/configure local staff identities separately.

## Recommended post-upgrade checks
1. Open Security / Identity settings and verify every staff display name and role.
2. Confirm at least one active Administrator exists.
3. Confirm each user can unlock with their existing PIN.
4. Test user switching and manual lock.
5. Confirm Nurse/Vet medication documentation permissions and Assistant restriction.
6. Test Final Sign-off re-authentication in a disposable/test case.
7. Test Full Backup authorization and Admin-only Restore in a disposable profile.
8. Run the V16.19.1 Production Validation protocol on each actual device/build profile.
