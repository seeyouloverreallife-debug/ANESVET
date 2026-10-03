# ANESVET V17.11.2 — Induction Given / Details Review

## Corrected induction semantics
- Pressing **Induction** means the prepared medications in the frozen Case Drug Plan with phase `induction` are considered **given at the Induction timestamp**.
- ANESVET does not invent a finalized actual-dose record at that moment. Each medication is stored as **Given • details pending** until its actual details are reviewed.
- This keeps the clinical workflow fast while preserving a visible documentation obligation.

## Review later
- The prepared induction drug buttons remain available after Induction.
- Pressing a drug later opens its medication review/editor.
- Default administration time = the original Induction time.
- The clinician may edit the administration time if that drug was actually given earlier/later than the others.
- Actual amount still defaults to Calculated-as-Given when the frozen plan supports it, and can be changed.
- Route, concentration/preparation, administrator and notes remain reviewable.

## Audit/data integrity
- Final confirmation creates the authoritative Drug Administration record and resolves that drug's provisional Given status.
- If administration time is changed, the record notes that it was adjusted from the Induction time.
- Induction medication review cannot be marked complete while any provisional medication still has details pending.
- Workflow Undo restores/removes the provisional induction set together with the Induction step.
- Medication Queue shows these as **GIVEN • REVIEW**, not as medications that have not been given.

Intubation remains timestamp-only. Airway, ventilator and fluid documentation remain deferred until the patient is stable.
