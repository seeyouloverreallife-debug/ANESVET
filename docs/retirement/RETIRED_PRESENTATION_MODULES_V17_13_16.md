# Retired Presentation Modules — V17.13.16

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
No additional CSS owner is retired in V17.13.16.

Current source state:
- canonical bundle-source CSS: **29**
- legacy-active CSS: **9**
- total bundle-source CSS: **38**
- production CSS delivery: **2 files under `assets/css/`**

## Runtime grouping status
Active runtime moves now include:
- `runtime/platform/` → platform-foundation startup group (5)
- `runtime/clinical/` → clinical-foundation startup group (3)
- `runtime/knowledge/` → lazy Clinical Knowledge / ECG group (7)

These are path/ownership migrations, not retirement.

No clinical calculation, dose, threshold, persistence, Induction, Intubation, End Surgery, Emergency Return, Recovery or Final Lock semantics are intentionally changed.
