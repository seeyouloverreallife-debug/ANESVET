# ANESVET Presentation / Package Owner Map — V17.13.10

## Runtime presentation owners
- Global workspace / Settings / mobile workflow navigation / mobile Identity bridge → `workspace-owner.js`
- Patient + Pre-op → `patient-preop-simplification.js`
- Drug Plan → `drug-start-simplification.js`
- OR LIVE layout → `or-workspace-restructure.js`
- OR LIVE Fast Vital rail / keyboard / viewport interaction → `or-live-controller.js`
- Quick Drug editor / keyboard progression / induction-detail action labeling → `medication-workspace-controller.js`
- shared mobile keyboard/viewport state → `mobile-or-owner.js`
- PWA update + freeze/BFCache coordination → `pwa-controller.js`
- Recovery → `recovery-end-refinement.js`
- Repeat / final-review presentation + return-to-case + next-case action → `repeat-presentation-owner.js`
- Storage/save/offline feedback → `app-shell.js`
- End Case blocker rendering/action routing → `finalization.js`
- Pre-OR readiness structured routing → `app.js`
- Lazy Clinical Knowledge loading → `knowledge-loader.js`

## Runtime delivery ownership
Runtime paths intentionally remain stable at package root in V17.13.10.

- entrypoint → `index.html`
- PWA manifest → `manifest.webmanifest`
- Service Worker → `service-worker.js`
- runtime JS → 69 scripts at root
- runtime CSS → `anesvet-ui-bundle.css` + `or-workspace-restructure.css`

## Source-only CSS ownership
Bundle-source CSS is no longer stored flat at root.

### `src/styles/canonical/`
Canonical or migrated source ownership. 29 source files.

V17.13.9 migrations retained:
- `or-clinical-interaction.css`
- `repeat-presentation-owner.css`

V17.13.10 migrations:
- `workflow-assist-presentation.css` — declaration-preserving replacement for `usability-hardening.css`; represents save assistance, actionable readiness/finalization affordances and return-to-case presentation shared by current canonical owners
- `mobile-workspace-presentation.css` — declaration-preserving replacement for `mobile-first-r27.css`; represents shared mobile workspace interaction/layout presentation used by current mobile/workspace owners

### `src/styles/legacy-active/`
Nine legacy-name CSS sources remain because active runtime/HTML still references surviving selectors:
- `ui-refinement.css`
- `adaptive-workspace.css`
- `clinical-simplicity.css`
- `recovery-endcase-ux.css`
- `repeat-use-ux.css`
- `focused-workspace.css`
- `progressive-disclosure.css`
- `progressive-clinical-flow.css`
- `pilot-efficiency.css`

Policy: do not delete/move declarations out of these sources until an explicit current owner is mapped and regression-protected.

## Retired JavaScript ownership
13 retired presentation JS sources are preserved under `src/legacy-js/` and are absent from startup + Service Worker delivery.

## Documentation ownership
- release history → `docs/releases/`
- architecture / owner maps → `docs/architecture/`
- audits → `docs/audits/`
- retirement history → `docs/retirement/`

## QA ownership
- current release contract QA → `qa/current/`
- historical QA/results → `qa/archive/`
- visual evidence → `qa/evidence/`
