# ANESVET V17.10.8 — Startup Root Fix

V17.10.7 proved that script order alone was not a sufficient startup guarantee on deployed clients.

## Root fix
- `recovery-handoff-view-model.js` no longer throws when `ANESVET_APP_UTILS` is unavailable.
- The only shared dependency used by this module (`normalizedHandoffDrugName`) now has a local, side-effect-free fallback.
- The shared helper is still preferred whenever it is available.
- Versioned JavaScript/CSS requests are now network-first with `cache: no-store`, with the current release cache retained as the offline fallback.
- This prevents a mixed old/new Service Worker asset set from becoming the normal online runtime.

No clinical decision rule or workflow gate was changed.
