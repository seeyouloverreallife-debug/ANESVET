# Retired Presentation Modules — V17.13.9

## Retired JavaScript runtime owners
Legacy Retirement I:
- ui-refinement.js
- adaptive-workspace.js
- clinical-simplicity.js
- recovery-endcase-ux.js
- repeat-use-ux.js
- repeat-use-r26.js

Legacy Retirement II:
- focused-workspace.js
- progressive-disclosure.js
- progressive-clinical-flow.js
- pilot-efficiency.js

Legacy Retirement III:
- usability-hardening.js
- mobile-first-r27.js

Legacy Retirement IV:
- or-speed-hardening.js

Total retired presentation JavaScript modules: **13**

## CSS delivery retirement history
V17.13.5:
- standalone CSS source files stopped being independently precached
- runtime CSS delivery standardized to `anesvet-ui-bundle.css` + `or-workspace-restructure.css`

V17.13.6–V17.13.8:
- dead selectors/properties/duplicates pruned conservatively
- remaining retired-source CSS classified as active visual debt

## V17.13.9 — Canonical CSS Ownership Migration I
Two legacy CSS source identities are retired from package after declaration-preserving ownership migration:

- `or-speed-hardening.css` → `or-clinical-interaction.css`
- `repeat-use-r26.css` → `repeat-presentation-owner.css`

Both migrations preserve source bytes exactly and keep their canonical bundle marker at the same historical position. No selector, declaration, media query or CSS rule ordering is changed.

After V17.13.9:
- legacy-named retired CSS debt sources remaining: **11**
- canonical migrated CSS sources from retired owners: **2**
- bundle source markers: **38/38**
- standalone bundle-source CSS count: **38**

Clinical calculations, thresholds, persistence, Induction semantics, Intubation timestamp semantics, End Surgery, Emergency Return, Recovery, Final Lock, Fast Vital, Quick Drug and PWA restore semantics are not intentionally changed.
