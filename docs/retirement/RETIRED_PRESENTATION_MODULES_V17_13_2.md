# Retired Presentation Modules — V17.13.2

## Retired from runtime in Legacy Retirement I
- ui-refinement.js
- adaptive-workspace.js
- clinical-simplicity.js
- recovery-endcase-ux.js
- repeat-use-ux.js
- repeat-use-r26.js

## Retired from runtime in Legacy Retirement II
- focused-workspace.js
- progressive-disclosure.js
- progressive-clinical-flow.js
- pilot-efficiency.js

The source files are retained in the archive for traceability, but none of the ten modules are loaded by `index.html` or precached as JavaScript by the current Service Worker.

### Migrated behavior
- Patient Master compact mode + Pre-op next-task → patient-preop-simplification.js
- Drug next-task + Quick Presets disclosure → drug-start-simplification.js
- Recovery collapsibles + next-task/focus → recovery-end-refinement.js
- Settings disclosure + mobile Continue/status + workflow step state → workspace-owner.js

Compatibility globals `ANESVETProgressiveDisclosure` and `ANESVETFocusedWorkspace` remain available through canonical owners for older callers.
