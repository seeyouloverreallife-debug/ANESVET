# Migration — V16.16.0 → V16.17.0

## Data migration
None required.

- IndexedDB `DB_VERSION` remains `2`.
- Current case and archived case clinical schemas are unchanged.
- Existing V16.16 Final Lock and Final Archive Assurance records remain compatible.
- Existing backups remain restorable under the existing backup schema rules.

## New device-local technical keys
V16.17 may create:
- `anesvet_v16_17_pilot_acceptance`
- `anesvet_v16_17_lifecycle_log`
- `anesvet_v16_17_last_readiness`

These keys contain production-pilot/testing information only and do not alter the clinical record.

## Recommended update procedure
1. If a mutable case is active, finish/finalize it or preserve it according to the existing update guard before installing the new service worker.
2. Update to V16.17.0.
3. Open **Settings → Production Pilot — Real-device Reliability**.
4. Run **Device readiness** on each physical device intended for OR use.
5. Complete the real-device acceptance matrix before treating that device/configuration as production-accepted.
6. Export the pilot report and keep it with the release QA evidence if required.
