# Runtime Module Map — V17.13.13

## Current runtime policy
- Startup JavaScript: **69 modules** total.
- `platform-foundation`: **5 modules** under `runtime/platform/`.
- Remaining startup modules: **64** at package root.
- Lazy Clinical Knowledge / ECG JavaScript: **7 modules** under `runtime/knowledge/`.
- Exact startup order remains unchanged from V17.13.12.
- Service Worker must precache all 69 startup + all 7 lazy modules at their current paths.

Source of truth: `config/runtime-map.json`.

## Second real module move
V17.13.13 moves the complete `platform-foundation` group:
1. `runtime/platform/lifecycle-coordinator.js`
2. `runtime/platform/viewport-coordinator.js`
3. `runtime/platform/workspace-owner.js`
4. `runtime/platform/presentation-ownership.js`
5. `runtime/platform/mobile-or-owner.js`

These remain startup positions 1–5.

## Migration guard
`qa/current/QA_V17_13_13_RUNTIME_GROUPING_II.js` verifies current paths, exact order, root-copy absence, Service Worker coverage, version alignment and lazy knowledge preservation.

## Next safe group
A future release can move one additional startup semantic group while preserving exact order. `clinical-foundation` (3 modules) is the next small candidate after this platform move is physically validated.
