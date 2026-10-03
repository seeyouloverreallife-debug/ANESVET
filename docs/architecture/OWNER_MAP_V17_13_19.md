# ANESVET Owner Map — V17.13.19

## Runtime foundation
- Lifecycle coordination → `runtime/platform/lifecycle-coordinator.js`
- Viewport coordination → `runtime/platform/viewport-coordinator.js`
- Workspace ownership → `runtime/platform/workspace-owner.js`
- Presentation ownership → `runtime/platform/presentation-ownership.js`
- Mobile OR state → `runtime/platform/mobile-or-owner.js`
- Drug dose reference → `runtime/clinical/drug-dose-reference.js`
- Protocol review → `runtime/clinical/protocol-review.js`
- Clinical workflow → `runtime/clinical/clinical-workflow.js`

## App foundation → runtime/core
Startup positions 9–18, exact order preserved:
- Shared UI/app shell → `runtime/core/app-shell.js`
- Case lifecycle queries → `runtime/core/case-lifecycle.js`
- Support report composer → `runtime/core/support.js`
- Reliability/environment helpers → `runtime/core/reliability.js`
- Hospital branding/settings → `runtime/core/branding.js`
- Clinical validation → `runtime/core/clinical-validation.js`
- Case runtime/checksum → `runtime/core/case-runtime.js`
- IndexedDB core storage → `runtime/core/core-storage.js`
- Multi-tab session coordination → `runtime/core/session-coordination.js`
- Session UI/ownership controller → `runtime/core/session-controller.js`

## Domain boundaries → runtime/domains
Startup positions 19–23:
- PWA/update lifecycle → `runtime/domains/pwa-controller.js`
- Dose-reference presentation boundary → `runtime/domains/dose-reference-controller.js`
- Patient domain helpers → `runtime/domains/patient-domain.js`
- OR domain helpers → `runtime/domains/or-domain.js`
- Recovery domain helpers → `runtime/domains/recovery-domain.js`

## Orchestration boundaries → runtime/orchestration
Startup positions 24–26:
- Patient record orchestration → `runtime/orchestration/patient-master-orchestration.js`
- OR vital record orchestration → `runtime/orchestration/or-record-orchestration.js`
- Recovery state orchestration → `runtime/orchestration/recovery-orchestration.js`

## Major workflow owners unchanged
- Patient + Pre-op → `patient-preop-simplification.js`
- Drug Plan → `drug-start-simplification.js`
- OR LIVE → `or-live-controller.js` + `or-workspace-restructure.js`
- Quick Drug → `medication-workspace-controller.js`
- Recovery → `recovery-end-refinement.js`
- Finalization → `finalization.js`
- Repeat/final review → `repeat-presentation-owner.js`
- Lazy knowledge orchestration → `knowledge-loader.js`
- Lazy knowledge implementation → `runtime/knowledge/*.js`
