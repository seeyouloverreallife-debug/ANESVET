# Retired Presentation Modules — V17.13.4

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

The source files remain in the archive for traceability. None of the thirteen retired JavaScript modules are loaded by `index.html` or precached as JavaScript by the current Service Worker.

### Migrated behavior in Retirement IV
- Fast Vital rail/keyboard/visible-viewport behavior moved into `or-live-controller.js`.
- `documentation-guardian.js` now calls the canonical OR LIVE controller instance for fast-field focus.
- Quick Drug keyboard progression/action labeling moved into `medication-workspace-controller.js`.
- installed-PWA freeze/BFCache callbacks moved into `pwa-controller.js`, while app-level persistence/render behavior remains injected from `app.js`.
- standalone `or-speed-hardening.css` is no longer precached; the active styles remain in `anesvet-ui-bundle.css`.

Clinical calculations, dose/concentration logic, alert thresholds, persistence schema, readiness criteria, Recovery criteria, Induction semantics, Intubation timestamp semantics, End Surgery, Emergency Return, Final Lock, and archive verification are not intentionally changed by this retirement.
