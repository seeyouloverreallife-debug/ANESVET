# Retired Presentation Modules — V17.13.8

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

## Retired from runtime in Legacy Retirement IV
- or-speed-hardening.js

## Legacy Retirement V — CSS delivery retirement
- standalone bundled CSS source files remain excluded from independent Service Worker precache
- canonical runtime CSS remains `anesvet-ui-bundle.css` + `or-workspace-restructure.css`

## V17.13.6 — CSS Bundle Pruning I
- proven dead positive presentation rules pruned conservatively
- lazy Clinical Knowledge and dynamically generated states protected

## V17.13.7 — Presentation State / Negative Selector Audit
- removed stale `ux-or-context-compact`
- removed stale `ux-patient-details-open`
- all remaining production `:not(.state)` classes require an active runtime/HTML reference

## V17.13.8 — Retired CSS Source / Remaining Presentation Debt Audit
No additional JavaScript owner is retired.

Audited CSS counterparts of all 13 retired JavaScript owners against startup + lazy runtime + HTML.

Safe prune only:
- removed dead `.no-problems` branch
- removed unused `--ux-sticky-top`
- removed unused `--r25-ink`
- removed inactive `.case-form`, `.record-table-wrap`, `.archive-table-wrap` members from `mobile-first-r27.css`
- removed two exact duplicate Recovery ordering rules from `clinical-simplicity.css`

After cleanup:
- 13/13 retired CSS sources remain packaged for traceability
- 13/13 remain represented in the canonical bundle because surviving visual rules are still active
- 0 inactive class selectors remain in those retired CSS sources under the static startup/lazy/HTML reference audit
- 0 exact duplicate rules remain between those retired CSS sources and non-retired standalone CSS under the deterministic exact-rule audit used for this milestone

The remaining legacy-named CSS is classified as **active visual debt**. It should be migrated by owner before any future whole-section retirement.

Clinical calculations, dose/concentration logic, alert thresholds, persistence schema, readiness criteria, Recovery criteria, Induction semantics, Intubation timestamp semantics, End Surgery, Emergency Return, Final Lock, archive verification, Fast Vital semantics, Quick Drug semantics and PWA restore semantics are not intentionally changed.
