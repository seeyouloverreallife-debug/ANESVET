# ANESVET Owner Map — V17.13.15

## Runtime foundation
- Lifecycle coordination → `runtime/platform/lifecycle-coordinator.js`
- Viewport coordination → `runtime/platform/viewport-coordinator.js`
- Workspace ownership → `runtime/platform/workspace-owner.js`
- Presentation ownership → `runtime/platform/presentation-ownership.js`
- Mobile OR state → `runtime/platform/mobile-or-owner.js`
- Drug dose reference → `runtime/clinical/drug-dose-reference.js`
- Protocol review → `runtime/clinical/protocol-review.js`
- Clinical workflow → `runtime/clinical/clinical-workflow.js`
- Shared UI/app shell → `runtime/core/app-shell.js`
- Case lifecycle queries → `runtime/core/case-lifecycle.js`
- Support report composer → `runtime/core/support.js`
- Reliability/environment helpers → `runtime/core/reliability.js`

## Deferred app foundation
- Hospital branding/settings → `branding.js`
- Clinical validation → `clinical-validation.js`
- Case runtime/checksum → `case-runtime.js`
- IndexedDB core storage → `core-storage.js`
- Multi-tab session coordination → `session-coordination.js`
- Session UI/ownership controller → `session-controller.js`

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
