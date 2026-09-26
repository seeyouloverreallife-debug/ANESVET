# ANESVET V15.29.0 — Recovery & Handoff 2.0

## Goal
Make the OR → Recovery → handoff transition shorter, abnormal-first, and less dependent on retyping information already present in the anesthesia record.

## Changes
- Reworked Recovery Handoff into a compact clinical snapshot.
- Added WATCH / HANDOFF FIRST for unresolved alerts, active complications, airway concern, latest MAP/SpO2/Temperature warnings from the active case alert protocol, oxygen/mentation concern, emergency return, and optional handoff note.
- Added automatic Actual Medication grouping: Analgesia, Antibiotic, NSAID. Each summary includes actual amount, administration time and route when recorded.
- Added a compact case timeline with anesthesia/recovery milestones and key medication timestamps.
- Added handoff readiness chips for Vitals, Checklist, Score, Extubation and unresolved Problems. These are display aids only and do not replace or alter the existing Recovery completion criteria.
- Added optional `Extra handoff / watch note`; normal V15.28 debounced autosave applies.
- A final schema-2 handoff snapshot is captured when Recovery is marked complete. Older schema-1 handoff snapshots remain readable.
- Recovery Handoff is opened on first V15.29 use; the user's later collapse preference is preserved.
- `More → Handoff` now opens a collapsed handoff panel before scrolling to it.
- Full handoff detail and snapshot history remain available inside collapsed detail sections.

## Safety boundaries
- No drug dose, concentration, calculation, alert threshold, medication reconciliation, finalization, or clinical validation logic was changed.
- Handoff classification is descriptive: it groups recorded administrations and surfaces unresolved/abnormal case data. It does not prescribe treatment or automatically clear problems.
- Latest-vital WATCH items use the case's active alert protocol instead of introducing new thresholds.

## Compatibility
- Existing local storage keys and case/archive schemas remain compatible.
- New `recHandoffNote` is optional.
- Existing recovery handoff snapshots without V15.29 fields remain displayable.
