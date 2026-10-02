# ANESVET V17.8.1 — One-tap Medication

## Goal
Reduce repeated data entry during OR LIVE without turning a medication tap into an unconfirmed administration.

## Behavior
For a frozen/planned medication with all actionable data available:
1. Opening/recording the medication automatically prefills calculated mL.
2. Route is prefilled from the frozen Case Drug Plan.
3. Concentration/preparation is prefilled from the frozen Case Drug Plan.
4. Actual mL remains editable.
5. Primary action becomes `Confirm given`.
6. Existing confirmation dialog/text remains mandatory before the administration record is committed.
7. After save, the medication workspace remains open and advances to the next unrecorded drug.

If calculation, route or concentration is incomplete, ANESVET falls back to the existing manual workflow and does not silently invent values.

## Safety
- No automatic medication administration record is created by opening a drug.
- BW/case/protocol snapshot mismatch still causes SAFETY STOP.
- Actual >0, route, administered-by and concentration remain required.
- Audit trail, retrospective induction timestamps, void behavior and reconciliation are unchanged.
- Geno V Cefazolin/Convenia use their frozen hospital preparation profiles from V17.7.4/17.7.5.
