# Migration — V16.18.4 → V16.18.5

## Data migration
None.

- `DB_VERSION = 2` unchanged
- storage keys unchanged
- current-case format unchanged
- archive format unchanged
- checksum algorithm / payload unchanged
- no medication / Recovery / alert migration

## Code migration
Finalization and archive UI/orchestration ownership moves from `app.js` to `finalization-archive-controller.js`.

Compatibility wrappers retained in `app.js`:
- `renderFinalSignoff()`
- `renderEndCase()`
- `focusMedicationReconciliation()`
- `archiveSnapshot()`
- `getArchive()`
- `verifyFinalArchive()`
- `retryFinalArchive()`
- `renderArchives()`

## Deployment
Replace the V16.18.4 package with V16.18.5 and allow the new Service Worker cache to activate. Existing local clinical data should remain readable without conversion.

Before production use, run a real-device regression through Recovery → End Case → Final Lock → Archive VERIFIED → Start new case, plus amendment and VOID on an archived test case.
