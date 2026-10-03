# ANESVET V17.7.4 — Geno V Hospital Preparation Profiles

## Hospital-specific medication configuration
These are explicitly stored as Geno V Pet Care hospital protocols, not universal drug-reference rules.

### Cefazolin
- Hospital preparation: 1,000 mg vial + sterile water 4 mL.
- Working concentration: 250 mg/mL.
- Geno V volume rule: BW ÷ 10 mL.
- Default route in ANESVET: IV.
- Case Drug Plan and frozen protocol snapshot preserve preparation/provenance.

### Convenia
- Hospital concentration: 80 mg/mL.
- Geno V volume rule: BW ÷ 10 mL.
- Default route in ANESVET: SC.
- Case Drug Plan and frozen protocol snapshot preserve concentration/provenance.

## Workflow fix
- Removed the old intentional `PREP REQUIRED` hard-block for these two built-in Geno V presets.
- Their calculated BW÷10 volume is now actionable and can flow into the Case Drug Plan / OR LIVE medication workspace.
- Medication recording still requires actual administered volume, route, administered-by and concentration confirmation.
- The frozen case protocol records the Geno V preparation profile so later hospital-setting changes do not silently rewrite an active case.

## Scope
No changes to other medication formulas or external/general drug reference data.
