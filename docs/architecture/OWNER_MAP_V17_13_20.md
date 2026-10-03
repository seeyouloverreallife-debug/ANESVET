# ANESVET Owner Map — V17.13.20

## Platform → runtime/platform
Positions 1–5: lifecycle, viewport, workspace, presentation and mobile-OR ownership.

## Clinical foundation → runtime/clinical
Positions 6–8: dose reference, protocol review and clinical workflow.

## App foundation → runtime/core
Positions 9–18: app shell, case lifecycle, support, reliability, branding, validation, case runtime, core storage and session ownership.

## Domains → runtime/domains
Positions 19–23: PWA, dose-reference presentation, Patient, OR and Recovery domains.

## Orchestration → runtime/orchestration
Positions 24–26: Patient record, OR record and Recovery orchestration.

## Controllers → runtime/controllers
Positions 27–33, exact order preserved:
- Patient master → `runtime/controllers/patient-master-controller.js`
- Pre-op → `runtime/controllers/preop-controller.js`
- Medication workspace / Quick Drug → `runtime/controllers/medication-workspace-controller.js`
- OR LIVE → `runtime/controllers/or-live-controller.js`
- Recovery → `runtime/controllers/recovery-controller.js`
- Backup / Restore → `runtime/controllers/backup-restore-controller.js`
- Finalization / Archive → `runtime/controllers/finalization-archive-controller.js`

## Higher workflow owners unchanged
- Patient + Pre-op simplification → `patient-preop-simplification.js`
- Drug Plan → `drug-start-simplification.js`
- OR workspace presentation → `or-workspace-restructure.js`
- Recovery presentation → `recovery-end-refinement.js`
- Finalization workflow → `finalization.js`
- Repeat/final review → `repeat-presentation-owner.js`
- Lazy knowledge loader → `knowledge-loader.js`
