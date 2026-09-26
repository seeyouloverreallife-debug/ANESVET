# ANESVET V15.25.0 — OR LIVE Safer Mobile Dock

Base: V15.24.0 — OR Vitals Fast Entry

## Goal

Make the fixed mobile controls in OR LIVE match what is actually used most often during surgery, while reducing accidental workflow transitions and accidental duplicate vital records.

## Changes

### 1. Phase-aware mobile OR dock

During **Intraoperative** phase the fixed bottom dock is now:

- `RECORD VITALS`
- `MEDS`
- `MORE`

The next phase action (normally **END SURGERY**) is no longer kept as a large fixed button beside the vital button during active surgery.

Outside Intra-op, the existing phase-driven Next Step behavior remains available.

### 2. Deliberate workflow transition during Intra-op

The current next workflow action remains available from:

- the OR LIVE workflow card, and
- `MORE` → workflow transition.

The existing confirmation workflow is preserved. No phase-transition logic was removed.

### 3. Medication pending count in the fixed dock

During Intra-op, MEDS shows the number of routine medications in the frozen Case Drug Plan that still have no matching Actual administration record, for example:

`MEDS • 2`

Tapping MEDS still opens the existing OR medication workspace. Planned medication matching and Medication Reconciliation rules are unchanged.

### 4. Exact double-save guard for anesthesia vitals

If the exact same anesthesia record is submitted again within **12 seconds** of the latest saved record, ANESVET prevents the duplicate and shows a feedback message instead of creating another record.

The comparison includes:

- HR / RR / SAP / MAP / DAP
- SpO2 / ETCO2 / Temperature
- vaporizer / oxygen flow
- fluid rate / fluid total
- depth / ventilation
- note

Changing any of these fields permits the new record to save normally.

This is a documentation double-tap guard only. It does not alter monitoring intervals or interpret whether unchanged physiology should be recorded later.

## Preserved safety behavior

V15.25.0 does **not** change:

- medication calculations or dose references
- medication-safety gates
- clinical validation calculations
- alert thresholds / alert protocol
- Finalization logic
- Medication Reconciliation logic
- V15.24 FILL BLANKS behavior
- frozen Case Drug Plan semantics

## Version

App version: `15.25.0`

Service-worker cache: `anesvet-v15-25-0-or-live-safer-mobile-dock`
