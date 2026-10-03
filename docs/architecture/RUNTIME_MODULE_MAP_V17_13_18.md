# Runtime Module Map — V17.13.18

Machine-readable source of truth: `config/runtime-map.json`.

## Current grouped startup modules
| Startup positions | Group | Directory | Count |
|---|---|---|---:|
| 1–5 | platform-foundation | `runtime/platform/` | 5 |
| 6–8 | clinical-foundation | `runtime/clinical/` | 3 |
| 9–18 | app-foundation | `runtime/core/` | 10 |
| 19–23 | domains | `runtime/domains/` | 5 |
| 24–69 | remaining groups | package root | 46 |

## Lazy runtime
- Clinical Knowledge / ECG: `runtime/knowledge/` — 7 modules.

## Completed boundaries
- platform-foundation
- clinical-foundation
- app-foundation
- domains positions 19–23

All completed groups preserve their original startup positions.

## Next guarded boundary
The next contiguous group is orchestration positions 24–26. Audit cross-domain dependencies before moving it to `runtime/orchestration/`.
