# Runtime Module Map — V17.13.11

## Purpose
V17.13.11 introduces a machine-readable runtime path/load-order contract before active JavaScript is moved into folders.

Source of truth: `config/runtime-map.json`.

## Current runtime policy
- Startup JavaScript: **69 modules**, still at package root.
- Lazy runtime JavaScript: **7 Clinical Knowledge / ECG modules**, still at package root.
- Exact startup order is preserved from V17.13.10.
- Service Worker must precache **all 69 startup + all 7 lazy modules**.
- Runtime JavaScript is not dynamically loaded from the JSON manifest in this release; static script tags remain authoritative at runtime while QA cross-checks them against the manifest.

## Semantic groups prepared for future folders
- `platform-foundation` → `runtime/platform/`
- `clinical-foundation` → `runtime/clinical/`
- `app-foundation` → `runtime/core/`
- `domains` → `runtime/domains/`
- `orchestration` → `runtime/orchestration/`
- `controllers` → `runtime/controllers/`
- `governance-sync` → `runtime/governance/`
- `resilience-models` → `runtime/resilience/`
- `app-core` → `runtime/core/`
- `safety-workflow` → `runtime/workflows/`
- `workflow-refinements` → `runtime/workflows/`
- `optional-startup` → `runtime/optional/`
- lazy Clinical Knowledge / ECG → `runtime/knowledge/`

The manifest stores an explicit `futurePath` per module so a future migration can move one group at a time without inventing path ownership during the move.

## Regression contract
`qa/current/QA_V17_13_11_RUNTIME_PATHS.js` verifies:
- 69 startup modules and exact order;
- 7 lazy modules;
- no path duplication/overlap;
- every current path exists;
- every future path maps below `runtime/`;
- Service Worker coverage for startup/lazy code;
- Knowledge loader list equivalence;
- production CSS/icon paths;
- manifest icon paths;
- retired JS exclusion;
- release/cache version alignment.

## Defect found by the new guard
The audit found `viewport-coordinator.js` in startup but absent from the V17.13.10 Service Worker precache list.

V17.13.11 adds it to precache, closing a possible offline cold-start cache miss.
