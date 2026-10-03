# Retired Presentation Modules — V17.13.1

These modules are intentionally no longer loaded by `index.html` or cached by the service worker.

- `ui-refinement.js` — compatibility marker only.
- `adaptive-workspace.js` — save-state flash moved into `app-shell.js`.
- `clinical-simplicity.js` — OR layout ownership is canonical in `or-workspace-restructure.js`; final static labels are now in `index.html`.
- `recovery-endcase-ux.js` — compatibility marker only.
- `repeat-use-ux.js` — return-to-case/final-review helpers moved into `repeat-presentation-owner.js`.
- `repeat-use-r26.js` — next-case/recovery keyboard helpers moved into `repeat-presentation-owner.js`.

No clinical calculations, case state transitions, safety gates, or persistence semantics were moved into presentation ownership.
