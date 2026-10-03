# Runtime Module Map — V17.13.16

Machine-readable source of truth: `config/runtime-map.json`.

## Current grouped startup modules
| Startup positions | Group | Directory | Count |
|---|---|---|---:|
| 1–5 | platform-foundation | `runtime/platform/` | 5 |
| 6–8 | clinical-foundation | `runtime/clinical/` | 3 |
| 9–16 | app-foundation | `runtime/core/` | 8 |
| 17–69 | remaining groups | package root | 53 |

## Lazy runtime
- Clinical Knowledge / ECG: `runtime/knowledge/` — 7 modules.

## Next guarded boundary
The session pair at startup positions 17–18 remains root. It should move together to `runtime/core/` only after a dedicated session ownership/path audit.
