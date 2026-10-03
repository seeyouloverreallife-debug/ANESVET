# Controller Dependency Audit — V17.13.20

## Scope
Startup positions 27–33:
1. `patient-master-controller.js`
2. `preop-controller.js`
3. `medication-workspace-controller.js`
4. `or-live-controller.js`
5. `recovery-controller.js`
6. `backup-restore-controller.js`
7. `finalization-archive-controller.js`

## Findings
All seven controllers are path-safe for relocation. None depends on relative `fetch()`, dynamic `import()`, `new URL()`, `currentScript`, `importScripts`, or Worker-relative resources.

The group is contiguous in startup order and consumes foundation/domain/orchestration globals loaded before it. Internal behavior remains injected through controller contexts and stable `window.ANESVET_*` ownership boundaries.

## Protected behavior
- Patient Master keeps patient-domain/orchestration integration and anesthesia-history behavior.
- Pre-op keeps structured examination and BOAS/risk contracts.
- Medication workspace keeps current-weight safety and Quick Drug behavior.
- OR LIVE keeps prepared-induction details-pending, timestamp-only Intubation and Fast Vital ownership.
- Recovery keeps Recovery domain/orchestration integration and Emergency Return.
- Backup/Restore keeps integrity manifest and restore-journal safeguards.
- Finalization/Archive keeps dual sign-off and locked-record protection.

## Migration decision
Move all seven together to `runtime/controllers/` while preserving startup positions 27–33.

## Source preservation
Five controllers are byte-identical to V17.13.19. `medication-workspace-controller.js` and `or-live-controller.js` differ only by the V17.13.20 release stamp.
