# ANESVET V17.8.0 — Full Workflow Validation Baseline

## Automated workflow regression
New `QA_V17_8_0_WORKFLOW.js` validates the current release rather than relying on historical V17.5.4 QA output.

Coverage includes:
- phase order/tracker invariants
- Recovery begin/complete orchestration
- emergency-return access semantics
- active-case reload safety and final sealed-case behavior
- Start Case identity/procedure/protocol freeze contract
- Surgery End milestone transition
- Extubation → milestone → Recovery-controller path
- Recovery save/navigation and completion → End Case
- workflow undo protection after clinical data
- Geno V Cefazolin/Convenia hospital profiles
- medication actual-confirmation safety
- continuous medication entry
- phase persistence ordering
- Final Lock lifecycle integration

Result at packaging: **20/20 PASS**.

## Important limitation
This is Node pure-model + source-contract regression, not browser/device E2E. Playwright and jsdom are not installed in the execution environment. `QA_V17_8_0_PHYSICAL_CHECKLIST_TH.md` is included for Android/PWA testing of keyboard, fullscreen, cold start, touch workflow and reload behavior.

## Clinical/data scope
No clinical formula, alert threshold, medication rule, storage schema, final-lock rule, or Recovery readiness criterion was intentionally changed in this release. V17.8.0 establishes a tested baseline before One-tap Medication work.
