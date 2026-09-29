# Architecture — ANESVET V16.20.0 Hospital Protocol Governance

## Release intent
V16.20.0 adds configuration lifecycle governance without rewriting the existing clinical calculation/runtime layers.

## `hospital-protocol-governance.js`
Owns non-case protocol lifecycle metadata:
- registry persistence in `anesvet_v16_20_protocol_registry`
- Draft / Reviewed / Published / Retired state transitions
- active published protocol identity
- deterministic configuration fingerprint for display/audit plus exact canonical payload comparison for safety gates
- legacy locked-protocol bootstrap
- review/publish drift detection
- new-case start-gate decision
- case governance metadata snapshot
- version history rendering/export

### Registry schema
`ANESVET_PROTOCOL_REGISTRY_V1`, schema 1.

Each version stores an exact copy of the governed configuration payload:
- protocol name/version
- alert protocol defaults
- built-in medication dose/factor configuration
- governed concentrations
- Hospital Drug Library snapshot
- Quick Presets snapshot

Operational settings such as screen behavior, report preference, pilot reporter information, and patient/case data are not part of the protocol fingerprint.

## Integration with existing settings
The existing Hospital Settings / Drug Library / Quick Presets remain the working editor. Governance controls when those working values may become a PUBLISHED protocol.

- PUBLISHED: configuration remains locked.
- Create Draft: published configuration is copied to the working editor and unlocked.
- REVIEWED: exact working configuration fingerprint is recorded.
- Publish: current fingerprint must still equal the reviewed fingerprint; configuration is re-applied and locked.
- Discard Draft: last active published configuration is restored and locked.

## Start Case gate
`validateCaseReadyToStart()` calls the governance start gate for first case start only.

The gate allows:
- legacy/unmanaged mode when no V16.20 registry exists, for backward compatibility
- exact active PUBLISHED configuration (canonical payload equality)

The gate blocks:
- DRAFT/REVIEWED working version
- no active PUBLISHED version after governance has begun
- live configuration drift from the active PUBLISHED snapshot

## Case freeze
The existing `captureProtocolSnapshot()` remains the source of frozen clinical protocol data and now adds a `governance` metadata object. The frozen built-in protocol, alert thresholds, drug library, quick presets and Case Drug Plan remain the clinical runtime source after Start Case.

## Backup integration
`backup-restore-controller.js` now includes the registry as `protocolGovernance` in the existing schema-3 Full Backup. Restore and rollback include its localStorage key.

`backupSchema` remains 3 and IndexedDB `DB_VERSION` remains 2.

## Production Validation integration
V16.20 validation evidence adds only a sanitized governance summary:
- managed/unmanaged
- active published version
- working draft/review status/version

No protocol drug details are copied into the validation evidence summary.
