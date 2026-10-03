# Runtime Module Map — V17.13.14

## Current runtime policy
- Startup JavaScript: **69 modules** total.
- `platform-foundation`: **5 modules** under `runtime/platform/` at startup positions 1–5.
- `clinical-foundation`: **3 modules** under `runtime/clinical/` at startup positions 6–8.
- Remaining startup modules: **61** at package root.
- Lazy Clinical Knowledge / ECG JavaScript: **7 modules** under `runtime/knowledge/`.
- Exact startup order remains unchanged from V17.13.13.
- Service Worker must precache all 69 startup + all 7 lazy modules at their current paths.

Source of truth: `config/runtime-map.json`.

## Third real module move
V17.13.14 moves the complete `clinical-foundation` group:
1. `runtime/clinical/drug-dose-reference.js`
2. `runtime/clinical/protocol-review.js`
3. `runtime/clinical/clinical-workflow.js`

These remain startup positions 6–8.

## Migration guard
`qa/current/QA_V17_13_14_RUNTIME_GROUPING_III.js` verifies current paths, exact startup order, root-copy absence, Service Worker coverage, version alignment, platform preservation and lazy knowledge preservation.

## Next safe group
The next candidate should be selected from a small contiguous startup group with no path-sensitive relative imports. `app-foundation` is larger (10 modules), so it should be split or audited before moving.
