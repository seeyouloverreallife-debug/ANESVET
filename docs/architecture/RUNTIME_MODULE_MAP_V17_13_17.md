# Runtime Module Map — V17.13.17

Machine-readable source of truth: `config/runtime-map.json`.

## Current grouped startup modules
| Startup positions | Group | Directory | Count |
|---|---|---|---:|
| 1–5 | platform-foundation | `runtime/platform/` | 5 |
| 6–8 | clinical-foundation | `runtime/clinical/` | 3 |
| 9–18 | app-foundation | `runtime/core/` | 10 |
| 19–69 | remaining groups | package root | 51 |

## Lazy runtime
- Clinical Knowledge / ECG: `runtime/knowledge/` — 7 modules.

## Completed boundary
All app-foundation modules are now grouped under `runtime/core/` with exact startup order preserved.

## Next guarded boundary
The next candidate is the domains group beginning at startup position 19. Move it only in small contiguous subgroups with path/order/Service Worker guards.
