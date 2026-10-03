# Runtime Module Grouping V — V17.13.16

## Startup layout
- positions 1–5 → `runtime/platform/`
- positions 6–8 → `runtime/clinical/`
- positions 9–16 → `runtime/core/`
- positions 17–69 → package root for now
- 7 lazy knowledge modules → `runtime/knowledge/`

## This release
Moved four state/storage foundation modules at positions 13–16 into `runtime/core/` while preserving exact startup order.

## Guards
- `config/runtime-map.json` path/order must equal `index.html` startup order exactly.
- Service Worker must precache all 69 startup and 7 lazy modules at their current paths.
- no root copy of moved positions 9–16 may remain.
- session pair positions 17–18 stays root and ordered coordination → controller.
- migration does not change module source bytes except release stamps in modules that already carry a release stamp.
