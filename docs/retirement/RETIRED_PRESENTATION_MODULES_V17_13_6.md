# Retired Presentation Modules — V17.13.6

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
- standalone bundled CSS source files remain excluded from independent Service Worker precache
- canonical runtime CSS remains `anesvet-ui-bundle.css` + `or-workspace-restructure.css`

## V17.13.6 — CSS Bundle Pruning I
No additional JavaScript owner is retired.

Instead, proven dead positive presentation rules are removed from the canonical bundle and matching source CSS while source files and all 38 bundle source markers remain packaged.

Pruning is intentionally conservative:
- lazy Clinical Knowledge `.ck-*` rules are retained
- dynamically generated protocol review severity rules are retained
- negative-state `:not(...)` rules with unresolved legacy-class semantics are retained pending physical validation

The thirteen retired JavaScript modules remain absent from `index.html` and JavaScript precache delivery.

Clinical calculations, dose/concentration logic, alert thresholds, persistence schema, readiness criteria, Recovery criteria, Induction semantics, Intubation timestamp semantics, End Surgery, Emergency Return, Final Lock, archive verification, Fast Vital semantics, Quick Drug semantics and PWA restore semantics are not intentionally changed by this pruning.
