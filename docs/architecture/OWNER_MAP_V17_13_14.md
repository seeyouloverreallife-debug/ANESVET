# ANESVET Presentation / Package Owner Map — V17.13.14

## Runtime presentation owners
- Global workspace / Settings / mobile workflow navigation / mobile Identity bridge → `runtime/platform/workspace-owner.js`
- Shared mobile keyboard/viewport state → `runtime/platform/mobile-or-owner.js`
- Presentation ownership registry → `runtime/platform/presentation-ownership.js`
- Lifecycle coordination → `runtime/platform/lifecycle-coordinator.js`
- Viewport coordination → `runtime/platform/viewport-coordinator.js`
- Drug dose reference foundation → `runtime/clinical/drug-dose-reference.js`
- Protocol review foundation → `runtime/clinical/protocol-review.js`
- Clinical workflow foundation → `runtime/clinical/clinical-workflow.js`
- Patient + Pre-op → `patient-preop-simplification.js`
- Drug Plan → `drug-start-simplification.js`
- OR LIVE layout → `or-workspace-restructure.js`
- OR LIVE Fast Vital rail / keyboard / viewport interaction → `or-live-controller.js`
- Quick Drug editor / keyboard progression / induction-detail action labeling → `medication-workspace-controller.js`
- PWA update + freeze/BFCache coordination → `pwa-controller.js`
- Recovery → `recovery-end-refinement.js`
- Repeat / final-review presentation + return-to-case + next-case action → `repeat-presentation-owner.js`
- Storage/save/offline feedback → `app-shell.js`
- End Case blocker rendering/action routing → `finalization.js`
- Pre-OR readiness structured routing → `app.js`
- Lazy Clinical Knowledge load orchestration → `knowledge-loader.js`
- Lazy Clinical Knowledge / ECG implementation modules → `runtime/knowledge/*.js`

## Runtime path ownership
Machine-readable path contract → `config/runtime-map.json`.

V17.13.14 policy:
- startup JS → 69 scripts total
- `platform-foundation` → 5 scripts under `runtime/platform/`
- `clinical-foundation` → 3 scripts under `runtime/clinical/`
- remaining startup JS → 61 scripts at root
- lazy JS → 7 scripts under `runtime/knowledge/`
- production CSS → `assets/css/`
- app/PWA icons → `assets/icons/`
- entrypoint → `index.html`
- PWA manifest → `manifest.webmanifest`
- Service Worker → `service-worker.js`

## Source-only CSS ownership
- `src/styles/canonical/`: 29 canonical/migrated source files
- `src/styles/legacy-active/`: 9 legacy-name source files still carrying active visual dependencies
- runtime bundle source total: 38

## Retired JavaScript
13 retired presentation JS sources remain in `src/legacy-js/` and are excluded from startup, Service Worker runtime JS inventory and `config/runtime-map.json`.
