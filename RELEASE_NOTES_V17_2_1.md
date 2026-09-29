# ANESVET V17.2.1 — Interaction Recovery Hotfix

## Purpose
Hotfix for a mobile/PWA interaction failure where a clinical page can remain visible but taps/clicks are blocked, including the floating **Return to OR LIVE** action.

The user screenshot was from V17.1.0. The affected navigation/identity interaction layers were still present in V17.2.0, so this patch is applied to the latest V17.2 branch rather than rolling back.

## Source findings consistent with the symptom
1. `setTab()` did not universally close the OR LIVE native modal (`orMoreDialog`) or other navigation-only dialogs before a programmatic page transition. A stale modal in the browser top layer can intercept input even if the destination page is visible.
2. Identity lock uses the HTML `inert` attribute on application surfaces. V17.2.0 did not have a restore-time invariant that re-synchronized `inert` state with the visible lock overlay after browser/PWA page restore.
3. Session view-only DOM state was not explicitly re-rendered on `pageshow`/foreground restore.

These are source-level failure modes consistent with the reported behavior; the exact Android/PWA trigger was not reproduced in the current build environment.

## Fixes
- Added transient navigation-dialog cleanup before successful tab transitions.
- `orMoreDialog`, `orStepConfirmDialog`, mobile workflow, Recovery More, Help, onboarding, and pre-OR navigation dialogs are closed before changing clinical pages.
- Added invisible-modal recovery on `pageshow` and foreground restore.
- Security lock surface now reconciles lock state, overlay visibility, and `inert` state.
- Session read-only banner/body state re-renders on `pageshow` and foreground restore.
- Floating **Return to OR LIVE / Recovery** control is explicitly `session-safe`.
- No dose calculation, alert threshold, medication administration semantics, Recovery criteria, Final Sign-off, Final Lock, archive integrity, DB schema, or backup schema were changed.

## Compatibility
- `DB_VERSION = 2`
- Full Backup schema = `3`
- Identity registry schema = `2`
- Sync Foundation / transport remain V17.2.0 components; package shell is V17.2.1.
- Sync remains experimental/off by default.

## Validation
- JavaScript syntax: 57/57 PASS
- Static/interactions QA: 36/36 PASS
- V17.1 sync regression: 17/17 PASS
- V17.2 sync safety regression: 19/19 PASS
- Critical selected clinical/runtime parity vs V17.2.0: 18/18 byte-identical
- HTTP packaging smoke: 200 PASS
- Real Android/PWA touch validation: still required
