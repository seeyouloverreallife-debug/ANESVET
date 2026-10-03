# Runtime Module Map — V17.13.15

## Current startup layout
- `runtime/platform/`: 5 modules, positions 1–5
- `runtime/clinical/`: 3 modules, positions 6–8
- `runtime/core/`: 4 app-foundation core utility modules, positions 9–12
- package root: remaining 57 startup modules
- `runtime/knowledge/`: 7 lazy modules

Total startup modules remain **69**. Source of truth: `config/runtime-map.json`.

## App-foundation status
Moved in this release:
- app shell
- case lifecycle queries
- support/report composer
- reliability/environment helpers

Deferred:
- state/storage foundation at positions 13–16
- session ownership pair at positions 17–18

The next migration must preserve the dependency evidence in `docs/audits/APP_FOUNDATION_DEPENDENCY_AUDIT_V17_13_15.md`.
