# ANESVET Owner Map — V17.14.0

Runtime grouping ไม่เปลี่ยนจาก V17.13.20

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

## UX ownership verified in V17.14.0
- Shared viewport event → `runtime/platform/viewport-coordinator.js`
- Mobile keyboard/editing state → `runtime/platform/mobile-or-owner.js`
- Workspace disclosure/focus scroll guard → `runtime/platform/workspace-owner.js`
- OR Fast Vital + mobile End Surgery dock behavior → `runtime/controllers/or-live-controller.js`
- Mobile context shell + authoritative visible version → `mobile-design.js` reading `window.AnesvetApp.version`
- Recovery state/action controller → `runtime/controllers/recovery-controller.js`
- Recovery presentation/next-task → `recovery-end-refinement.js`
- Recovery final navigation/repeat state → `repeat-presentation-owner.js`
- Startup critical surface → inline `#avStartupCritical` in `index.html` + manifest theme/background

## Application version authority
- canonical version value → `app.js::APP_VERSION`
- public read-only presentation surface → `window.AnesvetApp.version`
- presentation code must not hard-code an older app version for user-visible status
