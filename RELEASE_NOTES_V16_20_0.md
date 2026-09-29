# ANESVET V16.20.0 — Hospital Protocol Governance

V16.20.0 introduces a versioned hospital protocol lifecycle on top of V16.19.1 Production Validation. The release does **not** change dose calculations, medication-administration semantics, alert classification, Recovery criteria, Final Lock rules, or the IndexedDB clinical schema.

## Protocol lifecycle
Hospital protocol configuration can now move through:

**DRAFT → REVIEWED → PUBLISHED → RETIRED**

The governance registry stores each version separately with:
- protocol ID, name, version, parent version
- status and timestamps
- reviewer / publisher / retirement attribution entered by the user
- review / publish notes
- exact configuration snapshot
- deterministic content fingerprint for human-readable change tracking
- version-specific governance audit trail

Only one PUBLISHED protocol is active at a time. Publishing a new reviewed version automatically retires the previous active published version as superseded.

## New-case safety gate
Once governance is in use:
- a new case is blocked while a DRAFT or REVIEWED working version exists
- a new case is blocked if no PUBLISHED version is active
- a new case is blocked if the live hospital configuration no longer exactly matches the active PUBLISHED snapshot (canonical payload comparison)

Existing active cases are not rewritten. Protocol governance changes are disabled while a mutable case is active.

Legacy/unmanaged configuration remains backward compatible until the hospital creates its first governed draft. A previously locked V16.19.x protocol with a version is automatically imported into the registry as a legacy PUBLISHED version on first V16.20 startup.

## Review before publish
Marking a governance draft REVIEWED requires the existing Protocol Dose Review to be current for the exact saved medication-dose configuration. If the governed configuration changes after REVIEWED, publication is rejected until it is reviewed again. Publication/start gates compare the canonical configuration payload, not only the short display fingerprint.

The governance review does not imply that ANESVET has independently validated clinical appropriateness. It records the hospital's workflow and review state.

## Case protocol freeze
At Start Case, the existing frozen `protocolSnapshot` now also stores governance metadata when available:
- protocol ID
- PUBLISHED status
- name/version
- reviewed/published timestamps and entered-by fields
- content fingerprint
- parent protocol ID

The case continues using its frozen protocol snapshot even if a later hospital protocol version is published after that case.

## Backup / restore
Full Backup remains `backupSchema = 3` and now also carries the Hospital Protocol Governance registry. The registry is therefore covered by the existing whole-file SHA-256 backup manifest. Restore/rollback includes the governance registry.

The clinical-dataset SHA-256 digest remains scoped to clinical current/archive/patient data; protocol registry integrity is covered by the whole-backup-file digest rather than changing the clinical checksum model.

## Compatibility
- `DB_VERSION = 2` unchanged.
- `backupSchema = 3` unchanged.
- Clinical case record schema remains backward compatible.
- Existing schema-2/schema-3 backup compatibility is retained.
- Existing clinical domains/controllers checked for this release are byte-identical to V16.19.1.

## Real-device validation
System Chromium in the build environment still times out with D-Bus/service-process errors. Browser/PWA interactive validation therefore remains **BLOCKED / PENDING**, not PASS. Run V16.20.0 through the Production Validation Center on the actual hospital Android/Windows/iPad profiles before production use.
