# Migration — V16.19.1 → V16.20.0

No IndexedDB migration is required. `DB_VERSION` remains 2.

## On first load
1. Existing clinical case/archive/patient data is unchanged.
2. Existing Backup Schema 3 behavior is retained.
3. If Hospital Protocol is already locked **and** has a non-empty protocol version, V16.20 creates a governance registry and imports that exact current configuration as a legacy `PUBLISHED` version.
4. The imported record is marked `legacyImported = true`; migration does not invent a reviewer or retroactively claim formal V16.20 review.
5. If the previous protocol is unlocked or unversioned, the app remains in `UNMANAGED` compatibility mode until the hospital creates its first Draft.

## After governance starts
Creating a Draft enables the V16.20 start gate. While the draft is DRAFT/REVIEWED, new case start is blocked. Publish or discard the working version before starting another case.

## Backup compatibility
- New V16.20 schema-3 backups include `protocolGovernance`.
- V16.19.1 schema-3 backups without that field remain restoreable.
- Restoring an older locked/versioned protocol can be imported into governance on the next startup.
