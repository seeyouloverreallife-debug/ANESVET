# Retired Presentation Modules — V17.13.5

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

## Retired from runtime in Legacy Retirement III
- usability-hardening.js
- mobile-first-r27.js

## Retired from runtime in Legacy Retirement IV
- or-speed-hardening.js

## Legacy Retirement V — CSS delivery retirement
No additional JavaScript owner is retired in V17.13.5.

Instead, standalone CSS source files represented by `anesvet-ui-bundle.css` are retired from **Service Worker precache delivery**:
- 37 duplicate CSS precache entries removed versus V17.13.4
- canonical runtime CSS remains `anesvet-ui-bundle.css` + `or-workspace-restructure.css`
- standalone CSS files remain in the archive for traceability / rollback
- production CSS bytes are unchanged from V17.13.4

The thirteen retired JavaScript modules remain absent from `index.html` and from JavaScript precache delivery.

Clinical calculations, dose/concentration logic, alert thresholds, persistence schema, readiness criteria, Recovery criteria, Induction semantics, Intubation timestamp semantics, End Surgery, Emergency Return, Final Lock, archive verification, Fast Vital semantics, Quick Drug semantics and PWA restore semantics are not intentionally changed by this retirement.
