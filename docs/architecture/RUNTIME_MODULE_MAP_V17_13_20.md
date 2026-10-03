# Runtime Module Map — V17.13.20

## Grouped startup modules
- Positions 1–5 → `runtime/platform/`
- Positions 6–8 → `runtime/clinical/`
- Positions 9–18 → `runtime/core/`
- Positions 19–23 → `runtime/domains/`
- Positions 24–26 → `runtime/orchestration/`
- Positions 27–33 → `runtime/controllers/`
- Positions 34–69 → package root for now

## Lazy modules
- 7 Clinical Knowledge / ECG modules → `runtime/knowledge/`

## Contract
`config/runtime-map.json` is the machine-readable source of truth. Its 69 startup paths must match `index.html` exactly and all startup + lazy modules must be represented in Service Worker precache.

V17.13.20 migrates only the controller boundary. No startup reordering is permitted.
