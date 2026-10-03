# ANESVET Presentation Owner Map — V17.13.9

## Runtime presentation owners
- Global workspace / Settings / mobile workflow navigation / mobile Identity bridge → `workspace-owner.js`
- Patient + Pre-op → `patient-preop-simplification.js`
- Drug Plan → `drug-start-simplification.js`
- OR LIVE layout → `or-workspace-restructure.js`
- OR LIVE Fast Vital rail / keyboard / viewport interaction → `or-live-controller.js`
- Quick Drug editor / keyboard progression / induction-detail action labeling → `medication-workspace-controller.js`
- shared mobile keyboard/viewport state → `mobile-or-owner.js`
- PWA update + freeze/BFCache callback coordination → `pwa-controller.js`
- Recovery → `recovery-end-refinement.js`
- Repeat / final-review presentation + return-to-case + next-case action → `repeat-presentation-owner.js`
- Storage/save/offline feedback → `app-shell.js`
- End Case blocker rendering/action routing → `finalization.js`
- Pre-OR readiness structured “ไปแก้” routing → `app.js`
- Lazy Clinical Knowledge loading → `knowledge-loader.js`

## Runtime CSS delivery
- General canonical runtime stylesheet → `anesvet-ui-bundle.css`
- OR workspace override stylesheet → `or-workspace-restructure.css`
- Service Worker precaches only these two production CSS assets

## Canonical CSS source ownership migrated in V17.13.9
### `or-clinical-interaction.css`
Replaces legacy filename `or-speed-hardening.css` without changing declarations or bundle position.

Represents shared active contracts owned by:
- `or-live-controller.js` — Fast Vital presentation/state
- `mobile-or-owner.js` — keyboard offset / visual viewport state
- `medication-workspace-controller.js` — Quick Drug interaction presentation

### `repeat-presentation-owner.css`
Replaces legacy filename `repeat-use-r26.css` without changing declarations or bundle position.

Owner:
- `repeat-presentation-owner.js` — next-case presentation

## Remaining legacy CSS debt
The following retired-JS CSS counterparts remain packaged and represented in the canonical bundle because active UI still references their surviving selectors:
- `ui-refinement.css`
- `adaptive-workspace.css`
- `clinical-simplicity.css`
- `recovery-endcase-ux.css`
- `repeat-use-ux.css`
- `focused-workspace.css`
- `progressive-disclosure.css`
- `progressive-clinical-flow.css`
- `pilot-efficiency.css`
- `usability-hardening.css`
- `mobile-first-r27.css`

Policy:
- do not delete a remaining legacy CSS source merely because its JavaScript counterpart is retired
- first map surviving rules to current owner
- preserve bundle order/cascade unless equivalence is demonstrated
- retire old source name only after canonical replacement is present and regression-protected

## JavaScript retirement status
13 retired presentation JavaScript modules remain absent from startup and Service Worker JS delivery.

## Negative-state policy
A `:not(.state)` rule may remain only when the state has an active runtime/HTML emitter/reference. V17.13.7 guarantee remains in force.
