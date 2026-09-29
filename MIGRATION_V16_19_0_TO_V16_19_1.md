# Migration — V16.19.0 → V16.19.1

No clinical database migration is required.

## Unchanged
- IndexedDB `DB_VERSION = 2`
- clinical record format
- patient/archive stores
- Final Lock checksum semantics
- Full Backup `backupSchema = 3`
- schema-2 legacy restore compatibility
- Recovery, medication, dose, alert, and archive rules

## New local metadata
V16.19.1 may create three localStorage keys for Production Validation Center metadata:
- `anesvet_v16_19_1_validation_runs`
- `anesvet_v16_19_1_active_validation_run`
- `anesvet_v16_19_1_validation_device_label`

Deleting/resetting those keys does not delete clinical case data.

## Update procedure
Normal PWA update behavior is unchanged. An active mutable case should still not be deliberately reloaded merely to obtain the update; finish/save the case according to the existing PWA update safety workflow.
