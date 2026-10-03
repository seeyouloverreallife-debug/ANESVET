# ANESVET Presentation Owner Map — V17.13.5

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

## CSS ownership / delivery
- Canonical general UI stylesheet delivered at runtime → `anesvet-ui-bundle.css`
- Canonical OR workspace stylesheet delivered separately → `or-workspace-restructure.css`
- Source CSS represented inside `anesvet-ui-bundle.css` remains packaged for traceability but is **not independently precached**
- Service Worker must precache only the two canonical runtime stylesheets above

Legacy presentation modules and standalone source CSS must not reclaim runtime delivery ownership.
