# ANESVET Presentation / Package Owner Map — V17.13.11

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

## Runtime path ownership
Machine-readable path contract → `config/runtime-map.json`.

V17.13.11 policy:
- startup JS → 69 scripts at root (not moved yet)
- lazy JS → 7 scripts at root (not moved yet)
- production CSS → `assets/css/`
- app/PWA icons → `assets/icons/`
- entrypoint → `index.html`
- PWA manifest → `manifest.webmanifest`
- Service Worker → `service-worker.js`

The manifest assigns every startup module a semantic group and a future `runtime/*` destination. Current QA requires exact startup order and complete Service Worker coverage before any JavaScript path migration is allowed.

## Source-only CSS ownership
- `src/styles/canonical/`: 29 canonical/migrated source files
- `src/styles/legacy-active/`: 9 legacy-name source files still carrying active visual dependencies
- runtime bundle source total: 38

Production delivery remains exactly two stylesheets, now under `assets/css/`.

## Retired JavaScript
13 retired presentation JS sources remain in `src/legacy-js/` and are excluded from startup, Service Worker runtime JS inventory and `config/runtime-map.json`.

## Documentation / QA ownership
- releases → `docs/releases/`
- architecture → `docs/architecture/`
- audits → `docs/audits/`
- retirement → `docs/retirement/`
- current QA → `qa/current/`
- historical QA → `qa/archive/`
