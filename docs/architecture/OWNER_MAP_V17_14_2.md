# ANESVET Owner Map — V17.14.2

Runtime grouping ไม่เปลี่ยนจาก V17.14.0

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
Positions 27–33: Patient Master, Pre-op, Medication Workspace, OR LIVE, Recovery, Backup/Restore, Finalization/Archive.

## V17.14.2 OR medication queue ownership
- planned-medication timing classification → `runtime/controllers/or-live-controller.js`
- queue expanded/compact presentation state → `runtime/controllers/or-live-controller.js`
- queue DOM surface → `index.html#orMedicationQueue`
- queue visual rules → `src/styles/canonical/style.css` → `assets/css/anesvet-ui-bundle.css`
- actual medication administration remains owned by `runtime/controllers/medication-workspace-controller.js`

Presentation compacting must never create/modify a medication administration record.


## V17.14.2 pilot evidence authority
- `simulation-mode.js`: current build version from `AnesvetApp.version`; simulation remains sandboxed.
- `production-pilot.js`: current-build readiness evidence only.
- `validation-center.js`: current-build active/history qualification evidence.
- Clinical production ownership and startup order are unchanged.
