# ANESVET V16.0.0 — Unified Case Timeline & Anesthesia Record

## Major version rationale

V16 is a product-architecture milestone. ANESVET now has a central case record layer that assembles existing structured clinical data into one timeline and record view instead of requiring the user to inspect separate workflow sections.

## Added

- Unified Case Timeline from:
  - procedure/workflow events
  - confirmed medication administrations
  - anesthesia vital records
  - alert episodes and resolutions
  - alert interventions
  - structured complications and resolutions
  - recovery vital records
  - selected workflow audit transitions
- Focus timeline mode:
  - always retains first and latest anesthesia vital records
  - retains warning/critical vitals and vitals with notes
  - retains medication, workflow, alert, intervention, complication and recovery items
  - hides only routine intermediate vital items
- Full timeline mode for complete review of every vital record.
- Record overview cards for case status, frozen protocol, vital count, medication count, active problems and recovery status.
- Compact record trend sparklines for HR, MAP, SpO₂, ETCO₂ and temperature with min–max–latest summaries.
- Record integrity panel with record/case identity, final-lock checksum state, last-save time and frozen protocol.
- Full PDF report now includes a focused Unified Case Timeline in addition to the unchanged detailed anesthesia record table and audit sections.
- Direct Timeline actions for 1-page Summary, Full Anesthesia Record and Full Trends.

## Safety / data behavior

- No new clinical thresholds or drug calculations were introduced.
- Timeline is a derived read view; it does not replace or mutate source vital, medication, alert or recovery records.
- Abnormal anesthesia vital classification uses the record's frozen alert protocol when available for MAP / SpO₂ / ETCO₂ / temperature.
- HR/RR screening follows the existing ANESVET display logic; no existing alert workflow was changed.
- Recovery timeline classification uses the recovery record's alert protocol when available.
- Detailed serial vital records remain available in the Full timeline and the full PDF anesthesia table.

## Compatibility

The current localStorage / IndexedDB keys and case persistence model are retained. No destructive V16 data migration is required.

## Modules intentionally unchanged from V15.29.0

- `clinical-validation.js`
- `clinical-workflow.js`
- `drug-dose-reference.js`
- `protocol-review.js`
- `medication-reconciliation.js`
- `finalization.js`
