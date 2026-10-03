# Retired Presentation Modules — V17.13.10

## Retired JavaScript runtime owners
13 modules remain retired from startup and Service Worker delivery:
- ui-refinement.js
- adaptive-workspace.js
- clinical-simplicity.js
- recovery-endcase-ux.js
- repeat-use-ux.js
- repeat-use-r26.js
- focused-workspace.js
- progressive-disclosure.js
- progressive-clinical-flow.js
- pilot-efficiency.js
- usability-hardening.js
- mobile-first-r27.js
- or-speed-hardening.js

Their source files are now grouped under `src/legacy-js/` for audit/rollback rather than cluttering the package root.

## CSS source retirement history
V17.13.9:
- `or-speed-hardening.css` → `src/styles/canonical/or-clinical-interaction.css`
- `repeat-use-r26.css` → `src/styles/canonical/repeat-presentation-owner.css`

V17.13.10:
- `usability-hardening.css` → `src/styles/canonical/workflow-assist-presentation.css`
- `mobile-first-r27.css` → `src/styles/canonical/mobile-workspace-presentation.css`

After V17.13.10:
- legacy-active CSS sources remaining: **9**
- canonical bundle source files: **29**
- total bundle source files: **38**
- runtime CSS delivery: **2 files**

No clinical calculation, dose, threshold, persistence, Induction, Intubation, End Surgery, Emergency Return, Recovery or Final Lock semantics are intentionally changed.
