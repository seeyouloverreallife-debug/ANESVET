# Retired Presentation Modules — V17.13.13

## Retired JavaScript runtime owners
The same 13 modules remain retired from startup and Service Worker delivery:
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

Their sources remain under `src/legacy-js/` for audit/rollback.

## CSS retirement status
No additional CSS owner is retired in V17.13.13.

Current source state:
- canonical bundle-source CSS: **29**
- legacy-active CSS: **9**
- total bundle-source CSS: **38**
- production CSS delivery: **2 files under `assets/css/`**

## Runtime grouping status
The lazy Clinical Knowledge / ECG group remains under `runtime/knowledge/`. The `platform-foundation` startup group is now under `runtime/platform/`. These are active runtime moves, not retirement.

No clinical calculation, dose, threshold, persistence, Induction, Intubation, End Surgery, Emergency Return, Recovery or Final Lock semantics are intentionally changed.
