# Retired Presentation Modules — V17.13.3

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

The source files remain in the archive for traceability, but none of the twelve retired JavaScript modules are loaded by `index.html` or precached as JavaScript by the current Service Worker.

### Migrated behavior in Retirement III
- Pre-OR readiness inline “ไปแก้” actions now use the structured readiness descriptors already produced by `preOrReadinessStatus()` / `renderPreOrReadinessDialog()` in `app.js`; the old regex mapping is no longer required.
- Storage save/error/offline assist and retry presentation moved to `app-shell.js`; retry still delegates to the existing save path.
- End Case blocker chips are rendered as actionable controls directly by `finalization.js`, using each blocker’s existing `type` as the action key.
- Floating “กลับ OR LIVE / Recovery” shortcut and its Android pointer-safety guards moved to `repeat-presentation-owner.js`.
- Legacy mobile workflow Identity bridge moved to `workspace-owner.js`.

### Audited but retained
- `or-speed-hardening.js` remains loaded because it still owns distinct fast-vital entry rail, keyboard progression, explicit Save behavior, Quick Drug keyboard assistance, and installed-PWA lifecycle interaction hardening.
- `repeat-presentation-owner.js` remains the canonical repeat/final-review presentation owner and now also owns the floating return-to-case shortcut.

Clinical calculations, dose/concentration logic, alert thresholds, persistence schema, readiness criteria, Recovery criteria, Induction semantics, Intubation timestamp semantics, End Surgery, Emergency Return, Final Lock, and archive verification are not intentionally changed by this retirement.
