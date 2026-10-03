# ANESVET Presentation Owner Map — V17.13.8

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
- Canonical general runtime stylesheet → `anesvet-ui-bundle.css`
- Canonical OR workspace stylesheet → `or-workspace-restructure.css`
- Service Worker precaches only those two production CSS assets
- Standalone CSS source files remain packaged for traceability and controlled migration
- Bundle source markers remain 38/38

## Retired-source CSS policy — V17.13.8
Retiring a JavaScript presentation owner does **not** automatically retire its CSS counterpart.

For the 13 retired JS owners:
- JavaScript remains absent from startup and Service Worker JS delivery
- CSS source counterparts remain packaged and represented in the canonical bundle only where surviving selectors still have active runtime/HTML references
- proven dead selector branches / unused custom properties / exact duplicate rules may be pruned incrementally
- whole-source deletion requires migration of surviving visual rules to a canonical owner first

V17.13.8 static audit reports **0 inactive class selectors** remaining across the 13 retired CSS counterparts after safe prune.

## Migrated presentation contracts that still consume legacy-named CSS sections
- `r27-keyboard-open` → `mobile-or-owner.js`
- R27 Identity classes → `workspace-owner.js`
- `or-fast-entry-active` / Fast Vital rail → `or-live-controller.js`
- Quick Drug presentation → `medication-workspace-controller.js`
- `.ux-save-assist` → `app-shell.js`
- `.ux-return-case` → `repeat-presentation-owner.js`
- `.ux-recovery-collapsible` / completion states → `recovery-end-refinement.js`

## Negative-state rule policy
A `:not(.state)` rule may remain in production only when the state has an active startup/lazy runtime or HTML reference. The V17.13.7 guarantee remains in force.

Legacy presentation JavaScript and standalone CSS files must not reclaim independent runtime delivery ownership.
