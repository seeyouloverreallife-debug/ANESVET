# ANESVET V14.8.0 — Adaptive Clinical Workflow

## Goal

V14.8.0 keeps the validated V14.7.2 anesthesia record, medication audit, configurable alerts and recovery workflow, while making OR LIVE adapt to the clinical context of the case.

## New workflow profiles

- **Routine / Elective** — compact fast-path documentation.
- **Emergency / Critical** — keeps pre-anesthetic stabilization/support checkpoints visible without changing treatment, drug dose, or alert thresholds.
- **Cesarean section / C-section** — adds first-neonate and last-neonate delivery milestones with elapsed timing from Induction.
- **Custom / Other** — neutral standard OR LIVE.

The selected workflow profile belongs to the case, not the Patient Master.

## OR LIVE changes

- Workflow badge added beside ASA and case phase.
- New adaptive context panel changes its quick actions and metrics by profile.
- Routine profile prioritizes Record and Medication access.
- Critical profile allows a **pre-anesthetic Stabilization checkpoint** without starting the anesthesia timer.
- Critical support checkpoints can also be documented before induction.
- C-section intraoperative primary action advances through:
  1. First neonate delivered
  2. Last neonate delivered
  3. Surgery end
- C-section context displays:
  - Induction → first neonate elapsed time
  - First → last neonate elapsed time
- Existing Surgery end remains accessible as a secondary action; V14.8 does not force a clinical sequence.

## Safety / compatibility

- No drug dose, concentration, fluid reference, alert threshold or recovery score changed.
- Existing storage keys remain `anesvet_v14_3_*`.
- IndexedDB remains `ANESVET_DB` version 2.
- Legacy/current cases without a workflow profile default to `Routine / Elective`.
- The adaptive profile changes documentation UI only; it does not choose an anesthetic protocol or treatment.
- V14.7.2 deferred multi-drug induction documentation remains intact.

## Test coverage added

- Static contracts for workflow selector, adaptive panel, critical checkpoint and C-section milestone paths.
- jsdom workflow test verifies:
  - pre-anesthetic stabilization does not start the anesthesia timer;
  - C-section primary flow advances through first/last neonate milestones.
