# Architecture — ANESVET V16.19.1 Production Validation

## Release intent
V16.19.1 adds a non-clinical validation layer on top of V16.19.0. Clinical domains and data-safety semantics remain unchanged.

## `validation-center.js`
Owns real-device validation evidence only:
- active validation run
- validation run history
- 12-step protocol state
- technical evidence snapshots
- build/device signature
- consecutive PASS evidence counter
- validation report export

It reads clinical state only through a narrow adapter and stores a sanitized summary rather than patient/owner details or clinical values.

## Persistence
Validation metadata is stored separately from clinical records in localStorage:
- `anesvet_v16_19_1_validation_runs`
- `anesvet_v16_19_1_active_validation_run`
- `anesvet_v16_19_1_validation_device_label`

These keys are non-clinical metadata and are not part of the Final Lock clinical checksum or schema-3 clinical dataset digest.

## Evidence model
Each marked step can capture:
- timestamp
- online / visibility / viewport state
- current phase and whether the case is locked
- timer-running flag
- vital-record / event / drug-documentation counts
- age of most recent local save
- local runtime-error count
- Final Archive Assurance status when applicable
- Data Safety 2.0 summary (verified backup, off-device receipt, restore verification)
- Production Pilot readiness summary

The validation layer does not decide whether treatment was clinically appropriate.

## Run result
A run is:
- `PASS` only when all required steps are PASS
- `FAIL` when any required step is FAIL
- `BLOCKED` when no required failure exists but at least one required step is BLOCKED
- `INCOMPLETE` while required steps remain Not run
- `ABORTED` when explicitly aborted

The UI displays progress toward 20 consecutive PASS runs on the same build/device signature as evidence accumulation. This is not regulatory certification.

## Existing architecture
Controller extraction from V16.18.x remains intact. V16.19 Data Safety 2.0 remains the backup/restore integrity layer. The Validation Center is registered in `architecture-registry.js` as a non-clinical module.
