# ANESVET Presentation Owner Map — V17.13.6

## Runtime presentation owners
- Global workspace / Settings / mobile workflow navigation / mobile Identity bridge → `workspace-owner.js`
- Patient + Pre-op → `patient-preop-simplification.js` (`patient-preop-v17130`)
- Drug Plan → `drug-start-simplification.js` (`drug-start-v17130`)
- OR LIVE layout → `or-workspace-restructure.js` (`or-workspace-v17130`)
- OR LIVE fast-vital rail / keyboard / viewport interaction → `or-live-controller.js`
- Quick Drug editor / keyboard progression / induction-detail action labeling → `medication-workspace-controller.js`
- PWA update + freeze/BFCache callback coordination → `pwa-controller.js` with app-owned persistence/render callbacks
- Shared mobile keyboard/viewport state → `mobile-or-owner.js`
- Recovery → `recovery-end-refinement.js` (`recovery-end-v17130`)
- Repeat / final-review presentation + floating return-to-active-case shortcut → `repeat-presentation-owner.js`
- Storage/save/offline presentation feedback → `app-shell.js`
- End Case blocker rendering/action routing → `finalization.js`
- Pre-OR readiness structured “ไปแก้” routing → core readiness renderer in `app.js` using existing `tab` / `target` descriptors
- Lazy Clinical Knowledge asset loading → `knowledge-loader.js`; release version must match Service Worker exact versioned precache

## CSS ownership / delivery
- Canonical general UI stylesheet delivered at runtime → `anesvet-ui-bundle.css`
- Canonical OR workspace stylesheet delivered separately → `or-workspace-restructure.css`
- Source CSS represented inside `anesvet-ui-bundle.css` remains packaged for traceability and future controlled pruning
- Service Worker precaches only the two canonical runtime stylesheets
- V17.13.6 allows pruning only when a selector has a proven dead positive dependency across startup + lazy runtime assets
- Dynamic class generation and `:not(...)` negative-state selectors are not considered dead from literal grep alone

## Deferred negative-state ownership audit
Preserve until physical visual/device validation:
- `body.or-mobile-active:not(.ux-or-context-compact) #orStickyMini`
- `#patient:not(.ux-patient-details-open) .patient-form-grid`

Legacy presentation modules and standalone source CSS must not reclaim runtime delivery ownership.
