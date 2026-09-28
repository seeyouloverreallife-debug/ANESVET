# Migration — V16.2 → V16.3

No data migration is required.

## Preserved
- current-case storage keys
- archive and Patient Master data
- IndexedDB database/version
- hospital settings / alert protocol
- drug library / quick presets
- protocol audit
- dose-reference and reconciliation data

## New UI preference
`anesvet_v163_patient_optional_open` stores only whether the phone Patient form has secondary identity details expanded. It contains no clinical record data.

## Update note
The service-worker cache name changes to `anesvet-v16-3-0-progressive-clinical-flow`. Finish/archive an active case before applying a PWA update, consistent with the existing ANESVET update guard.
