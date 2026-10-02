# ANESVET V17.7.3 — Medication Workflow Hardening

## Changes
- After a non-induction medication is saved, the medication workspace remains open and selects the next not-yet-recorded candidate rather than potentially returning to the same drug.
- Recovery medication uses the same continuous-entry behavior.
- Existing induction workflow remains continuous and retains retrospective administration time linked to the Induction milestone.
- `Other medication` waits two animation frames after closing the native dialog before reopening the generic medication workspace, reducing mobile/native-dialog lifecycle collisions.
- Expanded route datalist where needed with common selectable routes: IV, IM, SC, PO, CRI, ET, IO, IN, TOPICAL, LOCAL. Route remains editable.
- Missing concentration remains manually enterable and is still required for a saved administration; no medication-safety requirement was removed.

## Safety boundary
No intended changes to calculated dose, frozen protocol/BW validation, actual-volume confirmation, required administered-by/route/concentration fields, duplicate/void audit, medication timestamps, Recovery lock, or case storage schema.

## Validation
JavaScript syntax, HTML references/IDs, service-worker assets, version consistency and medication-workflow static regressions checked. Browser/device E2E remains required.
